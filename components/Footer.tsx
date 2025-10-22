import React from 'react';

const FlameIcon = () => (
    <img 
        src="https://i.postimg.cc/L6KKKmrF/Vibrant-Flame-on-Black-Background-removebg-preview.png" 
        alt="Flaming Logo" 
        className="h-7 w-7"
    />
);

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-16 border-t border-slate-800/50 bg-black/20">
      <div className="max-w-3xl mx-auto px-4 text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FlameIcon />
            <span className="font-bold text-slate-300">Flaming Server Builder</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
      </div>
    </footer>
  );
};