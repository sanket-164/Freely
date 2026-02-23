import mongoose from "mongoose";
import ReplySchema from "../schema/reply.schema";

export const ReplyModel = mongoose.model("Reply", ReplySchema);