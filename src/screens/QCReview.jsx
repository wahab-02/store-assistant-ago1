import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Steps from "../components/layout/Steps";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Divider from "../components/shared/Divider";
import Button from "../components/shared/Button";
import Spacer from "../components/shared/Spacer";
import { BG, T1, T2, G } from "../constants/colors";
import { useProduct } from "../context/ProductContext";

function QCReview({ go, back }) {
  const { currentProduct, bestBeforeDate } = useProduct();
  const [live, setLive] = useState(false);
  
  // Fallback product data if none scanned
  const product = currentProduct || {
    name: "Product",
    price: 1.50,
    category: "Uncategorized",
  };
  
  // Mock discount data (would come from previous screens in full implementation)
  const discountPercent = 20;
  const rrp = product.rrp || product.price || 1.50;
  const discountedPrice = (rrp * (1 - discountPercent / 100)).toFixed(2);
  
  // Format best-before date for display
  const bestBeforeDateDisplay = bestBeforeDate 
    ? bestBeforeDate.formatted 
    : "14 May 2025"; // Fallback if no date was scanned
  
  const bestBeforeDateShort = bestBeforeDate
    ? bestBeforeDate.display.split(' ').slice(0, 2).join(' ')
    : "14 May"; // Fallback for shopper preview

  if (live) {
    return (
      <div style={{
        flex: 1,
        background: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        textAlign: "center"
      }}>
        <div style={{
          width: 72,
          height: 72,
          background: G + "18",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          animation: "fadeIn 0.4s"
        }}>
          <svg width="30" height="22" viewBox="0 0 30 22">
            <path
              d="M2 11L11 20L28 2"
              stroke={G}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: "drawCheck 0.7s cubic-bezier(0.175,0.885,0.32,1.275) forwards 0.1s"
              }}
            />
          </svg>
        </div>
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: T1,
          letterSpacing: "-0.8px",
          marginBottom: 8
        }}>
          Promotion live
        </div>
        <div style={{
          fontSize: 16,
          color: T2,
          lineHeight: 1.6,
          marginBottom: 40
        }}>
          {product.name} is now appearing on shopper tablets across Riverside Store.
        </div>
        <Button onClick={() => go("qc-status")}>View live status →</Button>
        <Spacer />
        <Button v="secondary" onClick={() => go("home")}>Back to Home</Button>
      </div>
    );
  }

  const rows = [
    ["Product", product.name],
    ["Discount", `${discountPercent}% off — Was £${rrp.toFixed(2)} · Now £${discountedPrice}`],
    ["Best-before", bestBeforeDateDisplay],
    ["Cap", "200 units"],
    ["Ends", "Today at 6:00 PM"],
    ["Audience", "Frequent dairy buyers"]
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG, overflow: "hidden" }}>
      <StatusBar />
      <NavBar title="Review" onBack={back} />
      <Steps total={6} current={5} />
      
      <Scroll>
        <div style={{
          background: "#1D1D1F",
          borderRadius: 18,
          padding: 20,
          marginBottom: 20
        }} className="anim">
          <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginBottom: 12
          }}>
            Shopper preview
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.5,
            marginBottom: 6
          }}>
            {discountPercent}% off {product.name}
          </div>
          <div style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            marginBottom: 16,
            lineHeight: 1.5
          }}>
            Pick the pack with best before <span style={{ color: "#0A84FF", fontWeight: 600 }}>{bestBeforeDateShort}</span>
          </div>
          <div style={{
            display: "flex",
            gap: 12,
            alignItems: "baseline",
            marginBottom: 16
          }}>
            <span style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.28)",
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
              £{discountedPrice}
            </span>
          </div>
          <div style={{
            background: "#0A84FF",
            borderRadius: 10,
            padding: "13px",
            textAlign: "center",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff"
          }}>
            Convert offer
          </div>
        </div>

        <Card style={{ marginBottom: 16 }} className="anim d1">
          {rows.map(([k, v], i) => (
            <div key={k}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "14px 20px",
                gap: 16
              }}>
                <span style={{ fontSize: 15, color: T2, flexShrink: 0 }}>{k}</span>
                <span style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T1,
                  textAlign: "right"
                }}>
                  {v}
                </span>
              </div>
              {i < rows.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: G + "12",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 20
        }} className="anim d2">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 1L1 4v5c0 3.5 3 6.2 7 7 4-.8 7-3.5 7-7V4L8 1z" fill={G} opacity=".3" />
            <path
              d="M5 8l2.5 2.5L11 6"
              stroke={G}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: G }}>
            Within guardrails — no approval needed
          </span>
        </div>

        <Button onClick={() => setLive(true)} style={{ marginTop: 20, marginBottom: 10 }}>
          Go Live Now
        </Button>
        <div style={{ textAlign: "center", fontSize: 13, color: T2, paddingBottom: 20 }}>
          Goes live immediately
        </div>
      </Scroll>
    </div>
  );
}

export default QCReview;
