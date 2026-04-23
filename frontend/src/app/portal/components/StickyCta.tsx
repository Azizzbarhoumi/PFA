'use client';
import React, { useState, useEffect } from 'react';

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past ~600px (first comparison row)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta fixed bottom-0 left-0 right-0 z-50">
      <div
        className="px-6 py-4 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(9,9,15,0.95)',
          borderTop: '1px solid rgba(183,148,246,0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="hidden md:flex items-center gap-4">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ADE80' }} />
          <p className="font-mono text-[11px] tracking-[0.15em]" style={{ color: '#9090B8' }}>
            FakeGuard AI · BERT + Classical ML · 96.9% accuracy on 72,134 articles
          </p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <a
            href="#models"
            className="font-mono text-[11px] tracking-[0.15em] transition-colors duration-200"
            style={{ color: '#9090B8' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#3B82F6')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9090B8')}
          >
            See Model Comparison →
          </a>
          <a
            href="/dashboard"
            className="cta-btn-primary px-6 py-3 rounded-lg text-sm font-bold inline-flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2L7 9M7 9L4.5 6.5M7 9L9.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Try the Detector
          </a>
        </div>
      </div>
    </div>
  );
}