import mongoose, { Document, Schema } from 'mongoose';

export interface ITalent extends Document {
  id: string;
  name: string;
  max: string;
  tests: string;
  description: string;
}

const TalentSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  max: { type: String, required: true },
  tests: { type: String, required: true },
  description: { type: String, required: true },
});

const Talent = mongoose.model<ITalent>('Talent', TalentSchema);

export default Talent;
