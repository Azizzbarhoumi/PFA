/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void': '#09090F',
        'void-mid': '#13131D',
        'interface': '#1E1E2E',
        'violet': '#6C2BD9',
        'violet-dark': '#5520B0',
        'lilac': '#B794F6',
        'chalk': '#EAEAFC',
        'chalk-muted': '#9090B8',
        'portal-amber': '#F6A623',
        'portal-green': '#4ADE80',
        'portal-red': '#F87171',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'violet-gradient': 'linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 50%, #B794F6 100%)',
        'void-gradient': 'linear-gradient(180deg, #09090F 0%, #0E0720 100%)',
      },
      animation: {
        'violet-pulse': 'violet-pulse 3s ease-in-out infinite',
        'float': 'float-card 6s ease-in-out infinite',
        'thermometer': 'thermometer-fill 2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slide-up-sticky 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'blink': 'blink-cursor 1.2s step-end infinite',
      },
      keyframes: {
        'violet-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 43, 217, 0.3), 0 0 40px rgba(108, 43, 217, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(108, 43, 217, 0.5), 0 0 60px rgba(108, 43, 217, 0.2)' },
        },
        'float-card': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'thermometer-fill': {
          from: { width: '0%' },
          to: { width: '73%' },
        },
        'slide-up-sticky': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};