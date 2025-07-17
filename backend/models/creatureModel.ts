import mongoose, { Document, Schema } from 'mongoose';

// Interface for the nested objects to ensure type safety
interface IProfile {
  characteristics: { [key: string]: number | null };
  secondary_profile: { [key: string]: number | null };
}

interface ITrait {
  name: string;
  rating: any;
}

// Main document interface
export interface ICreature extends Document {
  id: string;
  name: string;
  faction: string;
  keywords?: string[];
  description: string;
  profile: IProfile;
  traits: ITrait[];
  optional: ITrait[];
  special_rules?: { title: string; text: string }[];
}

const ProfileSchema = new Schema<IProfile>(
  {    
    characteristics: { type: Schema.Types.Mixed, required: true },
    secondary_profile: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const TraitSchema = new Schema<ITrait>(
  {
    name: { type: String, required: true },
    rating: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const CreatureSchema = new Schema<ICreature>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  faction: { type: String, required: true },
  keywords: { type: [String], required: false },
  description: { type: String, required: true },
  profile: { type: ProfileSchema, required: true },
  traits: { type: [TraitSchema], required: true },
  optional: { type: [TraitSchema], required: true },
  special_rules: {
    type: [{ title: String, text: String }],
    required: false,
    _id: false,
  },
});

const Creature = mongoose.model<ICreature>('Creature', CreatureSchema);

export default Creature;
