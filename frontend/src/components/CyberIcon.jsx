import { Shield, Lock, Key } from "lucide-react";

export default function CyberIcon({ type, className }) {
  const icons = {
    shield: <Shield size={40} className="text-neonGreen opacity-40 animate-pulse" />,
    lock: <Lock size={40} className="text-neonYellow opacity-40 animate-pulse" />,
    key: <Key size={40} className="text-white opacity-40 animate-pulse" />,
  };

  return <div className={`absolute ${className} z-0`}>{icons[type]}</div>;
}
