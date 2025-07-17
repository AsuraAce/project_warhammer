import mongoose, { Document, Schema } from 'mongoose';

// Interface for the optional 'specialUses' field
interface ISpecialUse {
  useCase: string;
  description: string;
}

// Interface for the optional 'lockTiers' field
interface ILockTier {
  type: string;
  difficulty: string;
  requiredSL: number;
}

export interface ISkill extends Document {
  id: string;
  name: string;
  type: string;
  characteristic: string;
  isGrouped: boolean;
  specialisations: string[];
  description: string;
  commonUses: string[];
  combatApplication: string;
  specialUses?: ISpecialUse[];
  lockTiers?: ILockTier[];
  specialRule?: string;
}

const SpecialUseSchema: Schema = new Schema({
  useCase: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const LockTierSchema: Schema = new Schema({
  type: { type: String, required: true },
  difficulty: { type: String, required: true },
  requiredSL: { type: Number, required: true },
}, { _id: false });

const SkillSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  characteristic: { type: String, required: true },
  isGrouped: { type: Boolean, required: true },
  specialisations: { type: [String], required: true },
  description: { type: String, required: true },
  commonUses: { type: [String], required: true },
  combatApplication: { type: String, required: true },
  specialUses: { type: [SpecialUseSchema], required: false },
  lockTiers: { type: [LockTierSchema], required: false },
  specialRule: { type: String, required: false },
});

const Skill = mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
