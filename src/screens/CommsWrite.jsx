import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Scroll from "../components/layout/Scroll";
import Card from "../components/shared/Card";
import Divider from "../components/shared/Divider";
import Label from "../components/shared/Label";
import Button from "../components/shared/Button";
import Spacer from "../components/shared/Spacer";
import { BG, T1, T2, T3, B, R } from "../constants/colors";

function CommsWrite({ go, back }) {
  const [msg, setMsg] = useState("");
  const [group, setGroup] = useState(null);
  const [sent, setSent] = useState(false);
  const MAX = 280;

  const examples = [
    "It's going to be a warm one this weekend — ice creams on the front counter, grab one on the way out!",
    "The Riverside Mermaids made it to the finals — we're all cheering for you. Go Mermaids!",
    "We're donating £1 to the Riverside food bank for every £30 spent today. Thanks for helping out.",
  ];

  if (sent) {
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
          background: B + "15",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          animation: "fadeIn 0.4s"
        }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M2 13L10 21L24 3"
              stroke={B}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
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
          Message sent
        </div>
        <div style={{
          fontSize: 16,
          color: T2,
          lineHeight: 1.6,
          marginBottom: 40
        }}>
          Shoppers in Riverside Store will see this on their tablets.
        </div>
        <Button onClick={() => go("comms-active")}>View active message</Button>
        <Spacer />
        <Button v="secondary" onClick={() => go("home")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: BG }}>
      <StatusBar />
      <NavBar title="Store Comms" onBack={back} />
      
      <Scroll>
        <Card style={{ marginBottom: 16 }} className="anim">
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value.slice(0, MAX))}
            placeholder="Write something for your shoppers…"
            rows={4}
            style={{
              width: "100%",
              padding: "20px 20px 10px",
              fontSize: 17,
              color: T1,
              lineHeight: 1.7,
              background: "transparent",
              border: "none",
              resize: "none"
            }}
          />
          <Divider />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 20px"
          }}>
            <span style={{ fontSize: 13, color: T3 }}>Plain text only</span>
            <span style={{ fontSize: 13, color: msg.length > 240 ? R : T3 }}>
              {msg.length}/{MAX}
            </span>
          </div>
        </Card>

        {msg.trim() && (
          <div style={{
            background: "#1D1D1F",
            borderRadius: 18,
            padding: 20,
            marginBottom: 16
          }} className="anim">
            <div style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              marginBottom: 10
            }}>
              Your store says
            </div>
            <div style={{ fontSize: 15, color: "#fff", lineHeight: 1.7 }}>
              "{msg}"
            </div>
          </div>
        )}

        {!msg.trim() && (
          <div className="anim d1">
            <Label>Inspiration</Label>
            <Card>
              {examples.map((e, i) => (
                <div key={i}>
                  <button className="press" onClick={() => setMsg(e)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "16px 20px",
                      background: "none",
                      border: "none",
                      textAlign: "left"
                    }}>
                    <div style={{ fontSize: 14, color: T1, lineHeight: 1.6 }}>{e}</div>
                  </button>
                  {i < examples.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          </div>
        )}

        <Spacer height={16} />
        <Label>Audience</Label>
        <Card className="anim d2" style={{ marginBottom: 20 }}>
          {[null, "Parents", "Loyalty members", "Health-conscious"].map((g, i, arr) => (
            <div key={i}>
              <button className="press" onClick={() => setGroup(g)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  gap: 14
                }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  border: `2px solid ${group === g ? B : T3}`,
                  background: group === g ? B : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s"
                }}>
                  {group === g && (
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
                <span style={{ fontSize: 15, color: T1, fontWeight: 500 }}>
                  {g ?? "All shoppers"}
                </span>
              </button>
              {i < arr.length - 1 && <Divider />}
            </div>
          ))}
        </Card>
        
        <Button onClick={() => msg.trim() && setSent(true)} disabled={!msg.trim()}>
          Send to shoppers
        </Button>
      </Scroll>
    </div>
  );
}

export default CommsWrite;
