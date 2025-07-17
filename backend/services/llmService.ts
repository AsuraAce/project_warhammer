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
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

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
  const prompt = `You are the Game Master for a Warhammer Fantasy Roleplay game. The current situation is: ${context}. The character, ${characterInfo.name} the ${characterInfo.career}, decides to: "${action}".

Determine if this action requires a skill check. 
- If NO skill check is needed, describe what happens next in a narrative paragraph.
- If YES, a skill check is required, respond with ONLY a JSON object in the format: {"skill": "[Skill Name]", "modifier": [modifier value as a number]}. Do not include any other text or explanation. For example: {"skill": "Stealth", "modifier": -10}`;

  return await generateStory(prompt);
};

/**
 * Generates a narrative for the outcome of a skill check.
 * @param characterInfo Information about the character.
 * @param skill The skill being tested.
 * @param success Whether the check was a success or failure.
 * @param sl The success level of the roll.
 * @returns The generated narrative as a string.
 */
export const generateSkillCheckOutcome = async (characterInfo: CharacterInfo, skill: string, success: boolean, sl: number): Promise<string> => {
  const outcome = success ? `succeeds with a success level of ${sl}` : `fails with a success level of ${sl}`;
  const prompt = `You are the Game Master for a Warhammer Fantasy Roleplay game. The character, ${characterInfo.name} the ${characterInfo.career}, attempts a ${skill} check and ${outcome}. Describe the result of this action in a narrative paragraph, keeping the tone of the Warhammer world (dark, gritty, perilous).`;

  return await generateStory(prompt);
};
