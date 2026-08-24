import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal } from "lucide-react";
import DashSphere from "../components/DashSphere";
import DashHoloStreams from "../components/DashHoloStreams";
import DashboardNavbar from "../components/dashboard/Navbar";
import CyberCursor from "../components/dashboard/CyberCursor";
import Snackbar, { showSnackbar } from "./Snackbar";
import API from "../api/axios";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
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

  const fetchScoreboard = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/scoreboard");
      setLeaderboard(data || []);
    } catch (err) {
      console.error("Failed to load scoreboard:", err);
      showSnackbar("Failed to fetch live leaderboard.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreboard();
    const interval = setInterval(fetchScoreboard, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("teamName");
    navigate("/");
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center text-yellow-400 font-bold">
          <Trophy className="w-4 h-4 mr-1 text-yellow-400" /> 1ST
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center text-gray-300 font-bold">
          <Medal className="w-4 h-4 mr-1 text-gray-300" /> 2ND
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center text-amber-600 font-bold">
          <Medal className="w-4 h-4 mr-1 text-amber-600" /> 3RD
        </span>
      );
    }
    return <span className="font-mono text-red-400">#{rank}</span>;
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-red-400 glitch-cycle">
              Global Leaderboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Live standings with solve timestamp tie-breaking
            </p>
          </div>
          <button
            onClick={fetchScoreboard}
            className="px-4 py-2 bg-red-950/60 border border-red-500/50 hover:bg-red-900/50 rounded text-sm text-red-300 transition"
          >
            Refresh Scores
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-red-400">
            Decrypting rankings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-gray-800 rounded bg-black/60">
            No solves recorded yet. Be the first operative to strike!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-red-500/30 bg-black/70 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-red-500/40 bg-red-950/30 text-red-300 text-xs uppercase">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Operative</th>
                  <th className="p-4 text-right">Points</th>
                  <th className="p-4 text-center">Solves</th>
                  <th className="p-4 text-right">Last Solve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-950/40 text-sm">
                {leaderboard.map((user, idx) => {
                  const isCurrentUser = user.name === username;
                  const rankNum = user.rank || idx + 1;
                  return (
                    <tr
                      key={user.id || idx}
                      className={`transition ${
                        isCurrentUser
                          ? "bg-red-500/20 font-bold border-l-4 border-red-500"
                          : "hover:bg-gray-900/40"
                      }`}
                    >
                      <td className="p-4 font-mono">
                        {renderRankBadge(rankNum)}
                      </td>
                      <td className="p-4">
                        <span className={isCurrentUser ? "text-red-300" : "text-white"}>
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-red-900/60 text-red-200">
                            You
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-green-400 font-bold">
                        {user.points}
                      </td>
                      <td className="p-4 text-center font-mono text-gray-300">
                        {user.solveCount || 0}
                      </td>
                      <td className="p-4 text-right text-xs text-gray-400 font-mono">
                        {user.lastSolve
                          ? new Date(user.lastSolve).toLocaleTimeString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Snackbar />
      <CyberCursor mousePos={mousePos} />
    </div>
  );
}
