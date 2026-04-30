import { G, B, SEP } from "../../constants/colors";

function Steps({ total, current }) {
  return (
    <div style={{
      display: "flex",
      gap: 4,
      justifyContent: "center",
      padding: "4px 0 14px"
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            width: i === current ? 24 : 8,
            borderRadius: 2,
            background: i < current ? G : i === current ? B : SEP,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)"
          }}
        />
      ))}
    </div>
  );
}

export default Steps;
