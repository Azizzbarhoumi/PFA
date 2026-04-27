'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroTabSwitcher from './components/HeroTabSwitcher';
import GraveyardSection from './components/GraveyardSection';
import ComparisonTable from './components/ComparisonTable';
import CtaSection from './components/CtaSection';
import StickyCta from './components/StickyCta';

const metricValues = {
  'Accuracy': { BERT: 98.00, 'CNN+LSTM': 96.74, SVM: 96.89, LR: 95.24 },
  'F1 Score': { BERT: 98.0, 'CNN+LSTM': 96.4, SVM: 97.0, LR: 95.0 },
  'AUC-ROC': { BERT: 99.80, 'CNN+LSTM': 99.43, SVM: 99.00, LR: 98.50 },
};

const modelColorMap: Record<string, string> = {
  BERT: '#3B82F6',
  'CNN+LSTM': '#A855F7',
  SVM: '#EF4444',
  LR: '#4ADE80',
};

export default function PortalPage() {
  const [activeMetric, setActiveMetric] = useState('Accuracy');
  
  const bgColor = 'var(--void)';
const cardBg = 'var(--bg-secondary)';
const borderColor = 'var(--border-color, rgba(59,130,246,0.1))';
const textPrimary = 'var(--chalk)';
const textMuted = 'var(--chalk-muted)';

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
    <div style={{ backgroundColor: bgColor, minHeight: '100vh' }}>
      <Header />
      <StickyCta />
      {/* ─── Hero ─── */}
      <section
        id="detector"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.10) 0%, var(--void) 60%)' }}
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
                FakeGuard v1.0 · Powered by BERT + CNN+LSTM + Classical ML · 98.0% Accuracy
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
            Paste any headline or article. Our AI analyzes it instantly using BERT, CNN+LSTM, and classical ML models trained on 72,000+ news articles.
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
              { value: '70,543', label: 'Training Articles', highlight: true },
              { value: '37K', label: 'Fake Articles (51.4%)', highlight: false },
              { value: '35K', label: 'Real Articles (48.6%)', highlight: false },
              { value: '3,268', label: 'Avg Characters / Article', highlight: true },
              { value: '541', label: 'Avg Words / Article', highlight: true },
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

          {/* Dataset Visualization */}
          <div className="reveal-hidden reveal-delay-3 mb-8">
            <p className="text-center font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#9090B8' }}>
              Training Data Distribution
            </p>
            <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(239,68,68,0.2)' }}>
                <div className="h-full rounded-full" style={{ width: '51.4%', background: '#EF4444' }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs" style={{ color: '#EF4444' }}>FAKE: 51.4%</span>
                <span className="font-mono text-xs" style={{ color: '#4ADE80' }}>REAL: 48.6%</span>
              </div>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.2)' }}>
                <div className="h-full rounded-full" style={{ width: '48.6%', background: '#4ADE80' }} />
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <p className="font-mono text-lg font-bold" style={{ color: '#EF4444' }}>37,106</p>
                <p className="font-mono text-[9px] uppercase" style={{ color: '#9090B8' }}>Fake Articles</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-bold" style={{ color: '#4ADE80' }}>35,028</p>
                <p className="font-mono text-[9px] uppercase" style={{ color: '#9090B8' }}>Real Articles</p>
              </div>
            </div>
          </div>

          {/* Model Comparison Bar Chart */}
          <div className="reveal-hidden reveal-delay-3 mb-8 px-4">
            <p className="text-center font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#9090B8' }}>
              Model Performance Comparison
            </p>
            
            {/* Interactive tabs for metrics */}
            <div className="flex justify-center gap-2 mb-4">
              {Object.keys(metricValues).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className="px-3 py-1 rounded font-mono text-[10px] uppercase"
                  style={{
                    background: activeMetric === metric ? 'rgba(59,130,246,0.3)' : 'rgba(30,30,46,0.5)',
                    color: activeMetric === metric ? '#3B82F6' : '#9090B8',
                    border: `1px solid ${activeMetric === metric ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.1)'}`
                  }}
                >
                  {metric}
                </button>
              ))}
            </div>
            
            {/* Bar chart */}
            <div className="max-w-xl mx-auto space-y-3">
              {Object.entries(metricValues[activeMetric]).map(([name, value]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-12 font-mono text-xs text-right" style={{ color: '#9090B8' }}>{name}</span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ background: 'rgba(30,30,46,0.5)' }}>
                    <div 
                      className="h-full rounded-lg transition-all duration-500"
                      style={{ 
                        width: `${value}%`,
                        background: modelColorMap[name] || '#3B82F6',
                        boxShadow: `0 0 15px ${(modelColorMap[name] || '#3B82F6')}40`
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs font-bold" style={{ color: '#EAEAFC' }}>
                      {value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-hidden reveal-delay-3 mb-8 px-4">
            <p className="text-center font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#9090B8' }}>
              Model Agreement Matrix (Test Set: 14,109 samples)
            </p>
            <div className="flex justify-center gap-4">
              {[
                { x: 'BERT', y: 'BERT', v: '98.00%' },
                { x: 'LR', y: 'BERT', v: '95.8%' },
                { x: 'SVM', y: 'BERT', v: '97.1%' },
                { x: 'LR', y: 'LR', v: '95.24%' },
                { x: 'SVM', y: 'LR', v: '97.9%' },
                { x: 'SVM', y: 'SVM', v: '96.89%' },
              ].map((cell, i) => (
                <div 
                  key={i}
                  className="w-16 h-12 flex items-center justify-center rounded font-mono text-xs"
                  style={{ 
                    background: cell.v === '100%' ? 'rgba(59,130,246,0.4)' : 
                              parseFloat(cell.v) > 96 ? 'rgba(59,130,246,0.25)' : 
                              parseFloat(cell.v) > 94 ? 'rgba(246,166,35,0.2)' : 'rgba(239,68,68,0.2)',
                    color: parseFloat(cell.v) > 97 ? '#3B82F6' : '#EAEAFC'
                  }}
                >
                  {cell.v}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-2 font-mono text-[9px]" style={{ color: '#9090B8' }}>
              <span>BERT</span><span className="w-16" /><span>LR</span><span className="w-16" /><span>SVM</span>
            </div>
            <div className="text-center mt-2 font-mono text-[9px]" style={{ color: '#9090B8' }}>
              Accuracy: LR=95.24% | SVM=96.89% | CNN+LSTM=96.74% | BERT=98.00%
            </div>
          </div>

          {/* Text Stats Comparison */}
          <div className="reveal-hidden reveal-delay-3 mb-8">
            <p className="text-center font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#9090B8' }}>
              Text Analysis by Label
            </p>
            <div className="flex justify-center gap-8">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="font-mono text-xs uppercase mb-2" style={{ color: '#EF4444' }}>Fake News</p>
                <p className="font-mono text-xl font-bold" style={{ color: '#EAEAFC' }}>3,495</p>
                <p className="font-mono text-[9px]" style={{ color: '#9090B8' }}>avg characters</p>
                <p className="font-mono text-xl font-bold mt-2" style={{ color: '#EAEAFC' }}>578</p>
                <p className="font-mono text-[9px]" style={{ color: '#9090B8' }}>avg words</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <p className="font-mono text-xs uppercase mb-2" style={{ color: '#4ADE80' }}>Real News</p>
                <p className="font-mono text-xl font-bold" style={{ color: '#EAEAFC' }}>3,054</p>
                <p className="font-mono text-[9px]" style={{ color: '#9090B8' }}>avg characters</p>
                <p className="font-mono text-xl font-bold mt-2" style={{ color: '#EAEAFC' }}>506</p>
                <p className="font-mono text-[9px]" style={{ color: '#9090B8' }}>avg words</p>
              </div>
            </div>
            <p className="text-center font-mono text-[9px] mt-3" style={{ color: '#9090B8' }}>
              Fake news tends to be 14% longer on average
            </p>
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
            Live inference · BERT + CNN+LSTM + Classical ML · Click the tabs above to explore models
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