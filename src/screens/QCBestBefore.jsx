import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Steps from "../components/layout/Steps";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Label from "../components/shared/Label";
import Button from "../components/shared/Button";
import DateOCRScanner from "../components/DateOCRScanner";
import { BG, T1, T2, B, G, CARD, SEP } from "../constants/colors";
import { useProduct } from "../context/ProductContext";

function QCBestBefore({ go, back }) {
  const { setBestBeforeDate } = useProduct();
  const [mode, setMode] = useState(null);
  const [scannedDate, setScannedDate] = useState(null);
  const [date, setDate] = useState("");

  const handleContinue = () => {
    if (scannedDate) {
      setBestBeforeDate(scannedDate);
    } else if (date) {
      // Convert manual date input to same format as scanned date
      const d = new Date(date);
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const dateObj = {
        formatted: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        iso: date,
        display: `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        raw: date
      };
      setBestBeforeDate(dateObj);
    }
    go("qc-details");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG }}>
      <StatusBar />
      <NavBar title="Best-Before Date" onBack={back} />
      <Steps total={6} current={2} />
      
      <Scroll>
        <div style={{
          background: B + "0d",
          borderRadius: 18,
          padding: 18,
          marginBottom: 20,
          borderLeft: `3px solid ${B}`
        }} className="anim">
          <div style={{ fontSize: 14, fontWeight: 700, color: B, marginBottom: 4 }}>
            Replaces the yellow sticker
          </div>
          <div style={{ fontSize: 14, color: T2, lineHeight: 1.6 }}>
            Shoppers see this date on their tablet and know exactly which pack to pick from the shelf.
          </div>
        </div>

        {!mode && (
          <>
            <Label>How would you like to capture the date?</Label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 20
            }} className="anim d1">
              {[
                { key: "scan", g: "⌕", l: "Scan the pack", s: "Point at the date" },
                { key: "manual", g: "✎", l: "Type it in", s: "Enter manually" }
              ].map(m => (
                <button key={m.key} className="press" onClick={() => setMode(m.key)}
                  style={{
                    background: CARD,
                    border: `1.5px solid ${SEP}`,
                    borderRadius: 18,
                    padding: "20px 16px",
                    textAlign: "left",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
                  }}>
                  <div style={{ fontSize: 26, color: B, marginBottom: 10, fontWeight: 300 }}>
                    {m.g}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{m.l}</div>
                  <div style={{ fontSize: 12, color: T2, marginTop: 3 }}>{m.s}</div>
                </button>
              ))}
            </div>
            <Button v="secondary" onClick={() => go("qc-details")}>
              Skip — not a near-expiry promotion
            </Button>
          </>
        )}

        {mode === "scan" && !scannedDate && (
          <div className="anim">
            <DateOCRScanner 
              onDateScanned={(dateObj) => setScannedDate(dateObj)}
              onClose={() => setMode("manual")}
            />
          </div>
        )}

        {mode === "scan" && scannedDate && (
          <div className="anim">
            <Card style={{
              padding: 24,
              marginBottom: 16,
              border: `1.5px solid ${G}`
            }}>
              <div style={{
                fontSize: 11,
                color: G,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 12
              }}>
                {scannedDate.corrected ? "Date read & corrected" : "Date read from pack"}
              </div>
              <div style={{
                fontSize: 36,
                fontWeight: 800,
                color: T1,
                letterSpacing: "-1.5px",
                marginBottom: scannedDate.corrected ? 8 : 16
              }}>
                {scannedDate.formatted}
              </div>
              {scannedDate.corrected && (
                <div style={{
                  fontSize: 12,
                  color: "#FF9500",
                  background: "#FF95000d",
                  padding: "8px 12px",
                  borderRadius: 8,
                  marginBottom: 12,
                  lineHeight: 1.5
                }}>
                  ⚠ Year auto-corrected (OCR read {scannedDate.raw}). Verify it's correct.
                </div>
              )}
              <div style={{
                background: BG,
                borderRadius: 10,
                padding: "12px 16px"
              }}>
                <div style={{ fontSize: 12, color: T2, marginBottom: 4 }}>
                  Shopper will see
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T1 }}>
                  "…pick the pack with best before <span style={{ color: B }}>{scannedDate.display.split(' ').slice(0, 2).join(' ')}</span>"
                </div>
              </div>
            </Card>
            <Button onClick={handleContinue}>Continue</Button>
            <div style={{ height: 10 }} />
            <Button v="secondary" onClick={() => setScannedDate(null)}>Scan again</Button>
          </div>
        )}

        {mode === "manual" && (
          <div className="anim">
            <Card style={{ padding: 20, marginBottom: 16 }}>
              <Label>Best-before date</Label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
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
            <Button onClick={handleContinue} disabled={!date}>
              Continue
            </Button>
          </div>
        )}
      </Scroll>
    </div>
  );
}

export default QCBestBefore;
