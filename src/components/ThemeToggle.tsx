import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();

  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';
  const labelSize = compact ? 'text-[8px]' : 'text-xs';
  const gap = compact ? 'gap-0.5' : 'gap-1';
  const padding = compact ? 'px-2 py-2' : 'px-4';
  const borderRadius = compact ? 'rounded-xl' : 'rounded-2xl';
  const shadow = compact ? 'shadow-[3px_3px_0_rgba(17,17,17,0.35)]' : 'shadow-[6px_6px_0_rgba(17,17,17,0.35)]';
  const minWidth = compact ? 'min-w-[50px]' : 'min-w-[80px]';

  return (
    <button
      onClick={toggleTheme}
      className={`h-full ${padding} ${borderRadius} border-2 border-pop-coal dark:border-[#1a1a2e] bg-white dark:bg-[#FFDAB9] text-pop-coal dark:text-[#1a1a2e] ${shadow} dark:shadow-[3px_3px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center ${gap} transition-all duration-500 active:translate-y-0.5 ${minWidth}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className={`relative ${iconSize}`}>
        {/* Sun Icon */}
        <svg
          className={`
            absolute inset-0 ${iconSize} text-pop-coal dark:text-[#1a1a2e] transition-all duration-500 ease-out
            ${
              theme === "light"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-75"
            }
          `}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`
            absolute inset-0 ${iconSize} text-[#1a1a2e] dark:text-[#1a1a2e] transition-all duration-500 ease-out
            ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-75"
            }
          `}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
      <span className={`${labelSize} font-black uppercase tracking-wider`}>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
};
