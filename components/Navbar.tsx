

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient.ts';
import type { Session } from '@supabase/supabase-js';


interface NavbarProps {
  session: Session | null;
  onGoHome: () => void;
  onShowToolkit: () => void;
  onNavigate: (sectionId: string) => void;
  onShowGallery: () => void;
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
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.037c.178.614.488 1.465.772 2.428a13.828 13.828 0 0 0-1.562 3.614.054.054 0 0 0 .007.054c.09.15.223.338.373.524a.05.05 0 0 0 .068.028c1.11-.369 2.14-1.107 2.757-1.728a.05.05 0 0 1 .054-.02c.422.253.882.478 1.37.683a.05.05 0 0 0 .065-.03c.007-.014.01-.028.014-.043a12.828 12.828 0 0 0 .63-.778.05.05 0 0 1 .04-.028c.118.061.237.122.353.184a.05.05 0 0 0 .054.003c.615-.478 1.23-1.043 1.788-1.743a.05.05 0 0 1 .054.018c.125.127.277.297.443.492a.05.05 0 0 0 .068-.028c.13-.178.26-.356.373-.524a.05.05 0 0 0 .007-.054 13.848 13.848 0 0 0-1.562-3.614c.284-.963.593-1.814.772-2.428a.04.04 0 0 0-.021-.037zM8.02 10.152c-.576 0-1.043-.516-1.043-1.144 0-.628.467-1.144 1.043-1.144.576 0 1.043.516 1.043 1.144 0 .628-.467 1.144-1.043 1.144zm3.64-1.144c0 .628-.467 1.144-1.043 1.144-.576 0-1.043-.516-1.043-1.144 0-.628.467-1.144 1.043-1.144.576 0 1.043.516 1.043 1.144z"/>
    </svg>
);


export const Navbar: React.FC<NavbarProps> = ({ session, onGoHome, onShowToolkit, onNavigate, onShowGallery }) => {
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

  const userMenu = user ? (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-red-500"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
            >
                <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-8 h-8 rounded-full" />
                {user.user_metadata.avatar_decoration && (
                    <img 
                        src={`https://cdn.discordapp.com/avatar-decorations/${user.user_metadata.provider_id}/${user.user_metadata.avatar_decoration}.png?size=160`}
                        alt="Avatar Decoration"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none"
                    />
                )}
            </button>
            {isDropdownOpen && (
                <div className="user-dropdown absolute top-full right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-20">
                    <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-sm font-semibold text-white truncate">{user.user_metadata.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-red-600/50 hover:text-white transition-colors">Logout</button>
                </div>
            )}
        </div>
    ) : (
        <button onClick={handleLogin} className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 btn-interactive-red text-sm flex items-center gap-2">
            <DiscordIcon className="w-5 h-5" />
            <span>Login with Discord</span>
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
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-lg font-bold text-red-400 hover:gradient-text">Logout</button>
                </div>
              ) : (
                <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-6 py-3 rounded-full shadow-md text-lg flex items-center gap-3">
                    <DiscordIcon className="w-6 h-6" />
                    <span>Login with Discord</span>
                </button>
              )}
            </div>
        </div>
      </div>
    </>
  );
};