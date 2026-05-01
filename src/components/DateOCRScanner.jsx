import { useEffect, useRef, useState } from "react";
import { B, T1, G, T2 } from "../constants/colors";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function DateOCRScanner({ onDateScanned, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(false);
  const [status, setStatus] = useState("initializing");
  const [detectedText, setDetectedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("ready");
      })
      .catch(() => setStatus("error"));

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return null;

    // Smaller image = fewer tokens = less quota usage
    canvas.width = 640;
    canvas.height = Math.round((video.videoHeight / video.videoWidth) * 640);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.75).split(",")[1];
  };

  const scanWithGemini = async () => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setIsProcessing(true);
    setDetectedText("Preparing image…");

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setDetectedText("Camera not ready");
        return;
      }

      // Capture frame
      const video = videoRef.current;
      if (!video || !video.videoWidth) {
        setDetectedText("Camera not ready");
        return;
      }

      // Draw full video frame to canvas
      canvas.width = 640;
      canvas.height = Math.round((video.videoHeight / video.videoWidth) * 640);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Crop to scan box area (80% width, 40% height, centered)
      const scanBoxWidth = canvas.width * 0.8;
      const scanBoxHeight = canvas.height * 0.4;
      const scanBoxX = (canvas.width - scanBoxWidth) / 2;
      const scanBoxY = (canvas.height - scanBoxHeight) / 2;

      // Create cropped canvas
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = scanBoxWidth;
      croppedCanvas.height = scanBoxHeight;
      const croppedCtx = croppedCanvas.getContext("2d");
      
      croppedCtx.drawImage(
        canvas,
        scanBoxX, scanBoxY, scanBoxWidth, scanBoxHeight,
        0, 0, scanBoxWidth, scanBoxHeight
      );

      // Preprocess image for better OCR (increase contrast, sharpen)
      const imageData = croppedCtx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
      const pixels = imageData.data;
      
      // Increase contrast and convert to grayscale for better OCR
      for (let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        // Increase contrast
        const contrast = 1.5;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        let adjusted = factor * (avg - 128) + 128;
        adjusted = Math.max(0, Math.min(255, adjusted));
        
        pixels[i] = pixels[i + 1] = pixels[i + 2] = adjusted;
      }
      
      croppedCtx.putImageData(imageData, 0, 0);

      // Convert cropped canvas to base64 for Gemini
      const base64Image = croppedCanvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      
      setDetectedText("Asking Gemini AI…");

      // Call Gemini Vision API
      const requestBody = {
        contents: [{
          parts: [
            {
              text: `You are an expert at reading expiry dates, best-before dates, use-by dates, and EXP dates from product packaging.

Analyze this image and find ANY expiry-related date. Look for:
- "Best Before", "Best-Before", "BB"
- "Use By", "Use-By"
- "Expiry", "EXP", "Expires"
- "Sell By"
- Any date printed near these labels
- Dates in formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, MMM DD YYYY, etc.
- Both printed AND handwritten dates

IMPORTANT: If the year looks unrealistic (like 2077, 2066, 2088), it's likely OCR misread a digit. The last digit is usually correct (e.g., 2077 should be 2027).

Reply with ONLY valid JSON (no markdown, no code blocks):
{
  "found": true,
  "day": 15,
  "month": 5,
  "year": 2027,
  "raw": "15/05/2027",
  "confidence": "high"
}

If no date found:
{"found": false}

Rules:
- month must be 1-12
- day must be 1-31
- year must be 4 digits (2024-2030 range is normal for food)
- raw is the exact text as shown in image`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
          responseMimeType: "application/json"
        }
      };

      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API error:", response.status, errorData);
        
        if (response.status === 429) {
          const retryAfter = errorData?.error?.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay?.replace("s", "");
          setDetectedText(`Rate limit. Wait ${retryAfter || "a moment"} and try again`);
        } else {
          setDetectedText(`API error ${response.status}. Try again`);
        }
        return;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Gemini full response:", data);
      console.log("Gemini text:", rawText);

      // Parse JSON from response
      let result;
      try {
        // Try direct JSON parse first (with responseMimeType: "application/json")
        result = JSON.parse(rawText);
      } catch (e) {
        // Fallback: extract JSON from text
        const jsonMatch = rawText.match(/\{[\s\S]*?\}/);
        if (!jsonMatch) {
          console.error("No JSON found in response:", rawText);
          setDetectedText("Unexpected response — try again");
          return;
        }
        result = JSON.parse(jsonMatch[0]);
      }

      if (!result.found) {
        setDetectedText("No date found — try again");
        return;
      }

      // Extract date from Gemini response
      let { day, month, year } = result;
      const rawMatch = result.raw || `${day}/${month}/${year}`;
      
      // Fix common OCR year mistakes (e.g., 2077 -> 2027, 2066 -> 2026)
      // Food expiry dates are typically within 1-5 years from now
      const currentYear = new Date().getFullYear();
      const maxReasonableYear = currentYear + 5; // Max 5 years in future
      let yearCorrected = false;
      
      if (year > maxReasonableYear) {
        const originalYear = year;
        // OCR likely misread a digit: 2027 became 2077, 2026 became 2066, etc.
        // Extract last 2 digits and fix doubled digit (77 -> 27, 66 -> 26, 88 -> 28)
        const lastTwoDigits = year % 100;
        const tensDigit = Math.floor(lastTwoDigits / 10);
        const onesDigit = lastTwoDigits % 10;
        
        // If tens and ones are same or close, likely a misread
        if (tensDigit === onesDigit || tensDigit > 5) {
          // Use ones digit with current decade: 77 -> 27, 66 -> 26, 88 -> 28
          const currentDecade = Math.floor(currentYear / 10) * 10;
          year = currentDecade + onesDigit;
          yearCorrected = true;
          console.log(`Year auto-corrected from ${originalYear} to ${year}`);
        }
      }

      const date = new Date(year, month - 1, day);

      if (
        isNaN(date.getTime()) ||
        date.getMonth() !== month - 1 ||
        day < 1 || day > 31 ||
        month < 1 || month > 12 ||
        year < currentYear - 1 || year > maxReasonableYear
      ) {
        setDetectedText(`Invalid date: ${rawMatch} — try again`);
        return;
      }

      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const dateObj = {
        formatted: date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        iso: date.toISOString().split("T")[0],
        display: `${day} ${monthNames[month - 1]} ${year}`,
        raw: rawMatch,
        corrected: yearCorrected
      };

      console.log("✓ Date found:", dateObj);
      const message = yearCorrected 
        ? `Found & corrected: ${day}/${month}/${year}`
        : `Found: ${rawMatch}`;
      setDetectedText(message);
      setStatus("found");
      setTimeout(() => onDateScanned(dateObj), 400);

    } catch (err) {
      console.error("Scan error:", err);
      setDetectedText("Error — try again");
    } finally {
      scanningRef.current = false;
      setIsProcessing(false);
    }
  };

  const accentColor = status === "found" ? G : isProcessing ? "#FFA500" : B;

  return (
    <div style={{ width: "100%" }}>
      {/* Camera view */}
      <div style={{ position: "relative", width: "100%", borderRadius: 18, overflow: "hidden", background: "#000" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", display: "block", maxHeight: 380, objectFit: "cover" }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none"
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

          {/* Scan box */}
          <div style={{
            width: "80%",
            height: "40%",
            position: "relative",
            zIndex: 2,
            borderRadius: 14,
            border: `2.5px solid ${accentColor}`,
            boxShadow: `0 0 0 9999px rgba(0,0,0,0.4), 0 0 20px ${accentColor}55`,
            transition: "border-color 0.3s, box-shadow 0.3s"
          }}>
            {[["top","left",0],["top","right",90],["bottom","right",180],["bottom","left",270]].map(([v,h,deg]) => (
              <div key={`${v}${h}`} style={{
                position: "absolute", [v]: -3, [h]: -3,
                width: 26, height: 26,
                borderTop: `5px solid ${accentColor}`,
                borderLeft: `5px solid ${accentColor}`,
                transform: `rotate(${deg}deg)`,
                transition: "border-color 0.3s"
              }} />
            ))}
          </div>

          {/* Status label */}
          <div style={{
            position: "absolute", bottom: "18%",
            padding: "6px 14px",
            background: "rgba(0,0,0,0.72)",
            borderRadius: 8, zIndex: 3,
            fontSize: 13, color: "#fff", fontWeight: 600
          }}>
            {status === "initializing" && "Starting camera…"}
            {status === "ready" && !isProcessing && "Align date inside the box"}
            {status === "ready" && isProcessing && "⏳ Reading with Gemini AI…"}
            {status === "found" && "✓ Date captured!"}
            {status === "error" && "⚠ Camera unavailable"}
          </div>
        </div>
      </div>

      {/* Last reading feedback */}
      {detectedText && status === "ready" && (
        <div style={{
          marginTop: 10, padding: "8px 14px",
          background: "#f5f5f5", borderRadius: 10,
          fontSize: 12, color: T2, fontFamily: "monospace"
        }}>
          {detectedText}
        </div>
      )}

      {/* Tips */}
      <div style={{
        margin: "12px 0 0", padding: "10px 14px",
        background: `${B}0d`, border: `1px solid ${B}25`,
        borderRadius: 12, fontSize: 12, color: T2, lineHeight: 1.6
      }}>
        <span style={{ fontWeight: 700, color: T1 }}>Tips: </span>
        Good lighting · Fill the box with the date · Works with printed &amp; handwritten · Tap Capture when ready
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {status === "ready" && (
          <button
            onClick={scanWithGemini}
            disabled={isProcessing}
            className={isProcessing ? "" : "press"}
            style={{
              padding: 18, borderRadius: 14, border: "none",
              background: isProcessing ? "#ccc" : G,
              color: "#fff", fontSize: 17, fontWeight: 700,
              cursor: isProcessing ? "not-allowed" : "pointer",
              boxShadow: isProcessing ? "none" : "0 4px 14px rgba(0,200,100,0.35)"
            }}
          >
            {isProcessing ? "⏳ Reading date…" : "📸 Capture & Read Date"}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="press"
            style={{
              padding: 14, borderRadius: 12,
              background: "transparent", border: `1.5px solid ${B}`,
              color: B, fontSize: 15, fontWeight: 600, cursor: "pointer"
            }}
          >
            ✎ Type manually instead
          </button>
        )}
      </div>
    </div>
  );
}

export default DateOCRScanner;
