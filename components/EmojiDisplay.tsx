import React from 'react';
import type { ServerTemplate, ServerEmoji } from '../types.ts';

interface EmojiDisplayProps {
  template: ServerTemplate;
  onGenerateSingleEmoji: (index: number) => void;
  isToolkitMode?: boolean;
  onRegenerate?: () => void;
}

const handleDownloadAsset = (base64: string | null, filename: string) => {
    if (!base64) return;
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const EmojiCard: React.FC<{ emoji: ServerEmoji; onGenerate: () => void }> = ({ emoji, onGenerate }) => {
    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left card-shine">
            <div className="w-20 h-20 rounded-full shadow-lg border-2 border-white/10 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                {emoji.isLoading ? (
                    <div className="w-6 h-6 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                ) : emoji.imageUrl ? (
                    <img src={emoji.imageUrl} alt={emoji.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                )}
            </div>
            <div className="flex-grow">
                <p className="font-mono text-lg text-white bg-slate-800 px-2 py-1 rounded-md inline-block">{`:${emoji.name}:`}</p>
                <p className="text-sm text-slate-400 mt-2">{emoji.description}</p>
            </div>
            <div className="flex-shrink-0 mt-3 sm:mt-0">
                {emoji.imageUrl && !emoji.isLoading ? (
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => handleDownloadAsset(emoji.imageUrl || null, `${emoji.name}.jpeg`)}
                            className="text-sm bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                        >
                            Download
                        </button>
                        <button 
                            onClick={onGenerate}
                            className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold p-2 rounded-lg transition-colors"
                            aria-label="Regenerate emoji"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={onGenerate}
                        disabled={emoji.isLoading}
                        className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed btn-interactive-red"
                    >
                       {emoji.isLoading ? 'Generating...' : 'Generate Image'}
                    </button>
                )}
            </div>
        </div>
    );
};


export const EmojiDisplay: React.FC<EmojiDisplayProps> = ({ template, onGenerateSingleEmoji, isToolkitMode, onRegenerate }) => {
    return (
        <div className="fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                <div>
                    <h3 className="text-2xl font-bold gradient-text mb-2">Emoji Ideas</h3>
                    <p className="text-slate-400">Here are some AI-generated emoji ideas for your server. Click "Generate Image" to bring them to life!</p>
                </div>
                {isToolkitMode && onRegenerate && (
                     <button 
                        onClick={onRegenerate}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm btn-interactive-slate flex-shrink-0"
                        aria-label="Regenerate emoji ideas"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" />
                        </svg>
                        <span>Regenerate Ideas</span>
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {(template.emojis || []).map((emoji, index) => (
                    <EmojiCard 
                        key={`${emoji.name}-${index}`}
                        emoji={emoji}
                        onGenerate={() => onGenerateSingleEmoji(index)}
                    />
                ))}
                {template.isStreaming && (!template.emojis || template.emojis.length === 0) && (
                    <div className="space-y-4">
                        <div className="w-full h-28 bg-slate-800 rounded-xl animate-pulse"></div>
                        <div className="w-full h-28 bg-slate-800 rounded-xl animate-pulse" style={{ animationDelay: '100ms' }}></div>
                        <div className="w-full h-28 bg-slate-800 rounded-xl animate-pulse" style={{ animationDelay: '200ms' }}></div>
                    </div>
                )}
            </div>
        </div>
    );
};
