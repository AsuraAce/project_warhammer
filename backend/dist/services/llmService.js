"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAction = exports.generateStory = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
// Initialize the Google Generative AI client
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
// A basic function to generate story content
const generateStory = async (prompt) => {
    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text.trim();
    }
    catch (error) {
        const errorMessage = `Timestamp: ${new Date().toISOString()}\nError: ${error.stack}\n\n`;
        fs_1.default.appendFileSync('gemini_error.log', errorMessage);
        console.error('Error calling Gemini API. Details logged to gemini_error.log');
        return 'The story could not be generated at this time.';
    }
};
exports.generateStory = generateStory;
// A function to process a player's action
const processAction = async (context, characterInfo, action) => {
    const prompt = `You are the Game Master for a Warhammer Fantasy Roleplay game. The current situation is: ${context}. The character, ${characterInfo.name} the ${characterInfo.career}, decides to: "${action}". Describe what happens next, keeping the tone of the Warhammer world (dark, gritty, perilous).`;
    return await (0, exports.generateStory)(prompt);
};
exports.processAction = processAction;
