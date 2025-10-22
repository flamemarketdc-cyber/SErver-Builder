
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ServerTemplate, TutorialStep, Section, ChatMessage, ChatAction, ChatSession } from './types.ts';
import { generateServerTemplateStream, generateIcon, generateSetupTutorial, generateWelcomeMessage, generateServerRules, generateFirstAnnouncement, generateEmbedMessage, generateBotRecommendations, startChatStream, generateChatTopic } from './services/geminiService.ts';
import { galleryTemplates as staticGalleryTemplates } from './gallery-templates.ts';
import { Header } from './components/Header.tsx';
import { PromptInput } from './components/PromptInput.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { TemplateDisplay } from './components/TemplateDisplay.tsx';
import { Footer } from './components/Footer.tsx';
import { ToolkitFeatures } from './components/ToolkitFeatures.tsx';
import { Hero } from './components/Hero.tsx';
import { ToolkitPrompt } from './components/ToolkitPrompt.tsx';
import { StarfieldBackground } from './components/StarfieldBackground.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { ChatbotFab } from './components/ChatbotFab.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { GalleryPage } from './components/GalleryPage.tsx';
import { supabase } from './supabaseClient.ts';
import type { Session } from '@supabase/supabase-js';

type AppView = 'home' | 'generating' | 'results' | 'toolkitPrompt' | 'toolkit' | 'serverBuilder' | 'gallery';

const defaultTemplateForToolkit: ServerTemplate = {
  serverName: 'AI Toolkit',
  vanityUrlSuggestion: 'ai-toolkit',
  serverIconPrompt: 'AI toolkit icon',
  roles: [],
  categories: [],
  serverSettings: { verificationLevel: 'Medium', explicitContentFilter: 'All Members', defaultNotifications: 'Mentions Only' },
};

