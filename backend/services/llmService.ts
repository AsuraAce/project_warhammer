import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface CharacterInfo {
  name: string;
  career: string;
}

// A basic function to generate story content
export const generateStory = async (prompt: string): Promise<string> => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error: any) {
    const errorMessage = `Timestamp: ${new Date().toISOString()}\nError: ${error.stack}\n\n`;
    fs.appendFileSync('gemini_error.log', errorMessage);
    console.error('Error calling Gemini API. Details logged to gemini_error.log');
    return 'The story could not be generated at this time.';
  }
};

// A function to process a player's action
export const processAction = async (context: string, characterInfo: CharacterInfo, action: string): Promise<string> => {
  const prompt = `You are the Game Master for a Warhammer Fantasy Roleplay game. The current situation is: ${context}. The character, ${characterInfo.name} the ${characterInfo.career}, decides to: "${action}". Describe what happens next, keeping the tone of the Warhammer world (dark, gritty, perilous).`;

  return await generateStory(prompt);
};
