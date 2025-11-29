
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export enum Mode {
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  CREATIVE = 'Creative',
  DEEP = 'Deep',
  FAST = 'Fast',
  KID_FRIENDLY = 'Kid-Friendly',
  DEVELOPER = 'Developer',
  QUIET = 'Quiet',
  FILMMAKER = 'Filmmaker'
}

export enum AppSection {
  HOME = 'Home',
  CHAT = 'Chat',
  SPEAK = 'Speak',
  IMAGE = 'Generate Image',
  VIDEO = 'Generate Video',
  IMAGE_EDITOR = 'Image Editor'
}

export enum VoiceState {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  SPEAKING = 'speaking'
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum AppLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  ARABIC = 'ar'
}

export enum AnswerPreference {
  SHORT = 'Short',
  MEDIUM = 'Medium', // Includes "how the ai got it and why"
  LONG = 'Long',
  EXPLAINED = 'Explained'
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  imageUrl?: string; // For displayed images (generated or uploaded)
  videoUrl?: string; // For generated videos
  audioUrl?: string; // For generated voice
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

export interface UserSettings {
  name: string;
  mode: Mode;
  avatarUrl?: string; // Base64 or URL for user avatar
  theme: Theme;
  language: AppLanguage;
  answerPreference: AnswerPreference;
}

export interface UserStats {
  messagesSent: number;
  imagesGenerated: number;
  videosGenerated: number;
  voiceInteractions: number;
}

export interface GeneratedContent {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  prompt: string;
  timestamp: Date;
}

// Database Structure for User Account
export interface UserAccount {
  id: string;
  email: string;
  password: string; // Stored in simulated DB
  settings: UserSettings;
  stats: UserStats;
  gallery: GeneratedContent[];
  chats: ChatSession[];
}

export interface VoiceOption {
  id: string;
  name: string;
}

export interface SpeechLanguage {
  code: string;
  name: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    webkitAudioContext: typeof AudioContext;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    aistudio?: AIStudio;
  }
}
