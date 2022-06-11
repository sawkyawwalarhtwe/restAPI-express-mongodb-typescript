import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'
import { findUser } from '../service/user.service';


export interface UserInput{
    dist: UserDocument["_id"];  
    email: string;
    name: string;
    password: string;
    phone: number;
    role: string;
    clusterUrl: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  clusterUrl: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
    checkRole(userRole: string): Promise<String>;
  }

const userSchema = new mongoose.Schema(
    {
      dist: { type: mongoose.Schema.Types.ObjectId, ref: "User"  },
      email: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      password: { type: String, required: true },
      phone: { type: Number},
      role: { type: String, required: true, default:"USER"},
      clusterUrl:{type:String, required: false, default:""}
    },
    {
      timestamps: true,
    }
  );

userSchema.pre("save", async function (next) {
    let user = this as UserDocument;
  
    if (!user.isModified("password")) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  
    const hash = await bcrypt.hashSync(user.password, salt);
  
    user.password = hash;
  
    return next();
  });

userSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    const user = this as UserDocument;
  
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
  };
  
  const UserModel = mongoose.model<UserDocument>("User", userSchema);
  
  export default UserModel;