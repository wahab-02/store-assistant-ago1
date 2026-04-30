import { B, T1, R, BDK } from "../../constants/colors";

function Button({ children, onClick, v = "primary", disabled, style = {} }) {
  const vs = {
    primary: { background: B, color: "#fff", border: "none" },
    secondary: { background: "rgba(0,0,0,0.06)", color: T1, border: "none" },
    ghost: { background: "transparent", color: B, border: `1.5px solid ${B}` },
    danger: { background: "rgba(255,59,48,0.1)", color: R, border: "none" },
    dark: { background: BDK, color: "#fff", border: "none" },
  };
  
  return (
    <button
      className="press"
      onClick={disabled ? null : onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "16px 20px",
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: "-0.3px",
        borderRadius: 980,
        opacity: disabled ? 0.3 : 1,
        ...vs[v],
        ...style
      }}
    >
      {children}
    </button>
  );
}

export default Button;
