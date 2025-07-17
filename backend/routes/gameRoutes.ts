import { Router, Request, Response } from 'express';
import Game, { ILogEntry } from '../models/gameModel';
import Character from '../models/characterModel';
import { generateStory, processAction } from '../services/llmService';

const router = Router();

// Interface for Character info passed to the LLM service
interface CharacterInfo {
  name: string;
  career: string;
}

// @route   POST /api/game/start
// @desc    Start a new game
// @access  Private
router.post('/start', async (req: Request, res: Response) => {
  try {
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

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/game/:id/action
// @desc    Process a player action
// @access  Private
router.post('/:id/action', async (req: Request, res: Response) => {
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

    const context = game.log.map((entry: ILogEntry) => entry.content).join('\n');
    const characterInfo: CharacterInfo = { name: character.name, career: character.career };

    // Add the player's action to the log
    game.log.push({ type: 'player', content: action, timestamp: new Date() });

    const gmResponse = await processAction(context, characterInfo, action);

    // Add the GM's response to the log
    game.log.push({ type: 'system', content: gmResponse, timestamp: new Date() });
    await game.save();

    res.json(game);
  } catch (err: any) {
    console.error('--- DETAILED ERROR ---');
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(err.stack);
    console.error('--- END DETAILED ERROR ---');
    res.status(500).send('Server Error');
  }
});

export default router;
