import { useEffect, useRef, useState } from "react";
import { getScandit, resetScandit } from "../lib/scandit";

export function BarcodeScanner({ licenseKey, isActive, onBarcodeScanned, onClose }) {
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const viewRef = useRef(null);
  const captureRef = useRef(null);
  const listenerAttachedRef = useRef(false);
  const initLock = useRef(false);
  const lastScanRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectViewSafely = (view, el) =>
    new Promise((resolve, reject) => {
      requestAnimationFrame(async () => {
        try {
          const maybe = view.connectToElement(el);
          if (maybe && typeof maybe.then === "function") {
            await maybe;
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });

  const shouldEmit = (code) => {
    const now = Date.now();
    const last = lastScanRef.current;
    if (last && last.code === code && now - last.ts <= 1200) {
      return false;
    }
    lastScanRef.current = { code, ts: now };
    return true;
  };

  async function disposeQuietly() {
    const cap = captureRef.current;
    const view = viewRef.current;
    const ctx = ctxRef.current;
    if (!cap && !view && !ctx) return;
    try {
      if (cap) {
        await cap.setEnabled(false);
        cap.removeAllListeners?.();
        listenerAttachedRef.current = false;
      }
      if (ctx?.frameSource) {
        await ctx.frameSource.switchToDesiredState("off");
      }
      if (view) {
        await view.setContext?.(null);
        const el = view.element || view.htmlElement || view.domElement;
        if (el?.parentNode) el.parentNode.removeChild(el);
      }
    } finally {
      captureRef.current = null;
      viewRef.current = null;
      ctxRef.current = null;
    }
  }

  async function init() {
    if (initLock.current || !isActive) return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn("[Scanner] Skipping init — container collapsed");
      return;
    }

    if (ctxRef.current && viewRef.current) {
      console.log("[Scanner] Reusing existing context/view");
      try {
        await captureRef.current?.setEnabled(true);
      } catch {}
      setLoading(false);
      initLock.current = false;
      return;
    }

    if (!licenseKey || licenseKey.trim() === '') {
      setError("Scandit license key is missing");
      initLock.current = false;
      return;
    }

    console.log("[Scanner] ========== SCANNER INITIALIZATION ==========");
    initLock.current = true;
    setLoading(true);
    setError(null);

    try {
      const { core, barcode, context } = await getScandit(licenseKey);
      const { DataCaptureView, Camera, FrameSourceState, RectangularLocationSelection } = core;
      const { BarcodeCapture, BarcodeCaptureSettings, Symbology, BarcodeCaptureOverlay } = barcode;

      if (!containerRef.current) throw new Error("Scanner container not mounted");

      const mount = containerRef.current;
      mount.style.minHeight = "200px";
      mount.style.position = "relative";
      mount.style.overflow = "hidden";

      ctxRef.current = context;

      const camera = await Camera.pickBestGuess();
      if (!camera) throw new Error("No camera available");
      
      const recommended = BarcodeCapture.recommendedCameraSettings;
      if (recommended) {
        await camera.applySettings(recommended);
      }
      await context.setFrameSource(camera);

      const settings = new BarcodeCaptureSettings();
      settings.enableSymbologies([
        Symbology.EAN13UPCA,
        Symbology.EAN8,
        Symbology.UPCE,
      ]);
      
      const size = new core.SizeWithUnit(
        new core.NumberWithUnit(0.74, core.MeasureUnit.Fraction),
        new core.NumberWithUnit(0.54, core.MeasureUnit.Fraction)
      );
      settings.locationSelection = RectangularLocationSelection.withSize(size);

      const view = await DataCaptureView.forContext?.(context) ?? new DataCaptureView();
      viewRef.current = view;
      
      if (!DataCaptureView.forContext) {
        await view.setContext?.(context);
      }

      await connectViewSafely(view, containerRef.current);

      const capture = await BarcodeCapture.forContext(context, settings);
      captureRef.current = capture;
      await BarcodeCaptureOverlay.withBarcodeCaptureForView(capture, view);

      if (!listenerAttachedRef.current) {
        capture.addListener({
          didScan: (_m, session) => {
            const b = session?.newlyRecognizedBarcode;
            const code = (b?.data ?? "").trim();
            if (!code) return;
            console.log(`[Scanner] Barcode detected: ${code}`);
            const codeWithoutCheckDigit = code.length > 1 ? code.slice(0, -1) : code;
            if (shouldEmit(code)) onBarcodeScanned(codeWithoutCheckDigit);
          },
        });
        listenerAttachedRef.current = true;
      }

      await context.frameSource.switchToDesiredState(FrameSourceState.On);
      await capture.setEnabled(true);
    } catch (e) {
      console.error("[Scanner] Initialization failed:", e);
      resetScandit();
      setError(e?.message || "Failed to initialize scanner");
      await disposeQuietly();
    } finally {
      setLoading(false);
      initLock.current = false;
    }
  }

  useEffect(() => {
    if (!isActive) {
      (async () => {
        try {
          await captureRef.current?.setEnabled(false);
          await ctxRef.current?.frameSource?.switchToDesiredState("off");
        } catch {}
      })();
      return;
    }

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      const id = setTimeout(() => {
        if (isActive) void init();
      }, 300);
      return () => clearTimeout(id);
    }

    void init();
  }, [isActive]);

  useEffect(() => {
    return () => {
      void disposeQuietly();
    };
  }, []);

  return (
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          background: "#000",
          position: "relative",
          overflow: "hidden"
        }}
      />
      
      {loading && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.7)"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 12,
            padding: "14px 20px",
            color: "#333",
            fontSize: 15,
            fontWeight: 500
          }}>
            Initializing scanner…
          </div>
        </div>
      )}
      
      {error && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.9)",
          flexDirection: "column",
          padding: 40
        }}>
          <div style={{
            fontSize: 48,
            marginBottom: 16
          }}>⚠️</div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 8
          }}>
            Scanner Error
          </div>
          <div style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            marginBottom: 24
          }}>
            {error}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 980,
                padding: "12px 24px",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Close Scanner
            </button>
          )}
        </div>
      )}

      {!loading && !error && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Scanning frame corners */}
          {[[{ top: 56, left: 28 }, { borderTop: "3px solid rgba(255,255,255,0.75)", borderLeft: "3px solid rgba(255,255,255,0.75)", borderRadius: "6px 0 0 0" }],
          [{ bottom: 56, left: 28 }, { borderBottom: "3px solid rgba(255,255,255,0.75)", borderLeft: "3px solid rgba(255,255,255,0.75)", borderRadius: "0 0 0 6px" }],
          [{ top: 56, right: 28 }, { borderTop: "3px solid rgba(255,255,255,0.75)", borderRight: "3px solid rgba(255,255,255,0.75)", borderRadius: "0 6px 0 0" }],
          [{ bottom: 56, right: 28 }, { borderBottom: "3px solid rgba(255,255,255,0.75)", borderRight: "3px solid rgba(255,255,255,0.75)", borderRadius: "0 0 6px 0" }]
          ].map(([pos, sty], i) => (
            <div key={i} style={{ position: "absolute", ...pos, width: 34, height: 34, ...sty }} />
          ))}
          
          {/* Scanning line */}
          <div style={{
            position: "absolute",
            left: 28,
            right: 28,
            height: 2,
            background: "linear-gradient(90deg,transparent,rgba(0,113,227,0.85),transparent)",
            borderRadius: 1,
            animation: "scanAnim 2.4s ease-in-out infinite"
          }} />
          
          <div style={{
            position: "absolute",
            bottom: 88,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 15,
            color: "rgba(255,255,255,0.5)"
          }}>
            Point at a barcode to scan
          </div>
        </div>
      )}
    </div>
  );
}
