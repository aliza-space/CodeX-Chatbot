import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateBearing,
  getRelativeAngle,
  getWalkingCue,
} from "../../hooks/useCompass.js";

export default function CompassHUD({
  userLat,
  userLng,
  destLat,
  destLng,
  destName,
  destIcon = "📍",
  distanceMeters,
  heading,
  isSupported,
  permissionState,
  onRequestPermission,
}) {
  const [minimized, setMinimized] = useState(false);

  // Target bearing relative to true North (0° = North, 90° = East)
  const targetBearing = calculateBearing(userLat, userLng, destLat, destLng);

  // Relative angle: how much user needs to turn relative to where they are facing
  const relativeAngle =
    heading !== null && heading !== undefined
      ? getRelativeAngle(targetBearing, heading)
      : targetBearing;

  const walkingCue = getWalkingCue(heading !== null ? relativeAngle : null);

  const formattedDist =
    distanceMeters >= 1000
      ? `${(distanceMeters / 1000).toFixed(1)} km`
      : `${distanceMeters} m`;

  return (
    <div className="absolute top-16 right-3 sm:right-5 z-[500] pointer-events-auto select-none">
      <AnimatePresence>
        {!minimized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-3 sm:p-3.5 shadow-2xl w-60 sm:w-64"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg animate-pulse">🧭</span>
                <div>
                  <h4 className="text-[12px] font-bold text-white tracking-wide uppercase">
                    Campus Compass
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    To {destName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs transition"
                title="Minimize compass"
              >
                ✕
              </button>
            </div>

            {/* Compass Dial & Direction Arrow */}
            <div className="flex items-center justify-between gap-3">
              {/* Dial with rotating pointer */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-primary-500/40 shadow-inner flex items-center justify-center shrink-0">
                {/* Cardinal markers */}
                <span className="absolute top-1 text-[8px] font-mono font-bold text-red-400">N</span>
                <span className="absolute right-1 text-[8px] font-mono font-bold text-slate-400">E</span>
                <span className="absolute bottom-1 text-[8px] font-mono font-bold text-slate-400">S</span>
                <span className="absolute left-1 text-[8px] font-mono font-bold text-slate-400">W</span>

                {/* Rotating Direction Arrow pointing at destination */}
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
                  style={{ transform: `rotate(${relativeAngle}deg)` }}
                >
                  <div className="flex flex-col items-center">
                    {/* Arrow head */}
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] sm:border-b-[24px] border-b-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    {/* Arrow tail */}
                    <div className="w-1.5 h-6 sm:h-7 bg-emerald-500/70 rounded-b-full" />
                  </div>
                </div>

                {/* Center pivot */}
                <div className="absolute w-3.5 h-3.5 rounded-full bg-white ring-2 ring-emerald-400 shadow-md flex items-center justify-center text-[8px]">
                  <span className="text-[7px]">{destIcon}</span>
                </div>
              </div>

              {/* Stats & Walking Cue */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Distance
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight leading-none mb-1">
                  {formattedDist}
                </div>

                <div className="text-[11px] sm:text-xs font-semibold text-white bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60 truncate">
                  {walkingCue}
                </div>

                <div className="mt-1.5 text-[9px] text-slate-400 flex items-center gap-1">
                  <span>Target:</span>
                  <span className="font-mono text-emerald-300 font-bold">{Math.round(targetBearing)}°</span>
                  {heading !== null && (
                    <>
                      <span className="text-slate-600">|</span>
                      <span>Face:</span>
                      <span className="font-mono text-cyan-300">{heading}°</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* iOS / Mobile Calibration or Permission button */}
            {permissionState === "prompt" && (
              <div className="mt-2.5 pt-2 border-t border-slate-800">
                <button
                  onClick={onRequestPermission}
                  className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow transition"
                >
                  <span>📡</span>
                  <span>Enable Live Compass Sensor</span>
                </button>
              </div>
            )}

            {/* Hint message for desktop users */}
            {heading === null && permissionState !== "prompt" && (
              <p className="mt-2 text-[9px] text-slate-400 text-center leading-tight">
                💡 Open on your mobile phone for real-time gyroscope & compass tracking.
              </p>
            )}
          </motion.div>
        ) : (
          /* Minimized pill button */
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setMinimized(false)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 text-white border border-slate-700/80 rounded-full shadow-xl hover:bg-slate-800 transition active:scale-95"
            title="Open Compass"
          >
            <span className="text-base animate-spin" style={{ animationDuration: "12s" }}>
              🧭
            </span>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-none text-emerald-400">
                {formattedDist}
              </span>
              <span className="text-[9px] text-slate-400 truncate max-w-[80px] block">
                {destName}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
