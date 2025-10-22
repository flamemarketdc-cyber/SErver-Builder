export interface Role {
  name: string;
  permissions: string[];
  color: string;
  hoist: boolean;
}

export interface Channel {
  name: string;
  type: 'text' | 'voice';
  topic: string;
}

export interface Category {
  name: string;
  channels: Channel[];
}

export interface ServerSettings {
  verificationLevel: string;
  explicitContentFilter: string;
  defaultNotifications: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface EmbedFooter {
    text: string;
}

export interface Embed {
  title: string;
  description: string;
  color: number;
  fields: EmbedField[];
  footer: EmbedFooter;
  thumbnail?: { url: string; };
  image?: { url: string; };
}

export interface EmbedMessagePayload {
  embeds: Embed[];
}

export interface TutorialStep {
  title: string;
  description: string;
}

export interface BotRecommendation {
    name: string;
    purpose: string;
    description: string;
    keyFeatures: string[];
    inviteLink: string;
}

// Fix: Add ServerEmoji interface to be exported.
export interface ServerEmoji {
  name: string;
  description: string;
  imageUrl?: string | null;
  isLoading?: boolean;
}

export type Section = 'Channels' | 'Roles' | 'Utilities' | 'Bots' | 'Tutorial';

export interface ServerTemplate {
  id?: string;
  serverName: string;
  vanityUrlSuggestion: string;
  serverIconPrompt: string;
  roles: Role[];
  categories: Category[];
  serverSettings: ServerSettings;
  setupTutorial?: TutorialStep[];
  welcomeMessage?: string;
  serverRules?: string;
  firstAnnouncement?: string;
  embedMessage?: EmbedMessagePayload;
  botRecommendations?: BotRecommendation[];
  // Fix: Add optional emojis property.
  emojis?: ServerEmoji[];
  iconUrl?: string;
  tagline?: string;
  isStreaming?: boolean;
  publishedAt?: any;
}

export interface ChatAction {
  label: string;
  actionId: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  actions?: ChatAction[];
}