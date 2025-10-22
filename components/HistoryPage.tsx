import React from 'react';
import type { ServerTemplate } from '../types.ts';
import { AnimatedSection } from './AnimatedSection.tsx';

interface HistoryPageProps {
  history: ServerTemplate[];
  isLoading: boolean;
  onSelectTemplate: (template: ServerTemplate) => void;
  onStartBuilding: () => void;
}

const HistoryListItem: React.FC<{ template: ServerTemplate; onSelect: (template: ServerTemplate) => void }> = ({ template, onSelect }) => {
    const iconUrl = template.iconUrl;

    return (
        <div className="card-shine bg-[rgba(20,20,22,0.6)] rounded-2xl border border-zinc-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 overflow-hidden flex flex-col sm:flex-row items-center p-4 gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white/10 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                {iconUrl ? (
                    <img 
                        src={iconUrl} 
                        alt={`${template.serverName} icon`} 
                        className="w-full h-full rounded-2xl object-cover"
                    />
                ) : (
                     <div className="text-3xl font-bold text-white">{template.serverName.charAt(0).toUpperCase()}</div>
                )}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white">{template.serverName}</h3>
                <p className="mt-1 text-slate-400 text-base">{template.tagline || 'No description provided.'}</p>
            </div>
            <div className="flex-shrink-0 mt-3 sm:mt-0">
                <button 
                    onClick={() => onSelect(template)}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out"
                >
                    View Template
                </button>
            </div>
        </div>
    );
};

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);


export const HistoryPage: React.FC<HistoryPageProps> = ({ history, isLoading, onSelectTemplate, onStartBuilding }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 min-h-[40vh]">
                <div className="w-16 h-16 relative mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-xl font-semibold gradient-text">Loading Your Creations...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center min-h-[40vh] flex flex-col items-center justify-center p-6 bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-xl">
                <h4 className="text-2xl font-bold text-white">No Creations Yet</h4>
                <p className="text-slate-400 max-w-md mx-auto my-3">You haven't generated any server templates. Go to the homepage to start building your first one!</p>
                <button 
                    onClick={onStartBuilding}
                    className="mt-6 flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed btn-interactive-red"
                >
                    <PlusIcon />
                    <span>Build Your First Server</span>
                </button>
            </div>
        );
    }

    return (
        <section className="fade-in max-w-4xl mx-auto">
             <div className="space-y-4">
                {history.map((template, index) => (
                    <AnimatedSection key={template.id || `${template.serverName}-${index}`} delay={`${index * 100}ms`} animationClass="unfold-animate">
                        <HistoryListItem
                            template={template}
                            onSelect={onSelectTemplate}
                        />
                    </AnimatedSection>
                ))}
            </div>
        </section>
    );
};