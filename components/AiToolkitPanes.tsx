import React, { useState, useEffect } from 'react';
import type { ServerTemplate, Embed, EmbedField, EmbedMessagePayload } from '../types.ts';

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const RegenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" />
    </svg>
);

interface GeneratorPaneProps {
    title: string;
    description: string;
    buttonText: string;
    content: string | undefined;
    isLoading: boolean;
    onGenerate: () => void;
    placeholderReplacements?: Record<string, string>;
}

const GeneratorPane: React.FC<GeneratorPaneProps> = ({ title, description, buttonText, content, isLoading, onGenerate, placeholderReplacements = {} }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatContent = (text: string) => {
        let html = text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/(`(.*?)`)/g, '<code class="bg-slate-800 text-slate-300 p-1 rounded-sm text-sm font-mono">$1</code>')
            .replace(/(@everyone|@here)/g, '<span class="bg-blue-900/50 text-blue-300 font-bold p-1 rounded">$1</span>');

        Object.entries(placeholderReplacements).forEach(([placeholder, replacementHtml]) => {
            const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
            html = html.replace(regex, replacementHtml as string);
        });
        
        return html;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[350px]">
                <div className="w-8 h-8 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-slate-300">Crafting your content...</p>
            </div>
        );
    }

    if (content) {
        return (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl group">
                <div 
                    className="p-4 whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed max-h-96 overflow-y-auto" 
                    dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                ></div>
                <div className="border-t border-slate-700 p-2 flex justify-end items-center gap-2">
                    <button 
                        onClick={onGenerate}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm btn-interactive-slate"
                        aria-label="Regenerate content"
                    >
                        <RegenerateIcon />
                        <span>Regenerate</span>
                    </button>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm btn-interactive-slate"
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center min-h-[350px] flex flex-col items-center justify-center p-6 bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-xl">
            <h4 className="text-lg font-bold text-white">{title}</h4>
            <p className="text-slate-400 max-w-md mx-auto my-2">{description}</p>
            <button 
                onClick={onGenerate} 
                disabled={isLoading}
                className="mt-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed btn-interactive-red"
            >
                {buttonText}
            </button>
        </div>
    );
};

// A generic input component for the editor
const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
        <input {...props} className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
    </div>
);
const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
    </div>
);


const EmbedEditor: React.FC<{ payload: EmbedMessagePayload, onPayloadChange: (newPayload: EmbedMessagePayload) => void }> = ({ payload, onPayloadChange }) => {
    const embed = payload.embeds[0];

    const handleEmbedChange = (field: keyof Embed, value: any) => {
        const newEmbed = { ...embed };
        if (value === undefined || (typeof value === 'object' && value !== null && 'url' in value && !value.url)) {
            delete newEmbed[field];
        } else {
            (newEmbed as any)[field] = value;
        }
        onPayloadChange({ ...payload, embeds: [newEmbed] });
    };
    
    const handleFieldChange = (index: number, field: keyof EmbedField, value: any) => {
        const newFields = [...embed.fields];
        newFields[index] = { ...newFields[index], [field]: value };
        handleEmbedChange('fields', newFields);
    };

    const addField = () => {
        const newFields = [...embed.fields, { name: 'New Field', value: 'Some value', inline: false }];
        handleEmbedChange('fields', newFields);
    };

    const removeField = (index: number) => {
        const newFields = embed.fields.filter((_, i) => i !== index);
        handleEmbedChange('fields', newFields);
    };

    return (
        <div className="bg-zinc-800 border border-slate-700 rounded-lg p-4 max-w-lg mx-auto">
            <div className="flex gap-4">
                <input 
                    type="color" 
                    value={`#${embed.color.toString(16).padStart(6, '0')}`}
                    onChange={(e) => handleEmbedChange('color', parseInt(e.target.value.substring(1), 16))}
                    className="w-2 h-auto p-0 border-none rounded-full flex-shrink-0 bg-transparent"
                    title="Change embed color"
                />
                <div className="text-left text-white text-sm w-full space-y-3">
                    <EditorInput label="Title" value={embed.title} onChange={e => handleEmbedChange('title', e.target.value)} />
                    <EditorTextarea label="Description" value={embed.description} onChange={e => handleEmbedChange('description', e.target.value)} rows={4} />
                    <EditorInput label="Thumbnail URL" value={embed.thumbnail?.url || ''} placeholder="https://..." onChange={e => handleEmbedChange('thumbnail', e.target.value ? { url: e.target.value } : undefined)} />
                    <EditorInput label="Image URL" value={embed.image?.url || ''} placeholder="https://..." onChange={e => handleEmbedChange('image', e.target.value ? { url: e.target.value } : undefined)} />
                    <div>
                        <h4 className="text-sm font-bold mb-2">Fields</h4>
                        <div className="space-y-3">
                        {embed.fields.map((field, index) => (
                            <div key={index} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <EditorInput label="Field Name" value={field.name} onChange={e => handleFieldChange(index, 'name', e.target.value)} />
                                    <EditorInput label="Field Value" value={field.value} onChange={e => handleFieldChange(index, 'value', e.target.value)} />
                               </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={field.inline} onChange={e => handleFieldChange(index, 'inline', e.target.checked)} className="accent-red-500 w-4 h-4" /> Inline</label>
                                    <button onClick={() => removeField(index)} className="text-red-500 hover:text-red-400 text-xs font-bold">Remove</button>
                                </div>
                            </div>
                        ))}
                        </div>
                        <button onClick={addField} className="mt-3 text-sm font-semibold text-red-400 hover:text-red-300">+ Add Field</button>
                    </div>
                    <EditorInput label="Footer Text" value={embed.footer.text} onChange={e => handleEmbedChange('footer', { text: e.target.value })} />
                </div>
            </div>
        </div>
    );
};

