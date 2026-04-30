let configured = false;
let contextInstance = null;
let readyPromise = null;

const LOCAL_BASE = "/scandit";
const CDN_BASE = "https://cdn.jsdelivr.net/npm/@scandit/web-datacapture-barcode@8.0.0/sdc-lib";
const ENV_BASE = import.meta?.env?.VITE_SCANDIT_BASE || "";

const REQUIRED_FILENAMES = [
  "scandit-datacapture-sdk-barcode.wasm",
  "scandit-datacapture-sdk-barcode.js",
];

async function headOk(url) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

async function baseLooksValid(base) {
  console.log(`[Scandit] Checking if base is valid: ${base}`);
  const checks = await Promise.all(
    REQUIRED_FILENAMES.map(async (name) => {
      const url = `${base.replace(/\/$/, "")}/${name}`;
      const isOk = await headOk(url);
      console.log(`[Scandit] ${isOk ? '✅' : '❌'} ${url}`);
      return isOk;
    })
  );
  const okCount = checks.filter(Boolean).length;
  console.log(`[Scandit] Valid files found: ${okCount}/${REQUIRED_FILENAMES.length}`);
  return okCount >= 1;
}

async function resolveLibraryBase() {
  console.log("[Scandit] ========== RESOLVING LIBRARY BASE ==========");
  console.log("[Scandit] Window origin:", window.location.origin);
  console.log("[Scandit] ENV_BASE:", ENV_BASE || "(not set)");

  if (ENV_BASE) {
    console.log("[Scandit] Step 1: Checking ENV base...");
    if (await baseLooksValid(ENV_BASE)) {
      console.log("[Scandit] ✅ Using ENV base", ENV_BASE);
      return ENV_BASE;
    }
  }

  console.log("[Scandit] Step 2: Checking local base...");
  const localUrl = `${window.location.origin}${LOCAL_BASE}`;

  if (await baseLooksValid(LOCAL_BASE)) {
    console.log("[Scandit] ✅ Using absolute URL for workers:", localUrl);
    return localUrl;
  }

  if (await baseLooksValid(localUrl)) {
    console.log("[Scandit] ✅ Using absolute URL:", localUrl);
    return localUrl;
  }

  console.log("[Scandit] Step 3: Checking CDN fallback...");
  if (await baseLooksValid(CDN_BASE)) {
    console.warn("[Scandit] ⚠️ Falling back to CDN base:", CDN_BASE);
    return CDN_BASE;
  }

  const fallbackUrl = `${window.location.origin}${LOCAL_BASE}`;
  console.error("[Scandit] ⚠️ Using absolute URL as last resort:", fallbackUrl);
  return fallbackUrl;
}

export function resetScandit() {
  console.log("[Scandit] Resetting Scandit configuration");
  readyPromise = null;
  configured = false;
  contextInstance = null;
}

export function getScandit(licenseKey, { timeoutMs = 200000 } = {}) {
  if (readyPromise) {
    console.log("[Scandit] Reusing existing initialization promise");
    return readyPromise;
  }

  readyPromise = (async () => {
    try {
      console.log("[Scandit] ========== INITIALIZATION START ==========");
      console.log("[Scandit] License key provided:", licenseKey ? `${licenseKey.substring(0, 20)}...` : "❌ MISSING");

      if (!licenseKey || licenseKey.trim() === '') {
        throw new Error("Scandit license key is missing. Check VITE_SCANDIT_LICENSE_KEY environment variable.");
      }

      console.log("[Scandit] Step 1: Importing ESM modules…");
      const core = await import("@scandit/web-datacapture-core");
      const barcode = await import("@scandit/web-datacapture-barcode");
      console.log("[Scandit] ✅ ESM modules imported successfully");

      if (!configured) {
        console.log("[Scandit] Step 2: Resolving library base location…");
        const base = await resolveLibraryBase();

        console.log("[Scandit] Step 3: Initializing DataCaptureContext…");
        const normalizedBase = base.endsWith('/') ? base : `${base}/`;
        console.log("[Scandit] Normalized library location:", normalizedBase);

        const contextPromise = core.DataCaptureContext.forLicenseKey(licenseKey, {
          libraryLocation: normalizedBase,
          moduleLoaders: [barcode.barcodeCaptureLoader()],
        });

        await new Promise((resolve, reject) => {
          const t = setTimeout(() => {
            reject(new Error(`Scandit initialization timed out after ${timeoutMs}ms`));
          }, timeoutMs);

          contextPromise.then(
            (ctx) => {
              clearTimeout(t);
              configured = true;
              contextInstance = ctx;
              console.log("[Scandit] ✅ DataCaptureContext initialized successfully");
              resolve();
            },
            (e) => {
              clearTimeout(t);
              console.error("[Scandit] ❌ Context initialization FAILED:", e);
              let errorMessage = e?.message || e?.error || String(e);
              if (typeof e === 'object' && e?.error) {
                errorMessage = e.error;
              }
              reject(new Error(errorMessage));
            }
          );
        });
      }

      return { core, barcode, context: contextInstance };
    } catch (error) {
      console.error("[Scandit] ❌ FATAL ERROR during initialization:", error);
      readyPromise = null;
      configured = false;
      contextInstance = null;
      throw error;
    }
  })();

  return readyPromise;
}
