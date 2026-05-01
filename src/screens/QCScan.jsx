import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Steps from "../components/layout/Steps";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Divider from "../components/shared/Divider";
import { BG, T1, T2, T3, CARD, SEP, B } from "../constants/colors";
import { BarcodeScanner } from "../components/BarcodeScanner";
import { useProduct } from "../context/ProductContext";
import { fetchProductByGtin } from "../services/catalogService";

function QCScan({ go, back }) {
  const [mode, setMode] = useState("scan");
  const [q, setQ] = useState("");
  const { setProduct, setLoading, setError } = useProduct();
  
  const res = q.length > 1
    ? ["Yeo Valley Natural Yoghurt 500g", "Yeo Valley Greek Yoghurt 450g", "Yeo Valley Vanilla 400g"]
    : [];

  const handleBarcodeScanned = async (barcode) => {
    console.log("📱 Barcode scanned:", barcode);
    setLoading(true);
    setError(null);

    try {
      const product = await fetchProductByGtin(barcode);
      
      if (product) {
        console.log("✅ Product found:", product);
        setProduct(product);
        go("qc-mechanic");
      } else {
        console.log("❌ No product found for barcode:", barcode);
        setError("Product not found");
        // Still navigate but with null product (will show unknown product)
        setProduct({
          gtin: barcode,
          name: `Unknown Product (${barcode})`,
          image: null,
          category: "Uncategorized",
          price: null,
          rrp: null,
        });
        go("qc-mechanic");
      }
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      setError(error.message);
      // Navigate anyway with error state
      setProduct({
        gtin: barcode,
        name: `Error Loading Product`,
        image: null,
        category: "Error",
        price: null,
        rrp: null,
      });
      go("qc-mechanic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      height: "100%",
      background: mode === "scan" ? "#000" : BG,
      overflow: "hidden"
    }}>
      <StatusBar light={mode === "scan"} />
      <NavBar title="Quick Create" onBack={back} light={mode === "scan"} />
      <Steps total={6} current={0} />
      
      {mode === "scan" ? (
        <div style={{ flex: 1, position: "relative", minHeight: 0, overflow: "hidden" }}>
          <BarcodeScanner
            isActive={mode === "scan"}
            licenseKey={import.meta.env.VITE_SCANDIT_LICENSE_KEY}
            onBarcodeScanned={handleBarcodeScanned}
            onClose={() => setMode("search")}
          />

          <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.9)",
            padding: "14px 20px 28px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            <button 
              className="press"
              onClick={() => handleBarcodeScanned("400580824600")}
              style={{
                background: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 980,
                padding: "14px",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600
              }}>
              🧪 Test: Scan NIVEA Body Lotion
            </button>
            <button onClick={() => setMode("search")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontSize: 15,
                fontWeight: 500,
                width: "100%",
                textAlign: "center"
              }}>
              Search manually instead
            </button>
          </div>
        </div>
      ) : (
        <Scroll>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="6" cy="6" r="5" stroke={T2} strokeWidth="1.5" />
              <path d="M10 10l4 4" stroke={T2} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search products…"
              style={{
                width: "100%",
                padding: "14px 16px 14px 38px",
                fontSize: 17,
                color: T1,
                background: CARD,
                border: "none",
                borderRadius: 12,
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
              }}
            />
          </div>
          
          {res.length > 0 && (
            <Card className="anim">
              {res.map((r, i) => (
                <div key={r}>
                  <button className="press" onClick={() => go("qc-mechanic")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      padding: "16px 20px",
                      background: "none",
                      border: "none",
                      gap: 14
                    }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      background: BG,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0
                    }}>
                      🥛
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: T1 }}>{r}</div>
                      <div style={{ fontSize: 13, color: T2, marginTop: 2 }}>Dairy · £1.50</div>
                    </div>
                    <svg width="7" height="12" viewBox="0 0 7 12">
                      <path d="M1 1l5 5-5 5" stroke={T3} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </button>
                  {i < res.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          )}
          
          <div style={{ height: 12 }} />
          <button onClick={() => setMode("scan")}
            style={{
              background: "none",
              border: "none",
              color: B,
              fontSize: 15,
              fontWeight: 500,
              width: "100%",
              textAlign: "center",
              padding: "8px"
            }}>
            ← Back to scan
          </button>
        </Scroll>
      )}
    </div>
  );
}

export default QCScan;
