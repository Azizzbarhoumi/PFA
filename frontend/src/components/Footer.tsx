import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t py-8 px-6" style={{ borderColor: 'rgba(183,148,246,0.08)', backgroundColor: '#09090F' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo + links */}
        <div className="flex items-center gap-8">
          <AppLogo size={24} text="Portal" iconName="SignalIcon" className="text-[#B794F6]" />
          {['Features', 'Compare', 'Privacy', 'Terms', 'Docs']?.map((item) => (
            <a
              key={item}
              href="#"
              className="font-mono text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200"
              style={{ color: '#9090B8' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EAEAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9090B8')}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'rgba(144,144,184,0.4)' }}>
          © 2026 Portal Systems, PBC
        </p>
      </div>
    </footer>
  );
}