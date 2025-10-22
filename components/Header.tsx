import React from 'react';

// Define a local AppView type to avoid import issues
type AppView = 'home' | 'generating' | 'results' | 'toolkitPrompt' | 'toolkit' | 'serverBuilder' | 'gallery' | 'history';


interface HeaderProps {
  view: AppView;
  onGoHome?: () => void;
}

const Underline = () => (
    <svg className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-auto text-red-500" viewBox="0 0 236 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12 C 40 4, 200 6, 234 16" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" className="underline-path-animated"/>
        <defs>
          <linearGradient id="underline-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop stopColor="#EF4444"/>
            <stop offset="1" stopColor="#B91C1C"/>
          </linearGradient>
        </defs>
    </svg>
);

const InteractiveText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-transform duration-200 ease-in-out hover:-translate-y-[6px] cursor-default ${className}`}
        >
          {char}
        </span>
      ))}
    </>
  );
};

export const Header: React.FC<HeaderProps> = ({ view, onGoHome }) => {
  const content = (() => {
    if (view === 'toolkit' || view === 'toolkitPrompt') {
      return (
        <>
          <h1 className="text-5xl md:text-7xl font-black font-title tracking-tight fire-shadow main-title-interactive">
             <span className="white-glow"><InteractiveText text="AI" className="text-white" /></span>
             {' '}
             <span className="red-glow"><InteractiveText text="Toolkit." className="gradient-text" /></span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Generate messages, rules, and professional embeds for any server.
          </p>
        </>
      );
    }
    if (view === 'history') {
      return (
        <>
          <h1 className="text-5xl md:text-7xl font-black font-title tracking-tight fire-shadow main-title-interactive">
             <span className="white-glow"><InteractiveText text="My" className="text-white" /></span>
             {' '}
             <span className="red-glow"><InteractiveText text="Creations." className="gradient-text" /></span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Review and revisit all the server templates you've generated.
          </p>
        </>
      );
    }
    
    return (
      <>
        <h1 className="text-5xl md:text-7xl font-black font-title tracking-tight fire-shadow main-title-interactive">
          <span className="white-glow"><InteractiveText text="Discord" className="silver-gradient-text" /></span>
          <span className="relative inline-block mx-2">
              <span className="white-glow"><InteractiveText text=" Server" className="silver-gradient-text" /></span>
              <Underline />
          </span>
          <span className="block md:inline">
            <span className="red-glow"><InteractiveText text="Builder." className="gradient-text" /></span>
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          From a single idea to a fully-designed Discord community. AI-powered, instant, and tailored to you.
        </p>
      </>
    );
  })();

  return (
    <header className="text-center">
      {onGoHome ? (
        <button 
          onClick={onGoHome} 
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg w-full"
          aria-label="Go to homepage"
        >
          {content}
        </button>
      ) : (
        <div>{content}</div>
      )}
    </header>
  );
};