import React from 'react';
import type { Section } from '../types.ts';

const AiToolkitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const BotSetupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1.5 1.5 0 00-1.5 1.5V5.5a.5.5 0 001 0V4h1V2.5A1.5 1.5 0 0010 2zM3.5 6A1.5 1.5 0 002 7.5v5A1.5 1.5 0 003.5 14h13a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 0016.5 6h-13zM6 9.5a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0zM6 16a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const sections: { id: Section; label: string; icon: React.ReactElement }[] = [
  {
    id: 'Channels',
    label: 'Channels',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
  },
  {
    id: 'Roles',
    label: 'Roles',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
  },
  {
    id: 'Utilities',
    label: 'AI Toolkit',
    icon: <AiToolkitIcon />
  },
  {
    id: 'Bots',
    label: 'Bot Setup',
    icon: <BotSetupIcon />
  },
  {
    id: 'Tutorial',
    label: 'Tutorial',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>
  }
];

interface SideNavProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isToolkitMode?: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({ activeSection, onSectionChange, isToolkitMode }) => {
  const availableSections = isToolkitMode
    ? sections.filter(s => s.id === 'Utilities')
    : sections;

  return (
    <nav className="bg-gray-900/50 border border-slate-700 rounded-xl p-2">
      <ul className="space-y-1">
        {availableSections.map(({ id, label, icon }) => (
          <li key={id} className="w-full">
            <button
              onClick={() => onSectionChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeSection === id
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md btn-interactive-red'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};