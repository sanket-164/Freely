import mongoose from "mongoose";
import PostSchema from "../schema/post.schema";

export const PostModel = mongoose.model("Post", PostSchema);