import { useSpeech } from "../../hooks/useSpeech.js";
import { IconMic } from "../common/Icons.jsx";

export default function VoiceInput({ onResult }) {
  const { isListening, supported, start, stop } = useSpeech({ onResult });

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? stop : start}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Listening... click to stop" : "Voice input"}
      className={`relative p-2 sm:p-2.5 rounded-xl transition-all focus:outline-none ${
        isListening
          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-4 ring-rose-500/20 animate-pulse"
          : "text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-cyan-950/40"
      }`}
    >
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>
      )}
      <IconMic className="w-4 h-4" />
    </button>
  );
}
