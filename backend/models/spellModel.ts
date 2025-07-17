import mongoose, { Document, Schema } from 'mongoose';

export interface ISpell extends Document {
  id: string;
  name: string;
  lore: string;
  cn: number;
  range: string;
  target: string;
  duration: string;
  description: string;
  overcasting: string | null;
}

const SpellSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lore: { type: String, required: true },
  cn: { type: Number, required: true },
  range: { type: String, required: true },
  target: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  overcasting: { type: String, required: false, default: null },
});

const Spell = mongoose.model<ISpell>('Spell', SpellSchema);

export default Spell;
