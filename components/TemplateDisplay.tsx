import React, { useState, useEffect } from 'react';
import type { ServerTemplate, Role, TutorialStep, BotRecommendation, Section } from '../types.ts';
import { SideNav } from './SideNav.tsx';
import { CollapsibleSection } from './CollapsibleSection.tsx';
import { DiscordPreview } from './DiscordPreview.tsx';
import { AiToolkitPanes } from './AiToolkitPanes.tsx';

interface TemplateDisplayProps {
  template: ServerTemplate;
  iconBase64: string | null;
  isIconLoading: boolean;
  isTutorialLoading: boolean;
  iconError: string | null;
  isWelcomeMessageLoading: boolean;
  onGenerateWelcomeMessage: () => void;
  isRulesLoading: boolean;
  onGenerateRules: () => void;
  isAnnouncementLoading: boolean;
  onGenerateAnnouncement: () => void;
  isEmbedLoading: boolean;
  onGenerateEmbed: (prompt: string) => void;
  onClearEmbed: () => void;
  isBotsLoading: boolean;
  onGenerateBots: () => void;
  originalPrompt: string;
  isToolkitMode?: boolean;
  onGoHome?: () => void;
  onRegenerateTemplate: () => void;
  onPublishToGallery: (template: ServerTemplate) => Promise<void>;
  initialSection?: Section;
}

const TemplateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const PreviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const RegenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" />
    </svg>
);

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const LetterIcon: React.FC<{ name: string }> = ({ name }) => (
    <div className="w-full h-full flex items-center justify-center bg-slate-700">
        <span className="text-5xl font-bold text-white">{name.charAt(0).toUpperCase()}</span>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <div className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out ${enabled ? 'bg-red-600' : 'bg-slate-600'}`}>
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </div>
);

const RoleCard: React.FC<{ role: Role }> = ({ role }) => {
    const [isColorCopied, setIsColorCopied] = useState(false);

    const handleCopyColor = () => {
        if (!role.color) return;
        navigator.clipboard.writeText(role.color);
        setIsColorCopied(true);
        setTimeout(() => setIsColorCopied(false), 2000);
    };

    return (
        <div 
            className="p-4 border border-slate-700 bg-slate-900/50 rounded-lg mb-2 role-card-glow"
            style={{ '--role-glow-color': role.color } as React.CSSProperties}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                     <div className="relative group w-16 h-16 rounded-lg bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: role.color }}></div>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl" style={{ color: role.color }}>{role.name}</h4>
                        <div className="group/copy relative flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-slate-400">{role.color}</span>
                            <button onClick={handleCopyColor} className="opacity-0 group-hover/copy:opacity-100 transition-opacity focus:opacity-100" aria-label="Copy color code">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <span className={`absolute bottom-full left-0 mb-1 whitespace-nowrap px-2 py-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-md transition-opacity pointer-events-none ${isColorCopied ? 'opacity-100' : 'opacity-0'}`}>
                                Copied!
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 border-t border-slate-700/50 sm:border-none pt-4 sm:pt-0">
                    <span className="font-semibold text-slate-300 text-sm">Display separately</span>
                    <ToggleSwitch enabled={role.hoist} />
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
            {role.permissions.slice(0, 7).map((p, i) => (
                <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">{p}</span>
            ))}
            {role.permissions.length > 7 && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">+{role.permissions.length - 7} more...</span>}
            </div>
        </div>
    );
};

const ChannelItem: React.FC<{ name: string; type: 'text' | 'voice' }> = ({ name, type }) => (
    <div className="flex items-center gap-2 text-slate-300 py-1 hover:bg-slate-700/50 rounded px-2 -mx-2 transition-colors duration-200">
        {type === 'text' ? <span className="text-slate-500 font-bold text-xl">#</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>}
        <span>{name}</span>
    </div>
);

export const formatDescription = (text: string): string => {
    if (!text) return '';
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-red-400/90">$1</strong>');
    processedText = processedText.replace(/`(.*?)`/g, '<code class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md text-sm font-mono">$1</code>');

    const lines = processedText.split('\n');
    let htmlParts: string[] = [];
    let listStack: 'ul'[] = [];

    const closeLists = (targetLevel: number) => {
        while (listStack.length > targetLevel) {
            htmlParts.push(`</${listStack.pop()}>`);
        }
    };

    for (const line of lines) {
        const trimmedLine = line.trim();
        const indentLevel = line.match(/^\s*/)?.[0].length / 2 || 0;

        if (trimmedLine.startsWith('* ')) {
            closeLists(indentLevel);
            if (listStack.length < indentLevel + 1) {
                htmlParts.push(`<ul class="list-disc list-inside space-y-1 mt-2 pl-4">`);
                listStack.push('ul');
            }
            htmlParts.push(`<li>${trimmedLine.substring(2)}</li>`);
        } else {
            closeLists(0);
            if (trimmedLine) {
                htmlParts.push(`<p class="mt-2">${trimmedLine}</p>`);
            }
        }
    }
    
    closeLists(0);
    
    return `<div class="description-content">${htmlParts.join('')}</div>`;
};


const TutorialChecklist: React.FC<{ steps: TutorialStep[] }> = ({ steps }) => {
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(() => Array(steps.length).fill(false));

  const handleToggle = (index: number) => {
    setCheckedSteps(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };
  
  const completedCount = checkedSteps.filter(Boolean).length;
  const totalCount = steps.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-semibold text-white">Progress</span>
          <span className="font-semibold text-slate-400">{progressPercentage}% Complete</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-700 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={index} 
            onClick={() => handleToggle(index)}
            className={`
              p-4 border rounded-xl transition-all duration-300 cursor-pointer group
              ${checkedSteps[index] 
                ? 'bg-green-950/30 border-green-700/50' 
                : 'bg-slate-800/60 border-slate-700 hover:border-red-600/50 hover:bg-slate-800'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${checkedSteps[index] 
                  ? 'bg-green-500 border-green-400' 
                  : 'border-slate-500 group-hover:border-red-500'
                }`}
              >
                {checkedSteps[index] && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className={`font-bold text-lg transition-colors duration-300 ${checkedSteps[index] ? 'text-green-300 line-through' : 'text-white'}`}>
                  {step.title}
                </h4>
                 <div 
                    className={`
                        text-sm mt-1 transition-colors duration-300
                        ${checkedSteps[index] ? 'text-green-500' : 'text-slate-400'}
                    `}
                    dangerouslySetInnerHTML={{ __html: formatDescription(step.description) }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {progressPercentage === 100 && (
        <div className="mt-6 text-center p-4 bg-green-950/50 border border-green-700/60 rounded-xl fade-in">
            <h4 className="text-xl font-bold text-green-300">🎉 Congratulations! 🎉</h4>
            <p className="text-green-400 mt-1">Your server template is ready. You're set to launch!</p>
        </div>
      )}
    </div>
  );
};

const BotPurposeIcon: React.FC<{ purpose: string }> = ({ purpose }) => {
    const shieldIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056v-5.555a12.02 12.02 0 00-3.382-8.457z" /></svg>;
    const musicIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;
    const gameIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const toolIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const defaultIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343l-1.414-1.414m12.728 12.728l-1.414-1.414M6.343 17.657l-1.414 1.414" /></svg>;

    const purposeMap: { [key: string]: { icon: React.ReactNode; color: string } } = {
        'Moderation': { icon: shieldIcon, color: 'text-blue-400' },
        'Music': { icon: musicIcon, color: 'text-green-400' },
        'Engagement': { icon: gameIcon, color: 'text-yellow-400' },
        'Fun & Engagement': { icon: gameIcon, color: 'text-yellow-400' },
        'Utility': { icon: toolIcon, color: 'text-purple-400' },
        'Management': { icon: toolIcon, color: 'text-purple-400' },
    };

    const style = purposeMap[purpose] || { icon: defaultIcon, color: 'text-slate-400' };

    return (
        <div className={`p-2 bg-slate-800 border border-slate-700 rounded-lg ${style.color}`}>
            {style.icon}
        </div>
    );
};

const BotCard: React.FC<{ bot: BotRecommendation }> = ({ bot }) => {
    const purposeMap: { [key: string]: { color: string } } = {
        'Moderation': { color: 'text-blue-400' }, 'Music': { color: 'text-green-400' },
        'Engagement': { color: 'text-yellow-400' }, 'Fun & Engagement': { color: 'text-yellow-400' },
        'Utility': { color: 'text-purple-400' }, 'Management': { color: 'text-purple-400' },
    };
    const style = purposeMap[bot.purpose] || { color: 'text-slate-400' };
    
    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 flex flex-col h-full card-shine">
            <div className="flex items-center gap-4 mb-4">
                <BotPurposeIcon purpose={bot.purpose} />
                <div>
                    <h4 className="font-bold text-xl text-white">{bot.name}</h4>
                    <span className={`text-sm font-semibold ${style.color}`}>{bot.purpose}</span>
                </div>
            </div>
            <p className="text-slate-400 text-sm mb-4 flex-grow">{bot.description}</p>
            
            <div className="mb-5">
                <h5 className="text-xs font-bold uppercase text-slate-500 mb-2">Getting Started</h5>
                <ul className="space-y-2 text-sm text-slate-300">
                    {bot.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                           <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <a href={bot.inviteLink} target="_blank" rel="noopener noreferrer" className="mt-auto w-full text-center bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out btn-interactive-red">
                Add Bot to Server
            </a>
        </div>
    );
};


const BotRecommendationsDisplay: React.FC<{ template: ServerTemplate; isLoading: boolean; onGenerate: () => void; }> = ({ template, isLoading, onGenerate }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[350px]">
                <div className="w-8 h-8 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-3 font-semibold text-lg gradient-text">Finding the best bots...</p>
            </div>
        );
    }

    if (template.botRecommendations && template.botRecommendations.length > 0) {
        return (
             <div className="fade-in">
                <h3 className="text-2xl font-bold gradient-text mb-2">Bot Recommendations</h3>
                <p className="text-slate-400 mb-6">Here are some top-tier bots tailored for your server, complete with quick setup guides.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {template.botRecommendations.map(bot => <BotCard key={bot.name} bot={bot} />)}
                </div>
            </div>
        );
    }
    
    return (
        <div className="text-center min-h-[350px] flex flex-col items-center justify-center p-6 bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-xl">
            <h4 className="text-lg font-bold text-white">Find the Perfect Bots</h4>
            <p className="text-slate-400 max-w-md mx-auto my-2">Let AI recommend the best bots for moderation, music, games, and more, tailored to your server's theme.</p>
            <button 
                onClick={onGenerate} 
                disabled={isLoading}
                className="mt-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed btn-interactive-red"
            >
                Get Bot Recommendations
            </button>
        </div>
    );
};

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string; className?: string; disabled?: boolean; }> = ({ onClick, children, label, className = '', disabled=false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`group relative flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={label}
    >
        {children}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-md transition-opacity pointer-events-none opacity-0 group-hover:opacity-100">
            {label}
        </span>
    </button>
);


export const TemplateDisplay: React.FC<TemplateDisplayProps> = (props) => {
  const { template, iconBase64, isIconLoading, isTutorialLoading, iconError, isToolkitMode, onGoHome, onRegenerateTemplate, onPublishToGallery, initialSection } = props;
  const [activeSection, setActiveSection] = useState<Section>(isToolkitMode ? 'Utilities' : 'Channels');
  const [copiedServerName, setCopiedServerName] = useState<boolean>(false);
  const [copiedVanityUrl, setCopiedVanityUrl] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'template' | 'preview'>('template');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handleDownloadAsset = (base64: string | null, filename: string) => {
    if (!base64) return;
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
        await onPublishToGallery(template);
        setIsPublished(true);
    } catch (error) {
        console.error("Publishing failed:", error);
    } finally {
        setIsPublishing(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Channels':
        return (
          <div className="fade-in space-y-4">
            <h3 className="text-2xl font-bold gradient-text mb-2">Channels & Categories</h3>
            <p className="text-slate-400 mb-6">A blueprint for your server's layout. Click each category to expand and see the channels inside.</p>
            {template.categories.map(category => (
                <CollapsibleSection title={category.name} key={category.name}>
                    <div className="pl-4 border-l-2 border-slate-700 space-y-1">
                        {category.channels.map(channel => <ChannelItem key={channel.name} name={channel.name} type={channel.type} />)}
                    </div>
                </CollapsibleSection>
            ))}
             {template.isStreaming && template.categories.length === 0 && (
                <div className="space-y-4">
                    <div className="w-full h-16 bg-slate-800 rounded-xl animate-pulse"></div>
                    <div className="w-full h-16 bg-slate-800 rounded-xl animate-pulse" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-full h-16 bg-slate-800 rounded-xl animate-pulse" style={{ animationDelay: '200ms' }}></div>
                </div>
            )}
          </div>
        );
      case 'Roles': {
        return (
          <div className="fade-in space-y-4">
            <h3 className="text-2xl font-bold gradient-text mb-2">Roles & Hierarchy</h3>
            <p className="text-slate-400 mb-6">A complete set of roles, ordered from highest to lowest hierarchy, with their recommended colors and permissions.</p>
            {template.roles.map(role => (
                <RoleCard 
                    key={role.name} 
                    role={role}
                />
            ))}
            {template.isStreaming && template.roles.length === 0 && (
                <div className="space-y-2">
                    <div className="w-full h-28 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="w-full h-28 bg-slate-800 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }}></div>
                </div>
            )}
          </div>
        );
      }
      case 'Utilities':
        return (
          <AiToolkitPanes
            template={props.template}
            onGenerateWelcomeMessage={props.onGenerateWelcomeMessage}
            isWelcomeMessageLoading={props.isWelcomeMessageLoading}
            onGenerateRules={props.onGenerateRules}
            isRulesLoading={props.isRulesLoading}
            onGenerateAnnouncement={props.onGenerateAnnouncement}
            isAnnouncementLoading={props.isAnnouncementLoading}
            isEmbedLoading={props.isEmbedLoading}
            onGenerateEmbed={props.onGenerateEmbed}
            onClearEmbed={props.onClearEmbed}
            initialTab={'welcome'}
          />
        );
       case 'Bots':
        return (
          <BotRecommendationsDisplay
            template={props.template}
            isLoading={props.isBotsLoading}
            onGenerate={props.onGenerateBots}
          />
        );
      case 'Tutorial':
        return (
           <div className="fade-in">
            <h3 className="text-2xl font-bold gradient-text mb-4">Step-by-Step Setup Tutorial</h3>
            <p className="text-slate-400 mb-6">Your personalized guide to bringing this server template to life on Discord. Check off tasks as you complete them!</p>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 min-h-[200px] flex flex-col justify-center">
                {isTutorialLoading ? (
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-3 text-slate-300">Generating your custom tutorial...</p>
                    </div>
                ) : template.setupTutorial && template.setupTutorial.length > 0 ? (
                    <TutorialChecklist steps={template.setupTutorial} />
                ) : (
                    <p className="text-slate-400 text-center">Tutorial not available.</p>
                )}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
        {!isToolkitMode && (
          <>
            <div className="bg-black/20 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="relative group flex-shrink-0">
                    <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden shadow-lg">
                        {isIconLoading || (template.isStreaming && !iconBase64) ? (
                            <div className="w-8 h-8 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        ) : iconBase64 ? (
                            <img src={iconBase64} alt="Generated Server Icon" className="w-full h-full object-cover" />
                        ) : iconError ? (
                            <LetterIcon name={template.serverName} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    {iconBase64 && !isIconLoading && !iconError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDownloadAsset(iconBase64, 'server-icon.jpeg')} className="text-white font-bold text-sm bg-slate-800/80 px-4 py-2 rounded-lg hover:bg-slate-700">Download</button>
                      </div>
                    )}
                </div>

                <div className="flex-grow text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white truncate">{template.serverName}</h2>
                        <button onClick={() => { navigator.clipboard.writeText(template.serverName); setCopiedServerName(true); setTimeout(() => setCopiedServerName(false), 2000); }} className="group relative flex-shrink-0">
                            <CopyIcon />
                            <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-md transition-opacity pointer-events-none opacity-0 group-hover:opacity-100 ${copiedServerName ? '!opacity-100' : ''}`}>{copiedServerName ? 'Copied!' : `Copy Name`}</span>
                        </button>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(template.vanityUrlSuggestion); setCopiedVanityUrl(true); setTimeout(() => setCopiedVanityUrl(false), 2000); }} className="group relative inline-flex items-center gap-2 bg-slate-800 text-slate-300 text-sm font-mono px-3 py-1.5 rounded-full border border-slate-700 hover:border-red-600 transition-all duration-200">
                        <LinkIcon />
                        <span>{template.vanityUrlSuggestion}</span>
                        <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-md transition-opacity pointer-events-none opacity-0 group-hover:opacity-100 ${copiedVanityUrl ? '!opacity-100' : ''}`}>{copiedVanityUrl ? 'Copied!' : `discord.gg/${template.vanityUrlSuggestion}`}</span>
                    </button>
                    {iconError && !iconBase64 && (
                        <p className="text-red-400 text-xs text-center sm:text-left mt-2 animate-pulse">{iconError}</p>
                    )}
                </div>
                
                 <div className="md:ml-auto flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                    {!template.id && (
                        <ActionButton
                            onClick={handlePublish}
                            disabled={isPublishing || isPublished}
                            label={isPublished ? "Published!" : isPublishing ? "Publishing..." : "Publish to Gallery"}
                            className="bg-sky-800/70 text-sky-300 hover:bg-sky-700 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span className="hidden sm:inline">{isPublished ? "Published!" : isPublishing ? "Publishing..." : "Publish"}</span>
                        </ActionButton>
                    )}
                    <ActionButton
                        onClick={onRegenerateTemplate}
                        label="Regenerate template"
                        className="bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                        <RegenerateIcon />
                        <span className="hidden sm:inline">Regenerate</span>
                    </ActionButton>
                    {onGoHome && (
                        <ActionButton
                            onClick={onGoHome}
                            label="Build a New Server"
                            className="bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700 shadow-md btn-interactive-red"
                        >
                            <PlusIcon />
                            <span className="hidden sm:inline">New</span>
                        </ActionButton>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-center items-center gap-4">
              <div className="bg-slate-900/50 border border-slate-700 rounded-full p-1.5 flex gap-2 shadow-lg backdrop-blur-sm">
                  <button
                      onClick={() => setViewMode('template')}
                      className={`flex items-center gap-2 px-5 py-2 font-bold rounded-full transition-colors duration-300 text-sm ${viewMode === 'template' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                      <TemplateIcon />
                      <span>Template</span>
                  </button>
                  <button
                      onClick={() => setViewMode('preview')}
                      className={`flex items-center gap-2 px-5 py-2 font-bold rounded-full transition-colors duration-300 text-sm ${viewMode === 'preview' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                      <PreviewIcon />
                      <span>Preview</span>
                  </button>
              </div>
            </div>
          </>
        )}


        {/* Main Content: Template or Preview */}
        {viewMode === 'template' || isToolkitMode ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10">
              {!isToolkitMode && (
                <aside className="md:col-span-4 xl:col-span-3">
                    <SideNav activeSection={activeSection} onSectionChange={setActiveSection} isToolkitMode={isToolkitMode}/>
                </aside>
              )}
              <main className={`${isToolkitMode ? 'md:col-span-12' : 'md:col-span-8 xl:col-span-9'} min-h-[500px] bg-gray-900/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm`}>
                {renderContent()}
              </main>
          </div>
        ) : (
          <div className="mt-10">
            <DiscordPreview template={template} iconBase64={iconBase64} />
          </div>
        )}
    </div>
  );
};