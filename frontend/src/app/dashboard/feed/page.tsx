'use client';
import React, { useState, useEffect } from 'react';
import { apiService, FeedResponse } from '@/lib/api';

export default function FeedPage() {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.getFeed();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#EAEAFC' }}>
             Global <span style={{ color: '#F6A623' }} className="italic">News Feed</span>
           </h1>
           <p className="font-mono text-xs mt-2" style={{ color: '#9090B8' }}>
             Real-time articles aggregated and analyzed automatically by FakeGuard AI.
           </p>
        </div>
        <button
           onClick={loadFeed}
           disabled={loading}
           className="px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center gap-2"
        >
          {loading ? 'Syncing...' : 'Refresh Feed'}
        </button>
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
