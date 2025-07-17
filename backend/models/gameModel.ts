import { Schema, model, Document, Types } from 'mongoose';

// Interface for a log entry
export interface ILogEntry {
  type: 'narrative' | 'roll' | 'system' | 'player';
  content: string;
  timestamp: Date;
}

// Interface for the Game document
export interface IGame extends Document {
  character: Types.ObjectId;
  log: ILogEntry[];
  gameState: {
    currentLocation: string;
  };
  userId: Types.ObjectId;
}

const gameSchema = new Schema<IGame>({
  character: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
  log: [
    {
      type: { type: String, enum: ['narrative', 'roll', 'system', 'player'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  gameState: {
    currentLocation: { type: String, default: 'A quiet tavern in Ubersreik' },
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Game = model<IGame>('Game', gameSchema);

export default Game;
