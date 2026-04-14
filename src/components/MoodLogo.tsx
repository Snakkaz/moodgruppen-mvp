export default function MoodLogo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const textClass = size === "lg" ? "text-[22px]" : "text-[18px]";
  const dotSize = size === "lg" ? "w-[6px] h-[6px]" : "w-[5px] h-[5px]";

  return (
    <span className={`inline-flex items-baseline ${textClass} font-bold tracking-tight`}>
      <span className="text-gray-800 dark:text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        Mood
      </span>
      <span className="relative text-gray-800 dark:text-white ml-[2px]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        Ai
        <span className={`absolute -top-[2px] -right-[6px] ${dotSize} rounded-full bg-cyan-400`} />
      </span>
    </span>
  );
}
