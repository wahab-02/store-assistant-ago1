import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Steps from "../components/layout/Steps";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Label from "../components/shared/Label";
import Button from "../components/shared/Button";
import { BG, T1, T2, B, G, SEP, CARD } from "../constants/colors";
import { useProduct } from "../context/ProductContext";

function QCMechanic({ go, back }) {
  const { currentProduct } = useProduct();
  const [mech, setMech] = useState(null);
  const [val, setVal] = useState("");
  
  // Use product RRP or default to £1.50
  const rrp = currentProduct?.rrp || currentProduct?.price || 1.5;
  
  const price = mech === "pct" && val
    ? (rrp * (1 - val / 100)).toFixed(2)
    : mech === "fixed" && val
    ? (rrp - parseFloat(val || 0)).toFixed(2)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG }}>
      <StatusBar />
      <NavBar title="Mechanic" onBack={back} />
      <Steps total={6} current={1} />
      
      <Scroll>
        <Card style={{
          padding: 20,
          marginBottom: 20,
          border: `1.5px solid ${G}`,
          boxShadow: `0 0 0 4px ${G}12`
        }} className="anim">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {currentProduct?.image ? (
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  objectFit: "cover",
                  background: BG,
                  flexShrink: 0
                }}
              />
            ) : (
              <div style={{
                width: 52,
                height: 52,
                background: BG,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                flexShrink: 0
              }}>
                📦
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11,
                color: G,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: 4
              }}>
                Confirmed
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: T1,
                letterSpacing: "-0.3px"
              }}>
                {currentProduct?.name || "Unknown Product"}
              </div>
              <div style={{ fontSize: 13, color: T2, marginTop: 2 }}>
                {currentProduct?.category || "Uncategorized"} · RRP £{rrp.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>

        <Label>Promotion type</Label>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 20
        }} className="anim d1">
          {[
            { key: "pct", g: "%", l: "Percentage off", s: "e.g. 20% off" },
            { key: "fixed", g: "£", l: "Fixed amount off", s: "e.g. £0.50 off" }
          ].map(m => (
            <button key={m.key} className="press" onClick={() => setMech(m.key)}
              style={{
                background: mech === m.key ? B + "0f" : CARD,
                border: `1.5px solid ${mech === m.key ? B : SEP}`,
                borderRadius: 18,
                padding: "18px 16px",
                textAlign: "left",
                boxShadow: mech === m.key ? `0 0 0 4px ${B}12` : "0 1px 6px rgba(0,0,0,0.06)",
                transition: "all 0.2s"
              }}>
              <div style={{
                fontSize: 28,
                fontWeight: 300,
                color: mech === m.key ? B : T2,
                marginBottom: 10
              }}>
                {m.g}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: T1,
                letterSpacing: "-0.2px"
              }}>
                {m.l}
              </div>
              <div style={{ fontSize: 12, color: T2, marginTop: 3 }}>{m.s}</div>
            </button>
          ))}
        </div>

        {mech && (
          <div className="anim">
            <Card style={{ padding: 20, marginBottom: 16 }}>
              <Label>{mech === "pct" ? "Discount (%)" : "Amount off (£)"}</Label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 22,
                  fontWeight: 300,
                  color: T2
                }}>
                  {mech === "pct" ? "%" : "£"}
                </span>
                <input
                  type="number"
                  placeholder={mech === "pct" ? "20" : "0.50"}
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 16px 16px 42px",
                    fontSize: 32,
                    fontWeight: 700,
                    color: T1,
                    background: BG,
                    border: "none",
                    borderRadius: 12,
                    letterSpacing: "-1px"
                  }}
                />
              </div>
            </Card>
            
            {price && parseFloat(price) > 0 && (
              <div className="anim" style={{
                background: T1,
                borderRadius: 18,
                padding: 20,
                marginBottom: 20
              }}>
                <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: 10
                }}>
                  Shopper preview
                </div>
                <div style={{
                  fontSize: 15,
                  color: "#fff",
                  fontWeight: 600,
                  lineHeight: 1.5,
                  marginBottom: 10
                }}>
                  {mech === "pct" ? val : ""}% off {currentProduct?.name || "Product"}
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.3)",
                    textDecoration: "line-through"
                  }}>
                    £{rrp.toFixed(2)}
                  </span>
                  <span style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: G,
                    letterSpacing: "-1px"
                  }}>
                    £{price}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={() => go("qc-bestbefore")}
          disabled={!mech || !val || parseFloat(val) <= 0}
        >
          Continue
        </Button>
      </Scroll>
    </div>
  );
}

export default QCMechanic;
