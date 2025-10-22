import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const extractLeadingEmoji = (text: string) => {
    // This more comprehensive regex matches a wider range of emojis, including extended pictographics.
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
    const match = text.match(emojiRegex);
    
    if (match) {
        const emoji = match[0];
        const rest = text.substring(emoji.length).trim();
        return { emoji, rest };
    }
    
    return { emoji: null, rest: text };
};


export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { emoji, rest } = extractLeadingEmoji(title);

  return (
    <div className="border border-slate-700 bg-slate-900/30 rounded-xl backdrop-blur-sm overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
      >
        <h3 className="text-xl font-bold text-white text-left flex items-center gap-2">
          {emoji && <span>{emoji}</span>}
          {rest && <span className="gradient-text">{rest}</span>}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 text-red-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transitionProperty: 'max-height, opacity, padding' }}
      >
        <div className="p-4">
            {children}
        </div>
      </div>
    </div>
  );
};