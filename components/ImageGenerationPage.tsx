
import React, { useState } from 'react';
import { Send, Image as ImageIcon, Video, Download, Save, Check, Palette, Ratio } from 'lucide-react';
import { GeneratedContent } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface ImageGenerationPageProps {
  type: 'image' | 'video';
  onGenerate: (prompt: string, style?: string, aspectRatio?: string) => Promise<string | null>;
  translations: any;
  onSave?: (content: GeneratedContent) => void;
}

export const ImageGenerationPage: React.FC<ImageGenerationPageProps> = ({ type, onGenerate, translations: t, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [aspectRatioIndex, setAspectRatioIndex] = useState(0); // Default to 0 -> "1:1"
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [currentPromptDisplay, setCurrentPromptDisplay] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // List of available styles with translation keys
  const styles = [
    { id: 'Realistic', label: t.styleRealistic },
    { id: 'Anime', label: t.styleAnime },
    { id: 'Cartoon', label: t.styleCartoon },
    { id: 'Logo', label: t.styleLogo },
    { id: 'Cinematic', label: t.styleCinematic },
    { id: 'Minimal', label: t.styleMinimal },
    { id: 'Fantasy', label: t.styleFantasy },
    { id: '3D Render', label: t.style3D },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentPromptDisplay(prompt);
    setGeneratedUrl(null);
    setIsSaved(false);

    // Pass selected style and aspect ratio only if it's image generation
    const styleToUse = type === 'image' ? selectedStyle : undefined;
    const ratioToUse = type === 'image' ? ASPECT_RATIOS[aspectRatioIndex] : undefined;
    
    const result = await onGenerate(prompt, styleToUse, ratioToUse);
    
    setGeneratedUrl(result);
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (generatedUrl && onSave && !isSaved) {
      onSave({
        id: Date.now().toString(),
        type: type,
        url: generatedUrl,
        prompt: currentPromptDisplay + (type === 'image' ? ` [${selectedStyle}, ${ASPECT_RATIOS[aspectRatioIndex]}]` : ''),
        timestamp: new Date()
      });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar h-full">
      
      {/* Input Section - Increased max-width by ~1.5x (3xl -> 5xl) */}
      <div className="w-full max-w-5xl mx-auto mb-4 md:mb-8 shrink-0">
         <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            {type === 'image' ? <ImageIcon className="text-purple-500 dark:text-purple-400"/> : <Video className="text-orange-500 dark:text-orange-400"/>}
            {type === 'image' ? t.image : t.video}
         </h2>

         {/* Style & Aspect Ratio Selectors (Only for Images) */}
         {type === 'image' && (
           <div className="flex flex-col md:flex-row gap-6 mb-4">
             {/* Style Selector */}
             <div className="flex-1">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                 <Palette size={14} /> {t.selectStyle}
               </label>
               <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                 {styles.map((style) => (
                   <button
                     key={style.id}
                     onClick={() => setSelectedStyle(style.id)}
                     className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                       ${selectedStyle === style.id 
                         ? 'bg-purple-600 text-white border-purple-600' 
                         : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'}`}
                   >
                     {style.label}
                   </button>
                 ))}
               </div>
             </div>

             {/* Aspect Ratio Slider */}
             <div className="w-full md:w-64">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                  <Ratio size={14} /> {t.aspectRatio} <span className="text-emerald-500 font-bold ml-1">{ASPECT_RATIOS[aspectRatioIndex]}</span>
                </label>
                <div className="relative px-2 py-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="4" 
                    step="1" 
                    value={aspectRatioIndex}
                    onChange={(e) => setAspectRatioIndex(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    {ASPECT_RATIOS.map((ratio, idx) => (
                      <span key={ratio} className={idx === aspectRatioIndex ? 'text-emerald-500 font-bold' : ''}>{ratio}</span>
                    ))}
                  </div>
                </div>
             </div>
           </div>
         )}

         <div className="relative">
            {/* Textarea - Increased height significantly */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={type === 'image' ? t.placeholderImage : t.placeholderVideo}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 pr-16 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none h-40 md:h-52 shadow-sm"
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all
                ${!prompt.trim() || isGenerating 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg'}`}
            >
              <Send size={20} />
            </button>
         </div>
      </div>

      {/* Result Display Box - Increased max-width (4xl -> 6xl) and min-height (45vh -> 65vh) */}
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col min-h-0">
        <div className={`relative flex-1 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex flex-col items-center justify-center transition-all w-full
          ${generatedUrl ? 'border-solid border-slate-200 dark:border-slate-800' : ''}
          min-h-[65vh]
        `}>
          
          {/* Empty State */}
          {!isGenerating && !generatedUrl && (
             <div className="text-center p-8">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600">
                 {type === 'image' ? <ImageIcon size={32} /> : <Video size={32} />}
               </div>
               <p className="text-slate-500 dark:text-slate-500 text-base md:text-lg">{t.emptyContent}</p>
             </div>
          )}

          {/* Loading State */}
          {isGenerating && (
             <div className="text-center p-8">
               <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
               <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">{t.generating}</h3>
               <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto italic text-sm md:text-base">"{currentPromptDisplay}" {type === 'image' && <span className="text-xs opacity-75">({selectedStyle}, {ASPECT_RATIOS[aspectRatioIndex]})</span>}</p>
             </div>
          )}

          {/* Result State */}
          {generatedUrl && (
            <div className="relative w-full h-full bg-slate-100 dark:bg-black flex items-center justify-center group">
              {type === 'image' ? (
                <img src={generatedUrl} alt="Generated" className="max-w-full max-h-full object-contain" />
              ) : (
                <video src={generatedUrl} controls className="max-w-full max-h-full" />
              )}
              
              {/* Overlay Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 {onSave && (
                   <button 
                     onClick={handleSave}
                     disabled={isSaved}
                     className={`p-2 rounded-lg backdrop-blur-sm transition-colors shadow-sm flex items-center gap-2
                       ${isSaved ? 'bg-emerald-500/90 text-white' : 'bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 text-slate-900 dark:text-white'}`}
                     title="Save to Gallery"
                   >
                     {isSaved ? <Check size={20} /> : <Save size={20} />}
                     <span className="text-xs font-semibold hidden md:inline">{isSaved ? 'Saved' : 'Save'}</span>
                   </button>
                 )}
                 <a 
                   href={generatedUrl} 
                   download={`generated-${type}-${Date.now()}`}
                   className="p-2 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 text-slate-900 dark:text-white rounded-lg backdrop-blur-sm transition-colors shadow-sm"
                   title={t.download}
                 >
                   <Download size={20} />
                 </a>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                 <p className="text-white text-xs md:text-sm line-clamp-1 opacity-90">
                   {currentPromptDisplay} {type === 'image' && <span className="opacity-75 text-[10px] md:text-xs border border-white/30 px-1 rounded ml-2">{selectedStyle} | {ASPECT_RATIOS[aspectRatioIndex]}</span>}
                 </p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
