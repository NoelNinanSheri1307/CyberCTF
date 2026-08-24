import { useEffect, useState } from "react";

const glyphs = [
  "Ξ SYSTEM BREACH",
  "Ψ ENTER THE CUBE",
  "Ж NODE INFILTRATED",
  "Λ ACCESS OVERRIDE",
  "Ω DATA SPIKE READY",
  "⌬ EXECUTE PAYLOAD",
  "⎊ GATEWAY UNLOCKED",
];

export default function CyberGlyphs({ color = "#39ff14" }) {
  const [activeGlyphs, setActiveGlyphs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newGlyph = {
        id: Date.now(),
        text: glyphs[Math.floor(Math.random() * glyphs.length)],
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.8,
      };
      setActiveGlyphs((prev) => [...prev.slice(-5), newGlyph]); // show max 5 at once
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activeGlyphs.map((glyph) => (
        <p
          key={glyph.id}
          style={{
            left: glyph.x,
            top: glyph.y,
            color,
          }}
          className="absolute font-mono text-sm md:text-lg opacity-60 glitch-text animate-glyphFade pointer-events-none"
        >
          {glyph.text}
        </p>
      ))}
    </>
  );
}
