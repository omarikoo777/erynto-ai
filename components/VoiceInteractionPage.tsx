import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader, Settings, X } from 'lucide-react';
import { VoiceState } from '../types';
import { VOICE_PRESETS, SPEECH_LANGUAGES } from '../constants';

interface VoiceInteractionPageProps {
  onProcessSpeech: (text: string) => Promise<string | null>; // Returns audio URL
  translations: any;
}

export const VoiceInteractionPage: React.FC<VoiceInteractionPageProps> = ({ onProcessSpeech, translations: t }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Voice Settings State
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Update language dynamically
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setVoiceState(VoiceState.PROCESSING);
        
        // Process with AI (Settings ignored in reverted state)
        const audioUrl = await onProcessSpeech(text);
        
        if (audioUrl) {
          setVoiceState(VoiceState.SPEAKING);
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => {
                console.error("Playback failed", e);
                setVoiceState(VoiceState.IDLE);
                setError("Audio playback failed.");
            });
          }
        } else {
          setVoiceState(VoiceState.IDLE);
          setError("I couldn't generate a voice response.");
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setVoiceState(VoiceState.IDLE);
        if (event.error === 'no-speech') {
            setError("No speech detected. Please try again.");
        } else {
            setError(t.micError);
        }
      };

      recognitionRef.current.onend = () => {
        if (voiceState === VoiceState.LISTENING) {
          // If stopped without result, go to idle
          setVoiceState(VoiceState.IDLE);
        }
      };
    } else {
      setError(t.speechError);
    }

    // Audio Ended Handler
    if (audioRef.current) {
        audioRef.current.onended = () => {
            setVoiceState(VoiceState.IDLE);
            setTranscript('');
        };
    }
  }, [voiceState, onProcessSpeech, selectedLanguage, t]); // selectedVoice removed from dependency as it is not used in onProcessSpeech

  const handleMicClick = () => {
    setError(null);
    if (voiceState === VoiceState.IDLE) {
      setVoiceState(VoiceState.LISTENING);
      setTranscript(t.listening);
      try {
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
      } catch (e) {
        console.error("Start error", e);
        setVoiceState(VoiceState.IDLE);
      }
    } else if (voiceState === VoiceState.LISTENING) {
      recognitionRef.current?.stop();
      setVoiceState(VoiceState.IDLE);
    } else if (voiceState === VoiceState.SPEAKING) {
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setVoiceState(VoiceState.IDLE);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <audio ref={audioRef} className="hidden" onEnded={() => setVoiceState(VoiceState.IDLE)} />

      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors z-30"
      >
        <Settings size={24} />
      </button>

      {/* Voice Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">{t.voiceSettings}</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Voice Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.aiVoice}</label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICE_PRESETS.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border
                        ${selectedVoice === voice.id 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'}`}
                    >
                      {voice.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.inputLanguage}</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-emerald-500"
                >
                  {SPEECH_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Animated Background Pulse */}
      {voiceState !== VoiceState.IDLE && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] transition-all duration-1000
          ${voiceState === VoiceState.LISTENING ? 'bg-blue-600/20 animate-pulse' : ''}
          ${voiceState === VoiceState.PROCESSING ? 'bg-purple-600/20' : ''}
          ${voiceState === VoiceState.SPEAKING ? 'bg-emerald-600/20 animate-pulse' : ''}
        `}></div>
      )}

      {/* Status Text */}
      <div className="absolute top-20 text-center z-10 w-full px-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-all">
          {voiceState === VoiceState.IDLE ? t.tapToSpeak : 
           voiceState === VoiceState.LISTENING ? t.listening : 
           voiceState === VoiceState.PROCESSING ? t.thinking : t.speaking}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {voiceState === VoiceState.IDLE ? t.idleTip : transcript || "..."}
        </p>
      </div>

      {/* Main Interaction Button */}
      <button 
        onClick={handleMicClick}
        className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl
          ${voiceState === VoiceState.IDLE 
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:scale-105 border border-slate-200 dark:border-slate-700' 
            : voiceState === VoiceState.LISTENING 
              ? 'bg-blue-600 text-white scale-110 shadow-blue-500/50'
              : voiceState === VoiceState.PROCESSING
                ? 'bg-purple-600 text-white scale-95 shadow-purple-500/50'
                : 'bg-emerald-600 text-white scale-110 shadow-emerald-500/50'
          }`}
      >
        {voiceState === VoiceState.PROCESSING ? (
           <Loader size={40} className="animate-spin" />
        ) : voiceState === VoiceState.SPEAKING ? (
           <div className="flex gap-1 items-center h-8">
             <div className="w-1.5 bg-white animate-bounce [animation-delay:-0.3s] h-full rounded-full"></div>
             <div className="w-1.5 bg-white animate-bounce [animation-delay:-0.15s] h-3/4 rounded-full"></div>
             <div className="w-1.5 bg-white animate-bounce h-full rounded-full"></div>
           </div>
        ) : (
           <Mic size={40} />
        )}
      </button>

      {/* Cancel/Stop Button (Only when active) */}
      {voiceState !== VoiceState.IDLE && (
        <button 
          onClick={() => {
            if(recognitionRef.current) recognitionRef.current.stop();
            if(audioRef.current) audioRef.current.pause();
            setVoiceState(VoiceState.IDLE);
          }}
          className="absolute bottom-12 z-20 px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm font-medium hover:bg-red-100 hover:text-red-500 transition-colors"
        >
          {t.tapToStop}
        </button>
      )}

      {error && (
        <div className="absolute bottom-24 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-900/50 animate-fade-in">
          {error}
        </div>
      )}

    </div>
  );
};