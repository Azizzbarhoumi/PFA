'use client';
import React, { useState } from 'react';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      id="download"
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #09090F 0%, #0E0720 40%, #1A0A40 100%)',
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Label */}
        <span
          className="font-mono text-[10px] tracking-[0.5em] uppercase mb-6 block"
          style={{ color: '#9090B8' }}
        >
          Powered by AI
        </span>

        {/* Headline */}
        <h2
          className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-8"
          style={{ color: '#EAEAFC' }}
        >
          Stop Spreading
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
            Misinformation.
          </span>
        </h2>

        <p
          className="text-lg font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          style={{ color: '#9090B8' }}
        >
          FakeGuard AI uses BERT deep learning and classical ML models trained on 72,000+ articles to detect fake news with 96.9% accuracy — in seconds.
        </p>

        {/* CTA group */}
        {!submitted ? (
          <div className="flex flex-col items-center gap-6">
            <a
              href="/dashboard"
              className="cta-btn-primary px-10 py-5 rounded-xl text-lg font-bold inline-flex items-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3L10 13M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Try the Detector Free →
            </a>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none transition-all"
                style={{
                  background: 'rgba(30,30,46,0.8)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  color: '#EAEAFC',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)')}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-200"
                style={{
                  background: 'rgba(59,130,246,0.2)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#3B82F6',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.35)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')}
              >
                Get API Access →
              </button>
            </form>
            <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'rgba(144,144,184,0.4)' }}>
              Free tier available · No credit card · BERT + 2 classical ML models
            </p>
          </div>
        ) : (
          <div
            className="inline-flex flex-col items-center gap-3 px-10 py-8 rounded-2xl"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.15)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-mono text-sm font-bold" style={{ color: '#4ADE80' }}>Access link sent to {email}</p>
            <p className="font-mono text-[10px]" style={{ color: '#9090B8' }}>Check your inbox — your detector is ready.</p>
          </div>
        )}

        {/* Trust signals */}
        <div
          className="flex flex-wrap justify-center gap-8 mt-16 pt-12"
          style={{ borderTop: '1px solid rgba(239,68,68,0.08)' }}
        >
          {[
            { value: '72,134', label: 'Training articles' },
            { value: '96.9%', label: 'Best accuracy' },
            { value: '3 Models', label: 'BERT · LR · SVM' },
            { value: '<1s', label: 'Inference time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl font-bold tabular-num" style={{ color: '#EF4444' }}>
                {stat.value}
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: '#9090B8' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}