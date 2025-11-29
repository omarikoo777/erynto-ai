import React, { useState, useRef } from 'react';
import { Upload, X, Send, Download, Save, Check, Image as ImageIcon, Sparkles, Loader } from 'lucide-react';
import { GeneratedContent } from '../types';

interface ImageEditorPageProps {
  onEdit: (file: File, instruction: string) => Promise<string | null>;
  translations: any;
  onSave?: (content: GeneratedContent) => void;
}

export const ImageEditorPage: React.FC<ImageEditorPageProps> = ({ onEdit, translations: t, onSave }) => {
  const [sourceImage, setSourceImage] = useState<{ file: File; preview: string } | null>(null);
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage({
          file,
          preview: reader.result as string
        });
        setResultImage(null);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       if (!file.type.startsWith('image/')) return;
       const reader = new FileReader();
       reader.onloadend = () => {
        setSourceImage({
          file,
          preview: reader.result as string
        });
        setResultImage(null);
        setIsSaved(false);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage || !instruction.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await onEdit(sourceImage.file, instruction);
      if (result) {
        setResultImage(result);
      }
    } catch (e) {
      console.error(e);
      // Optional: Add toast or error display here
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (resultImage && onSave && !isSaved) {
      onSave({
        id: Date.now().toString(),
        type: 'image',
        url: resultImage,
        prompt: `Edit: ${instruction}`,
        timestamp: new Date()
      });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar">
       <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
         <div className="flex items-center gap-3 mb-6 shrink-0">
           <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
             <Sparkles size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.imageEditor}</h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm">{t.imageEditorDesc}</p>
           </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            
            {/* Left Column: Input */}
            <div className="space-y-4 flex flex-col h-full">
              
              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-2xl h-64 lg:h-1/2 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                  ${sourceImage 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400'
                  }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                 
                 {sourceImage ? (
                   <div className="relative w-full h-full p-4">
                     <img src={sourceImage.preview} alt="Source" className="w-full h-full object-contain rounded-xl" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                       <p className="text-white font-medium flex items-center gap-2"><Upload size={20}/> Change Image</p>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center p-6">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Upload size={24} />
                     </div>
                     <p className="text-slate-900 dark:text-white font-medium mb-1">{t.uploadImage}</p>
                     <p className="text-slate-500 text-sm">{t.dragDrop}</p>
                   </div>
                 )}
              </div>

              {/* Instruction Input */}
              <div className="relative flex-1">
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder={t.describeEdits}
                  className="w-full h-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-slate-900 dark:text-white"
                  style={{ minHeight: '120px' }}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!sourceImage || !instruction.trim() || isProcessing}
                  className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all shadow-lg
                    ${!sourceImage || !instruction.trim() || isProcessing
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                >
                  {isProcessing ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>

            </div>

            {/* Right Column: Result */}
            <div className={`border rounded-2xl h-[500px] lg:h-full flex items-center justify-center relative bg-slate-100 dark:bg-black/50 overflow-hidden transition-all
               ${resultImage ? 'border-emerald-500/30' : 'border-slate-200 dark:border-slate-800'}
            `}>
               {!resultImage && !isProcessing && (
                 <div className="text-center text-slate-400 dark:text-slate-600">
                   <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                   <p>{t.emptyContent}</p>
                 </div>
               )}

               {isProcessing && (
                 <div className="text-center">
                   <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="text-slate-500 dark:text-slate-400 animate-pulse">{t.generating}</p>
                 </div>
               )}

               {resultImage && (
                 <>
                   <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain" />
                   
                   <div className="absolute top-4 right-4 flex gap-2 z-10">
                      {onSave && (
                        <button 
                          onClick={handleSave}
                          disabled={isSaved}
                          className={`p-2 rounded-lg backdrop-blur-sm transition-colors shadow-sm flex items-center gap-2
                            ${isSaved ? 'bg-emerald-500/90 text-white' : 'bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 text-slate-900 dark:text-white'}`}
                        >
                          {isSaved ? <Check size={20} /> : <Save size={20} />}
                        </button>
                      )}
                      <a 
                        href={resultImage}
                        download={`edited-image-${Date.now()}.png`}
                        className="p-2 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 text-slate-900 dark:text-white rounded-lg backdrop-blur-sm shadow-sm"
                      >
                        <Download size={20} />
                      </a>
                   </div>
                 </>
               )}
            </div>

         </div>
       </div>
    </div>
  );
};
