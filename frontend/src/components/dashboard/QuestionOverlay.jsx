// src/components/dashboard/QuestionOverlay.jsx
import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import API from "../../api/axios";
import Snackbar, { showSnackbar } from "../../pages/Snackbar";
export default function QuestionOverlay({
  questionPopup,
  setQuestionPopup,
  answers,
  setAnswers,
  submitAnswer,
}) {
  const [hints, setHints] = useState({}); // store unlocked hint text
  const [loadingHints, setLoadingHints] = useState({}); // per-hint loading

  // Reset hints when different question opened
  useEffect(() => {
    setHints({});
    setLoadingHints({});
  }, [questionPopup?.id]);

  if (!questionPopup) return null;

  // NOTE: endpoint per your final API list is POST /api/challenges/hints/{hintId}/unlock
  const unlockHint = async (hintId, index) => {
    if (!hintId) return;
    if (hints[index]) return; // already unlocked
    try {
      setLoadingHints((s) => ({ ...s, [index]: true }));
      const { data } = await API.post(`/challenges/hints/${hintId}/unlock`);
      // API returns { text: 'hint text', ... } (per your controller earlier)
      setHints((prev) => ({ ...prev, [index]: data.text || data }));
    } catch (err) {
      alert(err.response?.data?.message || "Error unlocking hint.");
    } finally {
      setLoadingHints((s) => ({ ...s, [index]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-30 flex justify-center items-center">
      <div className="bg-black p-6 rounded w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto relative border border-white">
        <button
          className="absolute top-2 right-2 text-red-400 font-bold"
          onClick={() => setQuestionPopup(null)}
        >
          X
        </button>

        <h2 className="text-xl font-bold">{questionPopup.title}</h2>
        <p className="text-sm text-gray-300">
          {questionPopup.type} | Difficulty: {questionPopup.difficulty}
        </p>
        <p className="mt-2">{questionPopup.description}</p>

        {questionPopup.resourceUrl && (
          <a
            href={questionPopup.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-blue-400 underline hover:text-blue-300"
          >
            Open Challenge Resource
          </a>
        )}

        <div className="mt-4 flex gap-2 flex-wrap">
          {(questionPopup.hints || []).slice(0, 3).map((hintId, i) => (
            <div key={i} className="flex flex-col">
              <button
                onClick={() => unlockHint(hintId, i)}
                className="flex items-center gap-1 px-2 py-1 border border-gray-400 rounded hover:bg-gray-800 text-sm"
                title={hints[i] || "Click to unlock"}
                disabled={!!hints[i] || !!loadingHints[i]}
              >
                <HelpCircle className="w-4 h-4" /> Hint {i + 1}
              </button>

              {/* show unlocked hint text */}
              {loadingHints[i] ? (
                <div className="text-xs text-gray-400 mt-1">Unlocking...</div>
              ) : hints[i] ? (
                <div className="text-xs text-gray-200 mt-1 max-w-xs">
                  {hints[i]}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <textarea
          className="w-full mt-4 p-2 bg-black border border-gray-500 rounded text-white"
          placeholder="Type your answer here..."
          rows={3}
          value={answers[questionPopup.id] || ""}
          onChange={(e) =>
            setAnswers({ ...answers, [questionPopup.id]: e.target.value })
          }
        />

        <button
          className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
          onClick={() => submitAnswer(questionPopup.id)}
        >
          Submit Flag
        </button>
      </div>
    </div>
  );
}
