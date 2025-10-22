import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ServerTemplate, EmbedMessagePayload, TutorialStep, BotRecommendation, Embed, Category, Role, ChatMessage } from '../types.ts';

const API_KEY = process.env.API_KEY;


if (!API_KEY) {
    console.error("API_KEY environment variable not set. Please configure it.");
}

const isPromptValid = async (prompt: string): Promise<boolean> => {
    const trimmedPrompt = prompt.trim();
    const lowercasedPrompt = trimmedPrompt.toLowerCase();

    if (lowercasedPrompt === 'server' || lowercasedPrompt === 'svr') {
        return false;
    }
    
    const repeatingCharsRegex = /(.)\1{4,}/;
    if (repeatingCharsRegex.test(trimmedPrompt)) {
        return false;
    }

    return true;
}

export const generateServerTemplateStream = async (
    prompt: string,
    onUpdate: (template: ServerTemplate) => void
): Promise<void> => {
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
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
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const fullPrompt = `
    You are a Discord message design expert. Your task is to generate the JSON for a beautiful and effective Discord embed message based on a user's prompt. You must adhere to the provided JSON schema precisely.

    User's Request: "${prompt}"

    **Guidelines:**
    - **Title & Description:** Craft a compelling title and description from the user's prompt. The description can use simple Discord markdown like **bold**.
    - **Color:** Choose a single, appropriate hex color and convert it to its integer representation.
    - **Fields:** Create 2-3 relevant fields. Each field must have a name, a value, and an 'inline' boolean status.
    - **Images:** If appropriate, suggest a placeholder thumbnail or image URL. Use a relevant, high-quality image URL from a public source like postimg.cc or imgur.com.
    - **Footer:** The footer text must be the server name: "${serverName}".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: embedSchema,
            },
        });
        const jsonText = response.text.trim();
        const embed = JSON.parse(jsonText) as Embed;
        return { embeds: [embed] };
    } catch (e) {
        console.error("Failed to generate embed message with Gemini:", e);
        throw new Error("Failed to generate embed message.");
    }
};

const botRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        purpose: { type: Type.STRING, description: "A single category like 'Moderation', 'Music', 'Engagement', 'Utility'." },
        description: { type: Type.STRING },
        keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
        inviteLink: { type: Type.STRING, description: "The official, valid invite link for the bot." },
    },
    required: ['name', 'purpose', 'description', 'keyFeatures', 'inviteLink']
};

const botListSchema = {
    type: Type.OBJECT,
    properties: {
        bots: {
            type: Type.ARRAY,
            items: botRecommendationSchema
        }
    },
    required: ['bots']
};


export const generateBotRecommendations = async (template: ServerTemplate, originalPrompt: string): Promise<BotRecommendation[]> => {
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const fullPrompt = `
    You are a Discord bot expert. Your task is to recommend the 2 best, most popular, and reliable Discord bots for a server with the theme "${originalPrompt}". The output must be a valid JSON object containing a list of 2 bot recommendations.

    For each bot, provide:
    1. 'name': The bot's official name.
    2. 'purpose': A single, concise category (e.g., "Moderation", "Music", "Engagement", "Utility").
    3. 'description': A short, compelling one-sentence summary of what the bot does.
    4. 'keyFeatures': A list of 2-3 of the bot's most important or useful features.
    5. 'inviteLink': The official, working invite link for the bot.

    The recommendations should be highly relevant to the server's theme. For example, a gaming server needs moderation and maybe a music or game-stats bot. A study server might need a utility bot for reminders or a music bot for focus.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: botListSchema,
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


export const generateIcon = async (prompt: string): Promise<string> => {
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("No image was generated by the API.");
        }

    } catch (e) {
        console.error("Failed to generate icon with Gemini:", e);
        throw e;
    }
};


export const startChatStream = async (
    history: ChatMessage[],
    onUpdate: (chunk: string) => void,
    onComplete: (fullMessage: string) => void,
    context: { view: string; serverName?: string | null; prompt?: string | null },
    file?: { base64Data: string; mimeType: string } | null
) => {
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const systemInstruction = `
        You are "Flame", an expert AI assistant for the Discord Server Builder application. Be helpful, concise, and friendly.
        Your goal is to guide users, answer questions about the app's features, and help them build their ideal Discord server.
        - Analyze the user's message and the conversation history.
        - Provide relevant information and suggestions.
        - You can suggest actions for the user to take within the app. To do this, you MUST end your response with a special block: [ACTIONS][{"label": "Button Text", "actionId": "ACTION_ID"}].
        - Use simple markdown for formatting (bold, lists).

        Available actionIds:
        - NAV_TOOLKIT: Navigate to the AI Toolkit page.
        - NAV_SERVERBUILDER: Navigate to the main server builder (home) page.
        - NAV_GALLERY: Navigate to the template gallery.
        - SCROLL_EXAMPLES: Scroll to the examples section on the homepage.
        - SCROLL_FEATURES: Scroll to the features section on the homepage.
        - SCROLL_HOWITWORKS: Scroll to the "How It Works" section on the homepage.
        - NAV_RESULTS_CHANNELS: On the results page, jump to the Channels & Categories section.
        - NAV_RESULTS_ROLES: On the results page, jump to the Roles & Hierarchy section.
        - NAV_RESULTS_UTILITIES: On the results page, jump to the AI Toolkit section.
        - NAV_RESULTS_BOTS: On the results page, jump to the Bot Setup section.
        - NAV_RESULTS_TUTORIAL: On the results page, jump to the Setup Tutorial section.
        
        Current context:
        - The user is on the "${context.view}" page.
        - Server being viewed/edited (if any): "${context.serverName || 'None'}"
        - The original prompt for the server (if any): "${context.prompt || 'None'}"
    `;

    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    
    if (file) {
      const lastUserMessage = contents[contents.length - 1];
      if (lastUserMessage.role === 'user') {
          // FIX: Cast the `parts` array to `any[]` to allow pushing multimodal content.
          // TypeScript infers `parts` as `({text: string})[]` initially, which caused an error.
          (lastUserMessage.parts as any[]).push({
              inlineData: {
                  data: file.base64Data,
                  mimeType: file.mimeType,
              },
          });
      }
    }


    try {
        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        let fullMessage = '';
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            fullMessage += chunkText;
            onUpdate(chunkText);
        }
        onComplete(fullMessage);

    } catch (e) {
        console.error("Chat stream failed:", e);
        onComplete("Sorry, I encountered an error. Please try again.");
    }
};

export const generateChatTopic = async (messages: ChatMessage[]): Promise<string> => {
    if (!API_KEY) throw new Error("API Key is not configured.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const conversation = messages.slice(1, 4).map(m => `${m.sender}: ${m.text}`).join('\n');
    
    const prompt = `
        Summarize the following conversation into a short, concise topic title (4 words maximum).
        Conversation:
        ${conversation}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.replace(/["']/g, ""); // Remove quotes
    } catch (e) {
        console.error("Failed to generate chat topic:", e);
        return "Chat Summary";
    }
};