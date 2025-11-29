import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';
import { User, Bot, Volume2, Video, Image as ImageIcon } from 'lucide-react';
import { LoadingDots } from './LoadingDots';

interface MessageItemProps {
  message: Message;
  onPlayAudio: (text: string) => void;
  translations: any;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onPlayAudio, translations: t }) => {
  const isUser = message.role === Role.USER;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlayAudio(message.text);
    setTimeout(() => setIsPlaying(false), 2000); // Simple visual feedback reset
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-md
            ${isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
            }`}>
            
            {/* Thinking Indicator */}
            {message.isThinking ? (
              <LoadingDots />
            ) : (
              <>
                {/* Text Content */}
                {message.text && (
                   <div className="prose prose-sm max-w-none dark:prose-invert">
                     <ReactMarkdown>{message.text}</ReactMarkdown>
                   </div>
                )}

                {/* Inline Image Display (User Uploaded) */}
                {message.imageUrl && !message.text.includes("Generated Image") && (
                   <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                     <img src={message.imageUrl} alt="Uploaded" className="max-w-full h-auto max-h-64 object-contain" />
                   </div>
                )}

                {/* Generated Image Display */}
                {message.imageUrl && message.text.includes("Generated Image") && (
                   <div className="mt-3">
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><ImageIcon size={12}/> {t.generatedResult}</p>
                     <div className="rounded-lg overflow-hidden border border-emerald-500/30 dark:border-emerald-900/50 shadow-lg">
                       <img src={message.imageUrl} alt="Generated" className="w-full h-auto" />
                     </div>
                   </div>
                )}

                {/* Generated Video Display */}
                {message.videoUrl && (
                  <div className="mt-3">
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Video size={12}/> {t.generatedResult}</p>
                    <video controls className="w-full rounded-lg border border-emerald-500/30 dark:border-emerald-900/50">
                      <source src={message.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                {/* Generated Audio Player */}
                {message.audioUrl && (
                  <div className="mt-3 w-full bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg">
                    <audio controls autoPlay src={message.audioUrl} className="w-full h-8" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Row for Bot */}
          {!isUser && !message.isThinking && (
            <div className="flex gap-2 mt-1 ml-1">
              <button 
                onClick={handlePlay}
                className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                title="Read Aloud"
              >
                <Volume2 size={14} className={isPlaying ? "animate-pulse text-emerald-500" : ""} />
              </button>
            </div>
          )}
          
          {/* Timestamp */}
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 mx-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};