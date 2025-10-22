import React, { useState } from 'react';

const Illustration1: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900/50 rounded-xl border border-slate-700 shadow-lg p-4 font-mono text-lg text-slate-300 relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="whitespace-pre-wrap">
                <span className="text-red-400/80">&gt;</span> A cozy server for 
                <br />  book lovers who enjoy
                <br />  fantasy novels...
                <span className="inline-block w-2.5 h-5 bg-slate-300 ml-1 animate-pulse" style={{ animationDuration: '1.2s' }}></span>
            </p>
             <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-red-500/10 rounded-full blur-2xl"></div>
        </div>
    </div>
);

const Illustration2: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900/50 rounded-xl border border-slate-700 shadow-lg p-6 relative overflow-hidden transform-gpu scale-90">
            <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:radial-gradient(circle,rgba(255,255,255,0.3)_10%,transparent_80%)]"></div>
            <div className="relative text-center">
                <h3 className="text-xl font-bold text-white tracking-wider">SERVER BLUEPRINT</h3>
                <p className="text-xs text-slate-400 uppercase">Project: Space Exploration Hub</p>

                <div className="mt-6 flex justify-around items-start text-left gap-4">
                    {/* Category 1 */}
                    <div className="flex-1 space-y-2 animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <div className="bg-slate-800 border border-slate-600 rounded p-2">
                            <p className="text-sm font-bold text-red-400">🚀 Mission Control</p>
                        </div>
                        <div className="pl-4 border-l-2 border-dashed border-slate-600 space-y-2">
                            <div className="bg-slate-800/70 p-2 rounded text-xs text-slate-300"># announcements</div>
                            <div className="bg-slate-800/70 p-2 rounded text-xs text-slate-300"># mission-log</div>
                        </div>
                    </div>
                    {/* Category 2 */}
                    <div className="flex-1 space-y-2 animate-fade-in" style={{animationDelay: '0.4s'}}>
                        <div className="bg-slate-800 border border-slate-600 rounded p-2">
                            <p className="text-sm font-bold text-red-400">🛰️ The Observatory</p>
                        </div>
                        <div className="pl-4 border-l-2 border-dashed border-slate-600 space-y-2">
                            <div className="bg-slate-800/70 p-2 rounded text-xs text-slate-300"># star-gazing</div>
                            <div className="bg-slate-800/70 p-2 rounded text-xs text-slate-300"># deep-space-images</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Illustration3: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900/50 rounded-xl border border-slate-700 shadow-lg p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,rgba(255,255,255,0),#fff)]"></div>
            <div className="relative">
                <h4 className="font-bold text-white mb-4 text-lg">Setup Checklist</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-green-700/50 rounded-lg">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="text-slate-300 line-through">Create roles & permissions</span>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-green-700/50 rounded-lg">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="text-slate-300 line-through">Build channel structure</span>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full border-2 border-red-500 animate-pulse"></div>
                        <span className="text-white font-medium">Launch Server!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const steps = [
    {
        number: "1",
        title: "Describe Your Vision",
        description: "Start with a simple idea. Tell the AI what your dream community is about, whether it's for a gaming squad, a study group, or a fan club. Your words are the starting point.",
        Illustration: Illustration1,
    },
    {
        number: "2",
        title: "Generate the Blueprint",
        description: "With one click, the AI architect designs a complete server template. It crafts theme-specific channels, a full hierarchy of roles with permissions, and even suggests a creative name.",
        Illustration: Illustration2,
    },
    {
        number: "3",
        title: "Build & Launch",
        description: "Use our personalized, step-by-step tutorial to quickly replicate the template in Discord. Launch your fully-featured server in minutes, not hours.",
        Illustration: Illustration3,
    },
];

export const HowItWorks: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-200 mb-4">
                From Idea to Server in <span className="gradient-text">3 Easy Steps</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-12">
                Our AI-driven process makes server creation intuitive, fast, and fun.
            </p>

            <div className="max-w-4xl mx-auto">
                {/* Step Selector */}
                <div className="flex justify-center">
                    <div className="inline-flex relative">
                        <div className="absolute top-6 left-14 right-14 h-0.5 bg-slate-800 -z-10">
                            <div 
                                className="h-full bg-gradient-to-r from-red-600 to-red-800 transition-transform duration-500 origin-left"
                                style={{ transform: `scaleX(${activeStep / (steps.length - 1)})` }}
                            />
                        </div>
                        <div className="flex justify-center items-start gap-4 md:gap-12 p-1">
                            {steps.map((step, index) => {
                                const isCurrent = activeStep === index;
                                const isCompleted = activeStep > index;
                                return (
                                <div key={step.number} className="flex flex-col items-center gap-3 relative z-10 w-28 text-center">
                                    <button
                                        onClick={() => setActiveStep(index)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-red-500 ${
                                            isCurrent
                                                ? 'bg-red-600 border-red-500 text-white scale-110 shadow-lg shadow-red-900/50'
                                                : isCompleted
                                                    ? 'bg-red-600 border-red-500 text-white'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-red-500'
                                        }`}
                                    >
                                        {`0${step.number}`}
                                    </button>
                                    <p className={`text-sm font-bold transition-opacity duration-300 ${activeStep >= index ? 'text-white' : 'text-slate-500'}`}>{step.title}</p>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                {/* Content Display */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[20rem]">
                    {/* Left: Illustration */}
                    <div className="relative h-80">
                        {steps.map((step, index) => (
                             <div 
                                key={index} 
                                className={`absolute inset-0 transition-all duration-500 ease-in-out flex items-center justify-center ${activeStep === index ? 'opacity-100 transform-none' : 'opacity-0 transform-gpu scale-95'}`}
                            >
                                <step.Illustration />
                            </div>
                        ))}
                    </div>

                    {/* Right: Description */}
                    <div className="text-center md:text-left">
                        <div key={activeStep} className="animate-fade-in">
                            <p className="text-slate-400 text-base leading-relaxed">
                                {steps[activeStep].description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};