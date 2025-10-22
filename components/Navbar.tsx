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
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M20.34,0.22 C21.69,0.66 22.47,1.55 22.47,2.94 L22.47,18.33 C22.47,19.74 21.41,20.82 20.0,21.13 L16.48,17.61 C17.0,17.37 17.38,17.03 17.65,16.61 C17.92,16.19 18.06,15.67 18.06,15.06 L18.06,13.95 C18.06,11.91 16.71,10.88 14.89,10.88 L12.87,10.88 C11.53,10.88 10.54,11.55 10.03,12.55 L9.44,9.01 L12.82,6.96 L10.12,5.28 L6.11,7.29 L5.09,13.24 L1.71,11.91 L1.71,8.83 C1.81,7.89 2.78,6.81 4.12,6.39 L5.84,0.67 C7.19,0.23 8.52,0.67 9.52,1.67 L10.53,2.67 L15.24,0.13 L20.34,0.22 Z M8.93,11.3 C8.75,11.3 8.63,11.41 8.63,11.59 L8.63,11.76 C8.63,11.94 8.75,12.05 8.93,12.05 L9.1,12.05 C9.28,12.05 9.4,11.94 9.4,11.76 L9.4,11.59 C9.4,11.41 9.28,11.3 9.1,11.3 L8.93,11.3 Z M15.17,11.3 C14.99,11.3 14.87,11.41 14.87,11.59 L14.87,11.76 C14.87,11.94 14.99,12.05 15.17,12.05 L15.34,12.05 C15.52,12.05 15.64,11.94 15.64,11.76 L15.64,11.59 C15.64,11.41 15.52,11.3 15.34,11.3 L15.17,11.3 Z M12.05,15.06 C10.71,15.06 9.6,16.14 9.6,17.5 C9.6,18.86 10.71,19.94 12.05,19.94 C13.39,19.94 14.5,18.86 14.5,17.5 C14.5,16.14 13.39,15.06 12.05,15.06 Z" />
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
                className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-red-500"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
            >
                <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-8 h-8 rounded-full" />
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