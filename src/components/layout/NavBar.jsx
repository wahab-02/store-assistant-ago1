import { T1, B } from "../../constants/colors";

function NavBar({ title, onBack, right, light }) {
  const c = light ? "#fff" : T1;
  
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "4px 20px 12px",
      position: "relative",
      flexShrink: 0
    }}>
      {onBack && (
        <button
          className="press"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: light ? "#fff" : B,
            fontSize: 17,
            fontWeight: 500,
            padding: "4px 0"
          }}
        >
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path
              d="M8 1 L1 8 L8 15"
              stroke={light ? "#fff" : B}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      )}
      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 17,
        fontWeight: 700,
        color: c,
        letterSpacing: "-0.3px"
      }}>
        {title}
      </div>
      <div style={{ marginLeft: "auto" }}>{right}</div>
    </div>
  );
}

export default NavBar;
