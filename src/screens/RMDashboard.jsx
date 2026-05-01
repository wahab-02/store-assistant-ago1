import { useState } from "react";
import Pill from "../components/shared/Pill";
import { CARD, SEP, T1, T2, T3, B, G, AM, R } from "../constants/colors";

function RMDashboard() {
  const [tab, setTab] = useState("promos");
  const [paused, setPaused] = useState({});
  const [removed, setRemoved] = useState({});

  const promos = [
    { store: "Riverside", product: "Yeo Valley Yoghurt 500g", mech: "20% off", bb: "14 May", cap: 200, end: "6pm", reached: 127, claims: 42, rate: "33%", status: "Live" },
    { store: "Riverside", product: "Warburtons White 800g", mech: "£0.80 off", bb: "—", cap: 100, end: "5pm", reached: 89, claims: 31, rate: "35%", status: "Live" },
    { store: "Oakfield", product: "Innocent Smoothie 750ml", mech: "25% off", bb: "12 May", cap: 50, end: "4pm", reached: 45, claims: 18, rate: "40%", status: "Ended" },
    { store: "Highgate", product: "Cathedral City 350g", mech: "£2.00 off", bb: "—", cap: 150, end: "7pm", reached: 63, claims: 22, rate: "35%", status: "Live" },
    { store: "Northfield", product: "Muller Yoghurt 6pk", mech: "15% off", bb: "11 May", cap: 80, end: "6pm", reached: 0, claims: 0, rate: "—", status: "Live" },
  ];

  const comms = [
    { store: "Riverside", msg: "The Riverside Mermaids made it to the finals next week...", sent: "10:15 AM", aud: "All shoppers" },
    { store: "Oakfield", msg: "Kids' activity kits now available at customer service.", sent: "9:40 AM", aud: "Parents" },
    { store: "Highgate", msg: "We're donating £1 to the food bank for every £30 spent.", sent: "8:55 AM", aud: "All shoppers" },
  ];

  const kpis = [
    { l: "Active promotions", v: "4", s: "+2 since 9am", c: B },
    { l: "Total reached", v: "324", s: "Across 4 stores", c: T1 },
    { l: "Total conversions", v: "113", s: "35% avg rate", c: G },
    { l: "Budget used", v: "68%", s: "£340 of £500", c: AM },
  ];

  const TH = ({ children }) => (
    <th style={{
      padding: "12px 16px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: T2,
      letterSpacing: "0.2px",
      whiteSpace: "nowrap"
    }}>
      {children}
    </th>
  );

  const TD = ({ children, style = {} }) => (
    <td style={{
      padding: "15px 16px",
      fontSize: 14,
      color: T1,
      ...style
    }}>
      {children}
    </td>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F2F2F7",
      fontFamily: "'Inter',-apple-system,sans-serif"
    }}>
      {/* Nav */}
      <div style={{
        background: CARD,
        borderBottom: `1px solid ${SEP}`,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            color: T1,
            letterSpacing: "-0.6px"
          }}>
            algo1
          </div>
          <div style={{ width: 1, height: 20, background: SEP }} />
          <div style={{ fontSize: 14, color: T2, fontWeight: 500 }}>
            Regional Manager
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Pill color={G}>● North Region · 5 stores</Pill>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: T1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff"
          }}>
            RM
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 32px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 30,
            fontWeight: 800,
            color: T1,
            letterSpacing: "-0.8px",
            marginBottom: 6
          }}>
            Store Activity
          </div>
          <div style={{ fontSize: 15, color: T2 }}>
            Monday 12 May · North Region
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 32
        }}>
          {kpis.map(k => (
            <div key={k.l} style={{
              background: CARD,
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
            }}>
              <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: k.c,
                letterSpacing: "-1.5px",
                marginBottom: 4
              }}>
                {k.v}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: T1,
                marginBottom: 3
              }}>
                {k.l}
              </div>
              <div style={{ fontSize: 13, color: T2 }}>{k.s}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex",
          borderBottom: `1px solid ${SEP}`,
          marginBottom: 20
        }}>
          {[
            { key: "promos", l: "Quick Create" },
            { key: "comms", l: "Store Comms" }
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: "12px 24px 14px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? T1 : T2,
                marginBottom: -1,
                borderBottom: tab === t.key ? `2px solid ${T1}` : "2px solid transparent",
                letterSpacing: "-0.2px"
              }}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{
          background: CARD,
          borderRadius: 18,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          overflow: "hidden"
        }}>
          {tab === "promos" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${SEP}` }}>
                  {["Store", "Product", "Discount", "Best Before", "Cap", "Ends", "Reached", "Conversions", "Rate", "Status", ""].map(h => (
                    <TH key={h}>{h}</TH>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((p, i) => {
                  const isPaused = paused[i];
                  const s = isPaused ? "Paused" : p.status;
                  return (
                    <tr key={i} style={{
                      borderBottom: `1px solid ${SEP}`,
                      opacity: s === "Ended" ? .5 : 1
                    }}>
                      <TD style={{ fontWeight: 700 }}>{p.store}</TD>
                      <TD style={{ maxWidth: 160 }}>{p.product}</TD>
                      <TD>{p.mech}</TD>
                      <TD style={{ color: p.bb !== "—" ? AM : T3 }}>{p.bb}</TD>
                      <TD style={{ color: T2 }}>{p.cap}</TD>
                      <TD style={{ color: T2 }}>{p.end}</TD>
                      <TD style={{ fontWeight: 700 }}>{p.reached}</TD>
                      <TD style={{ fontWeight: 700, color: G }}>{p.claims}</TD>
                      <TD style={{ fontWeight: 700 }}>{p.rate}</TD>
                      <td style={{ padding: "15px 16px" }}>
                        <Pill color={s === "Live" ? G : s === "Paused" ? AM : T3}>
                          {s === "Live" ? "● " : ""}{s}
                        </Pill>
                      </td>
                      <td style={{ padding: "15px 16px" }}>
                        {s === "Live" && (
                          <button className="press" onClick={() => setPaused({ ...paused, [i]: true })}
                            style={{
                              padding: "7px 16px",
                              background: "none",
                              border: `1px solid ${SEP}`,
                              borderRadius: 980,
                              fontSize: 13,
                              fontWeight: 600,
                              color: T1
                            }}>
                            Pause
                          </button>
                        )}
                        {s === "Paused" && (
                          <span style={{ fontSize: 13, color: T3 }}>Store notified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${SEP}` }}>
                  {["Store", "Message", "Sent", "Audience", ""].map(h => (
                    <TH key={h}>{h}</TH>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comms.map((c, i) => (
                  <tr key={i} style={{
                    borderBottom: `1px solid ${SEP}`,
                    opacity: removed[i] ? .4 : 1
                  }}>
                    <TD style={{ fontWeight: 700 }}>{c.store}</TD>
                    <TD style={{ maxWidth: 320 }}>
                      <div style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        "{c.msg}"
                      </div>
                    </TD>
                    <TD style={{ color: T2 }}>{c.sent}</TD>
                    <td style={{ padding: "15px 16px" }}>
                      <Pill color={B}>{c.aud}</Pill>
                    </td>
                    <td style={{ padding: "15px 16px" }}>
                      {!removed[i] ? (
                        <button className="press" onClick={() => setRemoved({ ...removed, [i]: true })}
                          style={{
                            padding: "7px 16px",
                            background: "none",
                            border: `1px solid ${SEP}`,
                            borderRadius: 980,
                            fontSize: 13,
                            fontWeight: 600,
                            color: R
                          }}>
                          Remove
                        </button>
                      ) : (
                        <span style={{ fontSize: 13, color: T3 }}>Removed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default RMDashboard;
