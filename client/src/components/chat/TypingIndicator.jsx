export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      <span
        className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "900ms" }}
      />
      <span
        className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-bounce"
        style={{ animationDelay: "180ms", animationDuration: "900ms" }}
      />
      <span
        className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-bounce"
        style={{ animationDelay: "360ms", animationDuration: "900ms" }}
      />
    </div>
  );
}