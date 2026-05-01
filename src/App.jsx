import { useState } from "react";
import Globals from "./components/shared/Globals";
import { ProductProvider } from "./context/ProductContext";

// Import all screen components
import Home from "./screens/Home";
import QCScan from "./screens/QCScan";
import QCMechanic from "./screens/QCMechanic";
import QCBestBefore from "./screens/QCBestBefore";
import QCDetails from "./screens/QCDetails";
import QCGroup from "./screens/QCGroup";
import QCReview from "./screens/QCReview";
import QCStatus from "./screens/QCStatus";
import CommsWrite from "./screens/CommsWrite";
import CommsActive from "./screens/CommsActive";
import RMDashboard from "./screens/RMDashboard";

// Navigation configuration
const NAV = [
  { id: "home", l: "Home", g: "sm" },
  { id: "qc-scan", l: "QC: Scan", g: "sm" },
  { id: "qc-mechanic", l: "QC: Mechanic", g: "sm" },
  { id: "qc-bestbefore", l: "QC: Best Before", g: "sm" },
  { id: "qc-details", l: "QC: Cap & Time", g: "sm" },
  { id: "qc-group", l: "QC: Audience", g: "sm" },
  { id: "qc-review", l: "QC: Review", g: "sm" },
  { id: "qc-status", l: "Live Status", g: "sm" },
  { id: "comms-write", l: "Store Comms", g: "sm" },
  { id: "comms-active", l: "Comms Active", g: "sm" },
  { id: "rm-dashboard", l: "RM Dashboard", g: "rm" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [hist, setHist] = useState(["home"]);
  
  const go = (s) => {
    setHist((h) => [...h, s]);
    setScreen(s);
  };
  
  const back = () => {
    if (hist.length > 1) {
      const n = hist.slice(0, -1);
      setHist(n);
      setScreen(n[n.length - 1]);
    }
  };
  
  const isRM = screen === "rm-dashboard";
  const p = { go, back };
  
  const render = () => {
    switch (screen) {
      case "home":
        return <Home {...p} />;
      case "qc-scan":
        return <QCScan {...p} />;
      case "qc-mechanic":
        return <QCMechanic {...p} />;
      case "qc-bestbefore":
        return <QCBestBefore {...p} />;
      case "qc-details":
        return <QCDetails {...p} />;
      case "qc-group":
        return <QCGroup {...p} />;
      case "qc-review":
        return <QCReview {...p} />;
      case "qc-status":
        return <QCStatus {...p} />;
      case "comms-write":
        return <CommsWrite {...p} />;
      case "comms-active":
        return <CommsActive {...p} />;
      case "rm-dashboard":
        return <RMDashboard />;
      default:
        return <Home {...p} />;
    }
  };

  return (
    <ProductProvider>
      <Globals />
      <div style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Content */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: isRM ? "flex-start" : "center",
          justifyContent: "center",
          padding: isRM ? 0 : "32px 24px"
        }}>
          {isRM ? (
            <div style={{ width: "100%" }}>{render()}</div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20
            }}>
              <div style={{
                width: 375,
                height: 780,
                borderRadius: 52,
                background: "#fff",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 0 0 10px #1C1C1E,
                  0 0 0 11px rgba(255,255,255,0.07), 0 50px 140px rgba(0,0,0,0.85)`
              }}>
                {/* Phone detail buttons */}
                {[
                  [
                    {
                      position: "absolute",
                      right: -3,
                      top: 120,
                      width: 4,
                      height: 64,
                      background: "#2C2C2E",
                      borderRadius: "0 2px 2px 0"
                    }
                  ],
                  [
                    {
                      position: "absolute",
                      left: -3,
                      top: 96,
                      width: 4,
                      height: 44,
                      background: "#2C2C2E",
                      borderRadius: "2px 0 0 2px"
                    }
                  ],
                  [
                    {
                      position: "absolute",
                      left: -3,
                      top: 152,
                      width: 4,
                      height: 64,
                      background: "#2C2C2E",
                      borderRadius: "2px 0 0 2px"
                    }
                  ],
                  [
                    {
                      position: "absolute",
                      left: -3,
                      top: 228,
                      width: 4,
                      height: 64,
                      background: "#2C2C2E",
                      borderRadius: "2px 0 0 2px"
                    }
                  ]
                ].map((s, i) => (
                  <div key={i} style={s[0]} />
                ))}
                {render()}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProductProvider>
  );
}
