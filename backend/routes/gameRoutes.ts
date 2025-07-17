import { Router, Request, Response } from 'express';
import Game, { ILogEntry } from '../models/gameModel';
import Character from '../models/characterModel';
import { Types } from 'mongoose';
import { generateStory, processAction, generateSkillCheckOutcome } from '../services/llmService';
import { rollD100 } from '../utils/dice';
import { ICharacter } from '../models/characterModel';

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
    console.log('[GAME START] Received request.');
    const { characterId } = req.body;
    console.log(`[GAME START] Character ID from request: ${characterId}`);

    if (!characterId) {
      return res.status(400).json({ msg: 'Character ID is required' });
    }

    // --- TEMPORARY FIX: Bypass database lookup and use a mock character --- 
    console.log(`[GAME START] Bypassing database lookup for character ID: ${characterId}`);
    const character = {
      _id: new Types.ObjectId(characterId),
      name: 'Grodni Ironhand',
      career: 'Dwarf Ironbreaker',
      userId: new Types.ObjectId(), // Fake user ID for now
    };
    console.log(`[GAME START] Using mock character: ${character.name}`);
    // --- END TEMPORARY FIX ---

    const initialPrompt = `You are a Game Master for a Warhammer Fantasy Roleplay game. Your player is ${character.name}, a ${character.career}. The adventure begins in a dimly lit tavern in Ubersreik. Describe the scene.`;
    console.log('[GAME START] Generating initial story with LLM...');
    const initialNarrative = await generateStory(initialPrompt);
    console.log('[GAME START] Initial story generated successfully.');

    const newGameData = {
      character: characterId,
      userId: character.userId,
      log: [{ type: 'system', content: initialNarrative, timestamp: new Date() }],
    };
    console.log('[GAME START] Preparing to create new game with data:', newGameData);
    
    const newGame = new Game(newGameData);
    console.log('[GAME START] Saving new game to database...');
    await newGame.save();
    console.log('[GAME START] New game saved successfully. ID:', newGame._id);

    res.json(newGame);

  } catch (err: any) {
    console.error('[GAME START] An error occurred:', err.stack);
    res.status(500).send('Server Error');
  }
});

const extractJson = (str: string): any | null => {
  const jsonMatch = str.match(/```json\n?(\{[\s\S]*\})\n?```|(\{[\s\S]*\})/);
  if (!jsonMatch) {
    return null;
  }
  const jsonString = jsonMatch[1] || jsonMatch[2];
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse extracted JSON:', error);
    return null;
  }
};

const getCharacterStat = (character: ICharacter, statName: string): number => {
  const normalizedStatName = statName.replace(/\s+/g, '').toLowerCase();
  const stats = character.stats as any;
  const statKey = Object.keys(stats).find(k => k.toLowerCase() === normalizedStatName);
  if (statKey) {
    return stats[statKey];
  }

  const skill = character.skills.find(s => s.name.replace(/\s+/g, '').toLowerCase() === normalizedStatName);
  if (skill) {
    return skill.value;
  }

  return 30; // Default fallback
};

// @route   POST /api/game/:id/action
// @desc    Process a player action
// @access  Private
router.post('/:id/action', async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });

    // --- TEMPORARY FIX: Bypass database lookup and use a mock character ---
    console.log(`[GAME ACTION] Bypassing database lookup for character ID: ${game.character}`);
    const character = {
      _id: new Types.ObjectId(game.character.toString()),
      name: 'Grodni Ironhand',
      career: 'Dwarf Ironbreaker',
      stats: { WS: 45, BS: 30, S: 40, T: 50, I: 25, Ag: 20, Dex: 35, Int: 20, WP: 40, Fel: 15 },
      skills: [{ name: 'Melee (Basic)', value: 55 }, { name: 'Intimidate', value: 50 }],
      userId: new Types.ObjectId(), // Fake user ID for now
    } as ICharacter;
    console.log(`[GAME ACTION] Using mock character: ${character.name}`);
    // --- END TEMPORARY FIX ---

    const context = game.log.map((entry: ILogEntry) => entry.content).join('\n');
    const characterInfo: CharacterInfo = { name: character.name, career: character.career };

    game.log.push({ type: 'player', content: action, timestamp: new Date() });

    const llmResponse = await processAction(context, characterInfo, action);
    const skillCheck = extractJson(llmResponse);

    if (skillCheck && skillCheck.skill) {
      const targetStat = getCharacterStat(character, skillCheck.skill);
      const targetNumber = targetStat + (skillCheck.modifier || 0);
      const roll = rollD100();
      const success = roll <= targetNumber;
      const sl = Math.floor(targetNumber / 10) - Math.floor(roll / 10);

      game.log.push({ type: 'system', content: `A ${skillCheck.skill} check is required.`, timestamp: new Date() });
      game.log.push({ type: 'roll', content: `${character.name} rolls against a target of ${targetNumber} for ${skillCheck.skill}. Roll: ${roll}.`, timestamp: new Date() });
      game.log.push({ type: 'system', content: `Success Level: ${sl}. ${success ? 'Success!' : 'Failure.'}`, timestamp: new Date() });

      const outcomeNarrative = await generateSkillCheckOutcome(characterInfo, skillCheck.skill, success, sl);
      game.log.push({ type: 'narrative', content: outcomeNarrative, timestamp: new Date() });
    } else {
      game.log.push({ type: 'narrative', content: llmResponse, timestamp: new Date() });
    }

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
