
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Mode, AppSection, AppLanguage, AnswerPreference } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

// Helper to get client instance
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from process.env");
    // In a real app, we'd handle this better, but for this demo, we assume the environment injects it.
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// Text & Multimodal Generation
export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  currentMessage: string,
  mode: Mode,
  userName: string,
  section: AppSection,
  answerPreference: AnswerPreference,
  language: AppLanguage,
  imagePart?: { inlineData: { data: string; mimeType: string } }
) => {
  const ai = getAiClient();
  
  // Choose model based on complexity/mode
  // Using Pro for Deep/Developer/Creative for better reasoning, Flash for others
  const modelName = [Mode.DEEP, Mode.DEVELOPER, Mode.CREATIVE, Mode.FILMMAKER].includes(mode) 
    ? 'gemini-3-pro-preview' 
    : 'gemini-2.5-flash';

  const systemInstruction = SYSTEM_INSTRUCTION(mode, userName, section, answerPreference, language);

  try {
    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.parts
      })),
      {
        role: 'user',
        parts: imagePart ? [imagePart, { text: currentMessage }] : [{ text: currentMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in sendMessageToGemini:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};

// Image Generation
export const generateImage = async (prompt: string, style: string = 'realistic', aspectRatio: string = '1:1') => {
  const ai = getAiClient();
  try {
    // Erynto persona enhancement for prompt
    // Explicitly requesting exact likeness for famous figures/characters
    const enhancedPrompt = `${prompt} . Style: ${style}. High quality, detailed, accurate facial features. 
    INSTRUCTIONS:
    1. If a specific public figure, celebrity, or character is named in the prompt, generate their EXACT facial likeness and features.
    2. If NO specific public figure is named, generate a completely unique, photorealistic fictional person. Do not mimic a specific celebrity.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio as any
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// Image Editing
export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAiClient();
  try {
    // Parse the data URI to get mimeType and base64 data
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image string");
    }
    const mimeType = matches[1];
    const data = matches[2];
    
    // Enhance prompt for editing as well
    const enhancedPrompt = `${prompt}. Maintain high quality and realistic details. If a person is mentioned, ensure accurate facial features and likeness.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType
            }
          },
          {
            text: enhancedPrompt
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

// Video Generation (Veo)
export const generateVideo = async (prompt: string) => {
  // Ensure Key Selection for Veo
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  // Create a FRESH client instance after key selection to ensure updated key
  const ai = getAiClient();

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Append API key for download
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return null;

  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};

// Text to Speech
export const generateSpeech = async (text: string, voiceName: string = 'Zephyr') => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      // Reverted to raw data URI (PCM) which will fail to play in standard audio tags
      return `data:audio/mp3;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};
