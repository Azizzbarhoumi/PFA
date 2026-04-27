'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isSystem: false,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isSystem: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    // Force add light-mode class when theme is light
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);
  
  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-all duration-500 overflow-hidden"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 100%)',
        border: `2px solid ${theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(253,203,110,0.5)'}`,
        boxShadow: theme === 'dark' 
          ? '0 0 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(0,0,0,0.3)'
          : '0 0 20px rgba(253,203,110,0.4), inset 0 0 10px rgba(255,255,255,0.3)'
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon for dark mode (shown when light) */}
      <div 
        className="absolute transition-all duration-500"
        style={{
          left: theme === 'dark' ? '2px' : '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: theme === 'dark' ? 0 : 1,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#F39C12" />
          <path d="M12 2V4M12 20V22M4 12H2M22 12H20M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#F39C12" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Moon icon for light mode (shown when dark) */}
      <div 
        className="absolute transition-all duration-500"
        style={{
          right: theme === 'light' ? '2px' : '50%',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path 
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
            fill={theme === 'dark' ? '#3B82F6' : '#2D3436'}
            stroke={theme === 'dark' ? '#60A5FA' : '#636E72'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Background glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3), transparent 70%)'
            : 'radial-gradient(circle at 70% 50%, rgba(253,203,110,0.4), transparent 70%)',
          opacity: 1
        }}
      />
    </button>
  );
}