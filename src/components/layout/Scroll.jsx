function Scroll({ children, style = {} }) {
  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "0 20px 40px",
      ...style
    }}>
      {children}
    </div>
  );
}

export default Scroll;
