'use client';
import React, { useState, useEffect } from 'react';
import { apiService, AnalysisResponse, ModelResult } from '@/lib/api';

type Tab = 'bert' | 'cnn' | 'logreg' | 'svm' | 'groq';

function getModelResult(results: ModelResult[] | undefined, modelName: string): ModelResult | undefined {
  if (!results) return undefined;
  return results.find((r) => r.model_name.toLowerCase().includes(modelName.toLowerCase()));
}

/* ─── Groq Screen ─── */
function GroqScreen({ result, loading }: { result: AnalysisResponse | null; loading: boolean }) {
  const model = getModelResult(result?.model_results, 'groq');
  const confidence = model ? (model.confidence * 100).toFixed(1) : '0.0';
  const label = model?.label || 'UNKNOWN';

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#F6A623' }}>
            Groq Inference Engine
          </span>
          <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'rgba(246,166,35,0.6)' }}>
            Llama-3.3-70b-Versatile
          </span>
        </div>
        <span
          className="font-mono text-[9px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(246,166,35,0.15)', color: '#F6A623', border: '1px solid rgba(246,166,35,0.3)' }}
        >
          {model ? `AI Reasoning Active` : 'Awaiting Input'}
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse h-14 rounded-lg" style={{ background: 'rgba(9,9,15,0.7)', border: '1px solid rgba(246,166,35,0.25)' }}></div>
      ) : model ? (
        <>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: label === 'FAKE' ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)',
                border: `1px solid ${label === 'FAKE' ? 'rgba(239,68,68,0.35)' : 'rgba(74,222,128,0.35)'}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
              <span className="font-mono text-sm font-bold tracking-[0.15em]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                {label}
              </span>
              <span className="font-mono text-xs" style={{ color: label === 'FAKE' ? 'rgba(239,68,68,0.7)' : 'rgba(74,222,128,0.7)' }}>
                {confidence}% confidence
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: '#9090B8' }}>Latency: {model.latency_ms.toFixed(1)}ms</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: '#9090B8' }}>Probability Score</span>
              <span className="font-mono text-[9px]" style={{ color: '#F6A623' }}>{confidence}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${confidence}%`,
                  background: 'linear-gradient(90deg, #F6A623, #FBD38D)',
                  transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
          <p className="font-mono text-[9px] leading-relaxed" style={{ color: 'rgba(144,144,184,0.6)' }}>
            Groq provides a secondary LLM-based verification layer to catch semantic nuances and logic patterns often missed by traditional classifiers.
          </p>
        </>
      ) : (
        <div className="py-10 text-center font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(144,144,184,0.5)' }}>
          Enter text below to see Groq's reasoning
        </div>
      )}
    </div>
  );
}

/* ─── BERT Screen ─── */
function BertScreen({ result, loading }: { result: AnalysisResponse | null; loading: boolean }) {
  const model = getModelResult(result?.model_results, 'bert');
  const confidence = model ? (model.confidence * 100).toFixed(1) : '0.0';
  const label = model?.label || 'UNKNOWN';

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between items-end">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#9090B8' }}>
          BERT Deep Learning Model
        </span>
        <span
          className="font-mono text-[9px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          {model ? `${confidence}% Confidence` : 'Awaiting Input'}
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse h-14 rounded-lg" style={{ background: 'rgba(9,9,15,0.7)', border: '1px solid rgba(59,130,246,0.25)' }}></div>
      ) : model ? (
        <>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: label === 'FAKE' ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)',
                border: `1px solid ${label === 'FAKE' ? 'rgba(239,68,68,0.35)' : 'rgba(74,222,128,0.35)'}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
              <span className="font-mono text-sm font-bold tracking-[0.15em]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                {label}
              </span>
              <span className="font-mono text-xs" style={{ color: label === 'FAKE' ? 'rgba(239,68,68,0.7)' : 'rgba(74,222,128,0.7)' }}>
                {confidence}% confidence
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: '#9090B8' }}>Latency: {model.latency_ms.toFixed(1)}ms</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: '#9090B8' }}>Confidence</span>
              <span className="font-mono text-[9px]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>{confidence}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${confidence}%`,
                  background: label === 'FAKE' ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #4ADE80, #86EFAC)',
                  transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-10 text-center font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(144,144,184,0.5)' }}>
          Enter text below to see real-time analysis
        </div>
      )}
    </div>
  );
}

