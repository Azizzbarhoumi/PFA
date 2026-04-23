'use client';
import React, { useRef, useEffect } from 'react';

const cells = [
  { label: 'donor_list_FINAL.xlsx', type: 'error' },
  { label: 'volunteer_hours_v7.csv', type: 'normal' },
  { label: '#REF! ERROR', type: 'error' },
  { label: 'grant_tracker_OLD.xlsx', type: 'normal' },
  { label: 'CONFLICT: merge failed', type: 'error' },
  { label: 'board_report_draft3.docx', type: 'normal' },
  { label: 'donor_list_FINAL_v2.xlsx', type: 'error' },
  { label: '#VALUE! ERROR', type: 'error' },
  { label: 'volunteers_feb_backup.csv', type: 'normal' },
  { label: 'grant_deadlines_2025.xlsx', type: 'normal' },
  { label: 'CIRCULAR REF!', type: 'error' },
  { label: 'impact_report_REVISED.docx', type: 'normal' },
  { label: '#DIV/0! ERROR', type: 'error' },
  { label: 'donor_seg_final_REAL.xlsx', type: 'normal' },
  { label: 'OVERWRITTEN BY SARAH', type: 'error' },
  { label: 'volunteer_sched_v11.xlsx', type: 'normal' },
  { label: '#NAME? ERROR', type: 'error' },
  { label: 'grant_apps_2026_q1.xlsx', type: 'normal' },
];

export default function GraveyardSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const el = sectionRef?.current;
    if (el) {
      el?.querySelectorAll('.reveal-hidden')?.forEach((child) => observer?.observe(child));
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #09090F 0%, #0C0C18 100%)' }}
    >
      {/* Violet line separator */}
      <div className="violet-line mb-20 max-w-7xl mx-auto" />
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-16 reveal-hidden">
          <span
            className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block"
            style={{ color: '#9090B8' }}
          >
            The Problem With Misinformation
          </span>
          <h2
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase"
            style={{ color: '#EAEAFC' }}
          >
            The Fake News
            <br />
            <span style={{ color: '#EF4444' }} className="italic">
              Epidemic.
            </span>
          </h2>
          <p
            className="mt-6 text-lg font-light max-w-xl mx-auto leading-relaxed"
            style={{ color: '#9090B8' }}
          >
            Misleading headlines. Fabricated stories. Viral misinformation. Without AI-powered detection, it spreads faster than the truth.
          </p>
        </div>

        {/* Blurred chaos mosaic */}
        <div
          className="relative rounded-2xl overflow-hidden reveal-hidden reveal-delay-2"
          style={{
            border: '1px solid rgba(248,113,113,0.15)',
            background: '#0C0C18',
          }}
        >
          {/* Scanline overlay */}
          <div className="scanline-effect absolute inset-0 z-10 pointer-events-none" />

          {/* Blur overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(9,9,15,0.1) 0%, rgba(9,9,15,0.85) 100%)',
            }}
          />

          {/* Grid of "spreadsheet" cells */}
          <div
            className="grid gap-1.5 p-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', filter: 'blur(1.5px)' }}
          >
            {cells?.map((cell, i) => (
              <div
                key={i}
                className={`graveyard-cell ${cell?.type === 'error' ? 'error' : ''} px-3 py-2`}
              >
                <p
                  className="font-mono text-[9px] truncate"
                  style={{ color: cell?.type === 'error' ? '#F87171' : 'rgba(144,144,184,0.5)' }}
                >
                  {cell?.label}
                </p>
                {cell?.type === 'error' && (
                  <div className="mt-1 h-1 rounded-full w-full" style={{ background: 'rgba(248,113,113,0.3)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Center overlay text */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
            <div
              className="px-8 py-5 rounded-2xl text-center"
              style={{
                background: 'rgba(9,9,15,0.85)',
                border: '1px solid rgba(248,113,113,0.3)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: '#F87171' }}>
                Version Conflict Detected
              </p>
              <p className="font-black text-2xl tracking-tight" style={{ color: '#EAEAFC' }}>
                donor_list_FINAL_v4_REAL_USE_THIS.xlsx
              </p>
              <p className="font-mono text-[10px] mt-2" style={{ color: '#9090B8' }}>
                Last modified by 3 people simultaneously · 11:47 PM
              </p>
            </div>
          </div>
        </div>

        {/* Pain point callouts */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 reveal-hidden reveal-delay-3">
          {[
            {
              icon: '⚠',
              title: 'Viral before verified',
              desc: 'Fake news spreads 6x faster than real news on social media. By the time it\'s debunked, millions have already seen it.',
              color: '#EF4444',
            },
            {
              icon: '🔍',
              title: 'Hard to spot manually',
              desc: 'Modern fake news mimics real journalism. Sensational language, fake quotes, and misleading statistics fool even experts.',
              color: '#F6A623',
            },
            {
              icon: '🤖',
              title: 'AI-generated content',
              desc: 'LLMs can generate convincing fake articles at scale. Traditional fact-checking can\'t keep up with the volume.',
              color: '#9090B8',
            },
          ]?.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{
                background: 'rgba(30,30,46,0.4)',
                border: `1px solid ${item?.color}22`,
              }}
            >
              <span className="text-2xl mb-3 block">{item?.icon}</span>
              <h3
                className="font-mono text-sm font-bold tracking-tight mb-2"
                style={{ color: item?.color }}
              >
                {item?.title}
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: '#9090B8' }}>
                {item?.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}