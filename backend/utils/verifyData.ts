import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from '../config/db';
import Creature from '../models/creatureModel';
import Career from '../models/careerModel';
import Spell from '../models/spellModel';
import Talent from '../models/talentModel';
import Skill from '../models/skillModel';
import Trapping from '../models/trappingModel';

dotenv.config({ path: path.resolve(__dirname, '../.env.development') });

const verifyData = async () => {
  let dbConnected = false;
  try {
    await connectDB();
    dbConnected = true;
    console.log('Database connected for verification...');

    const creatureCount = await Creature.countDocuments();
    console.log(`Creatures: ${creatureCount}`);

    const careerCount = await Career.countDocuments();
    console.log(`Careers: ${careerCount}`);

    const spellCount = await Spell.countDocuments();
    console.log(`Spells: ${spellCount}`);

    const talentCount = await Talent.countDocuments();
    console.log(`Talents: ${talentCount}`);

    const skillCount = await Skill.countDocuments();
    console.log(`Skills: ${skillCount}`);

    const trappingCount = await Trapping.countDocuments();
    console.log(`Trappings: ${trappingCount}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  } finally {
    if (dbConnected) {
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
  }
};

verifyData();