/* ─── CNN Screen ─── */
function CnnScreen({ result, loading }: { result: AnalysisResponse | null; loading: boolean }) {
  const model = getModelResult(result?.model_results, 'cnn+lstm') ?? getModelResult(result?.model_results, 'cnn');
  const confidence = model ? (model.confidence * 100).toFixed(1) : '0.0';
  const label = model?.label || 'UNKNOWN';

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between items-end">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#9090B8' }}>
          {model?.model_name || 'CNN+LSTM Deep Learning Model'}
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse h-14 rounded-lg" style={{ background: 'rgba(9,9,15,0.7)', border: '1px solid rgba(59,130,246,0.25)' }}></div>
      ) : model ? (
        <>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: label === 'FAKE' ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)',
                border: `1px solid ${label === 'FAKE' ? 'rgba(239,68,68,0.35)' : 'rgba(74,222,128,0.35)'}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
              <span className="font-mono text-sm font-bold tracking-[0.15em]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                {label}
              </span>
              <span className="font-mono text-xs" style={{ color: label === 'FAKE' ? 'rgba(239,68,68,0.7)' : 'rgba(74,222,128,0.7)' }}>
                {confidence}% confidence
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: '#9090B8' }}>Latency: {model.latency_ms.toFixed(1)}ms</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: '#9090B8' }}>Confidence</span>
              <span className="font-mono text-[9px]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>{confidence}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${confidence}%`,
                  background: label === 'FAKE' ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #4ADE80, #86EFAC)',
                  transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-10 text-center font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(144,144,184,0.5)' }}>
          Enter text below to see real-time analysis
        </div>
      )}
    </div>
  );
}

/* ─── Logistic Regression Screen ─── */
function LogRegScreen({ result, loading }: { result: AnalysisResponse | null; loading: boolean }) {
  const model = getModelResult(result?.model_results, 'logistic');
  const confidence = model ? (model.confidence * 100).toFixed(1) : '0.0';
  const label = model?.label || 'UNKNOWN';

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between items-end">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#9090B8' }}>
          Logistic Regression Model
        </span>
      </div>

      {loading ? (
           <div className="animate-pulse h-14 rounded-lg" style={{ background: 'rgba(9,9,15,0.7)', border: '1px solid rgba(59,130,246,0.25)' }}></div>
      ) : model ? (
        <>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: label === 'FAKE' ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)',
                border: `1px solid ${label === 'FAKE' ? 'rgba(239,68,68,0.35)' : 'rgba(74,222,128,0.35)'}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
              <span className="font-mono text-sm font-bold tracking-[0.15em]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                {label}
              </span>
              <span className="font-mono text-xs" style={{ color: label === 'FAKE' ? 'rgba(239,68,68,0.7)' : 'rgba(74,222,128,0.7)' }}>
                {confidence}% confidence
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: '#9090B8' }}>Latency: {model.latency_ms.toFixed(1)}ms</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: '#9090B8' }}>Confidence</span>
              <span className="font-mono text-[9px]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>{confidence}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${confidence}%`,
                  background: label === 'FAKE' ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #4ADE80, #86EFAC)',
                  transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-10 text-center font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(144,144,184,0.5)' }}>
          Enter text below to see real-time analysis
        </div>
      )}
    </div>
  );
}

