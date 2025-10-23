

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient.ts';
import type { Session } from '@supabase/supabase-js';
import type { ServerTemplate } from '../types.ts';

interface NavbarProps {
  session: Session | null;
  onGoHome: () => void;
  onShowToolkit: () => void;
  onNavigate: (sectionId: string) => void;
  onShowGallery: () => void;
  onShowHistory: () => void;
}

const Logo = () => (
    <img 
        src="https://i.postimg.cc/L6KKKmrF/Vibrant-Flame-on-Black-Background-removebg-preview.png" 
        alt="Flaming Logo" 
        className="h-8 w-8 transition-transform duration-300 hover:scale-110" 
    />
);

const HamburgerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 245 245">
        <path d="M208.2,36.2C188.4,26.5,167,19,144.3,13.9C143.4,15.1,142.4,16.3,141.4,17.5C125.1,15.1,108.8,15.1,92.6,17.5C91.6,16.3,90.6,15.1,89.7,13.9C67,19,45.6,26.5,25.8,36.2C2,58.8-4.3,80.7,1.8,102.1C18.2,120.3,34,136.3,49.5,150.3C52.1,147.2,54.6,144,57,140.7C52.1,136.4,47.5,131.8,43.3,127C43,126.7,42.7,126.3,42.4,126C27.9,112.5,16.8,97.4,10.2,81.2C11.3,80.5,12.4,79.8,13.5,79.1C21.4,85.3,29.9,91,39.1,96C39.4,96.2,39.7,96.4,40,96.6C46.3,99.7,52.9,102.5,59.8,104.9C66.8,107.4,74.1,109.5,81.6,111.3C89.2,113,97,114.5,104.9,115.6C112.8,116.7,120.8,117.5,128.8,117.8C128.8,117.8,128.9,117.8,128.9,117.8C142.9,117.8,156.9,116.1,170.1,112.6C183.1,109.2,195.3,103.8,206.5,96.6C206.8,96.4,207.1,96.2,207.4,96C216.6,91,225.1,85.3,233,79.1C234.1,79.8,235.2,80.5,236.3,81.2C229.7,97.4,218.6,112.5,204.1,126C203.8,126.3,203.5,126.7,203.2,127C199,131.8,194.4,136.4,189.5,140.7C191.9,144,194.4,147.2,197,150.3C212.5,136.3,228.3,120.3,244.7,102.1C250.8,80.7,244.5,58.8,208.2,36.2ZM81.5,92.5C74.9,92.5,69.5,87.1,69.5,80.5C69.5,73.9,74.9,68.5,81.5,68.5C88.1,68.5,93.5,73.9,93.5,80.5C93.5,87.1,88.1,92.5,81.5,92.5ZM165,92.5C158.4,92.5,153,87.1,153,80.5C153,73.9,158.4,68.5,165,68.5C171.6,68.5,177,73.9,177,80.5C177,87.1,171.6,92.5,165,92.5Z"/>
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const HistoryIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
   </svg>
);


