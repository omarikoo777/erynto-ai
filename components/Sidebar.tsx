import React, { useState, useEffect } from 'react';
import { LogOut, User, ChevronRight, MessageSquarePlus, MessageSquare, MoreHorizontal, Trash2, Edit2, Check } from 'lucide-react';
import { ChatSession } from '../types';
import { APP_LOGO_URL } from '../constants';

interface SidebarProps {
  onLogout: () => void;
  userName: string;
  userAvatar?: string;
  onOpenProfile: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  translations: any;
  chats: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onLogout, 
  userName, 
  userAvatar,
  onOpenProfile,
  isOpen,
  toggleSidebar,
  translations: t,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [activeMenuChatId, setActiveMenuChatId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuChatId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const startEditing = (e: React.MouseEvent, chat: ChatSession) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setActiveMenuChatId(null);
  };

  const saveEditing = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle);
    }
    setEditingChatId(null);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6 mt-2">
            <img 
              src={APP_LOGO_URL} 
              alt="Erynto" 
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-emerald-500/20"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Erynto</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI Assistant</p>
            </div>
          </div>

          <button 
            onClick={() => { onNewChat(); if(window.innerWidth < 768) toggleSidebar(); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md shadow-emerald-500/20 group"
          >
            <MessageSquarePlus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{t.newChat}</span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider px-4 mb-2 mt-2">{t.chatHistory}</h3>
          
          <div className="space-y-1">
            {chats.length === 0 && (
              <p className="px-4 text-sm text-slate-400 italic py-2">No conversations yet.</p>
            )}
            
            {chats.slice().reverse().map((chat) => (
              <div 
                key={chat.id}
                onClick={() => { onSelectChat(chat.id); if(window.innerWidth < 768) toggleSidebar(); }}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors border border-transparent
                  ${currentChatId === chat.id 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <MessageSquare size={16} className={`shrink-0 ${currentChatId === chat.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                
                {editingChatId === chat.id ? (
                  <div className="flex items-center flex-1 gap-1">
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                    <button 
                      onClick={(e) => saveEditing(e, chat.id)}
                      className="p-1 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="text-sm truncate flex-1 pr-6">{chat.title || t.untitledChat}</span>
                )}

                {/* Kebab Menu (Click Triggered) */}
                {editingChatId !== chat.id && (
                  <div className={`absolute right-2 flex items-center bg-inherit transition-opacity ${activeMenuChatId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                     <div className="relative">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveMenuChatId(activeMenuChatId === chat.id ? null : chat.id);
                         }}
                         className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors
                           ${activeMenuChatId === chat.id ? 'text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}
                         `}
                       >
                         <MoreHorizontal size={16} />
                       </button>

                       {/* Dropdown Content */}
                       {activeMenuChatId === chat.id && (
                         <div 
                           className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                           onClick={(e) => e.stopPropagation()}
                         >
                           <button 
                             onClick={(e) => startEditing(e, chat)}
                             className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 first:rounded-t-lg transition-colors"
                           >
                             <Edit2 size={12} /> {t.rename}
                           </button>
                           <button 
                             onClick={(e) => { 
                               e.stopPropagation(); 
                               onDeleteChat(chat.id);
                               setActiveMenuChatId(null);
                             }}
                             className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400 last:rounded-b-lg transition-colors"
                           >
                             <Trash2 size={12} /> {t.delete}
                           </button>
                         </div>
                       )}
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
            {/* User Profile Card */}
            <button 
              onClick={onOpenProfile}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all group text-left mb-3"
             >
               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600 group-hover:border-emerald-500/50 transition-colors">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-slate-500 dark:text-slate-400" />
                  )}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userName}</p>
                 <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                   {t.settings} <ChevronRight size={10} className="ml-1" />
                 </p>
               </div>
             </button>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors text-sm"
            >
              <LogOut size={16} />
              {t.logout}
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center mt-3">
              {t.createdBy} Omar Alsaharty
            </p>
        </div>
      </div>
    </>
  );
};