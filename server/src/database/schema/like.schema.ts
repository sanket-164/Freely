import { Schema } from "mongoose";

const LikeSchema = new Schema({
    nostr_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
}, { timestamps: true });

export default LikeSchema;