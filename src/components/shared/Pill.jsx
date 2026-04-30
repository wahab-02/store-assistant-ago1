import { B } from "../../constants/colors";

function Pill({ children, color = B, style = {} }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: 980,
      fontSize: 12,
      fontWeight: 600,
      background: color + "18",
      color,
      ...style
    }}>
      {children}
    </span>
  );
}

export default Pill;
