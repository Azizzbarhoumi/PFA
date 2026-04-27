'use client';
import React, { useState, useEffect } from 'react';
import { apiService, FeedResponse } from '@/lib/api';

export default function FeedPage() {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'All News', icon: '🌍' },
    { id: 'politics', label: 'Politics', icon: '🏛️' }, // NewsAPI doesn't have politics, but 'general' covers it, or we can use keyword search later. For now, let's stick to NewsAPI official categories.
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'technology', label: 'Tech', icon: '🚀' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'entertainment', label: 'Showbiz', icon: '🎭' },
    { id: 'science', label: 'Science', icon: '🧪' },
    { id: 'health', label: 'Health', icon: '🏥' },
  ];

  const loadFeed = async (cat: string = selectedCategory) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.getFeed(cat);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    loadFeed(catId);
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
        <div>
           <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter" style={{ color: '#EAEAFC' }}>
             Global <span style={{ color: '#F6A623' }} className="italic">News Feed</span>
           </h1>
           <p className="font-mono text-[10px] mt-2 uppercase tracking-widest" style={{ color: '#9090B8' }}>
             Real-time AI analysis of the world's top headlines
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 border ${
                selectedCategory === cat.id 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10 hover:text-gray-300'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
          <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
          <button
             onClick={() => loadFeed()}
             disabled={loading}
             className="p-2 rounded-lg bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all"
             title="Refresh Feed"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="font-mono text-xs text-red-400">{error}</p>
        </div>
      ) : loading && !data ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-64 rounded-xl bg-gray-800/50 animate-pulse border border-gray-700/50" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.articles.map((article, idx) => (
             <a 
               href={article.url} 
               target="_blank" 
               rel="noopener noreferrer" 
               key={idx}
               className="group flex flex-col rounded-2xl border p-5 transition-all overflow-hidden relative cursor-pointer"
               style={{ 
                 background: '#13131D', 
                 borderColor: article.prediction.status === 'analyzed' 
                   ? (article.prediction.verdict === 'FAKE' ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.2)') 
                   : 'rgba(255,255,255,0.05)'
               }}
             >
               {/* Verdict Badge */}
               <div className="absolute top-4 right-4 z-10">
                 {article.prediction.status === 'analyzed' ? (
                   <span className="font-mono text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest backdrop-blur-md"
                         style={{ 
                           background: article.prediction.verdict === 'FAKE' ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
                           color: article.prediction.verdict === 'FAKE' ? '#EF4444' : '#4ADE80',
                           border: article.prediction.verdict === 'FAKE' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(74,222,128,0.4)'
                         }}>
                     {article.prediction.verdict} // {(article.prediction.confidence * 100).toFixed(0)}%
                   </span>
                 ) : (
                    <span className="font-mono text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest bg-gray-800 text-gray-400 border border-gray-700 backdrop-blur-md animate-pulse">
                      Analyzing...
                    </span>
                 )}
               </div>

               <div className="flex-1 mt-6">
                 <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-2">{article.source}</p>
                 <h3 className="font-bold text-lg leading-tight mb-3 text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-3">
                   {article.title}
                 </h3>
                 <p className="font-mono text-xs text-gray-500 line-clamp-2">{article.preview}</p>
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                 <span className="font-mono text-[9px] text-gray-600 uppercase">By {article.author || 'Unknown'}</span>
                 <span className="font-mono text-[9px] text-gray-600 truncate">{new Date(article.published_date).toLocaleDateString()}</span>
               </div>
             </a>
          ))}
        </div>
      )}
    </div>
  );
}