export const Navbar: React.FC<NavbarProps> = (props) => {
  const { session, onGoHome, onShowToolkit, onNavigate, onShowGallery, onShowHistory } = props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const user = session?.user;

  const handleLogin = async () => {
      await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
              scopes: 'identify email guilds.join',
          },
      });
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScrollEvent = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScrollEvent);
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
        window.removeEventListener('scroll', handleScrollEvent);
        document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleMobileLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => onNavigate(id), 100);
  };
  
  const handleMobileClick = (handler: () => void) => {
    setIsMobileMenuOpen(false);
    handler();
  }

  const getAvatarDecorationUrl = (metadata: any): string | null => {
    if (!metadata) return null;
    const userId = metadata.provider_id;
    if (!userId) return null;

    // Check for new object format (snake_case and camelCase)
    const decorationData = metadata.avatar_decoration_data || metadata.avatarDecorationData;
    if (decorationData && decorationData.asset) {
        return `https://cdn.discordapp.com/avatar-decorations/${userId}/${decorationData.asset}.png?size=160`;
    }
    
    // Check for old string format (snake_case and camelCase)
    const decorationHash = metadata.avatar_decoration || metadata.avatarDecoration;
    if (typeof decorationHash === 'string' && decorationHash) {
        return `https://cdn.discordapp.com/avatar-decorations/${userId}/${decorationHash}.png?size=160`;
    }

    return null;
  };

  const userMenu = user ? (
        <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-red-500"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-9 h-9 rounded-full" />
                    {(() => {
                        const decorationUrl = getAvatarDecorationUrl(user.user_metadata);
                        if (decorationUrl) {
                            return (
                                <img 
                                    src={decorationUrl}
                                    alt="Avatar Decoration"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none"
                                />
                            );
                        }
                        return null;
                    })()}
                </button>
                {isDropdownOpen && (
                    <div className="user-dropdown absolute top-full right-0 mt-3 w-72 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/50 rounded-xl shadow-2xl z-20 overflow-hidden">
                        <div className="p-4 border-b border-zinc-700/50">
                            <p className="font-semibold text-white truncate">{user.user_metadata.full_name}</p>
                            <p className="text-sm text-zinc-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                            <button onClick={() => { onShowHistory(); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-3 text-sm rounded-md text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors">
                                <HistoryIcon />
                                <span>My Creations</span>
                            </button>
                        </div>
                        <div className="p-2 border-t border-zinc-700/50">
                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 flex items-center gap-3 text-sm rounded-md text-zinc-300 hover:bg-red-900/50 hover:text-red-300 transition-colors">
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <button onClick={handleLogin} className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 btn-interactive-red text-sm flex items-center gap-2">
            <DiscordIcon className="w-5 h-5" />
            <span>Login</span>
        </button>
    );

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="container mx-auto px-4">
          <div className={`mx-auto flex justify-between items-center transition-all duration-500 ease-in-out ${isScrolled ? 'max-w-4xl bg-black/20 backdrop-blur-lg border border-slate-700/60 rounded-2xl px-4 py-2 shadow-2xl shadow-black/30' : 'max-w-5xl bg-transparent border-transparent px-0 py-1'}`}>
            <button onClick={onGoHome} className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full z-10">
              <Logo />
              <span className="font-bold text-base text-white">Flaming</span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => onNavigate('features')} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">Features</button>
              <button onClick={onShowToolkit} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">AI Toolkit</button>
              <button onClick={onShowGallery} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">Gallery</button>
              <button onClick={() => onNavigate('howitworks')} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">How It Works</button>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {userMenu}
            </div>
            <div className="md:hidden z-10">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Toggle navigation menu">
                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 pt-24 flex flex-col h-full">
            <ul className="flex flex-col items-center gap-6">
              <li><button onClick={() => handleMobileLinkClick('features')} className="text-2xl font-bold text-slate-200 hover:gradient-text">Features</button></li>
              <li><button onClick={() => handleMobileClick(onShowToolkit)} className="text-2xl font-bold text-slate-200 hover:gradient-text">AI Toolkit</button></li>
              <li><button onClick={() => handleMobileClick(onShowGallery)} className="text-2xl font-bold text-slate-200 hover:gradient-text">Gallery</button></li>
              <li><button onClick={() => handleMobileLinkClick('howitworks')} className="text-2xl font-bold text-slate-200 hover:gradient-text">How It Works</button></li>
            </ul>
            <div className="mt-auto mb-12 text-center">
              {user ? (
                <div className="flex flex-col items-center gap-4">
                    <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-16 h-16 rounded-full border-2 border-slate-600" />
                    <span className="text-xl text-white">{user.user_metadata.full_name}</span>
                    <button onClick={() => { handleMobileClick(onShowHistory); }} className="text-xl font-bold text-slate-200 hover:gradient-text mt-4">My Creations</button>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-lg font-bold text-red-400 hover:gradient-text mt-4">Logout</button>
                </div>
              ) : (
                <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-6 py-3 rounded-full shadow-md text-lg flex items-center gap-3">
                    <DiscordIcon className="w-6 h-6" />
                    <span>Login</span>
                </button>
              )}
            </div>
        </div>
      </div>
    </>
  );
};