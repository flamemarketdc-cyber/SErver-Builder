import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import type { ServerTemplate, EmbedMessagePayload, TutorialStep, BotRecommendation, Embed, Category, Role, ChatMessage } from '../types.ts';

// The user has provided their API key to be used directly in the code.
// In a production environment, it is strongly recommended to use environment variables
// to keep sensitive keys out of the source code.
const API_KEY = "AIzaSyDA3pkJAlQmEuP7WQo1bvNz18SitAp5lwA";


if (!API_KEY) {
    console.error("API_KEY environment variable not set. Please configure it.");
}

const isPromptValid = async (prompt: string): Promise<boolean> => {
    const trimmedPrompt = prompt.trim();
    const lowercasedPrompt = trimmedPrompt.toLowerCase();

    if (lowercasedPrompt === 'server' || lowercasedPrompt === 'svr') {
        return false;
    }
    
    // Check for excessive repeating characters (e.g., "bbbbbb")
    const repeatingCharsRegex = /(.)\1{4,}/;
    if (repeatingCharsRegex.test(trimmedPrompt)) {
        return false;
    }

    // AI validation was too aggressive with short, creative prompts.
    // Removed to allow the main generation model to interpret the user's intent.
    return true;
}

export const generateServerTemplateStream = async (
    prompt: string,
    onUpdate: (template: ServerTemplate) => void
): Promise<void> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }

    const isValid = await isPromptValid(prompt);
    if (!isValid) {
        throw new Error('INVALID_PROMPT');
    }

    const fullPrompt = `
    You are an expert Discord server architect. Based on the user's prompt, generate a server template piece by piece, using the specific XML-like tags provided. Do not output anything other than these tags. The output must be sequential and well-formed.

    User's server theme: "${prompt}"

    **Output Format (Strictly Adhere):**
    1.  First, generate the server name: <SERVER_NAME>Your Creative Server Name</SERVER_NAME>
    2.  Second, the vanity URL: <VANITY_URL>your-vanity-url</VANITY_URL>
    3.  Third, the icon prompt: <ICON_PROMPT>A detailed prompt for an AI image generator.</ICON_PROMPT>
    4.  Then, generate all roles from highest to lowest hierarchy. For each role: <ROLE>Role Name|#HexColor|isHoisted(true/false)|Permission1,Permission2,Permission3</ROLE>
    5.  Then, generate categories and their channels. For each category: <CATEGORY>Category Name</CATEGORY>. For each channel inside that category: <CHANNEL>type(text/voice)|channel-name|Channel Topic</CHANNEL>
    6.  Then, generate the server settings: <SETTINGS>VerificationLevel|ExplicitContentFilter|DefaultNotifications</SETTINGS>
    7.  Finally, when ALL parts are generated, output: <DONE />

    **Generation Guidelines:**
    - **Roles**: Invent at least 2-3 creative, theme-specific roles in addition to standard ones. Do not include emojis in role names.
    - **Channels**: Create thematic and unique channels. Channel names MUST be in \`kebab-case\` and start with a single relevant emoji followed by a '・' separator (e.g., '👋・welcome'). This format is mandatory.
    - **Flow**: Follow the sequence exactly as described above. Do not mix the order of tags.
    `;

    try {
        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });

        let buffer = '';
        let template: ServerTemplate = {
            serverName: 'Generating...',
            vanityUrlSuggestion: '',
            serverIconPrompt: '',
            roles: [],
            categories: [],
            serverSettings: { verificationLevel: '', explicitContentFilter: '', defaultNotifications: '' },
            isStreaming: true,
        };
        let currentCategory: Category | null = null;

        for await (const chunk of stream) {
            buffer += chunk.text;

            let shouldContinue = true;
            while(shouldContinue) {
                const tagMatch = buffer.match(/<([A-Z_]+)>(.*?)<\/\1>/);
                if (tagMatch) {
                    const [fullMatch, tagName, tagValue] = tagMatch;

                    switch (tagName) {
                        case 'SERVER_NAME':
                            template.serverName = tagValue;
                            break;
                        case 'VANITY_URL':
                            template.vanityUrlSuggestion = tagValue;
                            break;
                        case 'ICON_PROMPT':
                            template.serverIconPrompt = tagValue;
                            break;
                        case 'ROLE':
                            const [name, color, hoist, permsStr] = tagValue.split('|');
                            const permissions = permsStr ? permsStr.split(',') : [];
                            template.roles.push({ name: name.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, '').trim(), color, hoist: hoist === 'true', permissions });
                            break;
                        case 'CATEGORY':
                            currentCategory = { name: tagValue, channels: [] };
                            template.categories.push(currentCategory);
                            break;
                        case 'CHANNEL':
                            if (currentCategory) {
                                const [type, chName, topic] = tagValue.split('|');
                                currentCategory.channels.push({ name: chName, type: type as 'text' | 'voice', topic });
                            }
                            break;
                        case 'SETTINGS':
                            const [verification, filter, notifications] = tagValue.split('|');
                            template.serverSettings = { verificationLevel: verification, explicitContentFilter: filter, defaultNotifications: notifications };
                            break;
                    }

                    buffer = buffer.slice(fullMatch.length);

                    try {
                        onUpdate({ 
                            ...template, 
                            roles: [...template.roles], 
                            categories: template.categories.map(c => ({...c, channels: [...c.channels]}))
                        });
                    } catch (e) {
                        if (e.message === 'STREAM_CANCELLED') {
                            console.log('Stream generation cancelled by user.');
                            return;
                        }
                        throw e;
                    }

                } else {
                    shouldContinue = false;
                }
            }

            if (buffer.includes('<DONE />')) {
                break;
            }
        }
        
        template.isStreaming = false;
        onUpdate(template);

    } catch (e) {
        console.error("Failed to generate template with Gemini stream:", e);
        if (e instanceof Error) {
            throw new Error(`The AI returned an invalid format or the service is down. Details: ${e.message}`);
        }
        throw new Error("An unknown error occurred while generating the template.");
    }
};

const tutorialStepSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A short, actionable title for the setup step." },
        description: { type: Type.STRING, description: "A concise, clear description of how to perform the step." },
    },
    required: ['title', 'description']
};

const tutorialSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            description: "A list of setup steps.",
            items: tutorialStepSchema,
        }
    },
    required: ['steps']
};

export const generateSetupTutorial = async (prompt: string, coreTemplate: ServerTemplate): Promise<TutorialStep[]> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }

    const fullPrompt = `
    You are an expert Discord server architect. You have already generated a server template. Now, create a detailed, step-by-step tutorial for a beginner to set up the server based on that template. The output must be a valid JSON object containing a list of steps.

    The original user prompt was: "${prompt}"

    The generated server template is as follows:
    - Server Name: ${coreTemplate.serverName}
    - Roles: ${coreTemplate.roles.map(r => `${r.name} (Displayed Separately: ${r.hoist})`).join(', ')}
    - Categories and Channels: ${coreTemplate.categories.map(c => `${c.name} (${c.channels.map(ch => ch.name).join(', ')})`).join('; ')}

    The tutorial should be a list of actionable steps. For each step, provide a clear 'title' and a 'description'. The steps should cover:
    1. Creating the server.
    2. Setting the server name and icon.
    3. Creating roles with their permissions and setting the 'Display role members separately' (hoist) toggle.
    4. Creating categories and channels.
    5. Configuring the recommended server settings.

    **CRITICAL FORMATTING**: The 'description' for each step MUST be extremely clear, organized, and easy for a beginner to follow.
    - Use simple Discord-style markdown.
    - For lists of actions (like creating multiple roles or channels), you MUST use bullet points (e.g., "* Create the **Admin** role.").
    - For sub-steps or details about a specific action, use nested bullet points (indented lists).
    - Use bold text (e.g., "**Server Settings**") to highlight UI elements, menus, names, or options that the user needs to click or find.
    - Wrap any specific setting names, permission names, or options in \`backticks\` for clarity (e.g., "Enable the \`Administrator\` permission.").
    - Keep each point concise and direct. This is crucial for user experience.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tutorialSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { steps: TutorialStep[] };
        return result.steps;
    } catch (e) {
        console.error("Failed to generate tutorial with Gemini:", e);
        return [{
            title: "Tutorial Generation Failed",
            description: "We couldn't generate the interactive tutorial at this time. Please refer to the Discord documentation for setting up roles and channels based on this template."
        }];
    }
};

export const generateWelcomeMessage = async (template: ServerTemplate, originalPrompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) throw new Error("API Key is not configured.");

    const keyChannels = template.categories
        .flatMap(c => c.channels)
        .filter(ch => ch.name.includes('rules') || ch.name.includes('roles') || ch.name.includes('general') || ch.name.includes('introduce'))
        .map(ch => ch.name)
        .slice(0, 4)
        .join(', ');

    const fullPrompt = `
    You are a creative and friendly community manager for a new Discord server. Your task is to generate a warm, engaging, and informative welcome message for new members.

    Server Theme: "${originalPrompt}"
    Server Name: "**${template.serverName}**"
    Key Channels for new members: ${keyChannels}

    The message must be structured and easy to read. It should include:
    1.  A vibrant, friendly greeting for the new member using the placeholder "{mention}".
    2.  A concise and exciting one-sentence description of what makes this server special.
    3.  A "Getting Started" section with 3-4 clear, numbered, and actionable steps. Use the key channels as inspiration for these steps (e.g., "1️⃣ Grab your roles in #channel", "2️⃣ Say hello in #channel").
    4.  A friendly closing statement wishing them a great time in the community.
    5.  The entire message must be formatted for Discord Markdown and use emojis to be visually appealing and fun. The tone should be enthusiastic and helpful.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text;
    } catch (e) {
        console.error("Failed to generate welcome message with Gemini:", e);
        throw new Error("Failed to generate welcome message.");
    }
};

