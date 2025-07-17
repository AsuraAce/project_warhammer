const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// A basic function to generate story content
const generateStory = async (prompt) => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    const errorMessage = `Timestamp: ${new Date().toISOString()}\nError: ${error.stack}\n\n`;
    fs.appendFileSync('gemini_error.log', errorMessage);
    console.error('Error calling Gemini API. Details logged to gemini_error.log');
    return 'The story could not be generated at this time.';
  }
};

// A function to process a player's action
const processAction = async (context, characterInfo, action) => {
  const prompt = `You are the Game Master for a Warhammer Fantasy Roleplay game. The current situation is: ${context}. The character, ${characterInfo.name} the ${characterInfo.career}, decides to: "${action}". Describe what happens next, keeping the tone of the Warhammer world (dark, gritty, perilous).`;

  return await generateStory(prompt);
};

module.exports = { generateStory, processAction };
