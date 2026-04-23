"use client";

import React, { useEffect, useState, useRef } from "react";

interface AINewsAnchorProps {
  verdict: 'REAL' | 'FAKE' | null;
  textToRead: string;
}

export function AINewsAnchor({ verdict, textToRead }: AINewsAnchorProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!verdict || !textToRead || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Choose voice: Try to find a good authoritative voice
    const voices = synthRef.current.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    if (verdict === 'FAKE') {
      // Pick a more expressive/intense voice if possible, or just speak slightly faster/louder
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
      utterance.volume = 1;
    } else {
      // Calm, neutral
      utterance.pitch = 1.0;
      utterance.rate = 0.95;
      utterance.volume = 0.9;
    }

    if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0]; // Just picking the first english one
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Short delay to let animations start before speaking
    setTimeout(() => {
      synthRef.current?.speak(utterance);
    }, 500);

  }, [verdict, textToRead]);

  if (!verdict) return null;

  const isFake = verdict === 'FAKE';
  
  return (
    <div className={`relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-4 ${isFake ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'} transition-all duration-500`}>
      {/* Background with flashing effect for FAKE */}
      <div className={`absolute inset-0 ${isFake && isSpeaking ? 'bg-red-900 animate-pulse' : 'bg-gray-800'}`} />
      
      <div className={`relative z-10 flex flex-col items-center justify-center p-6 ${isFake && isSpeaking ? 'animate-[shake_0.5s_infinite]' : ''}`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-32 h-32 mb-4 drop-shadow-xl"
        >
          {/* Head */}
          <circle cx="50" cy="40" r="25" fill="#facc15" />
          
          {/* Eyes */}
          <circle cx="40" cy="35" r="4" fill="#1f2937" className={isFake ? "transform translate-y-1" : ""} />
          <circle cx="60" cy="35" r="4" fill="#1f2937" className={isFake ? "transform translate-y-1" : ""} />
          
          {/* Eyebrows */}
          {isFake ? (
            <>
              <line x1="32" y1="25" x2="45" y2="30" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
              <line x1="68" y1="25" x2="55" y2="30" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="35" y1="28" x2="45" y2="28" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
              <line x1="55" y1="28" x2="65" y2="28" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* Mouth */}
          {isSpeaking ? (
             <ellipse cx="50" cy="50" rx="8" ry="6" fill="#1f2937" className="animate-[ping_0.5s_infinite]" />
          ) : (
             <path d={isFake ? "M 40 55 Q 50 45 60 55" : "M 40 50 Q 50 55 60 50"} fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Body/Suit */}
          <path d="M 20 100 Q 50 60 80 100" fill="#3b82f6" />
          <path d="M 40 100 L 50 75 L 60 100 Z" fill="#ffffff" />
          <path d="M 50 75 L 45 100 L 55 100 Z" fill="#dc2626" />
        </svg>

        <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center">
          <p className="font-bold text-sm tracking-wider uppercase text-gray-300 mb-1">AI News Anchor</p>
          <p className={`font-black text-xl ${isFake ? 'text-red-400' : 'text-green-400'}`}>
            {isFake ? 'DANGER: FAKE NEWS' : 'VERIFIED REAL'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
