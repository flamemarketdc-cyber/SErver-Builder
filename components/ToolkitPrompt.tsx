import React, { useState } from 'react';

interface ToolkitPromptProps {
  onContinue: (description: string) => void;
  onCancel: () => void;
}

export const ToolkitPrompt: React.FC<ToolkitPromptProps> = ({ onContinue, onCancel }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onContinue(description);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center fade-in">
      <h2 className="text-4xl font-extrabold text-white mb-2 main-title-interactive fire-shadow">
        First, what's your server about?
      </h2>
      <p className="text-slate-400 mb-8 max-w-lg mx-auto">
        Provide a theme or topic. The AI will use this context to generate perfectly tailored content for you.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 bg-black/20 border border-slate-700/60 rounded-xl p-4 shadow-lg backdrop-blur-md">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A cozy community for artists and illustrators"
            className="w-full bg-transparent text-lg text-white placeholder-slate-400 focus:outline-none px-4 py-3 resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!description.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed btn-interactive-red"
          >
            Continue to Toolkit &rarr;
          </button>
        </div>
      </form>
       <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-white transition-colors font-semibold py-2 px-4 rounded-lg"
        >
          &larr; Back to Home
        </button>
      </div>
    </div>
  );
};