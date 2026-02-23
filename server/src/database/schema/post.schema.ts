import { Schema } from "mongoose";

const PostSchema = new Schema({
    nostr_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [[String]],
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default PostSchema;