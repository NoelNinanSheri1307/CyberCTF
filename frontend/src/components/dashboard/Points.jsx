export default function PointsTab({ teamScore, username, tabFade }) {
  return (
    <div
      className={`relative z-10 px-6 transition-opacity duration-500 ${
        tabFade ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Your Score</h2>
      {teamScore ? (
        <table className="w-full border border-white text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border border-white">Operative</th>
              <th className="p-2 border border-white">Points</th>
              <th className="p-2 border border-white">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-white">{username}</td>
              <td className="p-2 border border-white font-mono text-green-400 font-bold">
                {teamScore.points}
              </td>
              <td className="p-2 border border-white">
                {new Date(teamScore.updatedAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading score...</p>
      )}
    </div>
  );
}