export const generateServerRules = async (template: ServerTemplate, originalPrompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) throw new Error("API Key is not configured.");

    const fullPrompt = `
    You are an experienced Discord moderator and community architect. Generate a comprehensive yet easy-to-digest set of server rules for a Discord server with the theme: "${originalPrompt}".

    The rules document should include:
    1.  A brief, positive opening statement about the community's goals (e.g., "Welcome! Our goal is to create a supportive space for...").
    2.  A numbered list of 7-10 essential rules. Each rule must have a clear, bolded title and a short, one-sentence explanation for clarity.
    3.  The rules must cover standard server etiquette (e.g., Be Respectful, No Spamming) as well as rules tailored to the server's specific theme.
    4.  A brief concluding sentence about how to contact moderators for help.
    5.  The entire output must be a single block of text, formatted in Discord Markdown for readability, ready to be posted in a #rules channel.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text;
    } catch (e) {
        console.error("Failed to generate server rules with Gemini:", e);
        throw new Error("Failed to generate server rules.");
    }
};

export const generateFirstAnnouncement = async (template: ServerTemplate, originalPrompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) throw new Error("API Key is not configured.");
    
    const keyChannels = template.categories
        .flatMap(c => c.channels)
        .filter(ch => ch.name.includes('rules') || ch.name.includes('roles') || ch.name.includes('introduce'))
        .map(ch => ch.name)
        .slice(0, 3)
        .join(', ');

    const fullPrompt = `
    You are a master of hype and community launches. Your mission is to write an EPIC "Grand Opening" announcement for a brand new Discord server. This is not a simple welcome, it's a launch party!

    Server Theme: "${originalPrompt}"
    Server Name: "${template.serverName}"
    Key channels for first steps: ${keyChannels}

    The announcement must be:
    - **High-Energy & Celebratory:** Use strong, exciting language to build hype.
    - **Visually Engaging:** Use Discord Markdown creatively. This includes a bold, exciting headline, and perhaps a blockquote for the main message.
    - **Informative but Concise:** The entire announcement should be around 200 words. It needs to clearly state the server's purpose and what members can look forward to.
    - **Action-Oriented:** Include a clear "What To Do Next" section with 2-3 specific actions for members.
    - The message must start with a ping for everyone ("@everyone").
    - End with a powerful call to action that inspires community participation.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text;
    } catch (e) {
        console.error("Failed to generate first announcement with Gemini:", e);
        throw new Error("Failed to generate first announcement.");
    }
};

const embedSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        color: { type: Type.INTEGER, description: "Integer representation of a hex color code." },
        fields: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.STRING },
                    inline: { type: Type.BOOLEAN },
                },
                required: ['name', 'value', 'inline']
            }
        },
        thumbnail: {
            type: Type.OBJECT,
            properties: { url: { type: Type.STRING, description: "URL of the thumbnail image." } },
        },
        image: {
            type: Type.OBJECT,
            properties: { url: { type: Type.STRING, description: "URL of the main image." } },
        },
        footer: {
            type: Type.OBJECT,
            properties: { text: { type: Type.STRING } },
            required: ['text']
        }
    },
    required: ['title', 'description', 'color', 'fields', 'footer']
};

