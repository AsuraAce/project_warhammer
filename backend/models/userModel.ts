import { Schema, model, Document } from 'mongoose';

// Interface for the User document
export interface IUser extends Document {
  username: string;
  password?: string; // Optional as it won't always be selected
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Prevent password from being returned by default
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;
