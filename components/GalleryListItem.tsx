import React, { useState, useEffect, useRef } from 'react';
import type { ServerTemplate } from '../types.ts';
import { generateIcon } from '../services/geminiService.ts';

interface GalleryListItemProps {
    template: ServerTemplate;
    onSelect: (template: ServerTemplate) => void;
    votes: { likes: number; dislikes: number };
    onVote: (templateId: string, newVote: 'like' | 'dislike' | null, oldVote: 'like' | 'dislike' | null) => void;
}

const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
    </svg>
);

const ThumbsDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.642a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.438 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.2-2.4A4 4 0 0014 9.667z" />
    </svg>
);


type IconStatus = 'pristine' | 'loading' | 'loaded' | 'error';


export const GalleryListItem: React.FC<GalleryListItemProps> = ({ template, onSelect, votes, onVote }) => {
    const [iconUrl, setIconUrl] = useState<string | null>(template.iconUrl || null);
    const [iconStatus, setIconStatus] = useState<IconStatus>(template.iconUrl ? 'pristine' : 'loading');
    const generationAttempted = useRef(false);
    const [voted, setVoted] = useState<'like' | 'dislike' | null>(null);

    useEffect(() => {
        if (!template.id) return;
        const currentVote = localStorage.getItem(`vote_${template.id}`);
        if (currentVote === 'like' || currentVote === 'dislike') {
            setVoted(currentVote);
        }
    }, [template.id]);

    useEffect(() => {
        if (iconStatus === 'loading' && !generationAttempted.current) {
            generationAttempted.current = true;
            generateIcon(template.serverIconPrompt)
                .then(base64Bytes => {
                    const newIcon = `data:image/jpeg;base64,${base64Bytes}`;
                    setIconUrl(newIcon);
                    setIconStatus('loaded');
                })
                .catch(err => {
                    console.error(`Fallback icon generation failed for ${template.serverName}:`, err);
                    setIconStatus('error');
                });
        }
    }, [iconStatus, template.serverIconPrompt, template.serverName]);

    const handleImageError = () => {
        if (iconStatus !== 'loading') {
            setIconStatus('loading');
        }
    };

    const handleSelect = () => {
        const finalIconUrl = (iconStatus === 'loaded' || iconStatus === 'pristine') ? iconUrl : undefined;
        onSelect({ ...template, iconUrl: finalIconUrl });
    };

    const handleVoteClick = (voteType: 'like' | 'dislike') => {
        if (!template.id) return;

        const oldVote = voted;
        // If the user clicks the same button again, un-vote. Otherwise, set the new vote.
        const newVote = oldVote === voteType ? null : voteType;

        // Propagate the vote change to the parent
        onVote(template.id, newVote, oldVote);

        // Update local state for immediate UI feedback
        setVoted(newVote);

        // Persist the vote in localStorage
        if (newVote) {
            localStorage.setItem(`vote_${template.id}`, newVote);
        } else {
            localStorage.removeItem(`vote_${template.id}`);
        }
    };

    return (
        <div className="card-shine bg-[rgba(20,20,22,0.6)] rounded-2xl border border-zinc-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 overflow-hidden flex flex-col sm:flex-row items-center p-4 gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white/10 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                {iconStatus === 'loading' && (
                    <div className="w-6 h-6 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                )}
                {(iconStatus === 'pristine' || iconStatus === 'loaded') && iconUrl && (
                    <img
                        src={iconUrl}
                        onError={handleImageError}
                        alt={`${template.serverName} icon`}
                        className="w-full h-full rounded-2xl object-cover"
                    />
                )}
                {iconStatus === 'error' && (
                     <div className="text-3xl font-bold text-white">{template.serverName.charAt(0).toUpperCase()}</div>
                )}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white">{template.serverName}</h3>
                <p className="mt-1 text-slate-400 text-base">{template.tagline}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 sm:mt-0">
                 <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1.5">
                    <button
                        onClick={() => handleVoteClick('like')}
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${voted === 'like' ? 'text-green-400' : 'text-slate-400 hover:text-green-400'}`}
                        aria-label="Like template"
                        aria-pressed={voted === 'like'}
                    >
                        <ThumbsUpIcon />
                        <span>{votes.likes ?? 0}</span>
                    </button>
                    <div className="w-px h-4 bg-slate-600"></div>
                     <button
                        onClick={() => handleVoteClick('dislike')}
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${voted === 'dislike' ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}
                        aria-label="Dislike template"
                        aria-pressed={voted === 'dislike'}
                    >
                        <ThumbsDownIcon />
                        <span>{votes.dislikes ?? 0}</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSelect}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out"
                    >
                        Use Template
                    </button>
                </div>
            </div>
        </div>
    );
};