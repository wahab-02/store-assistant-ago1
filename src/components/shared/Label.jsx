import { T2 } from "../../constants/colors";

function Label({ children }) {
  return (
    <div style={{
      fontSize: 13,
      fontWeight: 600,
      color: T2,
      letterSpacing: "0.1px",
      marginBottom: 8
    }}>
      {children}
    </div>
  );
}

export default Label;
