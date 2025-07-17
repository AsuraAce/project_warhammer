import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import Creature from '../models/creatureModel';
import Career from '../models/careerModel';
import Trapping from '../models/trappingModel';
import Spell from '../models/spellModel';
import Talent from '../models/talentModel';
import Skill from '../models/skillModel';
import Reference from '../models/referenceModel';

dotenv.config({ path: path.resolve(__dirname, '../.env.development') });

const importData = async () => {
  let dbConnected = false;
  try {
    await connectDB();
    dbConnected = true;
    console.log('Database connected for seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await Creature.deleteMany({});
    await Career.deleteMany({});
    await Trapping.deleteMany({});
    await Spell.deleteMany({});
    await Talent.deleteMany({});
    await Skill.deleteMany({});
    await Reference.deleteMany({});
    console.log('All collections cleared.');

    const extractData = (filePath: string, dataKey: string) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      for (const entry of Object.values(jsonData.entries) as any[]) {
        try {
          const content = JSON.parse(entry.content);
          if (content[dataKey] && Array.isArray(content[dataKey])) {
            return content[dataKey];
          }
        } catch (e) {
          // Ignore entries with malformed content
        }
      }
      return [];
    };

    // --- Import Creatures ---
    const creaturesPath = path.resolve(__dirname, '../../data/Warhammer (WFRP 4e) - 11. Bestiary.json');
    const creaturesToInsert = extractData(creaturesPath, 'bestiary');
    console.log(`Found ${creaturesToInsert.length} creatures to import.`);
    if (creaturesToInsert.length > 0) {
        const createdCreatures = await Creature.insertMany(creaturesToInsert);
        console.log(`${createdCreatures.length} creatures imported!`);
    }

    // --- Import Careers ---
    const careersPath = path.resolve(__dirname, '../../data/Warhammer (WFRP 4e) - 05. Career Paths.json');
    const careersFile = fs.readFileSync(careersPath, 'utf-8');
    const careersData = JSON.parse(careersFile);
    const careersToInsert = Object.values(careersData.entries).map((entry: any) => {
        try {
            const content = JSON.parse(entry.content);
            const careerKey = Object.keys(content)[0];
            if(content[careerKey] && content[careerKey].title) return content[careerKey];
            return null;
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
    console.log(`Found ${careersToInsert.length} careers to import.`);
    if (careersToInsert.length > 0) {
        const createdCareers = await Career.insertMany(careersToInsert);
        console.log(`${createdCareers.length} careers imported!`);
    }

    // --- Import Trappings ---
    const trappingsPath = path.resolve(__dirname, '../../data/Warhammer (WFRP 4e) - 12. Trappings.json');
    const trappingsFile = fs.readFileSync(trappingsPath, 'utf-8');
    const trappingsData = JSON.parse(trappingsFile);
    const trappingsToInsert = (Object.values(trappingsData.entries) as any[])
      .filter(entry => entry.uid !== 0) // Skip the metadata entry
      .map(entry => {
        const name = entry.key[0] || 'Unnamed Trapping';
        const description = entry.content || 'No description.';
        const id = entry.uid.toString();
        let category = 'General';
        if (entry.comment && entry.comment.startsWith('Trapping: ')) {
          category = entry.comment.replace('Trapping: ', '');
        }

        return {
          id,
          name,
          description,
          category,
          price: { gc: 0, ss: 0, bp: 0 }, // Default price
          encumbrance: 0, // Default encumbrance
          availability: 'Common', // Default availability
        };
      });
    console.log(`Found ${trappingsToInsert.length} trappings to import.`);
    if (trappingsToInsert.length > 0) {
        const createdTrappings = await Trapping.insertMany(trappingsToInsert);
        console.log(`${createdTrappings.length} trappings imported!`);
    }

    // --- Import Spells ---
    const spellsPath = path.resolve(__dirname, '../../data/Warhammer (WFRP 4e) - 13. Magic Spells.json');
    const spellsToInsert = extractData(spellsPath, 'spells');
    console.log(`Found ${spellsToInsert.length} spells to import.`);
    if (spellsToInsert.length > 0) {
        const createdSpells = await Spell.insertMany(spellsToInsert);
        console.log(`${createdSpells.length} spells imported!`);
    }

    // --- Import Talents ---
    const talentsPath = path.resolve(__dirname, '../../data/Warhammer (WFRP 4e) - 07. Talents.json');
    const talentsToInsert = extractData(talentsPath, 'talents');
    console.log(`Found ${talentsToInsert.length} talents to import.`);
    if (talentsToInsert.length > 0) {
        const createdTalents = await Talent.insertMany(talentsToInsert);
        console.log(`${createdTalents.length} talents imported!`);
    }

    // --- Import Skills ---
    const skillsPath = path.resolve(__dirname, '../../data/Warhammer (WFRP 4e) - 06. Skills.json');
    const skillsToInsert = extractData(skillsPath, 'skills');
    console.log(`Found ${skillsToInsert.length} skills to import.`);
    if (skillsToInsert.length > 0) {
        const createdSkills = await Skill.insertMany(skillsToInsert);
        console.log(`${createdSkills.length} skills imported!`);
    }

    // --- Import Reference Materials ---
    const importReferenceData = async (fileName: string, sourceName: string, idPrefix: string) => {
      const filePath = path.resolve(__dirname, `../../data/${fileName}`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      const itemsToInsert = (Object.values(jsonData.entries) as any[])
        .map(entry => {
          let content;
          try {
            content = JSON.parse(entry.content);
          } catch (e) {
            content = entry.content;
          }
          return {
            id: `${idPrefix}-${entry.uid.toString()}`,
            title: entry.comment || 'Untitled',
            content: content,
            source: sourceName,
          };
        });

      console.log(`Found ${itemsToInsert.length} items from ${sourceName}.`);
      if (itemsToInsert.length > 0) {
        const createdItems = await Reference.insertMany(itemsToInsert);
        console.log(`${createdItems.length} items from ${sourceName} imported!`);
      }
    };

    await importReferenceData('Warhammer (WFRP 4e) - 01. Reference Material.json', 'Reference Material', 'ref');
    await importReferenceData('Warhammer (WFRP 4e) - 02. Reference Guidelines.json', 'Reference Guidelines', 'guide');
    await importReferenceData("Warhammer (WFRP 4e) - 03. SOP's (New).json", 'SOPs', 'sop');
    await importReferenceData('Warhammer (WFRP 4e) - 04. Cheat Sheets.json', 'Cheat Sheets', 'cheat');

    console.log('Data Import Complete!');
  } catch (error) {
    console.error('Error with data import:', error);
  } finally {
    if (dbConnected) {
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
    process.exit(dbConnected ? 0 : 1);
  }
};

const destroyData = async () => {
  let dbConnected = false;
  try {
    await connectDB();
    dbConnected = true;

    await Creature.deleteMany({});
    console.log('Creatures deleted.');
    await Career.deleteMany({});
    console.log('Careers deleted.');
    await Trapping.deleteMany({});
    console.log('Trappings deleted.');
    await Spell.deleteMany({});
    console.log('Spells deleted.');
    await Talent.deleteMany({});
    console.log('Talents deleted.');
    await Skill.deleteMany({});
    console.log('Skills deleted.');

    console.log('Data Destroyed!');
  } catch (error) {
    console.error('Error destroying data:', error);
  } finally {
    if (dbConnected) {
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
    process.exit(dbConnected ? 0 : 1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
