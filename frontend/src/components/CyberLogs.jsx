import { useEffect, useState } from "react";

const hackerPhrases = [
  "> INITIATING PROTOCOL...",
  "> DECRYPTING NODE...",
  "> ACCESS GRANTED",
  "> SYSTEM BREACH DETECTED",
  "> ENCODING PAYLOAD...",
  "> CUBE NETWORK ONLINE",
  "> VERIFYING IDENTITY...",
  "> WELCOME OPERATIVE",
];

export default function CyberLogs({ color = "#39ff14" }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = hackerPhrases[Math.floor(Math.random() * hackerPhrases.length)];
      setLogs((prev) => [...prev.slice(-10), newLog]); // keep last 10 logs
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-10 left-6 w-80 h-48 overflow-hidden text-xs font-mono z-10 opacity-70 pointer-events-none">
      <div className="flex flex-col gap-1 animate-scrollLogs">
        {logs.map((log, i) => (
          <p
            key={i}
            style={{ color }}
            className="glitch-text"
          >
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}
