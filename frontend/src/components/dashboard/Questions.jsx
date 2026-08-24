export default function QuestionsTab({
  displayedQuestions,
  searchText,
  setSearchText,
  filterDifficulty,
  setFilterDifficulty,
  setQuestionPopup,
  difficultyColor,
  tabFade
}) {
  return (
    <div className={`relative z-10 px-6 transition-opacity duration-500 ${tabFade ? "opacity-100" : "opacity-0"}`}>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="p-2 bg-black border border-gray-500 rounded w-1/2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className="p-2 bg-black border border-gray-500 rounded"
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedQuestions.map((q, index) => (
          <div
  key={q.id}
  className={`border ${difficultyColor(q.difficulty)} p-4 rounded cursor-pointer transition-transform duration-200 hover:scale-105 opacity-0 animate-slideFadeIn ${q.solved ? "opacity-50 pointer-events-none" : ""}`}
  style={{ animationDelay: `${index * 100}ms` }}
  onClick={() => !q.solved && setQuestionPopup(q)}
>
  <h2 className="font-bold">{q.title}</h2>
  <p className="text-sm">{q.type}</p>
  <p className="text-xs text-gray-400">{q.difficulty}</p>
  <p className="mt-2 text-green-400">{q.solved ? "Solved" : "Unsolved"}</p>
</div>

        ))}
      </div>
    </div>
  );
}
