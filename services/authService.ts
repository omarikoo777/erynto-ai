
import { UserAccount, UserSettings, UserStats, GeneratedContent, Mode, Theme, AppLanguage, AnswerPreference } from '../types';
import { DEFAULT_USER_NAME } from '../constants';

const DB_KEY = 'erynto_users_db';
const SESSION_KEY = 'erynto_current_session';

// Initial default state for a new user
const DEFAULT_SETTINGS: UserSettings = {
  name: DEFAULT_USER_NAME,
  mode: Mode.PROFESSIONAL,
  theme: Theme.DARK,
  language: AppLanguage.ENGLISH,
  answerPreference: AnswerPreference.MEDIUM
};

const DEFAULT_STATS: UserStats = {
  messagesSent: 0,
  imagesGenerated: 0,
  videosGenerated: 0,
  voiceInteractions: 0
};

// --- Helper Functions ---

const getDb = (): UserAccount[] => {
  const dbStr = localStorage.getItem(DB_KEY);
  if (!dbStr) return [];
  try {
    const parsed = JSON.parse(dbStr);
    // Revive dates in gallery if needed
    return parsed.map((u: any) => ({
        ...u,
        gallery: u.gallery.map((g: any) => ({...g, timestamp: new Date(g.timestamp)})),
        chats: u.chats ? u.chats.map((c: any) => ({
          ...c,
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: any) => ({...m, timestamp: new Date(m.timestamp)}))
        })) : []
    }));
  } catch (e) {
    return [];
  }
};

const saveDb = (users: UserAccount[]) => {
  try {
      localStorage.setItem(DB_KEY, JSON.stringify(users));
  } catch (e) {
      console.warn("QuotaExceededError: LocalStorage is full. Content may not be saved.");
  }
};

const isValidEmail = (email: string): boolean => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- Public Auth Methods ---

export const signup = (email: string, password: string, name: string): UserAccount => {
  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error("Email is not valid.");
  }

  const users = getDb();
  
  // Check if email exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("This email is already registered.");
  }

  const newUser: UserAccount = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: password, // In a real app, this MUST be hashed. Storing plain text for demo only.
    settings: { ...DEFAULT_SETTINGS, name: name || DEFAULT_USER_NAME },
    stats: { ...DEFAULT_STATS },
    gallery: [],
    chats: []
  };

  users.push(newUser);
  saveDb(users);
  
  // Auto login
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));
  
  return newUser;
};

export const login = (email: string, password: string): UserAccount => {
  const users = getDb();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, timestamp: Date.now() }));
  return user;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const checkSession = (): UserAccount | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    const users = getDb();
    const user = users.find(u => u.id === session.userId);
    return user || null;
  } catch {
    return null;
  }
};

// --- Data Sync Methods ---

export const updateUserAccount = (userId: string, updates: Partial<UserAccount>) => {
  const users = getDb();
  const index = users.findIndex(u => u.id === userId);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveDb(users);
  }
};