const EmbedPreview: React.FC<{ embed: Embed; onStartEditing: () => void }> = ({ embed, onStartEditing }) => {
    const hexColor = `#${embed.color.toString(16).padStart(6, '0')}`;
    const formatPreviewText = (text: string) => text ? text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/__(.*?)__/g, '<u>$1</u>').replace(/`(.*?)`/g, '<code class="bg-zinc-900 p-1 rounded-sm text-sm font-mono">$1</code>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>').replace(/\n/g, '<br />') : '';

    return (
        <div className="bg-zinc-800 border border-slate-700 rounded-lg p-4 max-w-lg mx-auto font-sans">
            <div className="flex gap-4">
                <div className="w-1 h-auto rounded-full flex-shrink-0" style={{ backgroundColor: hexColor }}></div>
                <div className="text-left text-white text-sm w-full min-w-0">
                    {embed.title && <h3 onClick={onStartEditing} className="font-bold text-lg mb-2 break-words cursor-pointer hover:bg-zinc-700/50 rounded p-1 -m-1 transition-colors" dangerouslySetInnerHTML={{ __html: formatPreviewText(embed.title) }}></h3>}
                    <div className="flex gap-4">
                        <div className="flex-grow min-w-0">
                            {embed.description && <p onClick={onStartEditing} className="text-zinc-300 whitespace-pre-wrap break-words cursor-pointer hover:bg-zinc-700/50 rounded p-1 -m-1 transition-colors" dangerouslySetInnerHTML={{ __html: formatPreviewText(embed.description) }}></p>}
                            {embed.fields && embed.fields.length > 0 && (
                                <div className={`mt-4 grid gap-y-2 ${embed.fields.every(f => f.inline) ? `grid-cols-1 sm:grid-cols-${Math.min(embed.fields.length, 3)} gap-x-4` : 'grid-cols-1'}`}>
                                    {embed.fields.map((field, index) => (
                                        <div key={index} className={`${!field.inline && 'col-span-full'}`}>
                                            <p onClick={onStartEditing} className="font-bold mb-1 break-words cursor-pointer hover:bg-zinc-700/50 rounded p-1 -m-1 transition-colors" dangerouslySetInnerHTML={{ __html: formatPreviewText(field.name) }}></p>
                                            <p onClick={onStartEditing} className="text-zinc-300 whitespace-pre-wrap break-words cursor-pointer hover:bg-zinc-700/50 rounded p-1 -m-1 transition-colors" dangerouslySetInnerHTML={{ __html: formatPreviewText(field.value) }}></p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {embed.thumbnail?.url && (
                            <div className="flex-shrink-0 ml-4">
                                <img src={embed.thumbnail.url} alt="Thumbnail" className="w-20 h-20 object-cover rounded-md" />
                            </div>
                        )}
                    </div>
                    {embed.image?.url && (
                        <div className="mt-4">
                            <img src={embed.image.url} alt="Embed" className="max-w-full h-auto rounded-md max-h-80" />
                        </div>
                    )}
                    {embed.footer && embed.footer.text && <p onClick={onStartEditing} className="text-xs text-zinc-400 mt-4 break-words cursor-pointer hover:bg-zinc-700/50 rounded p-1 -m-1 transition-colors">{embed.footer.text}</p>}
                </div>
            </div>
        </div>
    );
};


const EmbedTutorialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in" onClick={onClose} aria-modal="true" role="dialog"><div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}><header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0"><h4 className="text-2xl font-bold gradient-text mb-2 fire-shadow">How to Post Your Embed on Discord</h4><button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close tutorial"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></header><div className="p-6 overflow-y-auto text-left"><p className="text-slate-400 mb-6">You can use a free tool called <a href="https://discohook.app" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:underline">Discohook</a> to easily post this embed message.</p><div className="space-y-6"><div><h5 className="font-bold text-white">Step 1: Create a Webhook in Discord</h5><ol className="list-decimal list-inside text-slate-300 space-y-1 mt-2 pl-2"><li>In your Discord server, go to the channel where you want to post the message.</li><li>Click the <strong className="font-semibold text-red-400">Edit Channel</strong> gear icon.</li><li>Go to the <strong className="font-semibold text-red-400">Integrations</strong> tab.</li><li>Click <strong className="font-semibold text-red-400">"Create Webhook"</strong>.</li><li>Click <strong className="font-semibold text-red-400">"Copy Webhook URL"</strong>.</li></ol></div><div><h5 className="font-bold text-white">Step 2: Use Discohook</h5><ol className="list-decimal list-inside text-slate-300 space-y-1 mt-2 pl-2"><li>Go to <a href="https://discohook.app" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:underline">discohook.app</a>.</li><li>Paste your <strong className="font-semibold text-red-400">Webhook URL</strong> into the field at the top.</li><li>Click the <strong className="font-semibold text-red-400">"Clear All"</strong> button.</li><li>Click the <strong className="font-semibold text-red-400"><code>&lt;/&gt; JSON</code></strong> button at the top-right.</li><li>A text box will appear. <strong className="font-semibold text-red-400">Delete</strong> any existing text inside it.</li><li>Come back here and click the <strong className="font-semibold text-red-400">"Copy JSON"</strong> button.</li><li>Paste our JSON into the textbox on Discohook.</li><li>Click <strong className="font-semibold text-red-400">"Send"</strong>!</li></ol></div></div></div></div></div>);
};

interface EmbedGeneratorProps { template: ServerTemplate; onGenerate: (prompt: string) => void; isLoading: boolean; onClearEmbed: () => void; }
const EmbedGenerator: React.FC<EmbedGeneratorProps> = ({ template, onGenerate, isLoading, onClearEmbed }) => {
    const [prompt, setPrompt] = useState(''); const [copied, setCopied] = useState(false); const [isEditing, setIsEditing] = useState(false); const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false); const [editablePayload, setEditablePayload] = useState<EmbedMessagePayload | null>(null);
    useEffect(() => { setEditablePayload(template.embedMessage || null); if (template.embedMessage) setIsEditing(false); }, [template.embedMessage]);
    const handleCopy = () => { if (!editablePayload) return; navigator.clipboard.writeText(JSON.stringify(editablePayload, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (prompt.trim()) onGenerate(prompt); };
    const handleGenerateNew = () => { onClearEmbed(); setPrompt(''); };
    return (<div className="space-y-6">{isLoading ? (<div className="flex flex-col items-center justify-center min-h-[350px]"><div className="w-8 h-8 border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div><p className="mt-3 font-semibold text-lg gradient-text">Designing your Embed...</p></div>) : !editablePayload ? (<form onSubmit={handleSubmit} className="p-6 bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-xl text-center fade-in min-h-[350px] flex flex-col items-center justify-center"><h4 className="text-lg font-bold text-white">Create Professional Embeds Instantly</h4><p className="text-slate-400 max-w-md mx-auto my-2">Describe the embed you need and the AI will generate the code for you.</p><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A welcome embed for new members." className="w-full max-w-lg mx-auto bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 my-4" rows={3} disabled={isLoading}/><button type="submit" disabled={isLoading || !prompt.trim()} className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed btn-interactive-red">Generate Embed</button></form>) : (<div className="space-y-4 fade-in"><div className="text-center"><button onClick={handleGenerateNew} className="flex items-center gap-2 mx-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm btn-interactive-slate"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg><span>Generate a New Embed</span></button></div>{isEditing ? (<EmbedEditor payload={editablePayload} onPayloadChange={setEditablePayload} />) : (<EmbedPreview embed={editablePayload.embeds[0]} onStartEditing={() => setIsEditing(true)} />)}<div className="flex justify-center items-center gap-4 flex-wrap">{isEditing ? (<button onClick={() => setIsEditing(false)} className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform btn-interactive-red">Done Editing</button>) : (<><button onClick={() => setIsTutorialModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform btn-interactive-red">Send Embed</button><button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm btn-interactive-slate"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg><span>Edit</span></button></>)}<button onClick={handleCopy} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm btn-interactive-slate">{copied ? <CheckIcon /> : <CopyIcon />}<span>{copied ? 'Copied!' : 'Copy JSON'}</span></button></div></div>)}<EmbedTutorialModal isOpen={isTutorialModalOpen} onClose={() => setIsTutorialModalOpen(false)} /></div>);
};

interface AiToolkitPanesProps {
  template: ServerTemplate; onGenerateWelcomeMessage: () => void; isWelcomeMessageLoading: boolean; onGenerateRules: () => void; isRulesLoading: boolean; onGenerateAnnouncement: () => void; isAnnouncementLoading: boolean; isEmbedLoading: boolean; onGenerateEmbed: (prompt: string) => void; onClearEmbed: () => void; initialTab?: UtilityTab;
}
type UtilityTab = 'welcome' | 'rules' | 'announcement' | 'embedGenerator';

export const AiToolkitPanes: React.FC<AiToolkitPanesProps> = (props) => {
    const { template, initialTab = 'welcome' } = props;
    const [activeTab, setActiveTab] = useState<UtilityTab>(initialTab);
    useEffect(() => { setActiveTab(initialTab); }, [initialTab]);
    useEffect(() => { if (template.embedMessage) setActiveTab('embedGenerator'); }, [template.embedMessage]);

    const TABS: { id: UtilityTab; label: string }[] = [ { id: 'welcome', label: 'Welcome Message' }, { id: 'rules', label: 'Server Rules' }, { id: 'announcement', label: 'Launch Announcement' }, { id: 'embedGenerator', label: 'Embed Generator' } ];
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'welcome': return <GeneratorPane title="Make a Great First Impression" description="Generate a custom welcome message to greet new members and guide them to the right channels." buttonText="Generate Welcome Message" content={template.welcomeMessage} isLoading={props.isWelcomeMessageLoading} onGenerate={props.onGenerateWelcomeMessage} placeholderReplacements={{ 'mention': '<span class="bg-blue-900/50 text-blue-300 font-bold p-1 rounded">@NewUser</span>' }} />;
            case 'rules': return <GeneratorPane title="Establish Clear Guidelines" description="Generate a concise set of key rules to ensure your community is safe, respectful, and fun." buttonText="Generate Server Rules" content={template.serverRules} isLoading={props.isRulesLoading} onGenerate={props.onGenerateRules} />;
            case 'announcement': return <GeneratorPane title="Announce Your Server's Launch" description="Create an exciting announcement to kick things off and let everyone know your server is ready for action!" buttonText="Generate Announcement" content={template.firstAnnouncement} isLoading={props.isAnnouncementLoading} onGenerate={props.onGenerateAnnouncement} />;
            case 'embedGenerator': return <EmbedGenerator template={template} onGenerate={props.onGenerateEmbed} isLoading={props.isEmbedLoading} onClearEmbed={props.onClearEmbed} />;
            default: return null;
        }
    }

    return (
        <div className="fade-in">
            <h3 className="text-2xl font-bold gradient-text mb-2">AI Content Toolkit</h3>
            <p className="text-slate-400 mb-6">A suite of generators to create essential content for your server.</p>
            <div className="mb-6"><div className="border-b border-slate-700 flex items-center gap-2 flex-wrap">{TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === tab.id ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}>{tab.label}</button>))}</div></div>
            {renderActiveTab()}
        </div>
    );
};