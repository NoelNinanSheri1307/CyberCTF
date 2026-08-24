import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import CyberCube from "../components/CyberCube";
import CyberLogs from "../components/CyberLogs";
import CyberGlyphs from "../components/CyberGlyphs";
import { registerUser } from "../api/auth";
import { Eye, EyeOff } from "lucide-react";
import Snackbar, { showSnackbar } from "./Snackbar";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      showSnackbar("Please fill in all fields.", "error");
      return;
    }

    if (password.length < 4) {
      showSnackbar("Password must be at least 4 characters long.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name: username, password });
      showSnackbar("Account registered successfully! Entering arena...", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Registration failed. Please try a different username.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background glow in Neon Yellow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(200px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,102,0.08), black 40%)`,
        }}
      />

      {/* 3D Cyber Cube in Neon Yellow */}
      <CyberCube color="#ffff66" />

      {/* Hacker overlays in Neon Yellow */}
      <CyberLogs color="#ffff66" />
      <CyberGlyphs color="#ffff66" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6">
        {/* Left side: Title + Cube space */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
          <h1 className="glitch-cycle text-5xl md:text-6xl mb-6 cyber-font">
            Capture the <span className="text-neonYellow">Flag</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-md">
            Enlist in the cyber arena. Create your operative account.
          </p>
        </div>

        {/* Right side: Auth Card in Yellow Theme */}
        <div className="flex-1 flex justify-center md:justify-end md:pl-20">
          <AuthCard title="Register" glow="glow-yellow">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                required
                disabled={loading}
                className="input-cyber w-full px-4 py-2 rounded bg-gray-900 text-white border-2 focus:cyber-yellow"
              />

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="input-cyber w-full px-4 py-2 rounded bg-gray-900 text-white border-2 pr-10 focus:cyber-yellow"
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

              <div>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  disabled={loading}
                  className="input-cyber w-full px-4 py-2 rounded bg-gray-900 text-white border-2 focus:cyber-yellow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-bold text-black bg-white hover:bg-yellow-300 hover:scale-105 transition duration-200"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>

              <div className="pt-2 text-center text-sm text-gray-400">
                <span>Already have an account? </span>
                <Link
                  to="/"
                  className="text-neonYellow hover:underline font-semibold"
                >
                  Login Here
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
