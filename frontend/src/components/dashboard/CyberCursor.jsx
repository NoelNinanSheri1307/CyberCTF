export default function CyberCursor({ mousePos }) {
  return (
    <>
      <div className="fixed top-0 left-0 pointer-events-none z-50" style={{ transform: `translate(${mousePos.x - 8}px, ${mousePos.y - 8}px)` }}>
        <div className="w-4 h-4 rounded-full bg-red-500 shadow-red-500/70 shadow-lg animate-pulse" />
      </div>
      <div className="fixed top-0 left-0 pointer-events-none z-40" style={{ transform: `translate(${mousePos.x - 20}px, ${mousePos.y - 20}px)` }}>
        <div className="w-10 h-10 rounded-full border-2 border-red-400 animate-ping opacity-70" />
      </div>
    </>
  );
}
