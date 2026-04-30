import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Scroll from "../components/layout/Scroll";
import Button from "../components/shared/Button";
import Pill from "../components/shared/Pill";
import { BG, T1, T2, T3, G } from "../constants/colors";

function CommsActive({ go, back }) {
  const [removed, setRemoved] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG }}>
      <StatusBar />
      <NavBar title="Active Message" onBack={back} />
      
      <Scroll>
        {removed ? (
          <div style={{ textAlign: "center", paddingTop: 60 }} className="anim">
            <div style={{
              width: 64,
              height: 64,
              background: BG,
              borderRadius: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 6h16M8 6V4h6v2M18 6l-1 13H5L4 6"
                  stroke={T2}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: T1,
              letterSpacing: "-0.6px",
              marginBottom: 8
            }}>
              Message removed
            </div>
            <div style={{
              fontSize: 15,
              color: T2,
              lineHeight: 1.6,
              marginBottom: 40
            }}>
              Shoppers will no longer see this message.
            </div>
            <Button onClick={() => go("comms-write")}>Write a new message</Button>
          </div>
        ) : (
          <>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20
            }} className="anim">
              <div style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: G,
                flexShrink: 0,
                animation: "pulse 1.5s ease-in-out infinite"
              }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: G }}>Active</span>
              <span style={{ fontSize: 14, color: T2 }}>· All shoppers · 10:15 AM</span>
            </div>
            
            <div style={{
              background: "#1D1D1F",
              borderRadius: 18,
              padding: 24,
              marginBottom: 20
            }} className="anim d1">
              <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: 14
              }}>
                Your store says
              </div>
              <div style={{
                fontSize: 17,
                color: "#fff",
                lineHeight: 1.7
              }}>
                "The Riverside Mermaids made it to the finals next week — we're all cheering for you. Go Mermaids!"
              </div>
            </div>
            
            <div style={{
              fontSize: 14,
              color: T2,
              lineHeight: 1.7,
              marginBottom: 24
            }} className="anim d2">
              This message will show on all new shopper sessions until you remove it.
            </div>
            
            <Button v="danger" onClick={() => setRemoved(true)} style={{ marginBottom: 12 }}>
              Remove message
            </Button>
            <Button onClick={() => go("comms-write")}>Write a new message</Button>
          </>
        )}
      </Scroll>
    </div>
  );
}

export default CommsActive;
