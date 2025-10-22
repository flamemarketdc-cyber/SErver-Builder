import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, ChatAction, ChatSession } from '../types.ts';

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
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onCloseChatView: () => void;
  onExecuteAction: (actionId: string) => void;
  isLoading: boolean;
  onSendMessage: (text: string, file?: File) => Promise<void>;
}

const formatChatMessage = (text: string): string => {
    if (!text) return '';
    let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
    if (inList) processedLines.push('</ul>');
    return processedLines.join('\n').replace(/\n/g, '<br />').replace(/<br \/><ul>/g, '<ul>').replace(/<\/ul><br \/>/g, '</ul>');
};

const BotAvatar = () => ( <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden"><img src="https://i.postimg.cc/QtFGsCXb/Vibrant-Flame-on-Black-Background.png" alt="Flame Assistant" className="w-full h-full object-cover"/></div> );
const UserAvatar = () => ( <div className="w-10 h-10 rounded-full bg-zinc-600 flex-shrink-0 flex items-center justify-center overflow-hidden"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div> );
const SendIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> );
const CloseIcon = () => ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const AttachIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg> );
const MicIcon: React.FC<{isListening: boolean}> = ({ isListening }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> );
const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const DeleteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>);

const ChatbotMessage: React.FC<{ msg: ChatMessage, isLoading: boolean, isLast: boolean, onExecuteAction: (actionId: string) => void }> = ({ msg, isLoading, isLast, onExecuteAction }) => {
    const cursorHtml = isLoading && msg.sender === 'bot' && isLast ? '<span class="inline-block w-2 h-4 bg-zinc-300 ml-1 animate-pulse" style="animation-duration: 1.2s; vertical-align: middle;"></span>' : '';
    return (
        <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <BotAvatar />}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-br from-red-600 to-red-800 text-white rounded-br-lg' : 'bg-zinc-800 text-zinc-200 rounded-bl-lg'}`}><div dangerouslySetInnerHTML={{ __html: formatChatMessage(msg.text) + cursorHtml }} /></div>
                {msg.sender === 'user' && <UserAvatar />}
            </div>
            {msg.actions && msg.actions.length > 0 && !isLoading && isLast && (
                <div className={`flex flex-wrap gap-2 animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start pl-12'}`}>
                    {msg.actions.map(action => ( <button key={action.actionId} onClick={() => onExecuteAction(action.actionId)} className="text-xs font-semibold text-red-300 bg-red-900/50 border border-red-800/50 px-3 py-1.5 rounded-full hover:bg-red-900/80 hover:text-red-200 transition-colors">{action.label}</button>))}
                </div>
            )}
        </div>
    );
};

const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

