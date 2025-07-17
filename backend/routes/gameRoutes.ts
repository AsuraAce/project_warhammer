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

    const initialNarrative = `The air in the Drunken Mug tavern is thick with the smell of stale ale, cheap pipe smoke, and unwashed bodies. A low fire sputters in the hearth, casting long, dancing shadows across the room. You sit alone at a rickety table, nursing a lukewarm drink as you watch the tavern's other patrons—a motley collection of weathered soldiers, shifty-eyed locals, and a boisterous group of river-traders. The world outside the tavern's grimy windows is just as grim, but for now, this small pocket of flickering light offers a brief respite from the ever-present dangers of Ubersreik. What do you do?`;

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



export default router;
