import React, { useState, useEffect, useRef } from 'react';
import type { ServerTemplate } from '../types.ts';
import { AnimatedSection } from './AnimatedSection.tsx';
import { generateIcon } from '../services/geminiService.ts';

interface GalleryPageProps {
  templates: ServerTemplate[];
  onSelectTemplate: (template: ServerTemplate) => void;
  isLoading: boolean;
}

type IconStatus = 'pristine' | 'loading' | 'loaded' | 'error';

interface GalleryListItemProps {
    template: ServerTemplate;
    onSelect: (template: ServerTemplate) => void;
}

const GalleryListItem: React.FC<GalleryListItemProps> = ({ template, onSelect }) => {
    const [iconUrl, setIconUrl] = useState<string | null>(template.iconUrl || null);
    const [iconStatus, setIconStatus] = useState<IconStatus>(template.iconUrl ? 'pristine' : 'loading');
    const generationAttempted = useRef(false);

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
            <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                 <button 
                    onClick={handleSelect}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out btn-interactive-red"
                >
                    Use Template
                </button>
            </div>
        </div>
    );
};


export const GalleryPage: React.FC<GalleryPageProps> = ({ templates, onSelectTemplate, isLoading }) => {
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 border-4 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-semibold gradient-text">Loading Gallery...</p>
        </div>
    );
  }

  if (templates.length === 0) {
    return (
         <div className="text-center p-8">
            <h3 className="text-2xl font-bold text-white">Gallery is Empty</h3>
            <p className="text-slate-400 mt-2">No templates have been published yet. Be the first!</p>
        </div>
    );
  }

  return (
    <section className="fade-in max-w-4xl mx-auto">
      <div className="space-y-4">
        {templates.map((template, index) => (
          <AnimatedSection key={template.id || template.serverName} delay={`${index * 100}ms`} animationClass="unfold-animate">
            <GalleryListItem
              template={template}
              onSelect={onSelectTemplate}
            />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};