export const generateEmbedMessage = async (prompt: string, serverName: string): Promise<EmbedMessagePayload> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) throw new Error("API Key is not configured.");

    const fullPrompt = `
    You are a Discord message design expert. Your task is to generate the JSON for a beautiful and effective Discord message payload, which includes an embed.

    The user wants an embed for: "${prompt}"
    The server's name is: "${serverName}"

    The response MUST be a valid JSON object adhering to the provided schema.
    
    **Embed Generation:**
    - **title**: A concise and engaging title. Can use emojis.
    - **description**: The main body of the embed. Use Discord markdown like **bold**, *italics*, and newlines (\\n) for formatting. Keep it readable.
    - **color**: An integer representation of a hex color code. For example, for red (#FF0000), the integer is 16711680. Use a color that fits the theme of the prompt.
    - **fields**: An array of objects for structured information. Use these to break down information into easy-to-read blocks. Use the 'inline' property to place fields side-by-side if they are short.
    - **thumbnail**: (Optional) An object with a 'url' property for a small image in the top-right. Only include this if the user's prompt implies a visual element that would fit well as a thumbnail (like a logo or small icon).
    - **image**: (Optional) An object with a 'url' property for a large image at the bottom of the embed. Only include this if the user's prompt asks for a banner, a showcase image, or a large visual.
    - **footer**: A small text at the bottom. Use the server name here.
    `;

    const payloadSchema = {
        type: Type.OBJECT,
        properties: {
            embeds: { type: Type.ARRAY, items: embedSchema },
        },
        required: ['embeds']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: payloadSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as EmbedMessagePayload;

    } catch (error) {
        console.error("Error generating embed message with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`The AI returned an invalid format or the service is down. Details: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the embed message.");
    }
};


export const generateIcon = async (fullPrompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: fullPrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("Image generation failed, no image data returned.");

    } catch (error) {
        console.error("Error generating icon with Gemini:", error);
        throw error;
    }
};

const botRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The bot's name." },
        purpose: { type: Type.STRING, description: "The bot's primary category/purpose, e.g., 'Moderation', 'Music', 'Fun & Engagement', 'Utility'." },
        description: { type: Type.STRING, description: "A concise, one-sentence summary of the bot's purpose and key features." },
        keyFeatures: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of 2-3 key features or getting-started tips."
        },
        inviteLink: { type: Type.STRING, description: "The valid, direct URL to invite the bot to a server." },
    },
    required: ['name', 'purpose', 'description', 'keyFeatures', 'inviteLink']
};


const botRecommendationsListSchema = {
    type: Type.OBJECT,
    properties: {
        bots: {
            type: Type.ARRAY,
            description: "A list of 3-4 recommended bots.",
            items: botRecommendationSchema
        }
    },
    required: ['bots']
};

