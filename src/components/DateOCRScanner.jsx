import { useEffect, useRef, useState } from "react";
import { B, T1, G, T2 } from "../constants/colors";
import { createWorker } from "tesseract.js";

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

  const scanWithOCR = async () => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setIsProcessing(true);
    setDetectedText("Reading text…");

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

      // Run Tesseract OCR on cropped area only
      setDetectedText("Analyzing image…");
      
      const worker = await createWorker("eng", 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setDetectedText(`Reading: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      // Configure for both printed and handwritten text
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/-:. ',
        tessedit_pageseg_mode: '6', // Assume uniform block of text
      });
      
      const { data } = await worker.recognize(croppedCanvas);
      await worker.terminate();
      
      const text = data.text;
      console.log("OCR text:", text);

      if (!text) {
        setDetectedText("No text found — try again");
        return;
      }

      // Date patterns to match
      const patterns = [
        // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
        /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/g,
        // MM/DD/YYYY, MM-DD-YYYY, MM.DD.YYYY (ambiguous)
        /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/g,
        // YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
        /\b(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})\b/g,
        // DD MMM YYYY, DD MMMM YYYY
        /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\s+(\d{2,4})\b/gi,
        // MMM DD YYYY, MMMM DD YYYY
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\s+(\d{1,2})[,\s]+(\d{2,4})\b/gi,
        // EXP: DD/MM/YYYY or similar
        /EXP[:\s]+(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/gi,
        // USE BY, BEST BEFORE, etc.
        /(USE BY|BEST BEFORE|EXPIRY|EXP)[:\s]+(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/gi,
      ];

      let foundDate = null;
      let rawMatch = "";

      for (const pattern of patterns) {
        const match = pattern.exec(text);
        if (match) {
          rawMatch = match[0];
          foundDate = parseDateFromMatch(match, pattern);
          if (foundDate) break;
        }
      }

      if (!foundDate) {
        setDetectedText("No date found — try again");
        return;
      }

      let { day, month, year } = foundDate;
      
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

  const parseDateFromMatch = (match, pattern) => {
    const monthMap = {
      jan: 1, january: 1,
      feb: 2, february: 2,
      mar: 3, march: 3,
      apr: 4, april: 4,
      may: 5,
      jun: 6, june: 6,
      jul: 7, july: 7,
      aug: 8, august: 8,
      sep: 9, september: 9,
      oct: 10, october: 10,
      nov: 11, november: 11,
      dec: 12, december: 12,
    };

    // Check if pattern includes month names
    const hasMonthName = match.some(m => typeof m === 'string' && isNaN(m) && monthMap[m.toLowerCase()]);

    if (hasMonthName) {
      // DD MMM YYYY or MMM DD YYYY format
      let day, month, year;
      for (let i = 1; i < match.length; i++) {
        const part = match[i];
        if (isNaN(part) && monthMap[part.toLowerCase()]) {
          month = monthMap[part.toLowerCase()];
        } else if (!isNaN(part)) {
          const num = parseInt(part);
          if (num > 31 || (year && !day)) {
            year = num < 100 ? 2000 + num : num;
          } else if (!day) {
            day = num;
          } else if (!year) {
            year = num < 100 ? 2000 + num : num;
          }
        }
      }
      return { day, month, year };
    }

    // Numeric formats
    const nums = match.slice(1).map(n => parseInt(n));
    
    // YYYY-MM-DD format (year first)
    if (nums[0] > 31) {
      const year = nums[0] < 100 ? 2000 + nums[0] : nums[0];
      return { day: nums[2], month: nums[1], year };
    }

    // DD/MM/YYYY or MM/DD/YYYY (ambiguous)
    // Assume DD/MM/YYYY (European/international standard)
    const day = nums[0];
    const month = nums[1];
    let year = nums[2];
    if (year < 100) year += 2000;

    // Swap if month > 12 (must be DD/MM format)
    if (month > 12) {
      return { day: month, month: day, year };
    }

    return { day, month, year };
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
            {status === "ready" && isProcessing && "⏳ Reading text…"}
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
            onClick={scanWithOCR}
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
