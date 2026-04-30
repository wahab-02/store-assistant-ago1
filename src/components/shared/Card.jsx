import { CARD, DK_C } from "../../constants/colors";

function Card({ children, style = {}, onClick, dark }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: dark ? DK_C : CARD,
        borderRadius: 18,
        boxShadow: dark ? "none" : "0 1px 6px rgba(0,0,0,0.06)",
        overflow: "hidden",
        ...style
      }}
    >
      {children}
    </div>
  );
}

export default Card;
