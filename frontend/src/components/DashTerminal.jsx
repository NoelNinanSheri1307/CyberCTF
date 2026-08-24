import { useEffect, useState } from "react";

const messages = [
  "Initializing CTF interface...",
  "[OK] Firewall bypassed successfully",
  "Analyzing packet streams from loud server",
  "[INFO] Web exploit detected on captureflag.dev",
  "[WARN] Suspicious activity logged",
  "Decrypting AES-256 encryption layers...",
  "CTF algorithm in progress",
  "[OK] Node hack.sys connected",
  "Injecting payload into challenge environment",
  "Scanning for open ports...",
  "[INFO] Web exploit mitigation active",
  "Performing brute-force analysis on target hack attacks",
  "Data exfiltration in progress...",
  "[WARN] Unauthorized access attempt blocked",
  "Challenge solution verified: CTF flag captured",
];

export default function DashTerminalPopups({ color = "#f44227" }) {
  const [activeMessages, setActiveMessages] = useState([]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setActiveMessages((prev) => {
        const newMsg = {
          text: messages[index],
          top: Math.random() * 70 + 10 + "vh", // random top between 10% - 80% of viewport
          left: Math.random() * 80 + 10 + "vw", // random left between 10% - 90% of viewport
          id: Date.now() + Math.random(),
        };

        let newArr = [...prev, newMsg];

        // Keep max 3 messages
        if (newArr.length > 1) newArr.shift();

        return newArr;
      });

      index = (index + 1) % messages.length;
    }, 4000); // 4s per message

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {activeMessages.map((msg) => (
        <div
          key={msg.id}
          className="absolute p-2 bg-black/50 border border-red-500 rounded shadow-md animate-fade-in-out font-mono text-sm text-red-400"
          style={{
            top: msg.top,
            left: msg.left,
            animationDuration: "4s",
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
