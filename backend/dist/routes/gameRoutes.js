"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameModel_js_1 = __importDefault(require("../models/gameModel.js"));
const characterModel_js_1 = __importDefault(require("../models/characterModel.js"));
const llmService_js_1 = require("../services/llmService.js");
const router = (0, express_1.Router)();
// @route   POST /api/game/start
// @desc    Start a new game
// @access  Private
router.post('/start', async (req, res) => {
    try {
        const { characterId } = req.body;
        if (!characterId) {
            return res.status(400).json({ msg: 'Character ID is required' });
        }
        const character = await characterModel_js_1.default.findById(characterId);
        if (!character) {
            return res.status(404).json({ msg: 'Character not found' });
        }
        const initialPrompt = `You are a Game Master for a Warhammer Fantasy Roleplay game. Your player is ${character.name}, a ${character.career}. The adventure begins in a dimly lit tavern in Ubersreik. Describe the scene.`;
        const initialNarrative = await (0, llmService_js_1.generateStory)(initialPrompt);
        const newGame = new gameModel_js_1.default({
            character: characterId,
            userId: character.userId, // Assuming userId is on character
            log: [{ type: 'system', content: initialNarrative }],
        });
        await newGame.save();
        res.json(newGame);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   POST /api/game/:id/action
// @desc    Process a player action
// @access  Private
router.post('/:id/action', async (req, res) => {
    try {
        const { action } = req.body;
        const game = await gameModel_js_1.default.findById(req.params.id).populate('character');
        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }
        const character = await characterModel_js_1.default.findById(game.character);
        if (!character) {
            console.error(`CRITICAL: Character not found for ID: ${game.character}`);
            return res.status(404).json({ msg: 'Character data not found for this game.' });
        }
        const context = game.log.map((entry) => entry.content).join('\n');
        const characterInfo = { name: character.name, career: character.career };
        // Add the player's action to the log
        game.log.push({ type: 'player', content: action, timestamp: new Date() });
        const gmResponse = await (0, llmService_js_1.processAction)(context, characterInfo, action);
        // Add the GM's response to the log
        game.log.push({ type: 'system', content: gmResponse, timestamp: new Date() });
        await game.save();
        res.json(game);
    }
    catch (err) {
        console.error('--- DETAILED ERROR ---');
        console.error(`Timestamp: ${new Date().toISOString()}`);
        console.error(err.stack);
        console.error('--- END DETAILED ERROR ---');
        res.status(500).send('Server Error');
    }
});
exports.default = router;
