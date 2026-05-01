import StatusBar from "../components/layout/StatusBar";
import Scroll from "../components/layout/Scroll";
import Button from "../components/shared/Button";
import Pill from "../components/shared/Pill";
import Spacer from "../components/shared/Spacer";
import { BG, T1, T2, B, SEP, CARD, G, T3 } from "../constants/colors";
import { useProduct } from "../context/ProductContext";

function Home({ go }) {
  const { currentProduct } = useProduct();
  
  const basePromotions = [
    { n: "Yeo Valley Yoghurt 500g",       d: "20% off",   r: 127, c: 42, rt: 33 },
    { n: "Warburtons White 800g",          d: "£0.80 off", r: 89,  c: 31, rt: 35 },
    { n: "Innocent Smoothie 750ml",        d: "25% off",   r: 104, c: 38, rt: 37 },
    { n: "Cathedral City 350g",            d: "£2.00 off", r: 76,  c: 21, rt: 28 },
    { n: "Lurpak Butter 250g",             d: "£1.00 off", r: 58,  c: 17, rt: 29 },
    { n: "Heinz Baked Beans 415g",         d: "3 for £2",  r: 143, c: 61, rt: 43 },
    { n: "Müller Corner Yoghurt",          d: "4 for £3",  r: 91,  c: 44, rt: 48 },
    { n: "Hovis Granary 800g",             d: "£0.50 off", r: 67,  c: 24, rt: 36 },
    { n: "Tropicana Orange 1L",            d: "20% off",   r: 83,  c: 29, rt: 35 },
    { n: "Activia Yoghurt 4-Pack",         d: "£1.50 off", r: 72,  c: 26, rt: 36 },
    { n: "Flora Margarine 500g",           d: "£0.75 off", r: 49,  c: 14, rt: 29 },
    { n: "Kellogg's Corn Flakes 500g",     d: "25% off",   r: 98,  c: 40, rt: 41 },
    { n: "McVitie's Digestives 400g",      d: "£0.60 off", r: 115, c: 52, rt: 45 },
    { n: "Anchor Cheddar 400g",            d: "£1.25 off", r: 64,  c: 20, rt: 31 },
    { n: "Ella's Kitchen Pouch",           d: "3 for £4",  r: 37,  c: 18, rt: 49 },
    { n: "Oat So Simple Original 8-Pk",   d: "20% off",   r: 88,  c: 35, rt: 40 },
    { n: "Robinsons Squash 1L",            d: "£0.80 off", r: 55,  c: 19, rt: 35 },
    { n: "Cadbury Dairy Milk 200g",        d: "£1.00 off", r: 162, c: 74, rt: 46 },
    { n: "Pringles Original 200g",         d: "2 for £3",  r: 139, c: 63, rt: 45 },
    { n: "Ribena Blackcurrant 1L",         d: "£0.70 off", r: 44,  c: 15, rt: 34 },
  ];

  // Build active promotions list - if product was scanned, show it first
  const activePromotions = currentProduct
    ? [
        {
          n: currentProduct.name || "Product",
          d: "20% off",
          r: 127,
          c: 42,
          rt: 33,
          image: currentProduct.image
        },
        ...basePromotions.slice(1)
      ]
    : basePromotions;
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      background: BG,
      overflow: "hidden"
    }}>
      <StatusBar />
      <Scroll>
        <div style={{
          padding: "18px 4px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }} className="anim">
          <div>
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              color: T1,
              letterSpacing: "-0.8px",
              lineHeight: 1.2
            }}>
              Good morning,<br />Sarah.
            </div>
            <div style={{ fontSize: 15, color: T2, marginTop: 6 }}>
              Riverside Store · Monday 12 May
            </div>
          </div>
          <button className="press" style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: CARD,
            border: `1px solid ${SEP}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            cursor: "pointer",
            flexShrink: 0
          }}>
            👤
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 28
        }} className="anim d1">
          <button className="press" onClick={() => go("qc-scan")}
            style={{
              background: "linear-gradient(135deg, #6028FF 0%, #6907D9 100%)",
              borderRadius: 24,
              padding: "20px 18px",
              border: "none",
              textAlign: "left",
              boxShadow: "0 8px 16px rgba(96, 40, 255, 0.3)",
              position: "relative",
              overflow: "hidden"
            }}>
            <div style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "-20%",
              width: "100%",
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
              animation: "shimmerglow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite"
            }} />
            <div style={{
              position: "absolute",
              right: -10,
              top: -10,
              opacity: 0.1
            }}>
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              width: 40,
              height: 40,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.3px",
              position: "relative"
            }}>
              Quick Create
            </div>
            <div style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              marginTop: 3,
              position: "relative"
            }}>
              New promotion
            </div>
          </button>

          <button className="press" onClick={() => go("comms-write")}
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: "20px 18px",
              border: "1px solid rgba(0,0,0,0.04)",
              textAlign: "left",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
            }}>
            <div style={{
              background: "rgba(0,0,0,0.04)",
              width: 40,
              height: 40,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T1} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T1, letterSpacing: "-0.3px" }}>
              Store Comms
            </div>
            <div style={{ fontSize: 13, color: T2, marginTop: 3 }}>
              Message shoppers
            </div>
          </button>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }} className="anim d2">
          <span style={{ fontSize: 20, fontWeight: 700, color: T1, letterSpacing: "-0.5px" }}>
            Active
          </span>
          <Pill color={G} style={{ background: "rgba(48,209,88,0.12)" }}>
            ● 20 live
          </Pill>
        </div>

        {activePromotions.map((p, i) => (
          <div key={i} className={`anim d${Math.min(i + 3, 4)}`} style={{ marginBottom: 12 }}>
            <div onClick={() => go("qc-status")} className="press" style={{
              background: "#fff",
              borderRadius: 24,
              padding: 20,
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              cursor: "pointer"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 18
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.n}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        objectFit: "cover",
                        background: BG
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 44,
                      height: 44,
                      background: BG,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: T1,
                      letterSpacing: "-0.2px"
                    }}>
                      {p.n}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: B,
                      fontWeight: 600,
                      marginTop: 2
                    }}>
                      {p.d}
                    </div>
                  </div>
                </div>
                <svg width="7" height="13" viewBox="0 0 7 13" style={{ marginTop: 6 }}>
                  <path d="M1 1l5 5.5-5 5.5" stroke={T3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                background: "rgba(249,249,249,0.8)",
                borderRadius: 14,
                padding: "14px 0"
              }}>
                {[
                  { v: p.r, l: "Reached" },
                  { v: p.c, l: "Conversions" },
                  { v: p.rt + "%", l: "Rate" }
                ].map((m, j) => (
                  <div key={j} style={{
                    textAlign: "center",
                    borderRight: j < 2 ? `1px solid rgba(0,0,0,0.05)` : "none"
                  }}>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: T1,
                      letterSpacing: "-0.5px"
                    }}>
                      {m.v}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: T2,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginTop: 2
                    }}>
                      {m.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Spacer height={8} />
        <div className="anim d4" style={{ marginBottom: 28, textAlign: "center" }}>
          <button className="press" onClick={() => go("ended-promotions")} style={{
            background: "none",
            border: "none",
            fontSize: 14,
            color: T3,
            cursor: "pointer",
            padding: "4px 0",
            textDecoration: "underline",
            textDecorationColor: "rgba(132,122,158,0.4)",
            textUnderlineOffset: 3
          }}>
            View ended promotions
          </button>
        </div>

        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: T1,
          letterSpacing: "-0.5px",
          marginBottom: 12
        }}>
          Store Message
        </div>
        <div onClick={() => go("comms-active")} className="press anim d4"
          style={{
            background: "linear-gradient(135deg, #EEFAFB 0%, #D8F7F9 100%)",
            borderRadius: 24,
            padding: 24,
            paddingBottom: 28,
            cursor: "pointer",
            border: "1px solid rgba(70, 230, 246, 0.4)",
            position: "relative",
            overflow: "hidden"
          }}>
          <div style={{
            position: "absolute",
            right: -30,
            top: -10,
            opacity: 0.1,
            color: "#1D9AA8"
          }}>
            <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 12,
            position: "relative"
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#1D9AA8" }} />
            <div style={{
              fontSize: 12,
              color: "#1D9AA8",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Active Message
            </div>
          </div>
          <div style={{
            fontSize: 16,
            color: T1,
            lineHeight: 1.6,
            fontWeight: 600,
            position: "relative",
            marginBottom: 10
          }}>
            "The Riverside Mermaids made it to the finals — we're all cheering for you. Go Mermaids!"
          </div>
          <div style={{
            fontSize: 13,
            color: T2,
            fontWeight: 600,
            position: "relative"
          }}>
            All shoppers · 10:15 AM
          </div>
        </div>
      </Scroll>
    </div>
  );
}

export default Home;
