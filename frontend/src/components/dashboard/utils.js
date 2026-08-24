// components/dashboard/utils.js
export function difficultyColor(difficulty) {
  if (!difficulty) return "border-gray-500";

  const diff = difficulty.toString().toLowerCase();

  switch (diff) {
    case "easy":
      return "border-blue-500";
    case "medium":
      return "border-yellow-400";
    case "hard":
      return "border-red-500";
    default:
      return "border-gray-500";
  }
}
