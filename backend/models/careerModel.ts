import mongoose, { Document, Schema } from 'mongoose';

// Interfaces for nested objects
interface IAdvanceScheme {
  ws: string | null;
  bs: string | null;
  s: string | null;
  t: string | null;
  i: string | null;
  agi: string | null;
  dex: string | null;
  int: string | null;
  wp: string | null;
  fel: string | null;
}

interface ICareerLevel {
  level: number;
  name: string;
  status: string;
  skills: string[];
  talents: string[];
  trappings: string[];
}

interface IQuotation {
  quote: string;
  source: string;
}

// Main document interface
export interface ICareer extends Document {
  title: string;
  limitations: string[];
  summary: string;
  description: string;
  advance_scheme: IAdvanceScheme;
  career_levels: ICareerLevel[];
  quotations: IQuotation[];
  adventuring: string;
}

const AdvanceSchemeSchema = new Schema<IAdvanceScheme>(
  {
    ws: { type: String, default: null },
    bs: { type: String, default: null },
    s: { type: String, default: null },
    t: { type: String, default: null },
    i: { type: String, default: null },
    agi: { type: String, default: null },
    dex: { type: String, default: null },
    int: { type: String, default: null },
    wp: { type: String, default: null },
    fel: { type: String, default: null },
  },
  { _id: false }
);

const CareerLevelSchema = new Schema<ICareerLevel>(
  {
    level: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    skills: { type: [String], required: true },
    talents: { type: [String], required: true },
    trappings: { type: [String], required: true },
  },
  { _id: false }
);

const QuotationSchema = new Schema<IQuotation>(
  {
    quote: { type: String, required: true },
    source: { type: String, required: true },
  },
  { _id: false }
);

const CareerSchema = new Schema<ICareer>({
  title: { type: String, required: true, unique: true },
  limitations: { type: [String], required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  advance_scheme: { type: AdvanceSchemeSchema, required: true },
  career_levels: { type: [CareerLevelSchema], required: true },
  quotations: { type: [QuotationSchema], required: true },
  adventuring: { type: String, required: true },
});

const Career = mongoose.model<ICareer>('Career', CareerSchema);

export default Career;
