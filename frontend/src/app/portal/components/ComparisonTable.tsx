'use client';
import React, { useRef, useEffect } from 'react';

const rows = [
  {
    painPoint: 'Detecting fake news from headlines alone',
    portal: 'BERT contextual embeddings — 96.9% accuracy on headlines',
    bloomerang: 'Keyword matching only',
    salesforce: 'No NLP, rule-based filters',
    excel: 'Manual fact-check',
    portalDetail: 'BERT understands context, not just keywords. Catches subtle misinformation.',
  },
  {
    painPoint: 'Handling unseen writing styles and new topics',
    portal: 'Fine-tuned BERT generalizes across domains and styles',
    bloomerang: 'Fails on out-of-vocabulary terms',
    salesforce: 'Domain-specific rules only',
    excel: 'Human judgment required',
    portalDetail: 'Trained on 72,134 diverse articles spanning politics, health, science, and more.',
  },
  {
    painPoint: 'Fast inference for real-time detection',
    portal: 'Sub-second inference with optimized BERT pipeline',
    bloomerang: 'Slow batch processing',
    salesforce: 'API latency > 2s',
    excel: 'Minutes per article',
    portalDetail: 'Logistic Regression and SVM models provide instant fallback for speed.',
  },
  {
    painPoint: 'Explainability — why was it flagged as fake?',
    portal: 'Token attention highlights + feature weight breakdown',
    bloomerang: 'Black box, no explanation',
    salesforce: 'Score only, no reasoning',
    excel: 'Your gut feeling',
    portalDetail: 'See exactly which words and phrases triggered the fake news classification.',
  },
  {
    painPoint: 'Confidence scoring and uncertainty quantification',
    portal: 'Probability scores with calibrated confidence bars',
    bloomerang: 'Binary yes/no only',
    salesforce: 'Threshold-based flags',
    excel: 'No scoring',
    portalDetail: 'Know when the model is uncertain — 94.2% fake vs 51% fake are very different.',
  },
  {
    painPoint: 'Multi-model ensemble for higher accuracy',
    portal: 'BERT + Logistic Regression + SVM ensemble voting',
    bloomerang: 'Single model only',
    salesforce: 'Single classifier',
    excel: 'One person\'s opinion',
    portalDetail: 'Three models vote on each article. Disagreement flags borderline cases for review.',
  },
  {
    painPoint: 'Training data transparency and reproducibility',
    portal: 'Open dataset: 72,134 labeled articles, full methodology',
    bloomerang: 'Proprietary, undisclosed',
    salesforce: 'Closed training data',
    excel: 'No training data',
    portalDetail: 'Full training pipeline documented. Reproduce results or fine-tune on your data.',
  },
  {
    painPoint: 'Handling satire vs. genuine misinformation',
    portal: 'Satire detection layer with source credibility signals',
    bloomerang: 'Flags satire as fake',
    salesforce: 'No satire handling',
    excel: 'Requires domain expertise',
    portalDetail: 'Trained on satire-labeled data to reduce false positives from The Onion-style content.',
  },
];

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8.5" stroke="#EF4444" strokeOpacity="0.3" />
      <path d="M5.5 9L7.5 11L12.5 6.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6 6L12 12M12 6L6 12" stroke="rgba(144,144,184,0.25)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PartialIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5 9H13" stroke="rgba(246,166,35,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ComparisonTable() {
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
      { threshold: 0.05 }
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
      id="models"
      className="py-24 px-6 relative"
      style={{ background: 'linear-gradient(180deg, #0C0C18 0%, #09090F 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 reveal-hidden">
          <span
            className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block"
            style={{ color: '#9090B8' }}
          >
            Model Comparison
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase"
            style={{ color: '#EAEAFC' }}
          >
            The Challenge.
            <br />
            <span style={{ color: '#EF4444' }} className="italic">
              Our Solution.
            </span>
          </h2>
          <p className="mt-5 text-base font-light max-w-lg mx-auto" style={{ color: '#9090B8' }}>
            Every row is a real fake news detection challenge. The FakeGuard column shows how our AI handles it.
          </p>
        </div>

        {/* Table container */}
        <div
          className="rounded-2xl overflow-hidden reveal-hidden reveal-delay-1"
          style={{ border: '1px solid rgba(239,68,68,0.12)' }}
        >
          <div className="overflow-x-auto">
            <table className="compare-table w-full" style={{ borderCollapse: 'collapse' }}>
              {/* Header */}
              <thead>
                <tr>
                  <th
                    className="text-left px-6 py-5 font-mono text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: '#9090B8', background: '#09090F', minWidth: '240px' }}
                  >
                    The Challenge
                  </th>
                  {/* FakeGuard — glowing column */}
                  <th
                    className="portal-col-header px-6 py-5 text-center"
                    style={{ minWidth: '200px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className="font-mono text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: '#EF4444' }}
                      >
                        🛡 FakeGuard AI
                      </span>
                      <span
                        className="font-mono text-[9px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        BERT · 96.9%
                      </span>
                    </div>
                  </th>
                  {['Keyword Filters', 'Rule-Based Systems', 'Manual Review']?.map((comp) => (
                    <th
                      key={comp}
                      className="px-6 py-5 text-center font-mono text-[10px] tracking-[0.3em] uppercase"
                      style={{ color: 'rgba(144,144,184,0.35)', background: '#09090F', minWidth: '160px' }}
                    >
                      {comp}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {rows?.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'compare-row-odd' : 'compare-row-even'}
                    style={{ borderTop: '1px solid rgba(239,68,68,0.05)' }}
                  >
                    {/* Challenge */}
                    <td className="px-6 py-5">
                      <p className="font-mono text-[11px] font-medium leading-relaxed" style={{ color: '#EAEAFC' }}>
                        {row?.painPoint}
                      </p>
                    </td>

                    {/* FakeGuard solution */}
                    <td className="portal-col-cell px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <CheckIcon />
                        <p className="font-mono text-[10px] font-medium leading-relaxed text-center" style={{ color: '#EF4444' }}>
                          {row?.portal}
                        </p>
                        <p className="font-mono text-[9px] text-center leading-relaxed" style={{ color: 'rgba(239,68,68,0.5)' }}>
                          {row?.portalDetail}
                        </p>
                      </div>
                    </td>

                    {/* Keyword Filters */}
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <PartialIcon />
                        <p className="font-mono text-[10px] leading-relaxed text-center" style={{ color: 'rgba(144,144,184,0.4)' }}>
                          {row?.bloomerang}
                        </p>
                      </div>
                    </td>

                    {/* Rule-Based */}
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <PartialIcon />
                        <p className="font-mono text-[10px] leading-relaxed text-center" style={{ color: 'rgba(144,144,184,0.4)' }}>
                          {row?.salesforce}
                        </p>
                      </div>
                    </td>

                    {/* Manual Review */}
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <XIcon />
                        <p className="font-mono text-[10px] leading-relaxed text-center" style={{ color: 'rgba(144,144,184,0.25)' }}>
                          {row?.excel}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model accuracy callout below table */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 reveal-hidden reveal-delay-2">
          <div className="flex items-center gap-6">
            {[
              { label: 'Keyword Filters', price: '~70% accuracy' },
              { label: 'Rule-Based', price: '~75% accuracy' },
              { label: 'Manual Review', price: 'Hours per article' },
            ]?.map((item) => (
              <div key={item?.label} className="flex items-center gap-2">
                <span className="font-mono text-[10px]" style={{ color: 'rgba(144,144,184,0.35)' }}>
                  {item?.label}:
                </span>
                <span className="font-mono text-[10px] line-through" style={{ color: 'rgba(248,113,113,0.4)' }}>
                  {item?.price}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px]" style={{ color: '#9090B8' }}>FakeGuard AI:</span>
            <span className="font-mono text-lg font-bold" style={{ color: '#EF4444' }}>96.9% accuracy.</span>
            <span className="font-mono text-[10px]" style={{ color: 'rgba(74,222,128,0.7)' }}>Sub-second.</span>
          </div>
        </div>
      </div>
    </section>
  );
}