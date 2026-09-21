import { useSpeech } from "../../hooks/useSpeech.js";

export default function VoiceInput({ onResult }) {
  const { isListening, supported, start, stop } = useSpeech({ onResult });

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? stop : start}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Listening... click to stop" : "Voice input"}
      className={`relative p-2.5 rounded-xl transition-all focus:outline-none ${
        isListening
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30 ring-4 ring-red-500/20"
          : "text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"
        />
      </svg>
    </button>
  );
}