export const generateBotRecommendations = async (template: ServerTemplate, originalPrompt: string): Promise<BotRecommendation[]> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) throw new Error("API Key is not configured.");

    const fullPrompt = `
    You are a Discord bot expert. Based on the provided server theme, recommend 3 to 4 popular and highly useful Discord bots.
    For each bot, provide its name, its primary purpose (e.g., "Moderation", "Music", "Fun & Engagement", "Utility"), a concise description, a list of 2-3 key features or getting-started tips, and its direct invite link.

    **CRITICAL**: The 'keyFeatures' should be a list of short, actionable points. For example: "Automated role assignments with /autorole", "Create polls with /poll", "Play music from YouTube with /play".

    The user's server theme is: "${originalPrompt}"
    Server Name: "${template.serverName}"

    **Bot Variety is Key**: Recommend a mix of bots for different purposes. Consider including bots for:
    - **Moderation & Utility**: Tools like Sapphire, Apollo (for events), Falcon, Ticket Tool.
    - **Fun & Engagement**: Dank Memer, OwO, Arcane (for leveling).
    - **Music**: Rythm or a similar popular music bot.
    - **Management**: Invite Tracker, Appy (for staff applications), BotGhost (for creating custom bots).

    Select the most relevant bots for the server's theme. For example, a gaming server would benefit from Arcane and Dank Memer, while a community server might need a good Ticket Tool and Invite Tracker.

    Output a valid JSON object that follows the provided schema.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: botRecommendationsListSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { bots: BotRecommendation[] };
        return result.bots;
    } catch (e) {
        console.error("Failed to generate bot recommendations with Gemini:", e);
        throw new Error("Failed to generate bot recommendations.");
    }
};

let chat: Chat | null = null;
let lastContextKey: string | null = null;

export const startChatStream = async (
    history: ChatMessage[],
    onUpdate: (chunk: string) => void,
    onComplete: (fullMessage: string) => void,
    context: { view: string; serverName?: string; prompt?: string; },
    file?: { base64Data: string; mimeType: string; }
): Promise<void> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    if (!API_KEY) throw new Error("API Key is not configured.");

    const getSystemInstruction = () => {
        let instruction = `You are Flame Assistant, a professional and helpful guide for the 'Flaming Server Builder' website. Your tone should be clear, concise, and professional. Keep your answers brief, ideally 2-3 sentences, unless the user asks for detailed steps. You can see and comment on images users attach. Provide direct and helpful answers. If asked who created the website, say it was created by a developer named Ace. Do not mention the creator otherwise. Your primary goal is to help users with the website, but you can answer related questions. The official Discord server for this website is https://discord.gg/flamegw.`;

        let actionPrompt = '';
        switch (context.view) {
            case 'home':
            case 'serverBuilder':
                instruction += `\n\nThe user is on the main Server Builder page. Help them with ideas, explain how it works, or guide them to other features.`;
                actionPrompt = `\n\nWhen helpful, you can suggest actions using this exact format at the very end of your response: [ACTIONS][{"label": "Try an Example", "actionId": "SCROLL_EXAMPLES"}, {"label": "Explore Features", "actionId": "SCROLL_FEATURES"}, {"label": "See How It Works", "actionId": "SCROLL_HOWITWORKS"}, {"label": "Use the AI Toolkit", "actionId": "NAV_TOOLKIT"}, {"label": "Browse Gallery", "actionId": "NAV_GALLERY"}]`;
                break;
            case 'gallery':
                instruction += `\n\nThe user is browsing the Community Gallery of pre-made server templates. Help them choose a template or understand its purpose.`;
                actionPrompt = `\n\nWhen helpful, you can suggest actions using this exact format at the very end of your response: [ACTIONS][{"label": "Create a new server", "actionId": "NAV_SERVERBUILDER"}, {"label": "Use the AI Toolkit", "actionId": "NAV_TOOLKIT"}]`;
                break;
            case 'toolkit':
            case 'toolkitPrompt':
                instruction += `\n\nThe user is on the AI Toolkit page. Their server theme is "${context.prompt || 'not specified'}". Help them generate welcome messages, rules, embeds, or find bots.`;
                actionPrompt = `\n\nWhen helpful, you can suggest actions using this exact format at the very end of your response: [ACTIONS][{"label": "Create a full server", "actionId": "NAV_SERVERBUILDER"}, {"label": "Browse Gallery", "actionId": "NAV_GALLERY"}]`;
                break;
            case 'results':
                instruction += `\n\nThe user is viewing their generated server template named "${context.serverName || 'Untitled Server'}" based on the prompt "${context.prompt || 'not specified'}". Help them understand the template and how to use it.`;
                actionPrompt = `\n\nWhen helpful, you can suggest actions using this exact format at the very end of your response: [ACTIONS][{"label": "View Channels", "actionId": "NAV_RESULTS_CHANNELS"}, {"label": "View Roles", "actionId": "NAV_RESULTS_ROLES"}, {"label": "See Setup Tutorial", "actionId": "NAV_RESULTS_TUTORIAL"}, {"label": "Find Bots", "actionId": "NAV_RESULTS_BOTS"}, {"label": "Use AI Toolkit", "actionId": "NAV_RESULTS_UTILITIES"}]`;
                break;
        }

        return instruction + actionPrompt;
    };

    const contextKey = `${context.view}-${context.serverName || ''}`;
    
    const historyForApi = history.slice(0, -1);
    // The Gemini API requires history to start with a user turn.
    // Our chatbot's first message is from the bot for UI purposes, so we need to filter it out.
    if (historyForApi.length > 0 && historyForApi[0].sender === 'bot') {
        historyForApi.shift(); // remove the first element (initial bot message)
    }
    
    const geminiHistory = historyForApi.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    if (!chat || contextKey !== lastContextKey) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: getSystemInstruction(),
            },
            history: geminiHistory,
        });
        lastContextKey = contextKey;
    }

    const userMessage = history[history.length - 1];
    if (userMessage.sender !== 'user') {
        console.error("Last message is not from user, aborting chat.");
        return;
    }

    const messageParts: (string | { inlineData: { data: string; mimeType: string; } })[] = [userMessage.text];

    if (file) {
        messageParts.push({
            inlineData: {
                data: file.base64Data,
                mimeType: file.mimeType
            }
        });
    }
    
    try {
        const stream = await chat.sendMessageStream({ message: messageParts });
        
        let fullText = '';
        for await (const chunk of stream) {
            const textChunk = chunk.text;
            fullText += textChunk;
            onUpdate(textChunk);
        }
        onComplete(fullText);

    } catch (e) {
        console.error("Failed to get chat response from Gemini stream:", e);
        onComplete("Sorry, I encountered an error. Please try again in a moment.");
    }
};

export const resetChat = () => {
    chat = null;
    lastContextKey = null;
};