export const Chatbot: React.FC<ChatbotProps> = (props) => {
    const { isOpen, onClose, sessions, activeSessionId, onSelectSession, onCreateNew, onDelete, onCloseChatView, onExecuteAction, isLoading, onSendMessage } = props;
    const [inputValue, setInputValue] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File; previewUrl: string } | null>(null);
    const [isListening, setIsListening] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeSession?.messages, isLoading]);
    useEffect(() => { if (!isOpen && isListening) recognitionRef.current?.stop(); }, [isOpen, isListening]);
    
    useEffect(() => {
        if (isOpen && sessions.length === 0 && !activeSessionId) {
            onCreateNew();
        }
    }, [isOpen, sessions, activeSessionId, onCreateNew]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { console.warn("Speech recognition not supported."); return; }
        const recognition = new SpeechRecognition();
        recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-US';
        recognition.onresult = (event: any) => setInputValue(prev => prev ? `${prev} ${event.results[0][0].transcript}` : event.results[0][0].transcript);
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => { console.error("Speech recognition error:", event.error); setIsListening(false); };
        recognitionRef.current = recognition;
    }, []);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        await onSendMessage(inputValue, attachedFile?.file);
        setInputValue('');
        setAttachedFile(null);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) setAttachedFile({ file, previewUrl: URL.createObjectURL(file) });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFile = () => { if(attachedFile) URL.revokeObjectURL(attachedFile.previewUrl); setAttachedFile(null); };
    const handleToggleListening = () => { if (!recognitionRef.current) return; isListening ? recognitionRef.current.stop() : recognitionRef.current.start(); };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

    useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; } }, [inputValue]);

    if (!isOpen) return null;

    const renderLobby = () => (
        <>
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-700">
                <h3 className="font-bold text-white text-lg">Conversations</h3>
                <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 -mr-2 rounded-full" aria-label="Close chat"><CloseIcon /></button>
            </header>
            <div className="flex-grow p-4 flex flex-col gap-4 overflow-y-hidden">
                <div className="flex-grow overflow-y-auto space-y-2">
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <div key={session.id} className="group flex items-center gap-2">
                                <button onClick={() => onSelectSession(session.id)} className="flex-grow text-left p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors w-full">
                                    <p className="font-semibold text-white truncate">{session.topic}</p>
                                    <p className="text-xs text-zinc-400">{timeAgo(session.timestamp)}</p>
                                </button>
                                <button onClick={() => onDelete(session.id)} className="flex-shrink-0 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete chat: ${session.topic}`}><DeleteIcon/></button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-zinc-400 h-full flex flex-col items-center justify-center"><p>Your chat history will appear here.</p><p>Start a new conversation to begin.</p></div>
                    )}
                </div>
                <button onClick={onCreateNew} className="flex-shrink-0 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-base"><PlusIcon /> New Chat</button>
            </div>
        </>
    );

    const renderChatView = () => (
        <>
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-700">
                <button onClick={onCloseChatView} className="text-zinc-400 hover:text-white p-2 -ml-2 rounded-full" aria-label="Back to conversations"><BackIcon /></button>
                <h3 className="font-bold text-white truncate">{activeSession?.topic}</h3>
                <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 -mr-2 rounded-full" aria-label="Close chat"><CloseIcon /></button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {activeSession?.messages.map((msg, index) => <ChatbotMessage key={index} msg={msg} isLoading={isLoading} isLast={index === activeSession.messages.length - 1} onExecuteAction={onExecuteAction}/>)}
                <div ref={messagesEndRef} />
            </div>
            <footer className="flex-shrink-0 p-4 border-t border-zinc-700">
                {attachedFile && (<div className="relative w-20 h-20 mb-2 rounded-lg overflow-hidden border-2 border-zinc-600"><img src={attachedFile.previewUrl} alt="File preview" className="w-full h-full object-cover" /><button onClick={handleRemoveFile} className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80">&times;</button></div>)}
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="flex-shrink-0 w-12 h-12 bg-zinc-800 text-zinc-300 rounded-lg flex items-center justify-center transition-colors hover:bg-zinc-700 disabled:opacity-50"><AttachIcon /></button>
                    <textarea ref={textareaRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask a question..." className="flex-grow bg-zinc-800 border border-zinc-600 rounded-lg p-2.5 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none max-h-28" rows={1} disabled={isLoading} />
                    <button type="button" onClick={handleToggleListening} disabled={isLoading} className="flex-shrink-0 w-12 h-12 bg-zinc-800 text-zinc-300 rounded-lg flex items-center justify-center transition-colors hover:bg-zinc-700 disabled:opacity-50"><MicIcon isListening={isListening} /></button>
                    <button type="submit" disabled={isLoading || (!inputValue.trim() && !attachedFile)} className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors hover:bg-red-500 disabled:bg-zinc-600 disabled:cursor-not-allowed"><SendIcon /></button>
                </form>
            </footer>
        </>
    );

    return (
        <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-zinc-950/80 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl flex flex-col z-50 chatbot-window">
            {activeSessionId ? renderChatView() : renderLobby()}
        </div>
    );
};