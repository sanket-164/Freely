import { UserModel as User } from "../../database/model";
import { UserSignUpData, UserUpdateData } from "./user.types";
import IndexService from "../index.service";
import { EventTemplate, finalizeEvent, generateSecretKey, getPublicKey, SimplePool, verifyEvent } from "nostr-tools";

class UserService {
    static async signUp(userData: UserSignUpData) {
        const { name } = userData;
        const existingUser = await User.findOne({ name });

        if (existingUser) {
            throw new Error("User with this name already exists");
        }

        const priKey = generateSecretKey();
        const publicKey = getPublicKey(priKey);

        const nostrEvent: EventTemplate = {
            kind: 0,
            tags: [],
            content: JSON.stringify({
                name: userData.name,
                display_name: userData.display_name,
                about: userData.about || "",
                picture: userData.picture || "",
                birthday: userData.birthday || null,
            }),
            // Convert current time to seconds
            created_at: Math.floor(Date.now() / 1000),
        };

        const nostrId = await IndexService.sendNostrEvent(nostrEvent, priKey);

        const encryptedPriKey = Buffer.from(priKey).toString("base64");

        const newUser = await User.create({ ...userData, pubKey: publicKey, priKey: encryptedPriKey, nostr_id: nostrId });

        return newUser;
    }

    static async signIn(priKey: string) {
        const user = await User.findOne({ priKey });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    static async getUserByName(userName: string) {
        const user = await User.findOne({ name: userName });

        return user;
    }

    static async updateUser(updateData: UserUpdateData) {
        const user = await User.findOne({ pubKey: updateData.pubKey });

        if (!user) {
            throw new Error("User not found");
        }

        const nostrEvent: EventTemplate = {
            kind: 0,
            tags: [],
            content: JSON.stringify({
                name: updateData.name,
                display_name: updateData.display_name,
                about: updateData.about || "",
                picture: updateData.picture || "",
                birthday: updateData.birthday || null,
            }),
            // Convert current time to seconds
            created_at: Math.floor(Date.now() / 1000),
        };

        const nostrId = await IndexService.sendNostrEvent(nostrEvent, Buffer.from(user.priKey, "base64"));

        const updatedUser = await User.findByIdAndUpdate(user._id, { ...updateData, nostr_id: nostrId }, { returnDocument: "after" });

        return updatedUser;
    }
}

export default UserService;