'use client';
import React, { useState, useRef } from 'react';
import { apiService, AnalysisResponse } from '@/lib/api';
import { LiveHeatmap } from '@/components/LiveHeatmap';
import { AINewsAnchor } from '@/components/AINewsAnchor';
import { ViralDangerMeter } from '@/components/ViralDangerMeter';
import * as htmlToImage from 'html-to-image';

type InputMode = 'text' | 'url' | 'pdf' | 'image';

export default function AnalyzePage() {
  const [mode, setMode] = useState<InputMode>('text');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (textInput?: string) => {
    // Determine the text to use if mode is 'text'
    const finalTextInput = textInput || '';
    
    if (mode === 'text' && !finalTextInput.trim()) return;
    if (mode === 'url' && !url.trim()) return;
    if ((mode === 'pdf' || mode === 'image') && !file) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let res: AnalysisResponse;
      if (mode === 'text') res = await apiService.analyzeText(finalTextInput);
      else if (mode === 'url') res = await apiService.analyzeUrl(url);
      else if (mode === 'pdf') res = await apiService.analyzePdf(file!);
      else res = await apiService.analyzeImage(file!);

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(reportRef.current, { backgroundColor: '#09090F' });
      const link = document.createElement('a');
      link.download = `fake-news-report-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate report', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#EAEAFC' }}>
            Multi-Modal <span style={{ color: '#3B82F6' }} className="italic">Analyzer</span>
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: '#9090B8' }}>
            Process text, articles, URLs, documents, and images through our ensemble ML validation engine.
          </p>
        </div>
      </header>

      {/* Input Section */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(30,30,46,0.5)', border: '1px solid rgba(59,130,246,0.1)' }}>
        <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-max" style={{ background: 'rgba(9,9,15,0.8)' }}>
          {[
            { id: 'text', label: 'Plain Text', icon: '📝' },
            { id: 'url', label: 'Article URL', icon: '🔗' },
            { id: 'pdf', label: 'PDF Document', icon: '📄' },
            { id: 'image', label: 'Screenshot', icon: '🖼️' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id as InputMode); setFile(null); setUrl(''); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest transition-all ${
                mode === m.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        {mode === 'text' ? (
           <LiveHeatmap onAnalyze={(text) => handleAnalyze(text)} />
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {mode === 'url' ? (
               <input
                 type="url"
                 value={url}
                 onChange={(e) => setUrl(e.target.value)}
                 placeholder="https://example.com/news-article"
                 className="w-full rounded-xl px-4 py-3 font-mono text-sm focus:outline-none transition-all resize-none"
                 style={{ background: 'rgba(9,9,15,0.7)', border: '1px solid rgba(59,130,246,0.2)', color: '#EAEAFC' }}
                 onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)')}
                 onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)')}
                 required
               />
            ) : (
              <div className="w-full relative rounded-xl border border-dashed border-blue-500/30 p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-500/5 transition-colors"
                   style={{ background: 'rgba(9,9,15,0.7)' }}>
                  <input 
                    type="file" 
                    accept={mode === 'pdf' ? '.pdf' : 'image/*'} 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-4xl mb-3">{mode === 'pdf' ? '📄' : '🖼️'}</span>
                  <p className="font-mono text-sm text-blue-400 mb-1">Click or drag a {mode.toUpperCase()} file to upload</p>
                  {file && <p className="font-mono text-xs text-green-400 mt-2 truncate max-w-sm">Selected: {file.name}</p>}
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-red-400">{error}</span>
              <button
                 type="submit"
                 disabled={loading || (mode === 'url' && !url.trim()) || ((mode === 'pdf' || mode === 'image') && !file)}
                 className="px-8 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 style={{ background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)', color: '#FFF' }}
               >
                 {loading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                 {loading ? 'Analyzing Pipeline...' : 'Run Analysis'}
               </button>
            </div>
          </form>
        )}
      </div>

      {/* Loading State for Text Mode (LiveHeatmap triggers it differently) */}
      {mode === 'text' && loading && (
         <div className="flex justify-center p-8">
           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
         </div>
      )}

      {/* Results Section */}
      {result && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12">
           <div className="flex justify-end">
             <button 
               onClick={downloadReport}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
               Share Report Card
             </button>
           </div>
           
           {/* Report Card wrapper for html-to-image */}
           <div ref={reportRef} className="space-y-8 p-6 rounded-3xl" style={{ backgroundColor: '#09090F', border: '1px solid rgba(59,130,246,0.2)' }}>
             
             {/* AI News Anchor Component */}
             <AINewsAnchor 
               verdict={result.verdict} 
               textToRead={`This article has been classified as ${result.verdict}. Confidence is ${(result.confidence * 100).toFixed(1)} percent.`} 
             />

             {/* Viral Danger Meter */}
             {result.verdict === 'FAKE' && (
               <ViralDangerMeter confidence={result.confidence} verdict={result.verdict} />
             )}

             {/* Disagreement / Verdict Header */}
             <div className={`p-6 rounded-2xl border ${result.verdict === 'FAKE' ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'} flex flex-col md:flex-row items-center justify-between gap-4`}>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: result.verdict === 'FAKE' ? '#FCA5A5' : '#86EFAC' }}>Final AI Consensus</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-black tracking-tighter" style={{ color: result.verdict === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                      {result.verdict}
                    </h2>
                    <div className="px-3 py-1 rounded bg-black/40 font-mono text-sm border" style={{ borderColor: result.verdict === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                       {(result.confidence * 100).toFixed(1)}% Confidence
                    </div>
                  </div>
                </div>
                
                {result.disagreement && result.disagreement.level !== 'UNANIMOUS' && (
                  <div className="bg-amber-500/20 border border-amber-500/40 p-4 rounded-xl max-w-sm">
                    <p className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">⚠ Disagreement Detected</p>
                    <p className="font-mono text-xs text-amber-200">{result.disagreement.explanation}</p>
                  </div>
                )}
             </div>

             {/* Individual Model Results */}
             <div>
               <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4">Pipeline Model Breakdown</h3>
               <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                 {result.model_results.map((m, idx) => (
                   <div key={idx} className="p-5 rounded-xl border border-gray-800 bg-[#13131D] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: m.label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
                      
                      <p className="font-mono text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-3">{m.model_name}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-black text-xl" style={{ color: m.label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>{m.label}</span>
                        <span className="font-mono text-sm text-white">{(m.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black rounded-full overflow-hidden mb-3">
                         <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(m.confidence * 100)}%`, background: m.label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
                      </div>
                      <p className="font-mono text-[9px] text-gray-600">Latency: {m.latency_ms.toFixed(2)}ms</p>
                   </div>
                 ))}
               </div>
             </div>
             
           </div>
        </div>
      )}
    </div>
  );
}
