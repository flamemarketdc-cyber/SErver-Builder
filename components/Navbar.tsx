import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onGoHome: () => void;
  onShowToolkit: () => void;
  onShowGallery: () => void;
  onNavigate: (sectionId: string) => void;
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

export const Navbar: React.FC<NavbarProps> = ({ onGoHome, onShowToolkit, onShowGallery, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScrollEvent);
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
        window.removeEventListener('scroll', handleScrollEvent);
        document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => onNavigate(id), 100);
  };
  
  const handleMobileClick = (handler: () => void) => {
    setIsMobileMenuOpen(false);
    handler();
  }

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
              <button onClick={onShowGallery} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">Gallery</button>
              <button onClick={onShowToolkit} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">AI Toolkit</button>
              <button onClick={() => onNavigate('howitworks')} className="font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm">How It Works</button>
            </div>
            <a href="https://discord.gg/flamegw" target="_blank" rel="noopener noreferrer" className="hidden md:flex flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-3 py-2 rounded-full shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 btn-interactive-red text-sm">Join Discord</a>
            <div className="md:hidden z-10">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Toggle navigation menu">
                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 pt-24 text-center">
            <ul className="flex flex-col items-center gap-6">
              <li><button onClick={() => handleMobileLinkClick('features')} className="text-2xl font-bold text-slate-200 hover:gradient-text">Features</button></li>
              <li><button onClick={() => handleMobileClick(onShowGallery)} className="text-2xl font-bold text-slate-200 hover:gradient-text">Gallery</button></li>
              <li><button onClick={() => handleMobileClick(onShowToolkit)} className="text-2xl font-bold text-slate-200 hover:gradient-text">AI Toolkit</button></li>
              <li><button onClick={() => handleMobileLinkClick('howitworks')} className="text-2xl font-bold text-slate-200 hover:gradient-text">How It Works</button></li>
              <li className="pt-4"><a href="https://discord.gg/flamegw" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-6 py-3 rounded-full shadow-md text-lg">Join Discord</a></li>
            </ul>
        </div>
      </div>
    </>
  );
};