import Game, { ILogEntry } from '../models/gameModel';
import Character, { ICharacter } from '../models/characterModel';
import { Types } from 'mongoose';
import { processAction, generateSkillCheckOutcome } from '../services/llmService';
import { DiceRoll } from 'rpg-dice-roller';
import { broadcastLogToGame } from '../services/webSocketService';

// An interface describing the minimum properties needed for stat/skill lookups
interface CharacterLike {
  stats: { [key: string]: number };
  skills: { name: string; value: number }[];
}

// A temporary, simplified character type for the mock data
interface TempCharacter extends CharacterLike {
    _id: Types.ObjectId;
    name: string;
    career: string;
    userId: Types.ObjectId;
  }

// Helper to add a log entry to the database and broadcast it
const addAndBroadcastLog = async (gameId: string, logEntry: Omit<ILogEntry, 'timestamp'>) => {
  const entryWithTimestamp: ILogEntry = { ...logEntry, timestamp: new Date() };
  await Game.findByIdAndUpdate(gameId, { $push: { log: entryWithTimestamp } });
  broadcastLogToGame(gameId, entryWithTimestamp);
};

const getCharacterStat = (character: CharacterLike, statName: string): number => {
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

export const handleManualRoll = async (gameId: string, command: string) => {
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      console.error(`Game not found for ID: ${gameId}`);
      return;
    }

    // Using the same mock character logic
    const character: TempCharacter = {
      _id: new Types.ObjectId(game.character.toString()),
      name: 'Grodni Ironhand',
      career: 'Dwarf Ironbreaker',
      stats: { WS: 45, BS: 30, S: 40, T: 50, I: 25, Ag: 20, Dex: 35, Int: 20, WP: 40, Fel: 15 },
      skills: [{ name: 'Melee (Basic)', value: 55 }, { name: 'Intimidate', value: 50 }],
      userId: new Types.ObjectId(),
    };

    // Save the command to the log without broadcasting, as the client already displayed it
    const entryWithTimestamp: ILogEntry = { type: 'player', content: command, timestamp: new Date() };
    await Game.findByIdAndUpdate(gameId, { $push: { log: entryWithTimestamp } });

    const commandArgs = command.substring(3).trim().split(' ');
    const diceNotation = commandArgs[0];
    const statToCheck = commandArgs[1];

    if (!diceNotation) {
      await addAndBroadcastLog(gameId, { type: 'system', content: 'Invalid roll command. Please provide dice notation (e.g., /r 1d100).' });
      return;
    }

    const roll = new DiceRoll(diceNotation);

    if (statToCheck) {
      const targetNumber = getCharacterStat(character, statToCheck);
      const success = roll.total <= targetNumber;
      const sl = Math.floor(targetNumber / 10) - Math.floor(roll.total / 10);
      const outcome = success ? `Success (SL ${sl})` : `Failure (SL ${sl})`;

      await addAndBroadcastLog(gameId, {
        type: 'roll',
        content: `${character.name} rolls ${roll.output} against a target of ${targetNumber} (${statToCheck.toUpperCase()}). Result: ${outcome}`,
      });
    } else {
      await addAndBroadcastLog(gameId, { type: 'roll', content: `${character.name} rolls ${roll.output}` });
    }
  } catch (error: any) {
    console.error('Error handling manual roll:', error);
    await addAndBroadcastLog(gameId, { type: 'system', content: `Error processing roll: ${error.message}` });
  }
};

export const handlePlayerAction = async (gameId: string, action: string) => {
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      console.error(`Game not found for ID: ${gameId}`);
      return;
    }

    // Using the same mock character logic from gameRoutes.ts
    const character: TempCharacter = {
      _id: new Types.ObjectId(game.character.toString()),
      name: 'Grodni Ironhand',
      career: 'Dwarf Ironbreaker',
      stats: { WS: 45, BS: 30, S: 40, T: 50, I: 25, Ag: 20, Dex: 35, Int: 20, WP: 40, Fel: 15 },
      skills: [{ name: 'Melee (Basic)', value: 55 }, { name: 'Intimidate', value: 50 }],
      userId: new Types.ObjectId(),
    };

    const context = game.log.map((entry: ILogEntry) => entry.content).join('\n');
    const characterInfo = { name: character.name, career: character.career };

    // The frontend already optimistically displays this, so we just add it to the DB
    await Game.findByIdAndUpdate(gameId, { $push: { log: { type: 'player', content: action, timestamp: new Date() } } });

        const llmResponse = await processAction(context, character, action);
    const skillCheck = extractJson(llmResponse);

    if (skillCheck && skillCheck.skill) {
      await addAndBroadcastLog(gameId, { type: 'system', content: `A ${skillCheck.skill} check is required.` });
      
      const targetStat = getCharacterStat(character, skillCheck.skill);
      const targetNumber = targetStat + (skillCheck.modifier || 0);
      const roll = new DiceRoll('d100').total;
      const success = roll <= targetNumber;
      const sl = Math.floor(targetNumber / 10) - Math.floor(roll / 10);

      await addAndBroadcastLog(gameId, { type: 'roll', content: `${character.name} rolls against a target of ${targetNumber} for ${skillCheck.skill}. Roll: ${roll}.` });
      await addAndBroadcastLog(gameId, { type: 'system', content: `Success Level: ${sl}. ${success ? 'Success!' : 'Failure.'}` });

      const outcomeNarrative = await generateSkillCheckOutcome(character, skillCheck.skill, success, sl);
      await addAndBroadcastLog(gameId, { type: 'narrative', content: outcomeNarrative });

    } else {
      await addAndBroadcastLog(gameId, { type: 'narrative', content: llmResponse });
    }

  } catch (error) {
    console.error('Error handling player action:', error);
    // Optionally, send an error message to the client
    broadcastLogToGame(gameId, { type: 'system', content: 'An error occurred on the server.', timestamp: new Date() });
  }
};
