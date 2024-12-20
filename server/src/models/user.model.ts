import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: string[];
  createAt: Date;
  updateAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokens: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Mongoose Middleware to Hash Password Before Saving
UserSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword; 
    next(); // Proceed with saving the user
  } catch (error) {
    next(error as Error);
  }
});

// Method to Compare Password (Used for login)
UserSchema.methods.comparePassword = async function (
    password: string
  ): Promise<boolean> {
    const user = this as IUser;
    return bcrypt.compare(password, user.password);
  };
  

const collectionName = "users";

const UserModel: Model<IUser> = mongoose.model<IUser>(
  collectionName,
  UserSchema
);
export { UserModel, collectionName };
