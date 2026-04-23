"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiService, WordHeatmapResponse, WordScore } from "@/lib/api";

interface LiveHeatmapProps {
  onAnalyze?: (text: string) => void;
}

export function LiveHeatmap({ onAnalyze }: LiveHeatmapProps) {
  const [text, setText] = useState("");
  const [heatmap, setHeatmap] = useState<WordScore[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (text.trim().length > 5) {
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await apiService.getWordHeatmap(text);
          setHeatmap(res.words);
        } catch (error) {
          console.error("Heatmap error:", error);
        } finally {
          setIsTyping(false);
        }
      }, 800); // 800ms debounce
    } else {
      setHeatmap([]);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text]);

  const getColor = (score: number) => {
    if (score > 0) {
      // Fake-leaning (Red)
      const intensity = Math.min(score * 20, 1); // Normalize a bit
      return `rgba(239, 68, 68, ${intensity})`;
    } else if (score < 0) {
      // Real-leaning (Green)
      const intensity = Math.min(Math.abs(score) * 20, 1);
      return `rgba(34, 197, 94, ${intensity})`;
    }
    return "transparent";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">Live Suspicion Heatmap</h3>
        <span className="text-sm text-gray-500">
          {isTyping ? "Analyzing model coefficients..." : "Ready"}
        </span>
      </div>
      
      <div className="relative w-full h-64 border rounded-xl overflow-hidden bg-white shadow-sm font-sans">
        {/* Underlay for highlights */}
        <div 
          className="absolute inset-0 p-4 whitespace-pre-wrap break-words pointer-events-none text-transparent z-0 overflow-y-auto"
          aria-hidden="true"
        >
          {heatmap.length > 0 ? (
            heatmap.map((wordObj, i) => (
              <span 
                key={i} 
                style={{ backgroundColor: getColor(wordObj.score) }}
                className="rounded px-[1px] transition-colors duration-300"
              >
                {wordObj.word}{" "}
              </span>
            ))
          ) : (
            <span>{text}</span>
          )}
        </div>
        
        {/* Actual Textarea */}
        <textarea
          className="absolute inset-0 w-full h-full p-4 bg-transparent resize-none outline-none text-gray-800 z-10 font-sans"
          placeholder="Start typing a news headline or article... Words flagged by the Logistic Regression model will highlight in red."
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onAnalyze?.(text)}
          disabled={text.trim().length < 10}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Run Full Analysis
        </button>
      </div>
    </div>
  );
}
