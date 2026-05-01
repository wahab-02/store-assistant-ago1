import StatusBar from "../components/layout/StatusBar";
import NavBar from "../components/layout/NavBar";
import Scroll from "../components/layout/Scroll";
import Pill from "../components/shared/Pill";
import { BG, T1, T2, T3, SEP, CARD } from "../constants/colors";

const ended = [
  {
    n: "Innocent Smoothie 750ml",
    d: "25% off",
    conversions: 61,
    rate: 40,
    date: "Mon 28 Apr"
  },
  {
    n: "Warburtons White 800g",
    d: "£0.80 off",
    conversions: 44,
    rate: 35,
    date: "Sun 27 Apr"
  },
  {
    n: "Cathedral City 350g",
    d: "£2.00 off",
    conversions: 39,
    rate: 28,
    date: "Sat 26 Apr"
  },
  {
    n: "Yeo Valley Yoghurt 500g",
    d: "20% off",
    conversions: 52,
    rate: 33,
    date: "Fri 25 Apr"
  },
  {
    n: "Lurpak Butter 250g",
    d: "£1.00 off",
    conversions: 29,
    rate: 22,
    date: "Thu 24 Apr"
  }
];

function EndedPromotions({ back }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      background: BG,
      overflow: "hidden"
    }}>
      <StatusBar />
      <NavBar title="Ended Promotions" onBack={back} />

      <Scroll>
        <div style={{
          fontSize: 14,
          color: T2,
          marginBottom: 20,
          lineHeight: 1.6
        }} className="anim">
          A record of your 5 most recently ended promotions.
        </div>

        {ended.map((p, i) => (
          <div key={i} className={`anim d${Math.min(i + 1, 4)}`} style={{ marginBottom: 10 }}>
            <div style={{
              background: CARD,
              borderRadius: 20,
              padding: "18px 20px",
              border: `1px solid ${SEP}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 14
              }}>
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: T1,
                    letterSpacing: "-0.2px",
                    marginBottom: 3
                  }}>
                    {p.n}
                  </div>
                  <div style={{ fontSize: 13, color: T2 }}>
                    {p.d} · {p.date}
                  </div>
                </div>
                <Pill color={T3} style={{ background: "rgba(0,0,0,0.05)", marginTop: 2 }}>
                  Ended
                </Pill>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: BG,
                borderRadius: 12,
                overflow: "hidden"
              }}>
                <div style={{
                  padding: "12px 16px",
                  borderRight: `1px solid ${SEP}`
                }}>
                  <div style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: T1,
                    letterSpacing: "-0.6px"
                  }}>
                    {p.conversions}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: T3,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginTop: 2
                  }}>
                    Conversions
                  </div>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <div style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: T1,
                    letterSpacing: "-0.6px"
                  }}>
                    {p.rate}%
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: T3,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginTop: 2
                  }}>
                    Conv. Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Scroll>
    </div>
  );
}

export default EndedPromotions;
