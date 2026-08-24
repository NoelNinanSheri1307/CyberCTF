// Snackbar.jsx
import { useState, useEffect } from "react";

let globalShowSnackbar;
export function showSnackbar(message, type = "info") {
  if (globalShowSnackbar) globalShowSnackbar(message, type);
}

export default function Snackbar() {
  const [snack, setSnack] = useState(null);

  useEffect(() => {
    globalShowSnackbar = (message, type) => {
      setSnack({ message, type });
      setTimeout(() => setSnack(null), 3000);
    };
    return () => { globalShowSnackbar = null; };
  }, []);

  if (!snack) return null;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[9999] px-4 py-2 rounded text-white ${colors[snack.type]} shadow-lg`}>
      {snack.message}
    </div>
  );
  
}
