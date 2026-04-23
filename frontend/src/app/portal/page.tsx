'use client';
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroTabSwitcher from './components/HeroTabSwitcher';
import GraveyardSection from './components/GraveyardSection';
import ComparisonTable from './components/ComparisonTable';
import CtaSection from './components/CtaSection';
import StickyCta from './components/StickyCta';

export default function PortalPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-hidden')?.forEach((el) => observer?.observe(el));

    return () => observer?.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: '#09090F', minHeight: '100vh' }}>
      <Header />
      <StickyCta />
      {/* ─── Hero ─── */}
      <section
        id="detector"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.10) 0%, #09090F 60%)' }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Ambient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Status bar */}
          <div className="flex justify-center mb-8 reveal-hidden">
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(30,30,46,0.8)',
                border: '1px solid rgba(239,68,68,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ADE80' }} />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: '#9090B8' }}>
                FakeGuard v1.0 · Powered by BERT + Classical ML
              </span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-6 reveal-hidden">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.88]"
              style={{ color: '#EAEAFC' }}
            >
              Detect Fake News
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                className="italic"
              >
                In Seconds.
              </span>
            </h1>
          </div>

          {/* Sub headline */}
          <p
            className="text-center text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-12 reveal-hidden reveal-delay-1"
            style={{ color: '#9090B8' }}
          >
            Paste any headline or article. Our AI analyzes it instantly using BERT deep learning and classical ML models trained on 72,000+ news articles.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 reveal-hidden reveal-delay-2">
            <a
              href="#detector"
              className="cta-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-flex items-center gap-3"
            >
              Try the Detector →
            </a>
            <a
              href="#models"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium transition-all duration-200"
              style={{
                background: 'rgba(30,30,46,0.6)',
                border: '1px solid rgba(59,130,246,0.15)',
                color: '#9090B8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)';
                e.currentTarget.style.color = '#EAEAFC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)';
                e.currentTarget.style.color = '#9090B8';
              }}
            >
              See Model Comparison
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16 reveal-hidden reveal-delay-2">
            {[
              { value: '72,134', label: 'Articles in training dataset' },
              { value: '96.9%', label: 'Best model accuracy', highlight: true },
              { value: '3 Models', label: 'BERT · Logistic Reg · SVM' },
            ]?.map((stat, i) => (
              <div
                key={i}
                className="text-center px-8 py-5 rounded-xl"
                style={{
                  background: 'rgba(30,30,46,0.5)',
                  border: stat?.highlight
                    ? '1px solid rgba(59,130,246,0.3)'
                    : '1px solid rgba(239,68,68,0.12)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <p
                  className="font-mono text-2xl font-bold tabular-num"
                  style={{
                    color: stat?.highlight ? '#3B82F6' : '#EF4444',
                  }}
                >
                  {stat?.value}
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: '#9090B8' }}>
                  {stat?.label}
                </p>
              </div>
            ))}
          </div>

          {/* App window tab switcher */}
          <div className="reveal-hidden reveal-delay-3">
            <HeroTabSwitcher />
          </div>

          {/* Caption below app window */}
          <p
            className="text-center font-mono text-[10px] tracking-[0.3em] uppercase mt-6 reveal-hidden reveal-delay-4"
            style={{ color: 'rgba(144,144,184,0.4)' }}
          >
            Live inference · BERT + Classical ML · Click the tabs above to explore models
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal-hidden reveal-delay-4">
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: 'rgba(144,144,184,0.3)' }}>
            Scroll
          </span>
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, rgba(239,68,68,0.3), transparent)' }} />
        </div>
      </section>
      {/* ─── Graveyard Section (repurposed) ─── */}
      <GraveyardSection />
      {/* ─── Comparison Table ─── */}
      <ComparisonTable />
      {/* ─── Final CTA ─── */}
      <CtaSection />
      <Footer />
    </div>
  );
}