import React, { useRef } from 'react';
import { UserSettings, UserStats, Mode, Theme, AppLanguage, AnswerPreference, UserAccount } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, Camera, Activity, Moon, Sun, Globe, AlignLeft, User, Mail, Lock } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  stats: UserStats;
  userEmail?: string;
  userPassword?: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  stats,
  userEmail,
  userPassword
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;
  
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS[AppLanguage.ENGLISH];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateSettings({
          ...settings,
          avatarUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar bg-slate-50 dark:bg-slate-950">
          
          {/* Profile Header Section (Name & Avatar) */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-lg">
                {settings.avatarUrl ? (
                  <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-slate-500 dark:text-slate-400" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarUpload} 
              />
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t.username}</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => onUpdateSettings({ ...settings, name: e.target.value })}
                className="w-full bg-transparent text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none py-1 mt-1 text-center md:text-left"
                placeholder={t.username}
              />
            </div>
          </div>

          {/* Account Details (Email & Password - Read Only / Visual) */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2 mb-2">
                   <Mail size={14}/> {t.email}
                </label>
                <div className="text-slate-700 dark:text-slate-300 font-mono text-sm truncate">
                   {userEmail || 'user@example.com'}
                </div>
             </div>
             <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2 mb-2">
                   <Lock size={14}/> {t.password}
                </label>
                <div className="text-slate-700 dark:text-slate-300 font-mono text-sm">
                   {userPassword ? '•'.repeat(Math.min(userPassword.length, 12)) : '••••••••'}
                </div>
             </div>
          </div>

          {/* --- Settings Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            
            {/* Mode Selection */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity size={16} /> {t.aiPersonality}
              </h3>
              <div className="relative">
                <select
                  value={settings.mode}
                  onChange={(e) => onUpdateSettings({ ...settings, mode: e.target.value as Mode })}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {Object.values(Mode).map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Answer Preference */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlignLeft size={16} /> {t.answerStyle}
              </h3>
              <div className="relative">
                <select
                  value={settings.answerPreference}
                  onChange={(e) => onUpdateSettings({ ...settings, answerPreference: e.target.value as AnswerPreference })}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {Object.values(AnswerPreference).map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                {settings.theme === Theme.DARK ? <Moon size={16} /> : <Sun size={16} />} {t.theme}
              </h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: Theme.LIGHT })}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${settings.theme === Theme.LIGHT ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                >
                  {t.modeLight}
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: Theme.DARK })}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${settings.theme === Theme.DARK ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                >
                  {t.modeDark}
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe size={16} /> {t.language}
              </h3>
              <div className="relative">
                <select
                  value={settings.language}
                  onChange={(e) => onUpdateSettings({ ...settings, language: e.target.value as AppLanguage })}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                >
                   {Object.values(AppLanguage).map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};