const getViewFromHash = (hash: string): AppView => {
  switch (hash) {
    case '#/results':
      return 'results';
    case '#/toolkit':
      return 'toolkitPrompt';
    case '#/serverbuilder':
      return 'serverBuilder';
    case '#/gallery':
      return 'gallery';
    case '#/':
    case '#':
    case '':
    default:
      return 'home';
  }
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [serverTemplate, setServerTemplate] = useState<ServerTemplate | null>(null);
  const [iconBase64, setIconBase64] = useState<string | null>(null);
  const [error, setError] = useState<{ title: string; subtitle: string } | null>(null);
  const [iconError, setIconError] = useState<string | null>(null);
  const [loadingSubMessage, setLoadingSubMessage] = useState<string>('');
  const [view, setView] = useState<AppView>(() => getViewFromHash(window.location.hash));
  const [session, setSession] = useState<Session | null>(null);

  // Gallery and History State
  const [galleryTemplates, setGalleryTemplates] = useState<ServerTemplate[]>([]);

  // State for individual loading spinners
  const [isIconLoading, setIsIconLoading] = useState<boolean>(false);
  const [isTutorialLoading, setIsTutorialLoading] = useState<boolean>(false);
  const [isWelcomeMessageLoading, setIsWelcomeMessageLoading] = useState<boolean>(false);
  const [isRulesLoading, setIsRulesLoading] = useState<boolean>(false);
  const [isAnnouncementLoading, setIsAnnouncementLoading] = useState<boolean>(false);
  const [isEmbedLoading, setIsEmbedLoading] = useState<boolean>(false);
  const [isBotsLoading, setIsBotsLoading] = useState<boolean>(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [initialSectionForResults, setInitialSectionForResults] = useState<Section | undefined>(undefined);

  const generationCancelled = useRef(false);
  const iconGenerationInitiated = useRef(false);
  const isGenerating = useRef(false);
  const serverTemplateRef = useRef(serverTemplate);
  
  // Supabase Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Load chat history from localStorage on initial mount
  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('flaming-chat-sessions');
        if (storedHistory) {
            const sessions = JSON.parse(storedHistory) as ChatSession[];
            const fourDays = 4 * 24 * 60 * 60 * 1000;
            // Filter out old sessions
            const recentSessions = sessions.filter(s => (Date.now() - s.timestamp) < fourDays);
            setChatSessions(recentSessions);
        }
    } catch (e) {
        console.error("Could not load chat history:", e);
        localStorage.removeItem('flaming-chat-sessions');
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    const sessionsToSave = chatSessions.filter(session =>
        session.messages.some(m => m.sender === 'user')
    );

    if (sessionsToSave.length > 0) {
        localStorage.setItem('flaming-chat-sessions', JSON.stringify(sessionsToSave));
    } else {
        localStorage.removeItem('flaming-chat-sessions');
    }
  }, [chatSessions]);

  useEffect(() => {
    serverTemplateRef.current = serverTemplate;
  }, [serverTemplate]);
  
  const resetAllState = useCallback(() => {
    generationCancelled.current = true;
    iconGenerationInitiated.current = false;
    setServerTemplate(null);
    setError(null);
    setPrompt('');
    setIconBase64(null);
    setIconError(null);
    setLoadingSubMessage('');
    setIsIconLoading(false);
    setIsTutorialLoading(false);
    setIsWelcomeMessageLoading(false);
    setIsRulesLoading(false);
    setIsAnnouncementLoading(false);
    setIsEmbedLoading(false);
    setIsBotsLoading(false);
  }, []);


  const handleGoHome = useCallback(() => {
    const currentHash = window.location.hash;
    const isAtHome = currentHash === '' || currentHash === '#' || currentHash === '#/';
    if (!isAtHome) {
        window.location.hash = '#/';
    } else {
        resetAllState();
        setView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [resetAllState]);

  const handleSelectTemplate = useCallback((template: ServerTemplate) => {
    // Set template data first, so the hash change handler knows it exists
    setServerTemplate(template);
    setIconBase64(template.iconUrl || null);
    setPrompt(template.tagline || `A server about ${template.serverName}`);

    // Then, navigate. The hashchange listener will handle setting the view.
    window.location.hash = '#/results';
  }, []);

  // This effect runs ONLY ONCE on mount to handle initial state.
  useEffect(() => {
    const hash = window.location.hash;
    const initialView = getViewFromHash(hash);
    if (initialView === 'results' && !serverTemplateRef.current) {
      // If user directly lands on /results without a template in state, go home.
      handleGoHome();
    }
  }, [handleGoHome]);

  // This effect handles all navigation based on URL hash changes.
  useEffect(() => {
    const handleHashChange = () => {
      if (isGenerating.current) return;
      
      const hash = window.location.hash;
      const newView = getViewFromHash(hash);
      
      if (newView === 'results') {
          // If we navigate to the results view but there's no template in memory
          // (e.g., using browser back button to a stale URL), go home.
          if (!serverTemplateRef.current) {
              handleGoHome();
              return;
          }
      } else {
          // Reset state when navigating to any other page.
          if (!isGenerating.current) {
             resetAllState();
          }
      }
      setView(newView);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleGoHome, resetAllState]);


  useEffect(() => {
    if (view === 'gallery') {
        loadGallery();
    }
  }, [view]);
  
  const loadGallery = () => {
    const pixelCraftTemplate = staticGalleryTemplates.find(t => t.serverName === "PixelCraft");
    if (pixelCraftTemplate) {
        setGalleryTemplates([pixelCraftTemplate]);
    } else {
        console.error("PixelCraft template not found in static gallery templates.");
        setGalleryTemplates([]);
        setError({ title: 'Could not load gallery', subtitle: 'The requested template could not be found.' });
    }
  };


  useEffect(() => {
    if (initialSectionForResults) {
        const timer = setTimeout(() => setInitialSectionForResults(undefined), 500);
        return () => clearTimeout(timer);
    }
  }, [initialSectionForResults]);

  const handleSmoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNavigate = (path: string) => {
    const newHash = `#${path}`;
    if (window.location.hash !== newHash) {
        window.location.hash = newHash;
    } else {
        const newView = getViewFromHash(newHash);
        if (newView !== 'results') {
            resetAllState();
        }
        setView(newView);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleGenerateIcon = async (iconPrompt: string) => {
      if (generationCancelled.current) return;
      setIsIconLoading(true);
      setIconError(null);
      try {
          const fullPrompt = `A professional, vibrant, and clean vector art logo for a Discord server. The design should be modern, minimalist, and centered. The theme is: "${iconPrompt}". Avoid text. High resolution, suitable for a circular icon format.`;
          const base64Bytes = await generateIcon(fullPrompt);
          if (generationCancelled.current) return;
          const iconUrl = `data:image/jpeg;base64,${base64Bytes}`;
          setIconBase64(iconUrl);
          setServerTemplate(prev => prev ? { ...prev, iconUrl } : null);
          setIconError(null);
      } catch (err) {
          if (generationCancelled.current) return;
          console.error("Server icon generation failed", err);
          let message = "The AI is busy, so a default icon is shown.";
          const isQuotaError = err?.error?.status === 'RESOURCE_EXHAUSTED' || err?.error?.code === 429 || err?.message?.includes('quota') || err?.message?.includes('rate limit');

          if (isQuotaError) {
              message = "Image generation is rate-limited. Using a default icon.";
          }
          setIconError(message);
          setIconBase64(null);
      } finally {
          if (generationCancelled.current) return;
          setIsIconLoading(false);
      }
  };

  useEffect(() => {
    if (scrollToSection && view === 'home') {
      const timer = setTimeout(() => {
        handleSmoothScroll(scrollToSection);
        setScrollToSection(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection, view]);

  const startGeneration = async (generationPrompt: string) => {
    if (!generationPrompt.trim()) {
      setError({ title: 'An empty canvas...', subtitle: 'Please enter an idea to get started.' });
      return;
    }

    resetAllState();
    setPrompt(generationPrompt);
    generationCancelled.current = false;
    isGenerating.current = true;
    
    // Set view to generating without changing hash to prevent race conditions
    setView('generating');
    setLoadingSubMessage('Drafting server blueprints...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        let isFirstUpdate = true;
        let finalTemplate: ServerTemplate | null = null;
        await generateServerTemplateStream(generationPrompt, (updatedTemplate) => {
            if (generationCancelled.current) {
                throw new Error("STREAM_CANCELLED");
            }
            if (isFirstUpdate) {
                // Now that we have some data, switch to results view
                setView('results');
                isFirstUpdate = false;
            }
            finalTemplate = updatedTemplate;
            setServerTemplate(updatedTemplate);

            if (updatedTemplate.serverIconPrompt && !iconGenerationInitiated.current) {
                 iconGenerationInitiated.current = true;
                 handleGenerateIcon(updatedTemplate.serverIconPrompt);
            }
        });

        if (finalTemplate && !generationCancelled.current) {
            setIsTutorialLoading(true);
            generateSetupTutorial(generationPrompt, finalTemplate)
                .then(tutorial => {
                    if (generationCancelled.current) return;
                    setServerTemplate(prev => prev ? { ...prev, setupTutorial: tutorial } : null);
                })
                .catch(err => {
                    if (generationCancelled.current) return;
                    console.error("Tutorial generation failed", err);
                     const fallbackTutorial: TutorialStep[] = [{ title: "Tutorial Generation Failed", description: "We couldn't generate the interactive tutorial." }];
                    setServerTemplate(prev => prev ? { ...prev, setupTutorial: fallbackTutorial } : null);
                })
                .finally(() => {
                    if (generationCancelled.current) return;
                    setIsTutorialLoading(false);
                });
        }
    } catch (err) {
        if (err.message === "STREAM_CANCELLED") return;
        console.error("Error during stream generation:", err);

        // If we already have a partial template, stay on the results page and show an error there.
        if (serverTemplateRef.current && serverTemplateRef.current.serverName !== 'Generating...') {
            setError({ title: 'Generation Interrupted', subtitle: 'The AI stream stopped unexpectedly. You can use the partial template or try again.' });
            setServerTemplate(prev => prev ? { ...prev, isStreaming: false } : null); // Stop loading indicators
            setIsIconLoading(false);
            setIsTutorialLoading(false);
        } else {
            // If generation failed before we got anything, go back home.
            setError({ title: 'An unexpected error occurred.', subtitle: 'The AI might be busy. Please try again.' });
            setView('home');
            window.location.hash = '#/';
        }
    } finally {
        isGenerating.current = false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startGeneration(prompt);
  };

  const handleExampleClick = async (examplePrompt: string) => {
    setPrompt(examplePrompt);
    await startGeneration(examplePrompt);
  };

  const handleScrollNavigate = (sectionId: string) => {
    const currentHash = window.location.hash;
    const isAtHome = currentHash === '' || currentHash === '#' || currentHash === '#/';
    if (!isAtHome) {
        window.location.hash = '#/';
        setScrollToSection(sectionId);
    } else {
        handleSmoothScroll(sectionId);
    }
  };
  
  const handleShowToolkit = () => handleNavigate('/toolkit');

  const handleContinueToToolkit = (description: string) => {
    setView('toolkit');
    setPrompt(description);
  };

  const handleGenerateWelcomeMessage = async () => {
    const currentTemplate = serverTemplate || defaultTemplateForToolkit;
    setIsWelcomeMessageLoading(true);
    try {
        const message = await generateWelcomeMessage(currentTemplate, prompt || "a general community server");
        setServerTemplate(prev => prev ? { ...prev, welcomeMessage: message } : { ...defaultTemplateForToolkit, welcomeMessage: message });
    } catch (err) { console.error("Failed to generate welcome message", err); } 
    finally { setIsWelcomeMessageLoading(false); }
  };
  
  const handleGenerateRules = async () => {
    const currentTemplate = serverTemplate || defaultTemplateForToolkit;
    setIsRulesLoading(true);
    try {
        const rules = await generateServerRules(currentTemplate, prompt || "a general community server");
        setServerTemplate(prev => prev ? { ...prev, serverRules: rules } : { ...defaultTemplateForToolkit, serverRules: rules });
    } catch (err) { console.error("Failed to generate rules", err); } 
    finally { setIsRulesLoading(false); }
  };
  
  const handleGenerateAnnouncement = async () => {
    const currentTemplate = serverTemplate || defaultTemplateForToolkit;
    setIsAnnouncementLoading(true);
    try {
        const announcement = await generateFirstAnnouncement(currentTemplate, prompt || "a general community server");
        setServerTemplate(prev => prev ? { ...prev, firstAnnouncement: announcement } : { ...defaultTemplateForToolkit, firstAnnouncement: announcement });
    } catch (err) { console.error("Failed to generate announcement", err); } 
    finally { setIsAnnouncementLoading(false); }
  };

  const handleGenerateEmbed = async (embedPrompt: string) => {
    const currentTemplate = serverTemplate || defaultTemplateForToolkit;
    setIsEmbedLoading(true);
    try {
        const embedPayload = await generateEmbedMessage(embedPrompt, currentTemplate.serverName);
        setServerTemplate(prev => prev ? { ...prev, embedMessage: embedPayload } : { ...defaultTemplateForToolkit, embedMessage: embedPayload });
    } catch (err) { console.error("Failed to generate embed message", err); } 
    finally { setIsEmbedLoading(false); }
  };
  
  const handleGenerateBots = async () => {
    const currentTemplate = serverTemplate || defaultTemplateForToolkit;
    setIsBotsLoading(true);
    try {
        const bots = await generateBotRecommendations(currentTemplate, prompt || "a general community server");
        setServerTemplate(prev => prev ? { ...prev, botRecommendations: bots } : { ...defaultTemplateForToolkit, botRecommendations: bots });
    } catch (err) { console.error("Failed to generate bot recommendations", err); }
    finally { setIsBotsLoading(false); }
  };

  const handleClearEmbed = () => {
    const currentTemplate = serverTemplate || defaultTemplateForToolkit;
    setServerTemplate({ ...currentTemplate, embedMessage: undefined });
  };
  
  const handleRegenerateTemplate = async () => {
    if (!prompt) return;
    await startGeneration(prompt);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
  };

  // --- CHAT HANDLERS ---
  const handleCreateNewChat = () => {
    let initialText = "Hello! I'm the Flame Assistant. How can I help you with the Server Builder today?";
    switch (view) {
        case 'gallery': initialText = "Welcome to the Gallery! Ask me about these templates."; break;
        case 'toolkit': case 'toolkitPrompt': initialText = `Welcome to the AI Toolkit! What would you like to create for your server about "${prompt || 'your topic'}"?`; break;
        case 'results': initialText = `This is the template for "${serverTemplate?.serverName || 'your server'}". How can I help you with it?`; break;
    }

    const newSession: ChatSession = {
        id: Date.now().toString(),
        topic: 'New Chat',
        messages: [{ sender: 'bot', text: initialText }],
        timestamp: Date.now(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatSessionId(newSession.id);
  };

  const handleDeleteChat = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeChatSessionId === sessionId) {
        setActiveChatSessionId(null);
    }
  };

  const handleChatSendMessage = async (text: string, file?: File) => {
      const trimmedInput = text.trim();
      if ((!trimmedInput && !file) || isChatLoading || !activeChatSessionId) return;

      const userMessage: ChatMessage = { sender: 'user', text: trimmedInput };
      
      setChatSessions(prev => prev.map(s => 
          s.id === activeChatSessionId 
              ? { ...s, messages: [...s.messages, userMessage, { sender: 'bot', text: '' }] }
              : s
      ));
      setIsChatLoading(true);

      let fileData = null;
      if (file) {
          try {
              const base64Data = await fileToBase64(file);
              fileData = { base64Data, mimeType: file.type };
          } catch (error) {
              console.error("Error converting file to base64", error);
              setIsChatLoading(false);
              return;
          }
      }

      const activeSession = chatSessions.find(s => s.id === activeChatSessionId);
      if (!activeSession) return;
      
      const historyForApi = [...activeSession.messages, userMessage];

      await startChatStream(
          historyForApi,
          (chunk) => { // onUpdate
              setChatSessions(prev => prev.map(s => {
                  if (s.id !== activeChatSessionId) return s;
                  const lastMessage = s.messages[s.messages.length - 1];
                  if (lastMessage.sender === 'bot') {
                      lastMessage.text += chunk;
                  }
                  return { ...s, messages: [...s.messages] };
              }));
          },
          (fullMessage) => { // onComplete
              const actionRegex = /\[ACTIONS\](\[.*\])/s;
              const match = fullMessage.match(actionRegex);
              let cleanText = fullMessage;
              let actions: ChatAction[] = [];

              if (match && match[1]) {
                  try {
                      cleanText = fullMessage.replace(actionRegex, '').trim();
                      actions = JSON.parse(match[1]);
                  } catch (err) { console.error("Failed to parse chat actions:", err, match[1]); }
              }

              setChatSessions(prev => prev.map(s => {
                  if (s.id !== activeChatSessionId) return s;
                  const lastMessage = s.messages[s.messages.length - 1];
                  if (lastMessage.sender === 'bot') {
                      lastMessage.text = cleanText;
                      lastMessage.actions = actions;
                  }
                  const updatedSession = { ...s, messages: [...s.messages], timestamp: Date.now() };
                  
                  if (updatedSession.topic === 'New Chat' && updatedSession.messages.length >= 4) {
                      generateChatTopic(updatedSession.messages).then(topic => {
                           setChatSessions(currentSessions => currentSessions.map(cs => 
                                cs.id === updatedSession.id ? { ...cs, topic } : cs
                           ));
                      });
                  }
                  
                  return updatedSession;
              }));
              setIsChatLoading(false);
          },
          { view, serverName: serverTemplate?.serverName, prompt },
          fileData
      );
  };

  const handleChatAction = (actionId: string) => {
    setIsChatOpen(false);
    setActiveChatSessionId(null);
    setTimeout(() => {
        switch (actionId) {
            case 'NAV_TOOLKIT': handleShowToolkit(); break;
            case 'NAV_SERVERBUILDER': handleNavigate('/serverbuilder'); break;
            case 'NAV_GALLERY': handleNavigate('/gallery'); break;
            case 'SCROLL_EXAMPLES': handleScrollNavigate('examples'); break;
            case 'SCROLL_FEATURES': handleScrollNavigate('features'); break;
            case 'SCROLL_HOWITWORKS': handleScrollNavigate('howitworks'); break;
            case 'NAV_RESULTS_CHANNELS': setInitialSectionForResults('Channels'); break;
            case 'NAV_RESULTS_ROLES': setInitialSectionForResults('Roles'); break;
            case 'NAV_RESULTS_UTILITIES': setInitialSectionForResults('Utilities'); break;
            case 'NAV_RESULTS_BOTS': setInitialSectionForResults('Bots'); break;
            case 'NAV_RESULTS_TUTORIAL': setInitialSectionForResults('Tutorial'); break;
            default: console.warn(`Unknown chat actionId: ${actionId}`);
        }
    }, 300);
  };

  const renderContent = () => {
    const isLoading = view === 'generating' || (serverTemplate?.isStreaming ?? false);
    switch (view) {
      case 'generating':
        return <LoadingSpinner message={'Architecting Your Server...'} subMessage={loadingSubMessage} />;
      
      case 'gallery':
        return <GalleryPage templates={galleryTemplates} onSelectTemplate={handleSelectTemplate} />;
        
      case 'results':
      case 'toolkit':
        const isToolkit = view === 'toolkit';
        const template = isToolkit ? defaultTemplateForToolkit : serverTemplate;
        // FIX: The `view !== 'generating'` check is redundant and causes a type error because
        // the view is already narrowed to 'results' or 'toolkit' in this switch case.
        if (!template) {
            return <LoadingSpinner message={'Loading Server Blueprint...'} />;
        }
        return (
          <div className="fade-in">
             {error && <div className="mb-6"><ErrorMessage title={error.title} subtitle={error.subtitle} onRetry={() => { view === 'results' ? handleRegenerateTemplate() : setError(null) }} /></div>}
            <TemplateDisplay 
              template={isToolkit ? (serverTemplate || template!) : template!} 
              iconBase64={iconBase64}
              isIconLoading={isIconLoading || (template!.isStreaming && !iconBase64)} 
              iconError={iconError} 
              originalPrompt={prompt || 'a general community server'}
              isTutorialLoading={isTutorialLoading}
              isWelcomeMessageLoading={isWelcomeMessageLoading}
              onGenerateWelcomeMessage={handleGenerateWelcomeMessage}
              isRulesLoading={isRulesLoading}
              onGenerateRules={handleGenerateRules}
              isAnnouncementLoading={isAnnouncementLoading}
              onGenerateAnnouncement={handleGenerateAnnouncement}
              isEmbedLoading={isEmbedLoading}
              onGenerateEmbed={handleGenerateEmbed}
              onClearEmbed={handleClearEmbed}
              isBotsLoading={isBotsLoading}
              onGenerateBots={handleGenerateBots}
              isToolkitMode={isToolkit}
              onGoHome={handleGoHome}
              onRegenerateTemplate={handleRegenerateTemplate}
              initialSection={initialSectionForResults}
            />
          </div>
        );
      case 'home':
      case 'serverBuilder':
      default:
        return (
          <>
            {error && <ErrorMessage title={error.title} subtitle={error.subtitle} onRetry={() => setError(null)} />}
            <PromptInput prompt={prompt} setPrompt={setPrompt} onSubmit={handleSubmit} isLoading={isLoading} onShowToolkit={handleShowToolkit} />
            <div id="examples" className="mt-20 md:mt-32 scroll-mt-20">
              <Hero onExampleClick={handleExampleClick} />
            </div>
            <div id="features" className="mt-20 md:mt-32 scroll-mt-20">
              <ToolkitFeatures onShowToolkit={handleShowToolkit} />
            </div>
            <div id="howitworks" className="mt-20 md:mt-32 scroll-mt-20">
              <HowItWorks />
            </div>
          </>
        );
      case 'toolkitPrompt':
        return <ToolkitPrompt onContinue={handleContinueToToolkit} onCancel={handleGoHome} />
    }
  };

  return (
    <>
      <StarfieldBackground />
      <Navbar 
        session={session}
        onGoHome={handleGoHome} 
        onShowToolkit={handleShowToolkit} 
        onNavigate={handleScrollNavigate} 
        onShowGallery={() => handleNavigate('/gallery')} 
      />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Header 
          isToolkitMode={view === 'toolkit'}
          onGoHome={view === 'results' || view === 'toolkit' || view === 'gallery' || view === 'toolkitPrompt' ? handleGoHome : undefined} 
        />
        <div className="mt-12">
          {renderContent()}
        </div>
      </main>
      <Footer />
      {!isChatOpen && <ChatbotFab onClick={() => setIsChatOpen(true)} />}
      <Chatbot 
          isOpen={isChatOpen} 
          onClose={() => { setIsChatOpen(false); setActiveChatSessionId(null); }}
          sessions={chatSessions}
          activeSessionId={activeChatSessionId}
          onSelectSession={setActiveChatSessionId}
          onCreateNew={handleCreateNewChat}
          onDelete={handleDeleteChat}
          onCloseChatView={() => setActiveChatSessionId(null)}
          onExecuteAction={handleChatAction}
          isLoading={isChatLoading}
          onSendMessage={handleChatSendMessage}
      />
    </>
  );
};

export default App;
