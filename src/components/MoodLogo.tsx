export default function MoodLogo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const textClass = size === "lg" ? "text-[22px]" : "text-[18px]";
  const dotSize = size === "lg" ? "w-1.5 h-1.5" : "w-[5px] h-[5px]";

  return (
    <span className={`inline-flex items-baseline ${textClass} font-bold tracking-tight`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <span className="text-gray-800 dark:text-white">Mood</span>
      <span className="text-gray-800 dark:text-white ml-[1px]">A</span>
      <span className="relative text-gray-800 dark:text-white">
        ı
        <span className={`absolute -top-[1px] left-[1px] ${dotSize} rounded-full bg-cyan-400`} />
      </span>
    </span>
  );
}
