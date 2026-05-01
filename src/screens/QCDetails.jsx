import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Steps from "../components/layout/Steps";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Label from "../components/shared/Label";
import Button from "../components/shared/Button";
import Spacer from "../components/shared/Spacer";
import { BG, T1, T2, B } from "../constants/colors";

function QCDetails({ go, back }) {
  const [cap, setCap] = useState("200");
  const [time, setTime] = useState("18:00");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG }}>
      <StatusBar />
      <NavBar title="Cap & End Time" onBack={back} />
      <Steps total={6} current={3} />
      
      <Scroll>
        <Card style={{ padding: 20, marginBottom: 12 }} className="anim">
          <Label>Quantity cap</Label>
          <input
            type="number"
            value={cap}
            onChange={e => setCap(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 32,
              fontWeight: 800,
              color: T1,
              background: BG,
              border: "none",
              borderRadius: 12,
              letterSpacing: "-1px"
            }}
          />
          <div style={{ fontSize: 13, color: T2, marginTop: 8 }}>
            Promotion ends automatically when this many units are converted.
          </div>
        </Card>
        
        <Card style={{ padding: 20 }} className="anim d1">
          <Label>End time (today)</Label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 8,
            marginBottom: 14
          }}>
            {["12:00", "14:00", "17:00", "18:00", "20:00", "Close"].map(t => (
              <button key={t} onClick={() => setTime(t)} className="press"
                style={{
                  padding: "10px 0",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  background: time === t ? B : BG,
                  color: time === t ? "#fff" : T1,
                  transition: "all 0.2s"
                }}>
                {t}
              </button>
            ))}
          </div>
          <input
            type="time"
            value={time === "Close" ? "21:00" : time}
            onChange={e => setTime(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 17,
              color: T1,
              background: BG,
              border: "none",
              borderRadius: 12
            }}
          />
        </Card>
        
        <Spacer height={16} />
        <Button onClick={() => go("qc-group")}>Continue</Button>
      </Scroll>
    </div>
  );
}

export default QCDetails;
