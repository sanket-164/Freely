import mongoose from "mongoose";
import UserSchema from "../schema/user.schema";

export const UserModel = mongoose.model("User", UserSchema);