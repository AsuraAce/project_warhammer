import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface CharacterInfo {
  name: string;
  career: string;
  stats: { [key: string]: number };
  skills: { name: string; value: number }[];
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
  const characterSheet = `
    Name: ${characterInfo.name}
    Career: ${characterInfo.career}
    Stats: ${JSON.stringify(characterInfo.stats)}
    Skills: ${JSON.stringify(characterInfo.skills.map(s => ({ [s.name]: s.value })))}`

  const prompt = `You are the Game Master for a Warhammer Fantasy Roleplay game, known for its gritty and perilous world.

**Current Situation:**
${context}

**Player Character:**
${characterSheet}

**Player's Action:**
"${action}"

**Your Task:**
Analyze the player's action and determine if a skill check is required based on their character sheet and the situation.

- **If a skill check is REQUIRED:**
  You MUST respond with ONLY a JSON object. Do not provide any other text, explanation, or markdown formatting.
  The JSON object must have this exact structure:
  {
    "skill": "[The name of the relevant skill or statistic from the character sheet]",
    "modifier": [A number representing the difficulty modifier (e.g., +20 for very easy, 0 for standard, -30 for very hard)]
  }
  Example: The player wants to sneak past a guard. You respond with: {"skill": "Stealth", "modifier": 0}

- **If a skill check is NOT required:**
  Describe the outcome of the action directly in a single, engaging narrative paragraph. Do not mention dice rolls or game mechanics.

Now, process the action.`;

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
