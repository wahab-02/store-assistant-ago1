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
      <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
          {render()}
        </div>
      </div>
    </ProductProvider>
  );
}
