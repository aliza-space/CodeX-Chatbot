import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLandmarkGuide } from "../../data/campusRoutes.js";

export default function TurnByTurnPanel({
  destId,
  destName,
  onSpeakInstruction,
  onClose,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const guide = getLandmarkGuide(destId, destName);
  const steps = guide.walkingSteps || [];
  const currentStep = steps[currentStepIndex] || steps[0];

  // Reset step when destination changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [destId]);

  if (!steps.length) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (onSpeakInstruction && steps[nextIdx]) {
        onSpeakInstruction(steps[nextIdx].instruction);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (onSpeakInstruction && steps[prevIdx]) {
        onSpeakInstruction(steps[prevIdx].instruction);
      }
    }
  };

  return (
    <div className="absolute bottom-20 sm:bottom-24 left-3 right-3 sm:left-6 sm:right-auto sm:w-96 z-[450] pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        {/* Step Header */}
        <div className="bg-primary-600 px-3.5 py-2 text-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span>🚶</span>
            <span>
              Campus Landmark Cue • Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xs px-1 rounded transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="p-3.5">
          <div className="flex items-start gap-3">
            <span className="text-2xl p-2 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 shrink-0">
              {currentStep.icon}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">
                {currentStep.title}
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 mt-0.5 leading-snug">
                {currentStep.instruction}
              </p>
              {currentStep.landmark && (
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>🏛️ Landmark:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {currentStep.landmark}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? "w-5 bg-primary-600"
                      : "w-1.5 bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                ◀ Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === steps.length - 1}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-600 text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-primary-700 active:scale-95 transition"
              >
                Next Step ▶
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
