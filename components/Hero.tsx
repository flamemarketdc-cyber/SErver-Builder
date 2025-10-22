import React from 'react';
import { AnimatedSection } from './AnimatedSection.tsx';

// Icons for the server template examples
const GamingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4m-2 -2v4" />
        <line x1="15" y1="11" x2="15" y2="11.01" />
        <line x1="18" y1="13" x2="18" y2="13.01" />
    </svg>
);

const StudyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const GiveawayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <line x1="12" y1="8" x2="12" y2="21" />
      <path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
    </svg>
);

const ChillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
      <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
      <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
    </svg>
);

const TechIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const examples = [
  {
    icon: <GamingIcon />,
    title: 'Gaming Community',
    description: 'A hub for gamers to connect, find teammates for multiplayer, and discuss their favorite titles.',
    prompt: 'A server for a gaming community',
  },
  {
    icon: <StudyIcon />,
    title: 'Studying',
    description: 'Create a focused environment for students to collaborate, share resources, and help each other succeed.',
    prompt: 'A study group server for university students',
  },
  {
    icon: <GiveawayIcon />,
    title: 'Giveaway Servers',
    description: 'Host and manage giveaways with ease. A perfect template for communities centered around prizes and events.',
    prompt: 'A server for giveaways (gw)',
  },
  {
    icon: <ChillIcon />,
    title: 'Chill Community',
    description: 'A relaxed, friendly space for people to hang out, chat about their day, and make new friends.',
    prompt: 'A chill community server for making friends',
  },
  {
    icon: <TechIcon />,
    title: 'Tech',
    description: 'A place for developers, designers, and tech enthusiasts to discuss trends, share projects, and learn together.',
    prompt: 'A tech server for developers and programmers',
  },
];

interface ExampleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isGiveaway?: boolean;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ icon, title, description, onClick, isGiveaway = false }) => (
  <button
    onClick={onClick}
    className={`card-shine bg-[rgba(20,20,22,0.4)] p-6 rounded-2xl border border-zinc-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-300 h-full text-left flex flex-col ${isGiveaway ? 'justify-between' : ''} hover:border-red-500/50`}
  >
    <div className="text-slate-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-700 w-min">
        {icon}
    </div>
    <div>
      <h3 className={`${isGiveaway ? '' : 'mt-4'} text-xl font-bold text-white`}>{title}</h3>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  </button>
);

interface HeroProps {
  onExampleClick: (prompt: string) => void;
  onShowGallery: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExampleClick, onShowGallery }) => {
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold text-slate-200 mb-4">
        Feeling Lost? Let's <span className="italic">Spark Some <span className="gradient-text">Inspiration.</span></span>
      </h2>
      <p className="text-slate-400 max-w-xl mx-auto mb-12">
        Kickstart your server with one of our proven templates, or browse the community gallery for more ideas.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 max-w-6xl mx-auto">
        <AnimatedSection className="lg:col-start-1 lg:row-start-1" animationClass="unfold-animate">
          <ExampleCard {...examples[0]} onClick={() => onExampleClick(examples[0].prompt)} />
        </AnimatedSection>
        <AnimatedSection className="lg:col-start-1 lg:row-start-2" delay="100ms" animationClass="unfold-animate">
          <ExampleCard {...examples[1]} onClick={() => onExampleClick(examples[1].prompt)} />
        </AnimatedSection>
        <AnimatedSection className="md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-2" delay="200ms" animationClass="unfold-animate">
          <ExampleCard {...examples[2]} isGiveaway={true} onClick={() => onExampleClick(examples[2].prompt)} />
        </AnimatedSection>
        <AnimatedSection className="lg:col-start-3 lg:row-start-1" delay="300ms" animationClass="unfold-animate">
          <ExampleCard {...examples[3]} onClick={() => onExampleClick(examples[3].prompt)} />
        </AnimatedSection>
        <AnimatedSection className="lg:col-start-3 lg:row-start-2" delay="400ms" animationClass="unfold-animate">
          <ExampleCard {...examples[4]} onClick={() => onExampleClick(examples[4].prompt)} />
        </AnimatedSection>
      </div>
    </section>
  );
};