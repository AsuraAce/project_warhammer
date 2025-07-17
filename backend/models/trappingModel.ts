import mongoose, { Document, Schema } from 'mongoose';

interface IPrice {
  gc: number;
  ss: number;
  bp: number;
}

export interface ITrapping extends Document {
  id: string;
  name: string;
  category: string;
  price: IPrice | null;
  encumbrance: number | null;
  availability: string | null;
  notes: string | null;
  carries: number | null;
}

const PriceSchema: Schema = new Schema({
  gc: { type: Number, required: true, default: 0 },
  ss: { type: Number, required: true, default: 0 },
  bp: { type: Number, required: true, default: 0 },
}, { _id: false });

const TrappingSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: PriceSchema, required: false, default: null },
  encumbrance: { type: Number, required: false, default: null },
  availability: { type: String, required: false, default: null },
  notes: { type: String, required: false, default: null },
  carries: { type: Number, required: false, default: null },
});

const Trapping = mongoose.model<ITrapping>('Trapping', TrappingSchema);

export default Trapping;
