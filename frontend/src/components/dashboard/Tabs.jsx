export default function DashboardTabs({ activeTab, switchTab }) {
  return (
    <div className="relative z-10 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-4">
      <button
        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border ${
          activeTab === "questions"
            ? "border-white bg-white/10 text-white font-semibold shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            : "border-gray-500 text-gray-300 hover:border-gray-300"
        } rounded transition`}
        onClick={() => switchTab("questions")}
      >
        Questions
      </button>
      <button
        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border ${
          activeTab === "points"
            ? "border-white bg-white/10 text-white font-semibold shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            : "border-gray-500 text-gray-300 hover:border-gray-300"
        } rounded transition`}
        onClick={() => switchTab("points")}
      >
        Points
      </button>
    </div>
  );
}
