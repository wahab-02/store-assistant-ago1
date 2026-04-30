const Globals = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; -webkit-font-smoothing: antialiased; }
    button { font-family: inherit; }
    input, textarea { font-family: inherit; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes scanAnim { 0%{top:15%} 50%{top:72%} 100%{top:15%} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
    .anim  { animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both; }
    .d1 { animation-delay:0.05s } .d2 { animation-delay:0.1s }
    .d3 { animation-delay:0.15s } .d4 { animation-delay:0.2s }
    .press { transition: transform 0.25s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.2s; cursor:pointer; }
    .press:active { transform:scale(0.95); opacity:0.8; transition: transform 0.1s, opacity 0.1s; }
    @keyframes drawCheck { 0% { stroke-dashoffset: 100; opacity: 0; } 100% { stroke-dashoffset: 0; opacity: 1; } }
    @keyframes shimmerglow { 0% { transform: translateX(-150%) skewX(-15deg); } 40%, 100% { transform: translateX(200%) skewX(-15deg); } }
    ::-webkit-scrollbar { width:0; }
    input:focus, textarea:focus { outline:none; }
  `}</style>
);

export default Globals;
