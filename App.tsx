
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { ProfileModal } from './components/ProfileModal';
import { AuthPage } from './components/AuthPage';
import { VoiceInteractionPage } from './components/VoiceInteractionPage';
import { ImageGenerationPage } from './components/ImageGenerationPage';
import { ImageEditorPage } from './components/ImageEditorPage';
import { Message, Mode, Role, UserSettings, UserStats, GeneratedContent, AppSection, Theme, AppLanguage, AnswerPreference, UserAccount, ChatSession } from './types';
import { DEFAULT_USER_NAME, AI_NAME, TRANSLATIONS } from './constants';
import { sendMessageToGemini, generateImage, generateVideo, generateSpeech, editImage } from './services/geminiService';
import { checkSession, logout, updateUserAccount } from './services/authService';
import { Send, ImagePlus, Menu, Video as VideoIcon, X, Home, MessageSquare, Mic, MicOff, Image as ImageIcon, Camera } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // App State
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.HOME);
  
  // Chat History Management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null); // Null means no specific chat selected (or 'New Chat' pending)

  // Current View Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: Role.MODEL,
      text: `Hello! I am **${AI_NAME}**. Please select an option from the home menu to begin.`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Voice Input State for Chat
  const [isListeningToChatInput, setIsListeningToChatInput] = useState(false);
  const chatRecognitionRef = useRef<any>(null);
  
  // User Data State (Synced with UserAccount)
  const [settings, setSettings] = useState<UserSettings>({
    name: DEFAULT_USER_NAME,
    mode: Mode.PROFESSIONAL,
    theme: Theme.DARK,
    language: AppLanguage.ENGLISH,
    answerPreference: AnswerPreference.MEDIUM
  });
  
  const [stats, setStats] = useState<UserStats>({
    messagesSent: 0,
    imagesGenerated: 0,
    videosGenerated: 0,
    voiceInteractions: 0
  });
  const [gallery, setGallery] = useState<GeneratedContent[]>([]);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{file: File, preview: string} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Auth & Init ---

  useEffect(() => {
    // Check for existing session
    const user = checkSession();
    if (user) {
      setCurrentUser(user);
      setSettings(user.settings);
      setStats(user.stats);
      setGallery(user.gallery);
      setChatSessions(user.chats || []);
    }
    setIsLoadingSession(false);
  }, []);

  // Sync state changes to "database" whenever they change
  useEffect(() => {
    if (currentUser) {
      updateUserAccount(currentUser.id, {
        settings,
        stats,
        gallery,
        chats: chatSessions
      });
    }
  }, [settings, stats, gallery, chatSessions, currentUser]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (chatRecognitionRef.current) {
        chatRecognitionRef.current.stop();
      }
    };
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setSettings(user.settings);
    setStats(user.stats);
    setGallery(user.gallery);
    setChatSessions(user.chats || []);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentSection(AppSection.HOME);
    setChatSessions([]);
    setMessages([]);
    // Reset to defaults visually
    setSettings({ ...settings, theme: Theme.DARK }); 
  };

  // Translation Helper
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS[AppLanguage.ENGLISH];

  // Scroll to bottom effect for Chat
  useEffect(() => {
    if (currentSection === AppSection.CHAT) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentSection]);

  // Section Navigation
  const enterSection = (section: AppSection) => {
    setCurrentSection(section);
    
    // If entering CHAT and no chat is selected, initialize a "fresh" view
    if (section === AppSection.CHAT && !currentChatId) {
        startNewChatView();
    }
    setSidebarOpen(false);
  };

  const startNewChatView = () => {
     setCurrentChatId(null);
     setMessages([{
         id: Date.now().toString(),
         role: Role.MODEL,
         text: `I am ready for a new text conversation in **${settings.mode}** mode.`,
         timestamp: new Date()
     }]);
  };

  const handleHomeClick = () => {
    setCurrentSection(AppSection.HOME);
    setCurrentChatId(null);
    setSidebarOpen(false);
    
    // Stop voice input if active when leaving chat
    if (isListeningToChatInput && chatRecognitionRef.current) {
        chatRecognitionRef.current.stop();
        setIsListeningToChatInput(false);
    }
  };

  // --- Chat History Handlers ---

  const handleCreateNewChat = () => {
      enterSection(AppSection.CHAT);
      startNewChatView();
  };

  const handleSelectChat = (chatId: string) => {
      const chat = chatSessions.find(c => c.id === chatId);
      if (chat) {
          setCurrentChatId(chatId);
          setMessages(chat.messages);
          setCurrentSection(AppSection.CHAT);
      }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
      setChatSessions(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
  };

  const handleDeleteChat = (chatId: string) => {
      setChatSessions(prev => prev.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
          startNewChatView();
      }
  };

  // --- Handlers for Chat Page ---
  const toggleChatVoiceInput = () => {
    if (isListeningToChatInput) {
        if (chatRecognitionRef.current) chatRecognitionRef.current.stop();
        setIsListeningToChatInput(false);
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert(t.speechError || "Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    chatRecognitionRef.current = recognition;
    
    // Map AppLanguage to Speech Lang
    const langMap: Record<string, string> = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'ar': 'ar-SA'
    };
    recognition.lang = langMap[settings.language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListeningToChatInput(true);
    
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
            setInput(prev => {
                const prefix = prev && !prev.endsWith(' ') ? prev + ' ' : (prev || '');
                return prefix + transcript;
            });
        }
    };

    recognition.onerror = (event: any) => {
        console.error("Chat Speech Error:", event.error);
        setIsListeningToChatInput(false);
    };

    recognition.onend = () => {
        setIsListeningToChatInput(false);
    };

    recognition.start();
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isProcessing) return;

    setStats(prev => ({ ...prev, messagesSent: prev.messagesSent + 1 }));

    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      role: Role.USER,
      text: input,
      timestamp: new Date(),
      imageUrl: selectedImage?.preview
    };

    // Optimistic Update
    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsProcessing(true);

    // --- Chat Session Persistence Logic ---
    let activeChatId = currentChatId;
    let activeChatSessions = [...chatSessions];

    // If no active chat ID, create a NEW Session
    if (!activeChatId) {
        activeChatId = Date.now().toString();
        setCurrentChatId(activeChatId);
        
        // Title logic: Use first message text (truncated) or "Image Sent"
        let title = userMessage.text.slice(0, 30);
        if (userMessage.text.length > 30) title += '...';
        if (!title && userMessage.imageUrl) title = "Image Sent";
        if (!title) title = t.untitledChat;

        const newSession: ChatSession = {
            id: activeChatId,
            title: title,
            messages: newMessagesList, // Includes init message and user message
            updatedAt: new Date()
        };
        activeChatSessions.push(newSession);
        setChatSessions(activeChatSessions);
    } else {
        // Update existing session
        setChatSessions(prev => prev.map(s => s.id === activeChatId ? {
            ...s,
            messages: newMessagesList,
            updatedAt: new Date()
        } : s));
    }

    const thinkingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: thinkingId,
      role: Role.MODEL,
      text: '',
      timestamp: new Date(),
      isThinking: true
    }]);

    try {
        let imagePart = undefined;
        if (currentImage) {
           const base64 = currentImage.preview.split(',')[1];
           imagePart = { inlineData: { data: base64, mimeType: currentImage.file.type } };
        }

        // Use 'messages' (the state before this update) to construct history.
        // This prevents duplication because 'newMessagesList' contains the current message,
        // and 'sendMessageToGemini' appends the current message again.
        const historyForApi = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

        const responseText = await sendMessageToGemini(
          historyForApi, 
          userMessage.text, 
          settings.mode, 
          settings.name,
          AppSection.CHAT,
          settings.answerPreference,
          settings.language,
          imagePart
        );

        const finalModelMsg: Message = {
          id: thinkingId,
          role: Role.MODEL,
          text: responseText,
          timestamp: new Date(),
          isThinking: false
        };

        // Update View State
        setMessages(prev => prev.map(msg => msg.id === thinkingId ? finalModelMsg : msg));

        // Update Persistent Session State
        setChatSessions(prev => prev.map(s => s.id === activeChatId ? {
            ...s,
            messages: [...s.messages, finalModelMsg],
            updatedAt: new Date()
        } : s));

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
          id: thinkingId,
          role: Role.MODEL,
          text: "I apologize, but I encountered an unexpected error.",
          timestamp: new Date(),
          isThinking: false
      };
      setMessages(prev => prev.map(msg => msg.id === thinkingId ? errorMsg : msg));
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Handler for Voice Page ---
  const handleVoiceProcess = async (transcript: string, voiceName?: string, languageCode?: string): Promise<string | null> => {
     setStats(prev => ({ ...prev, voiceInteractions: prev.voiceInteractions + 1 }));
     
     // 1. Get Text Response from Gemini
     const responseText = await sendMessageToGemini(
        [], 
        transcript,
        settings.mode,
        settings.name,
        AppSection.SPEAK,
        settings.answerPreference,
        settings.language
     );

     // 2. Convert Text Response to Speech (passing voiceName if provided)
     const audioData = await generateSpeech(responseText, voiceName);
     return audioData;
  };

  // --- Handler for Image/Video Pages ---
  const handleGeneration = async (prompt: string, type: 'image' | 'video', style: string = 'realistic', aspectRatio: string = '1:1'): Promise<string | null> => {
      if (type === 'image') {
          const url = await generateImage(prompt, style, aspectRatio);
          if (url) {
            setStats(prev => ({ ...prev, imagesGenerated: prev.imagesGenerated + 1 }));
          }
          return url;
      } else {
          alert(t.videoDesc);
          return null;
      }
  };

  // --- Handler for Image Editor ---
  const handleImageEdit = async (file: File, instruction: string): Promise<string | null> => {
     const reader = new FileReader();
     return new Promise((resolve) => {
       reader.onloadend = async () => {
         const base64 = reader.result as string;
         const result = await editImage(base64, instruction);
         if (result) {
            setStats(prev => ({ ...prev, imagesGenerated: prev.imagesGenerated + 1 }));
         }
         resolve(result);
       };
       reader.readAsDataURL(file);
     });
  };

  const handleSaveToGallery = (content: GeneratedContent) => {
    setGallery(prev => [content, ...prev]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting the same file again if user deletes preview then decides to add it back
      e.target.value = '';
    }
  };

  const handlePlayAudio = async (text: string) => {
    setStats(prev => ({ ...prev, voiceInteractions: prev.voiceInteractions + 1 }));
    const audioData = await generateSpeech(text);
    if (audioData) {
      const audio = new Audio(audioData);
      audio.play();
    }
  };

  if (isLoadingSession) {
    return <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-emerald-500">Loading...</div>;
  }

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`${settings.theme}`}>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        
        {/* Sidebar */}
        <Sidebar 
          onLogout={handleLogout}
          userName={settings.name}
          userAvatar={settings.avatarUrl}
          onOpenProfile={() => setProfileOpen(true)}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          translations={t}
          chats={chatSessions}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleCreateNewChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />

        {/* Profile Modal */}
        <ProfileModal 
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
          stats={stats}
          userEmail={currentUser.email}
          userPassword={currentUser.password}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-20 transition-colors duration-300">
             <div className="flex items-center gap-3">
               <button 
                 onClick={handleHomeClick}
                 className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-slate-500 dark:text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-sm"
                 title="Home"
               >
                 <Home size={20} />
               </button>

               <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-800 dark:text-slate-300 ml-2">
                 <Menu size={24} />
               </button>
               
               <div className="hidden md:block">
                  <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight ml-2">Erynto</span>
                  <span className="text-slate-500 text-sm ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {currentSection === AppSection.HOME ? t.home : currentSection}
                  </span>
               </div>
             </div>
             
             <div className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-900/50">
               {settings.mode}
             </div>
          </div>

          {/* --- DYNAMIC PAGE CONTENT --- */}
          
          {/* 1. HOME PAGE */}
          {currentSection === AppSection.HOME && (
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 z-0 transition-colors duration-300"></div>
               
               {/* Animated Background Elements */}
               <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

               <div className="relative z-10 w-full max-w-4xl">
                 <div className="text-center mb-12">
                   <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-500 mb-4 tracking-tight">
                     {t.greeting}, {settings.name}.
                   </h1>
                   <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                     I am Erynto. {t.selectOption}
                   </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                   
                   {/* Card: Chat */}
                   <button 
                     onClick={() => enterSection(AppSection.CHAT)}
                     className="group relative overflow-hidden p-8 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20 text-left flex flex-col justify-between h-56"
                   >
                     <div className="bg-emerald-100 dark:bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                       <MessageSquare size={28} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.chat}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">{t.chatDesc}</p>
                     </div>
                   </button>

                   {/* Card: Speak (DISABLED) */}
                   <button 
                     onClick={() => alert(t.videoDesc)}
                     className="group relative overflow-hidden p-8 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 text-left flex flex-col justify-between h-56 opacity-80 cursor-not-allowed"
                   >
                     <div className="bg-blue-100 dark:bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                       <Mic size={28} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.speak}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">{t.videoDesc}</p>
                     </div>
                   </button>

                   {/* Card: Generate Image */}
                   <button 
                     onClick={() => enterSection(AppSection.IMAGE)}
                     className="group relative overflow-hidden p-8 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 text-left flex flex-col justify-between h-56"
                   >
                     <div className="bg-purple-100 dark:bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                       <ImageIcon size={28} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.image}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">{t.imageDesc}</p>
                     </div>
                   </button>

                   {/* Card: Image Editor */}
                   <button 
                     onClick={() => enterSection(AppSection.IMAGE_EDITOR)}
                     className="group relative overflow-hidden p-8 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-500/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-900/20 text-left flex flex-col justify-between h-56"
                   >
                     <div className="bg-pink-100 dark:bg-pink-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                       <Camera size={28} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.imageEditor}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">{t.imageEditorDesc}</p>
                     </div>
                   </button>

                   {/* Card: Generate Video (DISABLED) */}
                   <button 
                     onClick={() => alert(t.videoDesc)}
                     className="group relative overflow-hidden p-8 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-900/20 text-left flex flex-col justify-between h-56 opacity-80 cursor-not-allowed md:col-span-2 lg:col-span-2"
                   >
                     <div className="bg-orange-100 dark:bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                       <VideoIcon size={28} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.video}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">{t.videoDesc}</p>
                     </div>
                   </button>

                 </div>
               </div>
            </div>
          )}

          {/* 2. CHAT PAGE */}
          {currentSection === AppSection.CHAT && (
            <>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50 dark:bg-slate-950">
                <div className="max-w-4xl mx-auto">
                  {messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} onPlayAudio={handlePlayAudio} translations={t} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto">
                  {selectedImage && (
                    <div className="mb-2 inline-flex relative group">
                      <img src={selectedImage.preview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600" />
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 items-end">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="p-3 text-slate-400 hover:text-emerald-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all" 
                      disabled={isProcessing}
                      title="Upload Image"
                    >
                      <ImagePlus size={20} />
                    </button>

                    <button 
                      onClick={toggleChatVoiceInput}
                      className={`p-3 rounded-xl transition-all ${
                          isListeningToChatInput 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 animate-pulse' 
                            : 'text-slate-400 hover:text-emerald-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      disabled={isProcessing}
                      title="Voice Input"
                    >
                      {isListeningToChatInput ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <div className="flex-1 relative">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                             e.preventDefault();
                             handleSendMessage();
                           }
                        }}
                        placeholder={isListeningToChatInput ? t.listening : t.inputPlaceholder}
                        className={`w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none custom-scrollbar transition-all ${isListeningToChatInput ? 'border-emerald-500 ring-1 ring-emerald-500' : ''}`}
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                        disabled={isProcessing}
                      />
                    </div>

                    <button 
                      onClick={handleSendMessage}
                      disabled={(!input.trim() && !selectedImage) || isProcessing}
                      className={`p-3 rounded-xl transition-all flex items-center justify-center ${(!input.trim() && !selectedImage) || isProcessing ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}`}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 3. SPEAK PAGE */}
          {currentSection === AppSection.SPEAK && (
            <VoiceInteractionPage onProcessSpeech={handleVoiceProcess} translations={t} />
          )}

          {/* 4. IMAGE GENERATION PAGE */}
          {currentSection === AppSection.IMAGE && (
            <ImageGenerationPage 
              type="image" 
              onGenerate={(p, s, r) => handleGeneration(p, 'image', s, r)} 
              translations={t} 
              onSave={handleSaveToGallery}
            />
          )}

          {/* 5. IMAGE EDITOR PAGE */}
          {currentSection === AppSection.IMAGE_EDITOR && (
             <ImageEditorPage 
                onEdit={handleImageEdit} 
                translations={t} 
                onSave={handleSaveToGallery} 
             />
          )}

          {/* 6. VIDEO GENERATION PAGE - Unreachable normally due to Home button change */}
          {currentSection === AppSection.VIDEO && (
            <ImageGenerationPage 
              type="video" 
              onGenerate={(p) => handleGeneration(p, 'video')} 
              translations={t} 
              onSave={handleSaveToGallery}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default App;
