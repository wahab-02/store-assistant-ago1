import { SEP, DK_SEP } from "../../constants/colors";

function Divider({ dark }) {
  return (
    <div style={{
      height: 1,
      background: dark ? DK_SEP : SEP,
      margin: "0 20px"
    }} />
  );
}

export default Divider;
