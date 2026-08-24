// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DashSphere from "../components/DashSphere";
import DashHoloStreams from "../components/DashHoloStreams";
import DashHoloTerminals from "../components/DashTerminal";
import Snackbar, { showSnackbar } from "./Snackbar";

import DashboardNavbar from "../components/dashboard/Navbar";
import DashboardTabs from "../components/dashboard/Tabs";
import QuestionsTab from "../components/dashboard/Questions";
import PointsTab from "../components/dashboard/Points";
import QuestionOverlay from "../components/dashboard/QuestionOverlay";
import CyberCursor from "../components/dashboard/CyberCursor";
import { difficultyColor } from "../components/dashboard/utils";
import API from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("questions");
  const [tabFade, setTabFade] = useState(true);
  const [questionPopup, setQuestionPopup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || localStorage.getItem("teamName") || "Operative"
  );

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [teamScore, setTeamScore] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch User Score
  const fetchUserScore = useCallback(async () => {
    try {
      const { data } = await API.get("/score/my");
      setTeamScore(data);
    } catch (err) {
      console.error("Failed to fetch score:", err);
    }
  }, []);

  // Fetch ALL challenges directly
  const fetchAllChallenges = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const { data } = await API.get("/challenges");

      const normalized = (data || []).map((ch) => ({
        id: ch.id,
        title: ch.title,
        type: ch.category || "Misc",
        difficulty: ch.difficulty,
        description: ch.description,
        hints: (ch.hints || []).map((h) => h.id),
        solved: !!ch.solved,
        points: ch.points ?? 0,
        resourceUrl: ch.resourceUrl || null,
      }));

      setQuestions(normalized);
    } catch (err) {
      console.error("Failed to load challenges:", err);
      showSnackbar("Could not load challenges.", "error");
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    fetchAllChallenges();
    fetchUserScore();
  }, [fetchAllChallenges, fetchUserScore]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("teamName");
    navigate("/");
  };

  // Submit flag
  const submitAnswer = async (challengeId) => {
    const flag = answers[challengeId];
    if (!flag || !flag.trim()) {
      return showSnackbar("Please enter a flag.", "error");
    }

    try {
      const { data } = await API.post(`/challenges/${challengeId}/submit`, {
        flag: flag.trim(),
      });

      if (data?.correct) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === challengeId ? { ...q, solved: true } : q))
        );

        setQuestionPopup(null);
        showSnackbar(
          data.message || "Correct flag! Points awarded.",
          "success"
        );
        fetchUserScore();
      } else {
        showSnackbar(data.message || "Incorrect flag. Try again!", "error");
      }
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Error submitting flag.",
        "error"
      );
    }
  };

  const displayedQuestions = questions.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "all" ||
      q.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const handleOpenQuestion = (question) => {
    if (question.solved) {
      showSnackbar("This challenge is already solved!", "info");
      return;
    }
    setQuestionPopup(question);
  };

  const switchTab = (tab) => {
    setTabFade(false);
    setTimeout(() => {
      setActiveTab(tab);
      setTabFade(true);
    }, 150);
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
      <DashHoloTerminals />
      <DashHoloStreams />

      <DashboardNavbar username={username} onLogout={handleLogout} />

      <DashboardTabs activeTab={activeTab} switchTab={switchTab} />

      {activeTab === "questions" && (
        <>
          {loadingQuestions ? (
            <div className="relative z-10 px-6 py-12 text-center text-red-400">
              Loading challenges...
            </div>
          ) : (
            <QuestionsTab
              displayedQuestions={displayedQuestions}
              searchText={searchText}
              setSearchText={setSearchText}
              filterDifficulty={filterDifficulty}
              setFilterDifficulty={setFilterDifficulty}
              setQuestionPopup={handleOpenQuestion}
              difficultyColor={difficultyColor}
              tabFade={tabFade}
            />
          )}
        </>
      )}

      {activeTab === "points" && (
        <PointsTab
          teamScore={teamScore}
          username={username}
          tabFade={tabFade}
        />
      )}

      <QuestionOverlay
        questionPopup={questionPopup}
        setQuestionPopup={setQuestionPopup}
        answers={answers}
        setAnswers={setAnswers}
        submitAnswer={submitAnswer}
      />

      <Snackbar />
      <CyberCursor mousePos={mousePos} />
    </div>
  );
}