/* ─── SVM Screen ─── */
function SvmScreen({ result, loading }: { result: AnalysisResponse | null; loading: boolean }) {
  const model = getModelResult(result?.model_results, 'svm');
  const confidence = model ? (model.confidence * 100).toFixed(1) : '0.0';
  const label = model?.label || 'UNKNOWN';

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between items-end">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#9090B8' }}>
          Support Vector Machine
        </span>
      </div>

       {loading ? (
             <div className="animate-pulse h-14 rounded-lg" style={{ background: 'rgba(9,9,15,0.7)', border: '1px solid rgba(59,130,246,0.25)' }}></div>
      ) : model ? (
        <>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: label === 'FAKE' ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)',
                border: `1px solid ${label === 'FAKE' ? 'rgba(239,68,68,0.35)' : 'rgba(74,222,128,0.35)'}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: label === 'FAKE' ? '#EF4444' : '#4ADE80' }} />
              <span className="font-mono text-sm font-bold tracking-[0.15em]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                {label}
              </span>
              <span className="font-mono text-xs" style={{ color: label === 'FAKE' ? 'rgba(239,68,68,0.7)' : 'rgba(74,222,128,0.7)' }}>
                {confidence}% confidence
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: '#9090B8' }}>Latency: {model.latency_ms.toFixed(1)}ms</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: '#9090B8' }}>Confidence</span>
              <span className="font-mono text-[9px]" style={{ color: label === 'FAKE' ? '#EF4444' : '#4ADE80' }}>{confidence}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${confidence}%`,
                  background: label === 'FAKE' ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #4ADE80, #86EFAC)',
                  transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        </>
      ) : (
         <div className="py-10 text-center font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(144,144,184,0.5)' }}>
          Enter text below to see real-time analysis
        </div>
      )}
    </div>
  );
}

/* ─── Main Tab Switcher ─── */
export default function HeroTabSwitcher() {
  const [activeTab, setActiveTab] = useState<Tab>('bert');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'bert', label: 'BERT' },
    { id: 'cnn', label: 'CNN+LSTM' },
    { id: 'groq', label: 'Groq LLM' },
    { id: 'logreg', label: 'Log.Reg' },
    { id: 'svm', label: 'SVM' },
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // It will use text or simple URL depending on prefix
      const isUrl = text.startsWith('http://') || text.startsWith('https://');
      const response = isUrl ? await apiService.analyzeUrl(text) : await apiService.analyzeText(text);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      
      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="w-full relative shadow-2xl">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a news headline, article text, or URL..."
          disabled={loading}
          className="w-full rounded-2xl px-6 py-5 pr-32 font-mono text-sm focus:outline-none transition-all duration-300"
          style={{
            background: 'rgba(19,19,29,0.9)',
            border: '1px solid rgba(59,130,246,0.3)',
            color: '#EAEAFC',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.2)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)'; }}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold font-mono text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)',
            color: '#FFF',
          }}
        >
          {loading ? 'Scanning...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="w-full text-center text-red-500 font-mono text-xs">{error}</div>
      )}

      {/* Disagreement Notice */}
      {result?.disagreement && result.disagreement.level !== 'UNANIMOUS' && (
        <div className="w-full p-4 rounded-xl mb-4 font-mono text-xs flex items-center justify-between" style={{ background: 'rgba(246,166,35,0.1)', border: '1px solid rgba(246,166,35,0.3)' }}>
          <div>
            <span style={{ color: '#F6A623', fontWeight: 'bold' }}>⚠ MODEL DISAGREEMENT: </span>
            <span style={{ color: '#9090B8' }}>{result.disagreement.explanation}</span>
          </div>
          <div className="px-3 py-1 rounded bg-black/30 text-white font-bold">
            System Verdict: {result.verdict}
          </div>
        </div>
      )}

      {/* App Window */}
      <div className="app-window w-full" style={{ minHeight: '350px' }}>
        {/* Window chrome bar */}
        <div className="app-window-bar px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#F87171' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#F6A623' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#4ADE80' }} />
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'rgba(9,9,15,0.6)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''} whitespace-nowrap`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'animate-pulse' : ''}`} style={{ background: loading ? '#F6A623' : '#4ADE80' }} />
            <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: '#9090B8' }}>{loading ? 'PROCESSING' : 'IDLE'}</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
          {activeTab === 'bert' && <BertScreen result={result} loading={loading} />}
          {activeTab === 'cnn' && <CnnScreen result={result} loading={loading} />}
          {activeTab === 'groq' && <GroqScreen result={result} loading={loading} />}
          {activeTab === 'logreg' && <LogRegScreen result={result} loading={loading} />}
          {activeTab === 'svm' && <SvmScreen result={result} loading={loading} />}
        </div>
      </div>
    </div>
  );
}