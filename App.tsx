import React, { useState, useEffect, useRef } from 'react';
import type { ServerTemplate, TutorialStep, Section, ChatMessage, ChatAction } from './types.ts';
import { generateServerTemplateStream, generateIcon, generateSetupTutorial, generateWelcomeMessage, generateServerRules, generateFirstAnnouncement, generateEmbedMessage, generateBotRecommendations, startChatStream } from './services/geminiService.ts';
import { fetchGalleryTemplates, publishTemplateToGallery } from './services/firebase.ts';
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
import { GalleryPage } from './components/GalleryPage.tsx';
import { ChatbotFab } from './components/ChatbotFab.tsx';
import { Chatbot } from './components/Chatbot.tsx';

type AppView = 'home' | 'generating' | 'results' | 'toolkitPrompt' | 'toolkit' | 'gallery' | 'serverBuilder';

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
    case '#/gallery':
      return 'gallery';
    case '#/toolkit':
      return 'toolkitPrompt';
    case '#/serverbuilder':
      return 'serverBuilder';
    case '#/results':
      return 'results';
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
  const [view, setView] = useState<AppView>('home');

  const [galleryTemplates, setGalleryTemplates] = useState<ServerTemplate[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [initialSectionForResults, setInitialSectionForResults] = useState<Section | undefined>(undefined);

  const generationCancelled = useRef(false);
  const iconGenerationInitiated = useRef(false);
  const isGenerating = useRef(false); // To prevent hash changes from interrupting generation

  useEffect(() => {
    const handleHashChange = () => {
      if (isGenerating.current) return; // Do not reset state while a generation is in progress
      resetAllState();
      setView(getViewFromHash(window.location.hash));
    };

    // Set initial view from hash
    setView(getViewFromHash(window.location.hash));

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  useEffect(() => {
    const loadGallery = async () => {
        setIsGalleryLoading(true);
        try {
            const templates = await fetchGalleryTemplates();
            setGalleryTemplates(templates);
        } catch (error) {
            console.error("Failed to load gallery:", error);
            setError({ title: "Could not load gallery", subtitle: "Please check your connection and try again." });
        } finally {
            setIsGalleryLoading(false);
        }
    };

    if (view === 'gallery') {
        loadGallery();
    }
  }, [view]);

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

  const resetAllState = () => {
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
  };
  
  const handleNavigate = (path: string) => {
    const newHash = `#${path}`;
    if (window.location.hash !== newHash) {
        window.location.hash = newHash;
    } else {
        // if hash is the same, listener won't fire. Manually do it.
        resetAllState();
        setView(getViewFromHash(newHash));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleGoHome = () => {
    const currentHash = window.location.hash;
    const isAtHome = currentHash === '' || currentHash === '#' || currentHash === '#/';
    if (!isAtHome) {
      handleNavigate('/');
    } else {
      resetAllState();
      setView('home');
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
    isGenerating.current = true; // Set generating flag
    
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
                setView('results');
                window.location.hash = '#/results';
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
      console.error(err);
      setError({ title: 'An unexpected error occurred.', subtitle: 'The AI might be busy. Please try again.' });
      setView('home');
      window.location.hash = '#/';
    } finally {
        isGenerating.current = false; // Unset generating flag
    }
  };
  
  const handleSelectTemplateFromGallery = async (template: ServerTemplate) => {
    loadTemplate(template);
  };

  const loadTemplate = (template: ServerTemplate) => {
    resetAllState();
    const originalPrompt = template.tagline || template.serverIconPrompt;
    setPrompt(originalPrompt);
    generationCancelled.current = false;

    setServerTemplate(template);
    setIconBase64(template.iconUrl || null);
    setView('results');
    window.location.hash = '#/results';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsTutorialLoading(true);
    generateSetupTutorial(originalPrompt, template)
      .then(tutorial => {
          if (generationCancelled.current) return;
          setServerTemplate(prev => prev ? { ...prev, setupTutorial: tutorial } : null);
      })
      .catch(err => {
          console.error("Tutorial generation failed for template", err);
      })
      .finally(() => setIsTutorialLoading(false));
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
  const handleShowGallery = () => handleNavigate('/gallery');

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
  
  const handlePublishToGallery = async (template: ServerTemplate) => {
    await publishTemplateToGallery(template);
  };

  const handleToggleChat = () => setIsChatOpen(prev => !prev);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
  };

  const handleChatSendMessage = async (text: string, file?: File) => {
      const trimmedInput = text.trim();
      if ((!trimmedInput && !file) || isChatLoading) return;

      const newMessages: ChatMessage[] = [...chatMessages, { sender: 'user', text: trimmedInput }];
      setChatMessages(newMessages);
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

      setChatMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      await startChatStream(
          newMessages,
          (chunk) => {
              setChatMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage.sender === 'bot') {
                      const updatedMessages = [...prev];
                      updatedMessages[prev.length - 1] = { ...lastMessage, text: lastMessage.text + chunk };
                      return updatedMessages;
                  }
                  return prev;
              });
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
                  } catch (err) {
                      console.error("Failed to parse chat actions:", err, match[1]);
                  }
              }

              setChatMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage.sender === 'bot') {
                      const updatedMessages = [...prev];
                      updatedMessages[prev.length - 1] = { ...lastMessage, text: cleanText, actions };
                      return updatedMessages;
                  }
                  return prev;
              });
              setIsChatLoading(false);
          },
          {
              view: view,
              serverName: serverTemplate?.serverName,
              prompt: prompt,
          },
          fileData
      );
  };

  const handleChatAction = (actionId: string) => {
    setIsChatOpen(false); // Close chat on action
    setTimeout(() => {
        switch (actionId) {
            case 'NAV_TOOLKIT': handleShowToolkit(); break;
            case 'NAV_GALLERY': handleShowGallery(); break;
            case 'NAV_SERVERBUILDER': handleNavigate('/serverbuilder'); break;
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
        return <GalleryPage templates={galleryTemplates} isLoading={isGalleryLoading} onSelectTemplate={handleSelectTemplateFromGallery} />;
      
      case 'results':
      case 'toolkit':
        const isToolkit = view === 'toolkit';
        const template = isToolkit ? defaultTemplateForToolkit : serverTemplate;
        if (!template) {
            handleGoHome();
            return null;
        }
        return (
          <div className="fade-in">
            <TemplateDisplay 
              template={isToolkit ? (serverTemplate || template) : template} 
              iconBase64={iconBase64}
              isIconLoading={isIconLoading}
              isTutorialLoading={isTutorialLoading}
              iconError={iconError}
              isWelcomeMessageLoading={isWelcomeMessageLoading} onGenerateWelcomeMessage={handleGenerateWelcomeMessage}
              isRulesLoading={isRulesLoading} onGenerateRules={handleGenerateRules}
              isAnnouncementLoading={isAnnouncementLoading} onGenerateAnnouncement={handleGenerateAnnouncement}
              isEmbedLoading={isEmbedLoading} onGenerateEmbed={handleGenerateEmbed} onClearEmbed={handleClearEmbed}
              isBotsLoading={isBotsLoading} onGenerateBots={handleGenerateBots}
              originalPrompt={prompt}
              isToolkitMode={isToolkit}
              onGoHome={handleGoHome}
              onRegenerateTemplate={handleRegenerateTemplate}
              onPublishToGallery={handlePublishToGallery}
              initialSection={initialSectionForResults}
            />
          </div>
        );

      case 'toolkitPrompt':
        return <ToolkitPrompt onContinue={handleContinueToToolkit} onCancel={handleGoHome} />;

      case 'serverBuilder':
        return ( <PromptInput prompt={prompt} setPrompt={setPrompt} onSubmit={handleSubmit} isLoading={isLoading} onShowToolkit={handleShowToolkit} /> );
      
      case 'home':
      default:
        return (
          <>
            {error ? (
              <div className="max-w-2xl mx-auto text-center"><ErrorMessage title={error.title} subtitle={error.subtitle} onRetry={() => { setError(null); setPrompt(''); }} /></div>
            ) : (
              <PromptInput prompt={prompt} setPrompt={setPrompt} onSubmit={handleSubmit} isLoading={isLoading} onShowToolkit={handleShowToolkit} />
            )}
            {!error && (<div className="mt-12 md:mt-20"><div className="space-y-24 md:space-y-32"><div id="examples"><Hero onExampleClick={handleExampleClick} onShowGallery={handleShowGallery} /></div><div id="features"><ToolkitFeatures onShowToolkit={handleShowToolkit} /></div><div id="howitworks"><HowItWorks /></div></div></div>)}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <StarfieldBackground />
      <Navbar onGoHome={handleGoHome} onShowToolkit={handleShowToolkit} onShowGallery={handleShowGallery} onNavigate={handleScrollNavigate} />
      <div className="relative container mx-auto px-4 pt-4 pb-8 md:pb-12 z-10">
        <Header 
            isToolkitMode={view === 'toolkit' || view === 'toolkitPrompt'}
            isGalleryMode={view === 'gallery'}
            onGoHome={handleGoHome} 
        />
        <main className="mt-8 md:mt-16">{renderContent()}</main>
      </div>
      {(view === 'home' || view === 'gallery' || view === 'toolkitPrompt' || view === 'serverBuilder') && !error && <Footer />}
      
      {!isChatOpen && <ChatbotFab onClick={handleToggleChat} />}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        currentView={view}
        contextData={{ serverName: serverTemplate?.serverName, prompt: prompt }}
        onExecuteAction={handleChatAction}
        messages={chatMessages}
        setMessages={setChatMessages}
        isLoading={isChatLoading}
        onSendMessage={handleChatSendMessage}
      />
    </div>
  );
};

export default App;
