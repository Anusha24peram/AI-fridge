
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Recipe, DietaryRestriction, Ingredient } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper for decoding base64 to bytes
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper for decoding PCM data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const analyzeFridgeImage = async (base64Image: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Identify all visible food ingredients in this fridge. Return only a simple JSON array of strings containing the ingredient names. Be concise (e.g., 'Milk', 'Eggs', 'Spinach')." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error analyzing fridge:", error);
    return [];
  }
};

export const getRecipeSuggestions = async (
  fridgeIngredients: string[], 
  pantryItems: Ingredient[],
  restriction: DietaryRestriction
): Promise<Recipe[]> => {
  const pantryInfo = pantryItems.map(i => `${i.name}${i.quantity ? ` (${i.quantity})` : ''}`).join(', ');
  
  // Calculate items expiring soon to prioritize them
  const expiringSoon = pantryItems.filter(i => {
    if (!i.expiryDate) return false;
    const diff = new Date(i.expiryDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 3;
  }).map(i => i.name).join(', ');

  const prompt = `Available in fridge: ${fridgeIngredients.join(', ')}. 
    Available in pantry with quantities: ${pantryInfo}.
    Dietary restriction: ${restriction}.
    ${expiringSoon ? `URGENT: The following items are expiring very soon or are expired. PLEASE PRIORITIZE using these in the recipes: ${expiringSoon}.` : ''}
    
    Suggest 3 highly relevant and creative recipes based strictly on the ingredients available in the fridge and pantry.
    Consider the quantities provided for pantry items to ensure they are sufficient for the recipes suggested.
    
    Return a JSON array of objects with:
    - id (unique string)
    - name (the recipe name)
    - difficulty (Easy, Medium, Hard)
    - prepTime (e.g., '20 min')
    - calories (number)
    - description (short, punchy summary)
    - imageDescription (detailed visual description for image generation, e.g. 'A ceramic bowl of creamy tomato soup topped with fresh basil and a side of sourdough bread')
    - ingredients (array of {name, isMissing})
    - steps (array of strings)
    - rating (float 3.5-5.0)
    - reviewCount (number)
    - recentReviews (array of {userName, rating, comment, date})`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              prepTime: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              description: { type: Type.STRING },
              imageDescription: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              reviewCount: { type: Type.NUMBER },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    isMissing: { type: Type.BOOLEAN }
                  }
                }
              },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recentReviews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    userName: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    comment: { type: Type.STRING },
                    date: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error suggesting recipes:", error);
    return [];
  }
};

export const generateRecipeImage = async (description: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Professional food photography, close-up shot of ${description}. Cinematic lighting, depth of field, vibrant colors, appetizing styling.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const speakStep = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this cooking step clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputAudioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Error playing TTS:", error);
  }
};
