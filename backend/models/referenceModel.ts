import mongoose, { Document, Schema } from 'mongoose';

export interface IReference extends Document {
  id: string;
  title: string;
  content: any;
  source: string;
}

const ReferenceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  source: { type: String, required: true },
});

const Reference = mongoose.model<IReference>('Reference', ReferenceSchema);

export default Reference;
