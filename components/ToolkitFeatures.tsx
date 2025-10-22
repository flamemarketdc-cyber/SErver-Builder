import React, { useState, useMemo } from 'react';
import { AnimatedSection } from './AnimatedSection.tsx';

// --- ICONS ---
const BlueprintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const RolesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const ChannelsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);
const BotsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const HandWavingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
);
const ShieldExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);
const CodeBracketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
);
const SpeakerWaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const LightBulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);
const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

// --- DATA & PREVIEWS ---
const serverBuilderFeatures = [
    {
        id: 'sb-0', Icon: LightBulbIcon, title: 'Server Name & Icon',
        description: 'Get a creative server name, vanity URL, and a detailed AI prompt to generate the perfect server icon instantly.',
        preview: (
            <div className="bg-zinc-900/50 backdrop-blur-sm p-5 rounded-xl border border-zinc-700 font-sans text-sm text-left shadow-lg card-shine">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                        <img src="https://i.postimg.cc/QtFGsCXb/Vibrant-Flame-on-Black-Background.png" alt="Server Icon Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-white truncate">Flaming</h2>
                        <div className="group relative inline-flex items-center gap-2 bg-slate-800 text-slate-300 text-xs font-mono px-2.5 py-1 rounded-full mt-2 border border-slate-700">
                            <LinkIcon />
                            <span className="truncate">flamegw</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'sb-3', Icon: ChannelsIcon, title: 'Structured Channels',
        description: 'Receive a logical channel structure grouped into categories, ensuring conversations stay organized and easy to navigate.',
        preview: (
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 font-sans text-sm text-left">
                <p className="font-bold uppercase text-zinc-400 text-xs">🌟 : WELCOME</p>
                <div className="mt-1 space-y-1 pl-2">
                    <p className="text-zinc-300">👋 ・ welcome</p>
                    <p className="text-zinc-300">📜 ・ rules</p>
                    <p className="text-zinc-300">📢 ・ announcements</p>
                </div>
                <p className="font-bold uppercase text-zinc-400 text-xs mt-3">💬 : COMMUNITY</p>
                <div className="mt-1 space-y-1 pl-2">
                    <p className="text-white bg-zinc-700/50 rounded px-2 py-0.5">💬 ・ general-chat</p>
                    <p className="text-zinc-300">🖼️ ・ media-and-memes</p>
                    <p className="text-zinc-300">🤖 ・ bot-commands</p>
                </div>
                 <p className="font-bold uppercase text-zinc-400 text-xs mt-3">🔊 : VOICE CHANNELS</p>
                <div className="mt-1 space-y-1 pl-2">
                    <p className="text-zinc-300">🔊 ・ The Lounge</p>
                    <p className="text-zinc-300">🎧 ・ Music Zone</p>
                    <p className="text-zinc-300">🎮 ・ Gaming</p>
                </div>
            </div>
        )
    },
    {
        id: 'sb-2', Icon: RolesIcon, title: 'Comprehensive Roles',
        description: 'Get a full hierarchy of roles, from admins to members, each with pre-configured permissions tailored to your community.',
        preview: (
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 font-sans text-sm space-y-2 text-left">
                 <div className="p-2 bg-zinc-900/50 rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#f1c40f'}}></div>
                        <span className="font-semibold text-sm" style={{color: '#f1c40f'}}>Admin</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 pl-5">Administrator, Manage Server...</p>
                </div>
                <div className="p-2 bg-zinc-900/50 rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#3498db'}}></div>
                        <span className="font-semibold text-sm" style={{color: '#3498db'}}>Moderator</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 pl-5">Kick/Ban Members, Manage Messages...</p>
                </div>
                 <div className="p-2 bg-zinc-900/50 rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#e91e63'}}></div>
                        <span className="font-semibold text-sm" style={{color: '#e91e63'}}>VIP</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 pl-5">Priority Speaker, Change Nickname...</p>
                </div>
                 <div className="p-2 bg-zinc-900/50 rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#95a5a6'}}></div>
                        <span className="font-semibold text-sm" style={{color: '#95a5a6'}}>Member</span>
                    </div>
                     <p className="text-xs text-zinc-400 mt-1 pl-5">Read Messages, Send Messages...</p>
                </div>
            </div>
        )
    },
    {
        id: 'tk-5', Icon: BotsIcon, title: 'Bot Recommendations',
        description: 'Get AI-powered suggestions for the best bots to enhance your server, complete with setup guides.',
        preview: (
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 font-sans text-left space-y-3">
                <div className="flex items-center gap-3">
                    <img alt="Apollo Bot" className="w-10 h-10 rounded-full bg-zinc-700" src="https://images-ext-1.discordapp.net/external/E5nEz3LOFV8-MGbrtE2QxPWd0-KLKCFE9DukQA3bg94/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/824119071556763668/a_53c5cfd5b697f1a1b3e57afbd7314d75.gif?width=338&height=338" />
                    <div>
                        <p className="font-semibold text-white">Apollo</p>
                        <p className="text-xs text-zinc-400">Events, Scheduling...</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <img alt="Invite Tracker Bot" className="w-10 h-10 rounded-full bg-zinc-700" src="https://images-ext-1.discordapp.net/external/o-sDwi1dV3LfezwpXQxsHDLI27lFaKA6NFs9fmHiGTg/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/720351927581278219/7ac935300e9bc3edcbc2de1b91c597b1.png?format=webp&quality=lossless&width=842&height=842" />
                    <div>
                        <p className="font-semibold text-white">Invite Tracker</p>
                        <p className="text-xs text-zinc-400">Invite Tracking...</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <img alt="Arcane Bot" className="w-10 h-10 rounded-full bg-zinc-700" src="https://images-ext-1.discordapp.net/external/FXn3B2MEp-QqDZ7JHY1SfMedPjmQprK5etcxHKDCOfw/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/437808476106784770/def5e0a7ff07e73d477a87df10a3dc4f.png?format=webp&quality=lossless&width=338&height=338" />
                    <div>
                        <p className="font-semibold text-white">Arcane</p>
                        <p className="text-xs text-zinc-400">Leveling, Moderation...</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'sb-1', Icon: BlueprintIcon, title: 'Guided Setup',
        description: 'Describe your server idea, and the AI will generate a complete template and a step-by-step tutorial to help you build it.',
        preview: (
            <div className="bg-zinc-900/50 backdrop-blur-sm p-5 rounded-xl border border-zinc-700 font-sans text-sm text-left shadow-lg card-shine">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">Setup Checklist</h3>
                        <p className="text-zinc-400 text-xs">Your personalized guide</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/60 rounded-lg">
                        <div className="w-5 h-5 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="text-zinc-300">Create roles & permissions</span>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-zinc-800/60 rounded-lg">
                        <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-red-500 animate-pulse"></div>
                        <span className="text-white font-medium">Build channel structure</span>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-zinc-800/60 rounded-lg opacity-60">
                        <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-zinc-500"></div>
                        <span className="text-zinc-400">Configure server settings</span>
                    </div>
                </div>
            </div>
        )
    },
];

const aiToolkitFeatures = [
    {
        id: 'tk-1', Icon: HandWavingIcon, title: 'Welcome Messages',
        description: 'Automate a warm, engaging message to greet new members and guide them, making a great first impression every time.',
        preview: (
            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 font-sans text-left">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white flex-shrink-0">A</div>
                    <div>
                        <p className="font-semibold text-white">ArtBot <span className="text-xs text-zinc-400 font-normal ml-2">Today at 1:37 PM</span></p>
                        <div className="text-zinc-300 text-sm space-y-2 mt-1">
                          <p>Hey <span className="bg-blue-900/50 text-blue-300 p-0.5 rounded">@NewUser</span>, welcome to the Artist's Corner! 👋</p>
                          <p>We're thrilled to have you here. This is a place to share, learn, and grow as an artist.</p>
                          <p className="text-xs font-semibold">To get started:</p>
                          <ol className="list-decimal list-inside text-xs space-y-1 pl-2">
                            <li>Grab your medium roles in <span className="bg-zinc-700 p-0.5 rounded">#roles</span></li>
                            <li>Introduce yourself in <span className="bg-zinc-700 p-0.5 rounded">#introductions</span></li>
                            <li>Check out the contest in <span className="bg-zinc-700 p-0.5 rounded">#events</span>!</li>
                          </ol>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'tk-2', Icon: ShieldExclamationIcon, title: 'Server Rules',
        description: 'Instantly generate a clear and concise set of rules to keep your community safe, positive, and on-topic.',
        preview: (
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 font-sans text-left">
                <h3 className="font-bold text-white text-lg mb-2">📜 Community Guidelines</h3>
                <ul className="space-y-2 text-zinc-300 text-sm pl-2">
                    <li><strong className="font-semibold text-red-400">1. Be Respectful:</strong> Treat all members with kindness. No harassment or hate speech.</li>
                    <li><strong className="font-semibold text-red-400">2. No Spamming:</strong> Avoid excessive messages or self-promotion outside designated channels.</li>
                    <li><strong className="font-semibold text-red-400">3. Stay On Topic:</strong> Keep conversations in their respective channels to maintain organization.</li>
                    <li><strong className="font-semibold text-red-400">4. No NSFW Content:</strong> Keep all shared content safe for work and all ages.</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'tk-3', Icon: CodeBracketIcon, title: 'Embed Generator',
        description: 'Design beautiful, professional-looking embed messages without the hassle. Perfect for updates, events, or important info.',
        preview: (
            <div>
                <div className="bg-zinc-800 rounded-lg border border-zinc-700 font-sans flex p-4 gap-4">
                    <div className="w-1 h-auto rounded-full flex-shrink-0 bg-red-500"></div>
                    <div className="text-sm w-full text-left flex flex-col">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white text-base">Discord Server Builder</h3>
                                    <p className="text-zinc-300 mt-1 text-xs">Generate custom embeds for your server in seconds with our powerful AI Toolkit. Perfect for announcements, rules, and more!</p>
                                    <div className="mt-3">
                                        <p className="font-bold text-red-400 text-xs uppercase">FEATURES</p>
                                        <p className="text-zinc-300 text-xs">&bull; AI-Powered Generation<br/>&bull; Live Previews<br/>&bull; Easy JSON Export</p>
                                    </div>
                                </div>
                                <img className="w-14 h-14 rounded-lg object-cover ml-2 flex-shrink-0" src="https://i.postimg.cc/L6KKKmrF/Vibrant-Flame-on-Black-Background-removebg-preview.png" alt="thumbnail" />
                            </div>
                        </div>
                         <div className="mt-4 pt-2 flex items-center gap-2">
                             <img className="w-5 h-5 rounded-full" src="https://i.postimg.cc/L6KKKmrF/Vibrant-Flame-on-Black-Background-removebg-preview.png" alt="footer icon" />
                             <p className="text-xs text-zinc-400">Flaming Server Builder</p>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex">
                    <button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors w-auto">
                        <span>🚀</span>
                        <span>Get Started</span>
                    </button>
                </div>
            </div>
        ),
    }
];


interface ToolkitFeaturesProps {
  onShowToolkit: () => void;
}

export const ToolkitFeatures: React.FC<ToolkitFeaturesProps> = ({ onShowToolkit }) => {
    const [activeTab, setActiveTab] = useState<'builder' | 'toolkit'>('builder');
    const [hoveredFeatureId, setHoveredFeatureId] = useState(serverBuilderFeatures[0].id);
    const [openMobileFeatureId, setOpenMobileFeatureId] = useState<string | null>(serverBuilderFeatures[0].id);

    const activeFeatures = activeTab === 'builder' ? serverBuilderFeatures : aiToolkitFeatures;
    
    const hoveredFeature = useMemo(() => 
        [...serverBuilderFeatures, ...aiToolkitFeatures].find(f => f.id === hoveredFeatureId)!,
        [hoveredFeatureId]
    );
    
    // Set default hovered feature when tab changes
    const handleTabChange = (tab: 'builder' | 'toolkit') => {
        setActiveTab(tab);
        const newDefaultId = tab === 'builder' ? serverBuilderFeatures[0].id : aiToolkitFeatures[0].id;
        setHoveredFeatureId(newDefaultId);
        setOpenMobileFeatureId(newDefaultId);
    };

    return (
        <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-200 mb-4">
                One Platform, <span className="gradient-text">Endless Possibilities</span>
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto mb-12">
                Whether you're starting from scratch or managing an existing community, our AI-powered tools are here to help.
            </p>
            
            <div className="flex justify-center mb-8">
                <div className="bg-slate-900/50 border border-slate-700 rounded-full p-1.5 flex items-center gap-2 shadow-lg backdrop-blur-sm">
                    <div className="relative group">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap text-sm font-light text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-white"
                            aria-label="Start Building a Server"
                        >
                            Start Building &rarr;
                        </button>
                        <button
                            onClick={() => handleTabChange('builder')}
                            className={`px-6 py-2.5 font-bold rounded-full transition-all duration-300 text-sm md:text-base ${activeTab === 'builder' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            Server Builder
                        </button>
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => handleTabChange('toolkit')}
                            className={`px-6 py-2.5 font-bold rounded-full transition-all duration-300 text-sm md:text-base ${activeTab === 'toolkit' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            AI Toolkit
                        </button>
                        <button
                            onClick={onShowToolkit}
                            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap text-sm font-light text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-white"
                            aria-label="Open AI Toolkit"
                        >
                             &larr; Open Toolkit
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:grid max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[400px]">
                {/* Left: Feature List */}
                <AnimatedSection className="space-y-2 text-left">
                    {activeFeatures.map(feature => (
                        <button
                            key={feature.id}
                            onMouseEnter={() => setHoveredFeatureId(feature.id)}
                            className={`w-full p-4 rounded-xl border transition-all duration-200 ${hoveredFeatureId === feature.id ? 'bg-slate-800/50 border-slate-600 scale-105' : 'border-transparent hover:bg-slate-800/30'}`}
                        >
                           <div className="flex items-start gap-4">
                               <div className={`flex-shrink-0 p-3 rounded-lg bg-slate-900/50 border border-slate-700 transition-colors ${hoveredFeatureId === feature.id ? 'text-red-400' : 'text-slate-500'}`}>
                                   <feature.Icon />
                               </div>
                               <div>
                                   <h4 className="font-bold text-lg text-white">{feature.title}</h4>
                                   <p className="text-slate-400 text-sm">{feature.description}</p>
                               </div>
                           </div>
                        </button>
                    ))}
                </AnimatedSection>

                {/* Right: Preview Pane */}
                <AnimatedSection className="relative h-64 lg:h-full w-full min-h-[300px]" delay="200ms">
                     <div key={hoveredFeature.id} className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-sm transform transition-transform duration-300 hover:scale-105">
                          {hoveredFeature.preview}
                        </div>
                    </div>
                </AnimatedSection>
            </div>
            
            {/* Mobile Accordion View */}
            <div className="block lg:hidden max-w-6xl mx-auto space-y-4">
              {activeFeatures.map((feature, index) => {
                const isOpen = openMobileFeatureId === feature.id;
                return (
                  <AnimatedSection key={feature.id} delay={`${index * 100}ms`}>
                      <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50 transition-all duration-300">
                        <button
                          onClick={() => setOpenMobileFeatureId(isOpen ? null : feature.id)}
                          className="w-full p-4"
                        >
                          <div className="flex items-start gap-4 text-left">
                            <div className={`flex-shrink-0 p-3 rounded-lg bg-slate-900/50 border border-slate-700 transition-colors ${isOpen ? 'text-red-400' : 'text-slate-500'}`}>
                              <feature.Icon />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-white">{feature.title}</h4>
                              <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 ml-auto flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ transitionProperty: 'max-height, opacity, padding' }}>
                            <div className="p-4 pt-0">
                                {feature.preview}
                            </div>
                        </div>
                      </div>
                  </AnimatedSection>
                )
              })}
            </div>
        </section>
    );
};