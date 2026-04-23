'use client';
import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#09090F]/90 backdrop-blur-xl border-b border-[rgba(239,68,68,0.1)] py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Shield Icon */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 2L4 6.5V13.5C4 19.2 8.4 24.5 14 26C19.6 24.5 24 19.2 24 13.5V6.5L14 2Z"
              fill="url(#shield-gradient)"
              stroke="rgba(239,68,68,0.4)"
              strokeWidth="1"
            />
            <path
              d="M10 14L12.5 16.5L18 11"
              stroke="#EAEAFC"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="shield-gradient" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="font-black text-base tracking-tight"
            style={{ color: '#EAEAFC' }}
          >
            FakeGuard <span style={{ color: '#EF4444' }}>AI</span>
          </span>
          <span
            className="font-mono text-xs font-medium tracking-[0.2em] uppercase hidden sm:block"
            style={{ color: 'rgba(239, 68, 68, 0.5)' }}
          >
            BERT Model · 96.9%
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-10">
          {['Detector', 'Models', 'About']?.map((item) => (
            <a
              key={item}
              href={`#${item?.toLowerCase()}`}
              className="font-mono text-[11px] font-medium tracking-[0.25em] uppercase transition-colors duration-200"
              style={{ color: '#9090B8' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9090B8')}
            >
              {item}
            </a>
          ))}
          <a
             href="/dashboard"
             className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase transition-colors duration-200"
             style={{ color: '#EAEAFC' }}
             onMouseEnter={(e) => (e.currentTarget.style.color = '#4ADE80')}
             onMouseLeave={(e) => (e.currentTarget.style.color = '#EAEAFC')}
          >
             Dashboard App
          </a>
        </nav>

        {/* CTA */}
        <a
          href="/dashboard"
          className="cta-btn-primary px-5 py-2.5 rounded-lg text-sm font-bold"
        >
          Open App →
        </a>
      </div>
    </header>
  );
}