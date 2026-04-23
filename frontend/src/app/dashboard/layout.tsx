'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Analyzer', path: '/dashboard/analyze', icon: '🔍' },
    { label: 'Deep Scanner', path: '/dashboard/paragraphs', icon: '📄' },
    { label: 'Live Feed', path: '/dashboard/feed', icon: '📡' },
    { label: 'Quiz Mode', path: '/dashboard/quiz', icon: '🎮' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#09090F' }}>
      {/* Sidebar */}
      <aside 
        className="w-64 flex flex-col border-r relative z-10"
        style={{ 
          borderColor: 'rgba(59,130,246,0.1)', 
          background: 'linear-gradient(180deg, #09090F 0%, #0C0C18 100%)' 
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <Link href="/portal" className="flex items-center gap-3">
             <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L4 6.5V13.5C4 19.2 8.4 24.5 14 26C19.6 24.5 24 19.2 24 13.5V6.5L14 2Z" fill="url(#shield-gradient)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
              <path d="M10 14L12.5 16.5L18 11" stroke="#EAEAFC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="shield-gradient" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-black text-lg tracking-tight" style={{ color: '#EAEAFC' }}>
              FakeGuard <span style={{ color: '#EF4444' }}>AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4 px-2" style={{ color: 'rgba(144,144,184,0.4)' }}>Command Center</p>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path === '/dashboard/analyze' && pathname === '/dashboard');
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: isActive ? '#3B82F6' : '#9090B8',
                  border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent'
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-mono text-[11px] uppercase tracking-wide font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
           <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: 'rgba(30,30,46,0.5)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ADE80' }} />
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-green-400">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
        {/* Background ambient glow */}
         <div className="fixed top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
             <div className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 60%)', filter: 'blur(80px)' }} />
         </div>
        
        <div className="relative z-10 w-full p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
