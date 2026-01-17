import mongoose, { Schema, Document } from 'mongoose';
import mongooseFieldEncryption from 'mongoose-field-encryption';

export interface IUser extends Document {
  name: string;
  email: string;
  githubId?: string;
  githubAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    githubId: {
      type: String,
      sparse: true,
      unique: true,
    },
    githubAccessToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt sensitive fields
userSchema.plugin(mongooseFieldEncryption.fieldEncryption, {
  fields: ['githubAccessToken'],
  secret: process.env.ENCRYPTION_KEY || '', // 32-byte hex key
  saltGenerator: () => process.env.ENCRYPTION_SALT || 'default-salt',
});

export const User = mongoose.model<IUser>('User', userSchema);
