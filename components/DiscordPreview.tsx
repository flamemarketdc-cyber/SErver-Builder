import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { ServerTemplate, Channel, Role } from '../types.ts';

const FLAMING_SERVER_ICON_URL = 'https://i.postimg.cc/QtFGsCXb/Vibrant-Flame-on-Black-Background.png';
const ACE_PFP_URL = 'https://images-ext-1.discordapp.net/external/w9ecX1VJjWVlBKyNoZ9nIKeT3oD9G1xXGYIs_-gjGtM/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1333834158715306168/dd4942c74ce44ef27ccbab77c43789a7.png?format=webp&quality=lossless&width=288&height=288';
const DEFAULT_PFP_URLS = [
    'https://cdn.discordapp.com/embed/avatars/0.png',
    'https://cdn.discordapp.com/embed/avatars/1.png',
    'https://cdn.discordapp.com/embed/avatars/2.png',
    'https://cdn.discordapp.com/embed/avatars/3.png',
    'https://cdn.discordapp.com/embed/avatars/4.png',
    'https://cdn.discordapp.com/embed/avatars/5.png',
];

interface DiscordPreviewProps {
  template: ServerTemplate;
  iconBase64: string | null;
}

interface Message {
    user: string;
    pfp: string;
    roleColor?: string;
    content: string;
    isBot: boolean;
}

const HashIcon: React.FC = () => <span className="text-zinc-500 font-bold text-xl mr-1 w-5 h-5 flex-shrink-0">#</span>;
const VoiceIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-zinc-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>;
const CategoryChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
    </svg>
);

