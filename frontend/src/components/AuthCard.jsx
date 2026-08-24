export default function AuthCard({ title, children, glow }) {
  return (
    <div
      className={`relative z-10 w-96 p-8 rounded-2xl bg-black/70 backdrop-blur-md border-2 ${glow} cyber-border animate-borderPulse`}
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>
      {children}
    </div>
  );
}
