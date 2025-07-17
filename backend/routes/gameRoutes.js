const express = require('express');
const router = express.Router();
const Game = require('../models/gameModel');
const Character = require('../models/characterModel');
const { generateStory, processAction } = require('../services/llmService');

// @route   POST /api/game/start
// @desc    Start a new game
// @access  Private
router.post('/start', async (req, res) => {
  try {
    // For now, we'll assume a character is created and its ID is passed.
    // In the future, this would be linked to the authenticated user.
    const { characterId } = req.body;

    if (!characterId) {
      return res.status(400).json({ msg: 'Character ID is required' });
    }

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ msg: 'Character not found' });
    }

    const initialPrompt = `You are a Game Master for a Warhammer Fantasy Roleplay game. Your player is ${character.name}, a ${character.career}. The adventure begins in a dimly lit tavern in Ubersreik. Describe the scene.`;
    
    const initialNarrative = await generateStory(initialPrompt);

    const newGame = new Game({
      character: characterId,
      userId: character.userId, // Assuming userId is on character
      log: [{ type: 'system', content: initialNarrative }],
    });

    await newGame.save();
    res.json(newGame);

  } catch (err) {
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
    const game = await Game.findById(req.params.id).populate('character');

    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    const character = await Character.findById(game.character);

    if (!character) {
      console.error(`CRITICAL: Character not found for ID: ${game.character}`);
      return res.status(404).json({ msg: 'Character data not found for this game.' });
    }

    const context = game.log.map(entry => entry.content).join('\n');
    const characterInfo = { name: character.name, career: character.career };

    // Add the player's action to the log
    game.log.push({ type: 'player', content: action });

    const gmResponse = await processAction(context, characterInfo, action);

    // Add the GM's response to the log
    game.log.push({ type: 'system', content: gmResponse });
    await game.save();

    res.json(game);
  } catch (err) {
    console.error('--- DETAILED ERROR ---');
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(err.stack);
    console.error('--- END DETAILED ERROR ---');
    res.status(500).send('Server Error');
  }
});

module.exports = router;
