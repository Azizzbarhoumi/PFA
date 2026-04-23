'use client';
import React, { useState } from 'react';
import { apiService, QuizResponse } from '@/lib/api';

type GameState = 'start' | 'playing' | 'revealed';

export default function QuizPage() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userGuess, setUserGuess] = useState<'REAL' | 'FAKE' | null>(null);
  
  // Scoring
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const loadNewQuiz = async () => {
    setLoading(true);
    setError('');
    setUserGuess(null);
    setGameState('start');

    try {
      const res = await apiService.getQuiz('medium'); // Default difficulty
      setQuiz(res);
      setGameState('playing');
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = async (guess: 'REAL' | 'FAKE') => {
    setUserGuess(guess);
    setGameState('revealed');
    
    const isCorrect = guess === quiz?.model_analysis.verdict;
    setStats(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));
    
    // Fire and forget feedback to backend report endpoint
    if (quiz) {
       apiService.submitQuizFeedback(quiz.session_id, guess).catch(e => console.error("Feedback failed", e));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <header className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#EAEAFC' }}>
             Turing <span style={{ color: '#8B5CF6' }} className="italic">Test</span>
           </h1>
           <p className="font-mono text-xs mt-2" style={{ color: '#9090B8' }}>
             Can you beat the AI? Spot the fake news.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Your Score</p>
             <p className="font-bold font-mono text-2xl text-blue-400">{stats.correct} / {stats.total}</p>
           </div>
        </div>
      </header>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="font-mono text-xs text-red-400">{error}</p>
        </div>
      )}

      {gameState === 'start' && !loading && (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-blue-500/20 bg-[#13131D] text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
           <span className="text-6xl mb-6">🎮</span>
           <h2 className="text-3xl font-black mb-4 text-white">Challenge the Machine</h2>
           <p className="font-mono text-sm text-gray-400 mb-8 max-w-md">
             We pulled a random article from our database. Read it carefully. Is it verified journalism or fabricated misinformation?
           </p>
           <button 
             onClick={loadNewQuiz}
             className="px-10 py-4 rounded-xl font-bold font-mono text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1"
             style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', color: '#FFF' }}
           >
             Start Challenge
           </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-24 rounded-2xl border border-gray-800 bg-[#13131D]">
           <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
           <p className="font-mono text-xs text-blue-400 animate-pulse tracking-widest uppercase">Initializing Neural Link...</p>
        </div>
      )}

      {gameState !== 'start' && quiz && !loading && (
        <div className="grid md:grid-cols-5 gap-8">
           <div className="md:col-span-3 space-y-6">
              <div className="p-8 rounded-2xl bg-[#09090F] border border-gray-800 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                 
                 <div className="flex items-center gap-2 mb-6">
                   <span className="font-mono text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-300 uppercase tracking-widest border border-gray-700">
                     Source Blocked
                   </span>
                   <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                     Category: {quiz.category}
                   </span>
                 </div>

                 <h2 className="text-2xl font-bold text-white leading-tight mb-4">{quiz.article_title}</h2>
                 <div className="prose prose-invert prose-sm max-w-none font-sans text-gray-300 leading-relaxed">
                   <p>{quiz.article_text}</p>
                 </div>
              </div>
           </div>

           <div className="md:col-span-2 space-y-6">
              {/* User Input Section */}
              <div className="p-6 rounded-2xl bg-[#13131D] border border-gray-800 flex flex-col gap-4">
                 <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest text-center">Your Verdict</h3>
                 
                 {gameState === 'playing' ? (
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                         onClick={() => handleGuess('REAL')}
                         className="py-4 rounded-xl font-bold font-mono text-sm tracking-widest uppercase border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                         REAL
                      </button>
                      <button 
                         onClick={() => handleGuess('FAKE')}
                         className="py-4 rounded-xl font-bold font-mono text-sm tracking-widest uppercase border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                         FAKE
                      </button>
                   </div>
                 ) : (
                   <div className="py-4 rounded-xl font-bold font-mono text-lg tracking-widest text-center border"
                        style={{ 
                          background: userGuess === 'FAKE' ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)',
                          color: userGuess === 'FAKE' ? '#EF4444' : '#4ADE80',
                          borderColor: userGuess === 'FAKE' ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'
                        }}>
                     YOU GUESSED: {userGuess}
                   </div>
                 )}
              </div>

              {/* Reveal Section */}
              {gameState === 'revealed' && (
                <div className="p-6 rounded-2xl bg-[#13131D] border flex flex-col gap-6 animate-in slide-in-from-top-4"
                     style={{ borderColor: quiz.model_analysis.verdict === userGuess ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)' }}>
                   
                   <div className="text-center">
                     <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">Ground Truth / AI Verdict</p>
                     <h3 className="text-4xl font-black" style={{ color: quiz.model_analysis.verdict === 'FAKE' ? '#EF4444' : '#4ADE80' }}>
                       {quiz.model_analysis.verdict}
                     </h3>
                   </div>

                   <div className="w-full h-px bg-gray-800" />

                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-gray-400 uppercase">AI Confidence</span>
                        <span className="font-mono text-sm text-white">{(quiz.model_analysis.confidence * 100).toFixed(1)}%</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-gray-400 uppercase">Actual Source</span>
                        <span className="font-mono text-xs text-blue-400 truncate max-w-[150px]">{quiz.source}</span>
                     </div>
                   </div>

                   {quiz.model_analysis.verdict === userGuess ? (
                     <div className="p-3 rounded-lg bg-green-500/10 text-green-400 font-mono text-xs font-bold text-center border border-green-500/30">
                       Success! Neural pathways aligned.
                     </div>
                   ) : (
                     <div className="p-3 rounded-lg bg-red-500/10 text-red-500 font-mono text-xs font-bold text-center border border-red-500/30">
                       Failed. The machine outsmarted you.
                     </div>
                   )}

                   <button 
                     onClick={loadNewQuiz}
                     className="w-full py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-colors"
                   >
                     Next Article →
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
