import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashSphere from "../components/DashSphere";
import DashHoloStreams from "../components/DashHoloStreams";
import DashboardNavbar from "../components/dashboard/Navbar";
import CyberCursor from "../components/dashboard/CyberCursor";
import Snackbar, { showSnackbar } from "./Snackbar";
import API from "../api/axios";

export default function Profile() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({ solves: [], hints: [] });
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || localStorage.getItem("teamName") || "Operative"
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [profileRes, progressRes] = await Promise.all([
          API.get("/team/me"),
          API.get("/team/progress"),
        ]);
        setProfile(profileRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Failed to load profile data:", err);
        showSnackbar("Failed to load profile data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("teamName");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white cyber-font bg-black">
      <style>{`body { cursor: none !important; }`}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(0px at ${mousePos.x}px ${mousePos.y}px, rgba(244,66,39,0.01), black 80%)`,
        }}
      />
      <DashSphere color="#f44227" />
      <DashHoloStreams />

      <DashboardNavbar username={username} onLogout={handleLogout} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-red-400 glitch-cycle mb-6">
          Operative Profile
        </h2>

        {loading ? (
          <div className="text-center py-12 text-red-400">
            Accessing operative dossier...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg border border-red-500/40 bg-black/70 backdrop-blur-md">
                <p className="text-xs text-red-300 uppercase tracking-widest">
                  Username
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {profile?.name || username}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  Enlisted:{" "}
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div className="p-6 rounded-lg border border-green-500/40 bg-black/70 backdrop-blur-md">
                <p className="text-xs text-green-300 uppercase tracking-widest">
                  Total Score
                </p>
                <h3 className="text-3xl font-bold text-green-400 mt-1 font-mono">
                  {profile?.points ?? 0} PTS
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  Live competitive points
                </p>
              </div>

              <div className="p-6 rounded-lg border border-cyan-500/40 bg-black/70 backdrop-blur-md">
                <p className="text-xs text-cyan-300 uppercase tracking-widest">
                  Solved Challenges
                </p>
                <h3 className="text-3xl font-bold text-cyan-400 mt-1 font-mono">
                  {progress.solves?.length || 0}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  Hints unlocked: {progress.hints?.length || 0}
                </p>
              </div>
            </div>

            {/* Solves History */}
            <div className="p-6 rounded-lg border border-red-500/30 bg-black/70 backdrop-blur-md">
              <h4 className="text-xl font-bold text-white mb-4">
                Captured Flags ({progress.solves?.length || 0})
              </h4>
              {progress.solves && progress.solves.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {progress.solves.map((solve) => (
                    <div
                      key={solve.id}
                      className="p-3 rounded border border-green-500/30 bg-green-950/20 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-sm text-green-300">
                          {solve.challenge?.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {solve.challenge?.category} • {solve.challenge?.difficulty}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono text-green-400 font-bold">
                          +{solve.challenge?.points} pts
                        </span>
                        <p className="text-xs text-gray-500 font-mono">
                          {new Date(solve.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No flags captured yet. Select challenges on the Dashboard to start solving.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <Snackbar />
      <CyberCursor mousePos={mousePos} />
    </div>
  );
}
