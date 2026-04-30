import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Steps from "../components/layout/Steps";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Divider from "../components/shared/Divider";
import Button from "../components/shared/Button";
import Spacer from "../components/shared/Spacer";
import { BG, T1, T2, T3, B } from "../constants/colors";

const Check = ({ active }) => (
  <div style={{
    width: 22,
    height: 22,
    borderRadius: 11,
    border: `2px solid ${active ? B : T3}`,
    background: active ? B : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s"
  }}>
    {active && (
      <svg width="10" height="8" viewBox="0 0 10 8">
        <path
          d="M1 4L4 7L9 1"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    )}
  </div>
);

function QCGroup({ go, back }) {
  const [sel, setSel] = useState(null);
  
  const groups = [
    { id: "dairy", l: "Frequent dairy buyers", s: "Best match for this product" },
    { id: "parents", l: "Parents", s: "Shoppers with children" },
    { id: "health", l: "Health-conscious", s: "Organic & free-from buyers" },
    { id: "loyal", l: "Loyalty members", s: "Card holders only" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG }}>
      <StatusBar />
      <NavBar title="Audience" onBack={back} />
      <Steps total={6} current={4} />
      
      <Scroll>
        <div style={{
          fontSize: 15,
          color: T2,
          lineHeight: 1.6,
          marginBottom: 20
        }} className="anim">
          Optional. Choose a group or skip to reach all active shoppers.
        </div>
        
        <Card className="anim d1">
          <button className="press" onClick={() => setSel(null)}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "18px 20px",
              background: "none",
              border: "none",
              gap: 14
            }}>
            <Check active={sel === null} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T1 }}>
                All shoppers
              </div>
              <div style={{ fontSize: 13, color: T2, marginTop: 1 }}>
                Everyone in store
              </div>
            </div>
          </button>
          
          {groups.map((g) => (
            <div key={g.id}>
              <Divider />
              <button className="press" onClick={() => setSel(g.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "18px 20px",
                  background: "none",
                  border: "none",
                  gap: 14
                }}>
                <Check active={sel === g.id} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T1 }}>
                    {g.l}
                  </div>
                  <div style={{ fontSize: 13, color: T2, marginTop: 1 }}>
                    {g.s}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </Card>
        
        <Spacer height={16} />
        <Button onClick={() => go("qc-review")}>
          {sel ? "Continue" : "Skip — all shoppers"}
        </Button>
      </Scroll>
    </div>
  );
}

export default QCGroup;
