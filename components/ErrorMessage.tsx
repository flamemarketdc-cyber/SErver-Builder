import React from 'react';

interface ErrorMessageProps {
  title: string;
  subtitle: string;
  onRetry: () => void;
  isConfigurationError?: boolean;
}

const RetryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-90deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" />
    </svg>
);


export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, subtitle, onRetry, isConfigurationError }) => {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-3 p-6 bg-red-950/70 border border-red-800 rounded-xl">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-rose-300">{subtitle}</p>
      {!isConfigurationError && (
        <button 
          onClick={onRetry} 
          className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors group text-sm font-semibold text-white"
          aria-label="Try again"
        >
          <RetryIcon />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};