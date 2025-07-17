import { Schema, model, Document, Types } from 'mongoose';

// Interface for Character stats
interface ICharacterStats {
  weaponSkill: number;
  ballisticSkill: number;
  strength: number;
  toughness: number;
  initiative: number;
  agility: number;
  dexterity: number;
  intelligence: number;
  willpower: number;
  fellowship: number;
}

// Interface for Character document
export interface ICharacter extends Document {
  name: string;
  career: string;
  stats: ICharacterStats;
  skills: { name: string; value: number }[];
  talents: { name: string; description: string }[];
  inventory: string[];
  userId: Types.ObjectId;
}

const characterSchema = new Schema<ICharacter>({
  name: { type: String, required: true },
  career: { type: String, required: true },
  stats: {
    weaponSkill: { type: Number, default: 30 },
    ballisticSkill: { type: Number, default: 30 },
    strength: { type: Number, default: 30 },
    toughness: { type: Number, default: 30 },
    initiative: { type: Number, default: 30 },
    agility: { type: Number, default: 30 },
    dexterity: { type: Number, default: 30 },
    intelligence: { type: Number, default: 30 },
    willpower: { type: Number, default: 30 },
    fellowship: { type: Number, default: 30 },
  },
  skills: [{ name: String, value: Number }],
  talents: [{ name: String, description: String }],
  inventory: [String],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Character = model<ICharacter>('Character', characterSchema);

export default Character;
