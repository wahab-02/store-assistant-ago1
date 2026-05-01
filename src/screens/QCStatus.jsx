import { useState, useEffect } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Scroll from "../components/layout/Scroll";
import Pill from "../components/shared/Pill";
import Button from "../components/shared/Button";
import Spacer from "../components/shared/Spacer";
import { DK_BG, DK_T1, DK_T2, DK_C, DK_C2, G } from "../constants/colors";
import { useProduct } from "../context/ProductContext";

function QCStatus({ go, back }) {
  const { currentProduct, bestBeforeDate } = useProduct();
  const [reached, setReached] = useState(127);
  const [claims, setClaims] = useState(42);
  const [ended, setEnded] = useState(false);
  const [showEndDrawer, setShowEndDrawer] = useState(false);
  
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
      
      {showEndDrawer && (
        <>
          <div
            onClick={() => setShowEndDrawer(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 100,
              animation: "fadeIn 0.2s both"
            }}
          />
          <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 101,
            background: "#1C1C1E",
            borderRadius: "28px 28px 0 0",
            padding: "12px 24px 44px",
            animation: "slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both"
          }}>
            <div style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 28px"
            }} />
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: "rgba(255,59,48,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: DK_T1,
              letterSpacing: "-0.4px",
              marginBottom: 8
            }}>
              End this promotion?
            </div>
            <div style={{
              fontSize: 15,
              color: DK_T2,
              lineHeight: 1.6,
              marginBottom: 28
            }}>
              This will stop the promotion immediately. Shoppers who have already converted will still be able to redeem at the till.
            </div>
            <button
              className="press"
              onClick={() => { setEnded(true); setShowEndDrawer(false); }}
              style={{
                width: "100%",
                padding: "16px",
                background: "#FF453A",
                border: "none",
                borderRadius: 18,
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 10,
                cursor: "pointer"
              }}
            >
              Yes, end promotion
            </button>
            <button
              className="press"
              onClick={() => setShowEndDrawer(false)}
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(255,255,255,0.07)",
                border: "none",
                borderRadius: 18,
                color: DK_T1,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Keep it running
            </button>
          </div>
        </>
      )}

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
              { v: claims, l: "Conversions" },
              { v: rate + "%", l: "Rate" }
            ].map((m, i) => (
              <div key={i} style={{
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
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
            <button className="press" onClick={() => setShowEndDrawer(true)}
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
                Final: {claims} conversions · {rate}% rate
              </div>
            </div>
          )}
        </div>

        <Spacer height={4} />
        <Button v="dark" onClick={() => go("qc-scan")}>+ New Promotion</Button>
      </Scroll>
    </div>
  );
}

export default QCStatus;
