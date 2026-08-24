import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import CyberCube from "../components/CyberCube";
import CyberLogs from "../components/CyberLogs";
import { loginUser } from "../api/auth";
import CyberGlyphs from "../components/CyberGlyphs";
import { Eye, EyeOff } from "lucide-react";
import Snackbar, { showSnackbar } from "./Snackbar";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, go straight to dashboard
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showSnackbar("Please enter both username and password.", "error");
      return;
    }

    setLoading(true);
    try {
      await loginUser({ name: username, password });
      showSnackbar("Access granted. Initializing terminal...", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Authentication failed. Check credentials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(200px at ${mousePos.x}px ${mousePos.y}px, rgba(0,255,115,0.08), black 40%)`,
        }}
      />

      {/* Cube background */}
      <CyberCube color="#39ff14" />

      {/* Hacker overlays */}
      <CyberLogs color="#39ff14" />
      <CyberGlyphs color="#39ff14" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6">
        {/* Left side: Title + Cube space */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
          <h1 className="glitch-cycle text-5xl md:text-6xl mb-6 cyber-font">
            Capture the <span className="text-neonGreen">Flag</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-md">
            Ready hacker? Login and capture the Flag.
          </p>
        </div>

        {/* Right side: Auth Card */}
        <div className="flex-1 flex justify-center md:justify-end md:pl-20">
          <AuthCard title="Login" glow="glow-green">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                required
                disabled={loading}
                className="input-cyber w-full px-4 py-2 rounded bg-gray-900 text-white border-2 focus:cyber-green"
              />

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="input-cyber w-full px-4 py-2 rounded bg-gray-900 text-white border-2 pr-10 focus:cyber-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-bold text-black bg-white hover:bg-green-400 hover:scale-105 transition duration-200"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>

              <div className="pt-2 text-center text-sm text-gray-400">
                <span>Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-neonGreen hover:underline font-semibold"
                >
                  Register Now
                </Link>
              </div>
            </form>
          </AuthCard>
        </div>
      </div>

      <Snackbar />
    </div>
  );
}
