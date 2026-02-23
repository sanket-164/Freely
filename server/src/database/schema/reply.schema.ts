import { Schema } from 'mongoose';

const ReplySchema = new Schema({
    nostr_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [[String]],
        required: true,
    }
});

export default ReplySchema;