import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, ChatAction } from '../types.ts';
import { resetChat } from '../services/geminiService.ts';

// Add SpeechRecognition types to the window object
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  contextData: {
      serverName?: string;
      prompt?: string;
  };
  onExecuteAction: (actionId: string) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  onSendMessage: (text: string, file?: File) => Promise<void>;
}

const formatChatMessage = (text: string): string => {
    if (!text) return '';
    
    // Escape HTML to prevent any unexpected HTML from the model
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Process markdown: **bold**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process lists: lines starting with * or -
    const lines = html.split('\n');
    const processedLines = [];
    let inList = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            if (!inList) {
                processedLines.push('<ul>');
                inList = true;
            }
            processedLines.push(`<li>${trimmed.substring(2)}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            processedLines.push(line);
        }
    }

    if (inList) {
        processedLines.push('</ul>');
    }

    // Join lines and clean up formatting for HTML
    return processedLines.join('\n')
        .replace(/\n/g, '<br />')
        .replace(/<br \/><ul>/g, '<ul>') // Remove extra space before lists
        .replace(/<\/ul><br \/>/g, '</ul>'); // Remove extra space after lists
};


const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img 
            src="https://i.postimg.cc/QtFGsCXb/Vibrant-Flame-on-Black-Background.png" 
            alt="Flame Assistant"
            className="w-full h-full object-cover"
        />
    </div>
);

const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-zinc-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AttachIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

const MicIcon: React.FC<{isListening: boolean}> = ({ isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);


const ChatbotMessage: React.FC<{ msg: ChatMessage, isLoading: boolean, isLast: boolean, onExecuteAction: (actionId: string) => void }> = ({ msg, isLoading, isLast, onExecuteAction }) => {
    const cursorHtml = isLoading && msg.sender === 'bot' && isLast
        ? '<span class="inline-block w-2 h-4 bg-zinc-300 ml-1 animate-pulse" style="animation-duration: 1.2s; vertical-align: middle;"></span>'
        : '';
        
    return (
        <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <BotAvatar />}
                <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-red-600 to-red-800 text-white rounded-br-lg' 
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-lg'}`}
                >
                    <div dangerouslySetInnerHTML={{ __html: formatChatMessage(msg.text) + cursorHtml }} />
                </div>
                {msg.sender === 'user' && <UserAvatar />}
            </div>
            {msg.actions && msg.actions.length > 0 && !isLoading && isLast && (
                <div className={`flex flex-wrap gap-2 animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start pl-12'}`}>
                    {msg.actions.map(action => (
                        <button
                            key={action.actionId}
                            onClick={() => onExecuteAction(action.actionId)}
                            className="text-xs font-semibold text-red-300 bg-red-900/50 border border-red-800/50 px-3 py-1.5 rounded-full hover:bg-red-900/80 hover:text-red-200 transition-colors"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, currentView, contextData, onExecuteAction, messages, setMessages, isLoading, onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File; previewUrl: string } | null>(null);
    const [isListening, setIsListening] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(scrollToBottom, [messages, isLoading]);
    
    useEffect(() => {
        if (isOpen) {
            if (messages.length === 0) {
                let initialText = "Hello! I'm the Flame Assistant. How can I help you with the Server Builder today?";
                switch (currentView) {
                    case 'gallery':
                        initialText = "Welcome to the Gallery! Let me know if you want details about any of these templates.";
                        break;
                    case 'toolkit':
                    case 'toolkitPrompt':
                        initialText = `Welcome to the AI Toolkit! I can help you generate content for your server about "${contextData.prompt || 'your topic'}". What would you like to create?`;
                        break;
                    case 'results':
                        initialText = `This is the template for "${contextData.serverName || 'your server'}". I can explain the channels and roles, or help you with the setup tutorial. What would you like to do?`;
                        break;
                }
                setMessages([{ sender: 'bot', text: initialText }]);
            }
        } else {
            resetChat();
            setAttachedFile(null);
            if(isListening) recognitionRef.current?.stop();
        }
    }, [isOpen, currentView, contextData.serverName, contextData.prompt, isListening, messages.length, setMessages]);
    
    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
        };
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
    }, []);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        await onSendMessage(inputValue, attachedFile?.file);
        setInputValue('');
        setAttachedFile(null);
    };
    
    const handleFileSelect = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setAttachedFile({ file, previewUrl: URL.createObjectURL(file) });
        }
        // Reset file input value to allow selecting the same file again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFile = () => {
        if(attachedFile) URL.revokeObjectURL(attachedFile.previewUrl);
        setAttachedFile(null);
    };

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-zinc-950/80 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl flex flex-col z-50 chatbot-window">
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-700">
                <div className="flex items-center gap-3">
                    <BotAvatar />
                    <div>
                        <h3 className="font-bold text-white">Flame Assistant</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>Online</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 rounded-full" aria-label="Close chat">
                    <CloseIcon />
                </button>
            </header>

            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <ChatbotMessage 
                        key={index} 
                        msg={msg} 
                        isLoading={isLoading}
                        isLast={index === messages.length - 1}
                        onExecuteAction={onExecuteAction}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="flex-shrink-0 p-4 border-t border-zinc-700">
                {attachedFile && (
                    <div className="relative w-20 h-20 mb-2 rounded-lg overflow-hidden border-2 border-zinc-600">
                        <img src={attachedFile.previewUrl} alt="File preview" className="w-full h-full object-cover" />
                        <button onClick={handleRemoveFile} className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80">
                            &times;
                        </button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <button type="button" onClick={handleFileSelect} disabled={isLoading} className="flex-shrink-0 w-12 h-12 bg-zinc-800 text-zinc-300 rounded-lg flex items-center justify-center transition-colors hover:bg-zinc-700 disabled:opacity-50">
                        <AttachIcon />
                    </button>
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question..."
                        className="flex-grow bg-zinc-800 border border-zinc-600 rounded-lg p-2.5 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none max-h-28"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button type="button" onClick={handleToggleListening} disabled={isLoading} className="flex-shrink-0 w-12 h-12 bg-zinc-800 text-zinc-300 rounded-lg flex items-center justify-center transition-colors hover:bg-zinc-700 disabled:opacity-50">
                        <MicIcon isListening={isListening} />
                    </button>
                    <button type="submit" disabled={isLoading || (!inputValue.trim() && !attachedFile)} className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors hover:bg-red-500 disabled:bg-zinc-600 disabled:cursor-not-allowed">
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
};
