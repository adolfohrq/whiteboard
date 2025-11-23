import { GoogleGenAI, Type } from '@google/genai';
import { showError, showLoading, dismissToast } from '../utils/toast';
import { handleError } from '../utils/errorHandling';

// Safely access process.env to avoid "Uncaught ReferenceError: process is not defined" in browser
const API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

// Initialize the client with the API key
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateIdeas = async (topic: string): Promise<string[]> => {
  if (!API_KEY) {
    showError('Missing API Key. Please configure your GEMINI_API_KEY in .env.local');
    return [];
  }

  const toastId = showLoading('Generating ideas...');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 short, creative, and distinct ideas related to the topic: "${topic}". Keep them concise (under 15 words each).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    dismissToast(toastId);

    if (response.text) {
      const ideas = JSON.parse(response.text);
      return Array.isArray(ideas) ? ideas : [];
    }
    return [];
  } catch (error) {
    dismissToast(toastId);
    handleError(error, 'AI Brainstorm');
    return [];
  }
};

export const expandContent = async (currentContent: string): Promise<string> => {
  if (!API_KEY) {
    showError('Missing API Key');
    return currentContent;
  }

  const toastId = showLoading('Expanding content with AI...');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Expand on the following text to make it a more complete thought or paragraph. Keep the tone professional but creative. Text: "${currentContent}"`,
    });

    dismissToast(toastId);
    return response.text || currentContent;
  } catch (error) {
    dismissToast(toastId);
    handleError(error, 'AI Content Expansion');
    return currentContent;
  }
};

export const analyzeBoard = async (itemsContent: string[]): Promise<string> => {
  if (!API_KEY) {
    showError('Missing API Key');
    return 'API Key missing.';
  }

  const toastId = showLoading('Analyzing board...');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here are the contents of a creative board: ${JSON.stringify(itemsContent)}. summarized the main theme and suggest one next step for this project.`,
    });

    dismissToast(toastId);
    return response.text || 'Could not analyze board.';
  } catch (error) {
    dismissToast(toastId);
    handleError(error, 'Board Analysis');
    return 'Error analyzing board.';
  }
};
