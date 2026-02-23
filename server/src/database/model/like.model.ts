import mongoose from "mongoose";
import LikeSchema from "../schema/like.schema";

export const LikeModel = mongoose.model("Like", LikeSchema);