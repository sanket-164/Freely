import { Schema } from "mongoose";

const UserSchema = new Schema({
    nostr_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    display_name: {
        type: String,
        required: true,
    },
    priKey: {
        type: String,
        required: true,
    },
    pubKey: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    picture: {
        type: String,
    },
    birthday: {
        year: {
            type: Number,
        },
        month: {
            type: Number,
        },
        day: {
            type: Number,
        },
    }
}, { timestamps: true });

export default UserSchema;