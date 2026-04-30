import { T1 } from "../../constants/colors";

function StatusBar({ light }) {
  const c = light ? "rgba(255,255,255,0.85)" : T1;
  
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 26px 0",
      height: 50,
      flexShrink: 0
    }}>
      <span style={{
        fontSize: 15,
        fontWeight: 700,
        color: c,
        letterSpacing: "-0.3px"
      }}>
        9:41
      </span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="16" height="11" viewBox="0 0 16 11">
          {[0, 3.5, 7, 10.5].map((x, i) => (
            <rect
              key={i}
              x={x}
              y={11 - (i + 1) * 2.6}
              width="2.5"
              height={(i + 1) * 2.6}
              rx="1"
              fill={c}
              opacity={i < 2 ? 0.4 : 1}
            />
          ))}
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12">
          <rect
            x=".5"
            y="1"
            width="20"
            height="10"
            rx="3"
            fill="none"
            stroke={c}
            strokeWidth="1.2"
            opacity=".5"
          />
          <rect x="21" y="4" width="2.5" height="4" rx="1" fill={c} opacity=".5" />
          <rect x="2" y="2.5" width="13" height="7" rx="2" fill={c} opacity=".85" />
        </svg>
      </div>
    </div>
  );
}

export default StatusBar;
