import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onShowToolkit: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading, onShowToolkit }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/20 border border-slate-700/60 rounded-xl p-2 shadow-lg backdrop-blur-md">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cozy server for book lovers"
            className="w-full bg-transparent text-lg text-white placeholder-slate-400 focus:outline-none px-4 py-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onShowToolkit}
          className="text-slate-400 hover:text-white transition-colors font-semibold py-2 px-4 rounded-lg hover:bg-slate-800/50"
          disabled={isLoading}
        >
          Or, just use the AI Toolkit &rarr;
        </button>
      </div>
    </div>
  );
};