function Scroll({ children, style = {} }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
      <div style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "0 20px 40px",
        ...style
      }}>
        {children}
      </div>
    </div>
  );
}

export default Scroll;
