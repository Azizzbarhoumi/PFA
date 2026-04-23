'use client';
import React, { useState } from 'react';
import { apiService, ParagraphResponse, ParagraphAnalysis } from '@/lib/api';

export default function ParagraphHeatmapPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParagraphResponse | null>(null);
  const [error, setError] = useState('');
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await apiService.analyzeParagraphs(text);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'An error occurred during paragraph analysis');
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (tier: number) => {
    switch (tier) {
      case 3: return 'rgba(239, 68, 68, 0.4)';  // High suspicion (Red)
      case 2: return 'rgba(249, 115, 22, 0.25)'; // Medium suspicion (Orange)
      case 1: return 'rgba(234, 179, 8, 0.15)';  // Low suspicion (Yellow)
      case 0: return 'rgba(74, 222, 128, 0.05)'; // Safe (Green snippet)
      default: return 'transparent';
    }
  };

  const getHeatmapBorder = (tier: number) => {
    switch (tier) {
      case 3: return '1px solid rgba(239, 68, 68, 0.8)';
      case 2: return '1px solid rgba(249, 115, 22, 0.5)';
      case 1: return '1px solid rgba(234, 179, 8, 0.3)';
      case 0: return '1px solid rgba(74, 222, 128, 0.2)';
      default: return '1px solid transparent';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#EAEAFC' }}>
             Deep Scanner <span style={{ color: '#EF4444' }} className="italic">Heatmap</span>
           </h1>
           <p className="font-mono text-xs mt-2" style={{ color: '#9090B8' }}>
             Paste long articles below. The scanner will identify and highlight the exact fabricated paragraphs.
           </p>
        </div>
        {result && (
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-black/40 shadow-xl">
             <div className="text-right">
               <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Article Verdict</p>
               <p className="font-bold font-mono text-lg" style={{ color: result.verdict === 'FAKE' ? '#EF4444' : '#4ADE80' }}>{result.verdict}</p>
             </div>
             <div className="w-px h-8 bg-gray-800" />
             <div className="text-left">
               <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Suspicious Chunks</p>
               <p className="font-bold font-mono text-lg text-white">{result.suspicious_paragraph_count} / {result.total_paragraphs}</p>
             </div>
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Side */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Source Text Editor</span>
            {error && <span className="font-mono text-[10px] text-red-400">{error}</span>}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="Paste your long-form article here to generate a suspicion heatmap..."
            className="w-full h-[600px] rounded-2xl px-6 py-5 font-mono text-sm focus:outline-none transition-all resize-none shadow-2xl"
            style={{
              background: 'rgba(9,9,15,0.7)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#EAEAFC',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
          />
          <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="w-full py-4 rounded-xl font-bold font-mono text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)', color: '#FFF' }}
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Scanning Document...' : 'Generate Heatmap'}
            </button>
        </div>

        {/* Heatmap Side */}
        <div className="space-y-4 h-[670px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Visual Analysis Layer</span>
            <div className="flex gap-2">
               {['Safe', 'Low', 'Med', 'High'].map((lbl, i) => (
                 <div key={i} className="flex items-center gap-1">
                   <div className="w-2h-2 rounded-full border" style={{ width: '8px', height: '8px', background: getHeatmapColor(i), border: getHeatmapBorder(i) }} />
                   <span className="font-mono text-[8px] text-gray-500 uppercase">{lbl}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto rounded-2xl p-6 shadow-2xl" style={{ background: '#13131D', border: '1px solid rgba(255,255,255,0.05)' }}>
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                 <span className="text-6xl mb-4">🔬</span>
                 <p className="font-mono text-sm text-white">Heatmap View Active</p>
                 <p className="font-mono text-xs mt-2 text-gray-400">Run analysis to identify suspicious paragraphs.</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center gap-4 p-10 justify-center">
                 <div className="scanline-effect relative w-full max-w-sm h-32 border border-blue-500/30 rounded-lg overflow-hidden bg-blue-500/5">
                   <div className="w-full h-1 bg-blue-400/50 absolute top-0 shadow-[0_0_10px_#3B82F6] animate-[scanline_2s_linear_infinite]" />
                 </div>
                 <p className="font-mono text-xs text-blue-400 animate-pulse tracking-widest uppercase mt-4">Sectioning paragraphs...</p>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                {result.paragraphs.map((p, i) => (
                  <div 
                    key={i} 
                    className="relative rounded-lg p-4 transition-all duration-300 font-sans text-sm leading-relaxed text-gray-300 shadow-sm cursor-help"
                    style={{ 
                      background: getHeatmapColor(p.heatmap_tier),
                      border: hoveredParagraph === i ? getHeatmapBorder(p.heatmap_tier) : '1px solid transparent'
                    }}
                    onMouseEnter={() => setHoveredParagraph(i)}
                    onMouseLeave={() => setHoveredParagraph(null)}
                  >
                    {/* Hover Stats Tooltip/Overlay logic */}
                    {hoveredParagraph === i && p.heatmap_tier > 0 && (
                      <div className="absolute -top-3 -right-2 bg-black border border-gray-700 shadow-xl rounded px-2 py-1 flex items-center gap-2 z-10 animate-in fade-in zoom-in duration-200">
                        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: p.verdict === 'FAKE' ? '#EF4444' : '#EAB308' }}>
                          Score: {(p.suspicion_score * 100).toFixed(0)}
                        </span>
                      </div>
                    )}
                    {p.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
