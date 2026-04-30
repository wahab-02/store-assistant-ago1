import { useState, useEffect } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Scroll from "../components/layout/Scroll";
import Pill from "../components/shared/Pill";
import Button from "../components/shared/Button";
import Spacer from "../components/shared/Spacer";
import { DK_BG, DK_T1, DK_T2, DK_C, DK_C2, DK_SEP, G } from "../constants/colors";
import { useProduct } from "../context/ProductContext";

function QCStatus({ go, back }) {
  const { currentProduct, bestBeforeDate } = useProduct();
  const [reached, setReached] = useState(127);
  const [claims, setClaims] = useState(42);
  const [ended, setEnded] = useState(false);
  
  // Use actual product or fallback
  const product = currentProduct || {
    name: "Product",
    price: 1.50,
    category: "Uncategorized",
  };
  
  // Mock promotion data (would come from context in full implementation)
  const discountPercent = 20;
  const cap = 200;
  const endTime = "6 PM";
  
  // Format best-before date with year
  const bestBeforeDateDisplay = bestBeforeDate
    ? bestBeforeDate.display
    : "14 May 2025";

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => {
      setReached(r => r < 158 ? r + 1 : r);
      if (Math.random() > .55) setClaims(c => c + 1);
    }, 1800);
    return () => clearInterval(t);
  }, [ended]);

  const rate = reached > 0 ? Math.round((claims / reached) * 100) : 0;
  
  const history = [
    { n: "Warburtons White 800g", d: "£0.80 off", r: "35%", a: "Yesterday" },
    { n: "Innocent Smoothie 750ml", d: "25% off", r: "40%", a: "2 days ago" },
    { n: "Cathedral City 350g", d: "£2.00 off", r: "28%", a: "3 days ago" }
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      background: DK_BG,
      overflow: "hidden"
    }}>
      <StatusBar light />
      <NavBar
        title="Live Status"
        onBack={back}
        light
        right={!ended && (
          <Pill color={G} style={{ background: G + "25", fontSize: 11 }}>
            <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>●</span> Live
          </Pill>
        )}
      />
      
      <Scroll style={{ padding: "0 20px 28px" }}>
        <div style={{ marginBottom: 24 }} className="anim">
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: DK_T1,
            letterSpacing: "-0.4px",
            marginBottom: 4
          }}>
            {product.name}
          </div>
          <div style={{ fontSize: 14, color: DK_T2 }}>
            {discountPercent}% off · {cap} cap · Ends {endTime} · Best before {bestBeforeDateDisplay}
          </div>
        </div>

        <div style={{
          background: DK_C,
          borderRadius: 18,
          padding: "28px 20px",
          marginBottom: 12
        }} className="anim d1">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0
          }}>
            {[
              { v: reached, l: "Reached" },
              { v: claims, l: "Claims" },
              { v: rate + "%", l: "Rate" }
            ].map((m, i) => (
              <div key={i} style={{
                borderRight: i < 2 ? `1px solid ${DK_SEP}` : "none",
                padding: "0 4px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: DK_T1,
                  letterSpacing: "-1.5px",
                  animation: "fadeUp 0.3s both"
                }}>
                  {m.v}
                </div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: DK_T2,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginTop: 4
                }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: DK_C,
          borderRadius: 18,
          padding: 20,
          marginBottom: 12
        }} className="anim d2">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
          }}>
            <div>
              <div style={{
                fontSize: 13,
                color: DK_T2,
                marginBottom: 4,
                fontWeight: 500
              }}>
                Redeemed at till
              </div>
              <div style={{
                fontSize: 34,
                fontWeight: 700,
                color: G,
                letterSpacing: "-1.5px"
              }}>
                31
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: DK_T2, marginBottom: 4 }}>
                Cap used
              </div>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: DK_T1,
                letterSpacing: "-0.8px"
              }}>
                {claims}<span style={{ fontSize: 14, color: DK_T2, fontWeight: 400 }}> / {cap}</span>
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 14,
            background: DK_C2,
            borderRadius: 4,
            height: 6,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${Math.min((claims / cap) * 100, 100)}%`,
              background: G,
              height: "100%",
              borderRadius: 4,
              transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)"
            }} />
          </div>
        </div>

        <div className="anim d3" style={{ marginBottom: 24 }}>
          {!ended ? (
            <button className="press" onClick={() => setEnded(true)}
              style={{
                width: "100%",
                padding: "15px",
                background: "none",
                border: `1.5px solid rgba(255,59,48,0.35)`,
                borderRadius: 980,
                color: "#FF453A",
                fontSize: 16,
                fontWeight: 600
              }}>
              End promotion early
            </button>
          ) : (
            <div style={{
              background: DK_C,
              borderRadius: 18,
              padding: 20,
              textAlign: "center"
            }}>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: DK_T1,
                marginBottom: 4
              }}>
                Promotion ended
              </div>
              <div style={{ fontSize: 14, color: DK_T2 }}>
                Final: {claims} claims · {rate}% rate
              </div>
            </div>
          )}
        </div>

        <div style={{
          fontSize: 17,
          fontWeight: 700,
          color: DK_T1,
          marginBottom: 12,
          letterSpacing: "-0.3px"
        }}>
          Last 7 Days
        </div>
        
        <div style={{ background: DK_C, borderRadius: 18 }}>
          {history.map((h, i) => (
            <div key={i}>
              <div style={{
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: DK_T1,
                    marginBottom: 2
                  }}>
                    {h.n}
                  </div>
                  <div style={{ fontSize: 13, color: DK_T2 }}>
                    {h.d} · {h.a}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: G,
                    letterSpacing: "-0.8px"
                  }}>
                    {h.r}
                  </div>
                  <div style={{ fontSize: 11, color: DK_T2 }}>claim rate</div>
                </div>
              </div>
              {i < history.length - 1 && (
                <div style={{ height: 1, background: DK_SEP, margin: "0 20px" }} />
              )}
            </div>
          ))}
        </div>
        
        <Spacer height={20} />
        <Button v="dark" onClick={() => go("qc-scan")}>+ New Promotion</Button>
      </Scroll>
    </div>
  );
}

export default QCStatus;
