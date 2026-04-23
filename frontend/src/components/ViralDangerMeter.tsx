"use client";

import React, { useEffect, useState } from "react";

interface ViralDangerMeterProps {
  confidence: number; // 0 to 1
  verdict: 'REAL' | 'FAKE' | null;
}

export function ViralDangerMeter({ confidence, verdict }: ViralDangerMeterProps) {
  const [misledCount, setMisledCount] = useState(0);

  useEffect(() => {
    if (verdict === 'FAKE') {
      // Animate up to the final number
      const target = Math.floor((confidence * 100000) * (Math.random() * 0.4 + 0.8));
      let current = 0;
      const step = Math.ceil(target / 60); // Animate over ~1s (60 frames)
      
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setMisledCount(target);
          clearInterval(interval);
        } else {
          setMisledCount(current);
        }
      }, 16);
      
      return () => clearInterval(interval);
    } else {
      setMisledCount(0);
    }
  }, [confidence, verdict]);

  if (verdict !== 'FAKE') return null;

  // Calculate rotation for gauge: -90deg to 90deg based on confidence
  const rotation = -90 + (confidence * 180);

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden">
      {/* Warning tape background effect */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px', backgroundColor: '#ef4444' }}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-red-500 font-black tracking-widest uppercase mb-4 text-center animate-pulse">
          ⚠️ Viral Danger Meter ⚠️
        </h3>

        {/* Gauge SVG */}
        <div className="relative w-48 h-24 mb-6">
          {/* Track */}
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Value Arc (approximated visually with SVG gradients/paths) */}
            <defs>
              <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#dangerGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6" /* Roughly Pi * R */
              strokeDashoffset={125.6 - (125.6 * confidence)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Needle */}
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom transform -translate-x-1/2 transition-transform duration-1000 ease-out z-20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          >
            {/* Center dot */}
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border-2 border-white"></div>
          </div>
        </div>

        <div className="text-center bg-black/50 p-4 rounded-xl border border-red-900/50 backdrop-blur-sm w-full">
          <p className="text-gray-400 text-sm font-medium mb-1">If shared 1,000 times...</p>
          <p className="text-3xl font-black text-white tabular-nums">
            {misledCount.toLocaleString()}
          </p>
          <p className="text-red-400 text-sm font-bold uppercase tracking-wider mt-1">Estimated People Misled</p>
        </div>
      </div>
    </div>
  );
}