const MuteIcon: React.FC<{ muted: boolean }> = ({ muted }) => (
  <div className="relative w-5 h-5">
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"></path>
    </svg>
    {muted && <svg className="w-5 h-5 absolute top-0 left-0" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16" /></svg>}
  </div>
);

const DeafenIcon: React.FC<{ deafened: boolean }> = ({ deafened }) => (
  <div className="relative w-5 h-5">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z"></path>
    </svg>
    {deafened && <svg className="w-5 h-5 absolute top-0 left-0" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16" /></svg>}
  </div>
);

const ServerIcon: React.FC<{ icon: string | null; name: string; isActive?: boolean; onClick?: () => void; }> = ({ icon, name, isActive = false, onClick }) => {
    return (
        <div className="group relative">
            <div className={`absolute -left-3 top-1/2 -translate-y-1/2 h-0 w-2 bg-white rounded-r-full transition-all duration-200 ${isActive ? 'h-10' : 'group-hover:h-5'}`} />
            <button
                onClick={onClick}
                className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ease-in-out bg-zinc-700 hover:bg-red-600 ${isActive ? 'rounded-2xl bg-red-600' : 'hover:rounded-2xl'}`}
                aria-label={name}
            >
                {icon ? <img src={icon} className="w-full h-full object-cover" alt={`${name} server icon`}/> : <span className="font-bold text-lg text-white">{name.charAt(0)}</span>}
            </button>
             <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 bg-zinc-950 border border-zinc-700 text-white text-xs font-semibold rounded-md transition-all pointer-events-none opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 origin-left">
                {name}
            </span>
        </div>
    );
};

// --- DUMMY DATA ---
const DUMMY_USERNAMES = ['Zyler', 'Glyph', 'Nyx', 'Riven', 'Echo', 'Wraith', 'Jinx', 'Silas', 'Faye', 'Cassian'];
type Member = { username: string; role: Role; };

const generateMembers = (roles: Role[]): Member[] => {
    const members: Member[] = [];
    const usedUsernames = new Set<string>();

    roles.slice().reverse().forEach(role => {
        let count = 1;
        if (role.name.toLowerCase().includes('member')) count = 5;
        else if (role.name.toLowerCase().includes('mod')) count = 2;

        for (let i = 0; i < count; i++) {
            let username = DUMMY_USERNAMES[Math.floor(Math.random() * DUMMY_USERNAMES.length)];
            let suffix = 0;
            while(usedUsernames.has(username + (suffix || ''))) {
                suffix++;
            }
            username = username + (suffix || '');
            usedUsernames.add(username);
            members.push({ username, role });
        }
    });
    return members;
};


export const DiscordPreview: React.FC<DiscordPreviewProps> = ({ template, iconBase64 }) => {
    const [activeChannel, setActiveChannel] = useState<Channel | null>(template.categories[0]?.channels.find(c => c.type === 'text') || null);
    const [openCategories, setOpenCategories] = useState<string[]>(() => template.categories.map(c => c.name));
    const [mobileView, setMobileView] = useState<'sidebar' | 'content'>('sidebar');
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [inputValue, setInputValue] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const botTypingTimeout = useRef<number | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const members = useMemo(() => generateMembers(template.roles), [template.roles]);

    useEffect(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, [messages, isBotTyping, activeChannel]);

    useEffect(() => {
        return () => { // Cleanup timeout on unmount
            if (botTypingTimeout.current) clearTimeout(botTypingTimeout.current);
        };
    }, []);

    const memberGroups = useMemo(() => {
        const hoistedRoles = template.roles.filter(r => r.hoist);
        const groups: { role: Role; members: Member[] }[] = hoistedRoles.map(role => ({
            role,
            members: members.filter(m => m.role.name === role.name)
        }));
        
        const onlineMembers = members.filter(m => !m.role.hoist);
        return { hoistedGroups: groups.filter(g => g.members.length > 0), onlineMembers };
    }, [template.roles, members]);


    const toggleCategory = (categoryName: string) => {
        setOpenCategories(prev => prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]);
    };
    
    const handleChannelSelect = (channel: Channel) => {
        if (channel.type === 'text') {
            setActiveChannel(channel);
            setMobileView('content');
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeChannel) return;

        const userMessage: Message = { user: 'Ace', pfp: ACE_PFP_URL, content: inputValue, isBot: false };
        const channelName = activeChannel.name;

        setMessages(prev => ({ ...prev, [channelName]: [...(prev[channelName] || []), userMessage] }));
        setInputValue('');

        setIsBotTyping(true);
        if (botTypingTimeout.current) clearTimeout(botTypingTimeout.current);

        botTypingTimeout.current = window.setTimeout(() => {
            const botMessage: Message = {
                user: template.serverName,
                pfp: iconBase64 || DEFAULT_PFP_URLS[0],
                content: `Thanks for your message, Ace! This is an interactive preview. Try typing in other channels!`,
                isBot: true
            };
            setMessages(prev => ({ ...prev, [channelName]: [...(prev[channelName] || []), botMessage] }));
            setIsBotTyping(false);
        }, 1500 + Math.random() * 1000);
    };
    
    const handleMuteToggle = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        if (!newMuteState && isDeafened) setIsDeafened(false);
    };
    
    const handleDeafenToggle = () => {
        const newDeafenState = !isDeafened;
        setIsDeafened(newDeafenState);
        if (newDeafenState) setIsMuted(true);
    };

    const MembersList: React.FC = () => (
      <aside className="bg-zinc-800 w-60 flex-shrink-0 p-2 overflow-y-auto hidden md:flex md:flex-col">
          {memberGroups.hoistedGroups.map(({ role, members }) => (
              <div key={role.name} className="mb-4">
                  <h3 className="text-xs font-bold uppercase text-zinc-400 px-2 mb-1">{role.name} — {members.length}</h3>
                  {members.map(member => (
                      <div key={member.username} className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700/50">
                          <img src={DEFAULT_PFP_URLS[member.username.length % DEFAULT_PFP_URLS.length]} alt={member.username} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-semibold" style={{ color: role.color }}>{member.username}</span>
                      </div>
                  ))}
              </div>
          ))}
           {memberGroups.onlineMembers.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 px-2 mb-1">Online — {memberGroups.onlineMembers.length}</h3>
                  {memberGroups.onlineMembers.map(member => (
                     <div key={member.username} className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700/50">
                        <img src={DEFAULT_PFP_URLS[member.username.length % DEFAULT_PFP_URLS.length]} alt={member.username} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-semibold text-zinc-300">{member.username}</span>
                    </div>
                  ))}
              </div>
            )}
      </aside>
    );

    const renderChannelContent = () => (
        <div className="bg-zinc-700 flex-grow flex flex-col min-w-0">
            <header className="p-4 shadow-md h-12 flex items-center border-b border-zinc-900/50 flex-shrink-0">
                <button onClick={() => setMobileView('sidebar')} className="mr-2 text-zinc-400 hover:text-white md:hidden" aria-label="Back to channels">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {activeChannel ? <><HashIcon /><h2 className="font-semibold text-white ml-1 truncate">{activeChannel.name}</h2></> : <h2 className="font-semibold text-zinc-400 ml-1 truncate">Select a channel</h2>}
            </header>
            <main ref={messagesContainerRef} className="flex-grow p-4 flex flex-col text-zinc-300 overflow-y-auto">
                <div className="space-y-4 mt-auto">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                             {iconBase64 ? <img src={iconBase64} className="w-full h-full object-cover" alt="Server Icon"/> : <div className="text-white font-bold text-lg">{template.serverName.charAt(0)}</div>}
                        </div>
                        <div>
                            <p className="font-bold text-white">{template.serverName} <span className="text-xs text-zinc-400 font-normal ml-2">Today at 4:20 PM</span></p>
                            <p>Welcome to {activeChannel?.name || 'the server'}!</p>
                            <p className="text-sm text-zinc-400">{activeChannel?.topic}</p>
                        </div>
                    </div>
                     {(messages[activeChannel?.name || ''] || []).map((msg, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <img src={msg.pfp} alt={msg.user} className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0" />
                            <div>
                                <p className="font-bold" style={{ color: msg.roleColor }}>{msg.user} <span className="text-xs text-zinc-400 font-normal ml-2">Today at 4:20 PM</span> {msg.isBot && <span className="text-xs bg-blue-600 text-white font-semibold px-1.5 py-0.5 rounded-sm ml-1">BOT</span>}</p>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isBotTyping && <div className="text-xs text-zinc-400 animate-pulse">{template.serverName} is typing...</div>}
                </div>
            </main>
            <footer className="p-4 flex-shrink-0">
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Message #${activeChannel?.name || '...'}`}
                        className="w-full bg-zinc-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none"
                        disabled={!activeChannel}
                    />
                </form>
            </footer>
        </div>
    );

    return (
        <div className="w-full h-[70vh] min-h-[600px] bg-zinc-800 rounded-xl overflow-hidden flex font-sans text-sm shadow-2xl border border-zinc-700 fade-in">
            <div className="bg-zinc-900 p-3 space-y-2 flex flex-col items-center flex-shrink-0"><ServerIcon icon={iconBase64} name={template.serverName} isActive={true} /><a href="https://discord.gg/flamegw" target="_blank" rel="noopener noreferrer" aria-label="Join the Flaming server"><ServerIcon icon={FLAMING_SERVER_ICON_URL} name="Flaming" /></a></div>
            <div className={`bg-zinc-800 flex-shrink-0 flex flex-col ${mobileView === 'content' ? 'hidden md:flex' : 'flex w-full md:w-64'}`}>
                <header className="shadow-md h-12 flex items-center border-b border-zinc-900/50 px-4">
                     <h1 className="font-bold text-white truncate">{template.serverName}</h1>
                </header>
                <div className="flex-grow overflow-y-auto p-2 space-y-2">
                  {template.categories.map(category => (
                      <div key={category.name}>
                          <button onClick={() => toggleCategory(category.name)} className="flex items-center gap-1 text-xs text-zinc-400 font-bold uppercase hover:text-zinc-200 w-full px-1 py-0.5"><CategoryChevronIcon isOpen={openCategories.includes(category.name)} /><span>{category.name}</span></button>
                          {openCategories.includes(category.name) && (
                              <div className="mt-1 space-y-1">
                                  {category.channels.map(channel => (
                                      <button key={channel.name} onClick={() => handleChannelSelect(channel)} className={`w-full text-left flex items-center py-1 px-2 rounded transition-colors duration-150 group ${activeChannel?.name === channel.name ? 'bg-zinc-600/70 text-white' : 'text-zinc-300 hover:bg-zinc-700/40 hover:text-white'} ${channel.type === 'voice' ? 'cursor-not-allowed opacity-60' : ''}`} disabled={channel.type === 'voice'}>
                                          {channel.type === 'text' ? <HashIcon /> : <VoiceIcon />}<span className="truncate">{channel.name}</span>
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>
                  ))}
                </div>
                <footer className="p-2 bg-zinc-900/60 flex items-center justify-between mt-auto flex-shrink-0 h-14 border-t border-zinc-900/50">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="relative flex-shrink-0">
                            <img src={ACE_PFP_URL} alt="Ace" className="w-8 h-8 rounded-full" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-zinc-900/60 animate-pulse"></div>
                        </div>
                        <div className="truncate"><p className="text-sm font-semibold text-white truncate">Ace</p><p className="text-xs text-zinc-400 truncate">Online</p></div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0"><button onClick={handleMuteToggle} className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 p-1.5 rounded-md transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}><MuteIcon muted={isMuted} /></button><button onClick={handleDeafenToggle} className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 p-1.5 rounded-md transition-colors" aria-label={isDeafened ? 'Undeafen' : 'Deafen'}><DeafenIcon deafened={isDeafened} /></button></div>
                </footer>
            </div>
            <div className={`flex-grow md:flex min-w-0 ${mobileView === 'sidebar' ? 'hidden' : 'flex'}`}>
                {renderChannelContent()}
                <MembersList />
            </div>
        </div>
    );
};