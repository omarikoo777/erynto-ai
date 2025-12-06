import React, { useState, useRef } from 'react';
import { Upload, Send, Download, Save, Check, Image as ImageIcon, Sparkles, Loader } from 'lucide-react';
import { GeneratedContent } from '../types';

interface ImageEditorPageProps {
  onEdit?: (file: File, instruction: string) => Promise<string | null>;
  translations?: {
    imageEditor?: string;
    imageEditorDesc?: string;
    uploadImage?: string;
    dragDrop?: string;
    describeEdits?: string;
    emptyContent?: string;
    generating?: string;
  };
  onSave?: (content: GeneratedContent) => void;
}

export const ImageEditorPage: React.FC<ImageEditorPageProps> = ({ 
  onEdit, 
  translations: t = {}, 
  onSave 
}) => {
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
        setSourceImage({ file, preview: reader.result as string });
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
        setSourceImage({ file, preview: reader.result as string });
        setResultImage(null);
        setIsSaved(false);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage || !instruction.trim() || isProcessing || !onEdit) return;
    
    setIsProcessing(true);
    try {
      const result = await onEdit(sourceImage.file, instruction);
      if (result) setResultImage(result);
    } catch (e) {
      console.error("Image generation failed:", e);
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
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.imageEditor || "Image Editor"}</h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm">{t.imageEditorDesc || "Upload and edit your images."}</p>
           </div>
         </div>

         {/* Rest of your JSX unchanged, now safe with fallbacks */}
         {/* ... */}
       </div>
    </div>
  );
};
