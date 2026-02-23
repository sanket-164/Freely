import { RELAY_URLS } from "../../config/env.config";
import { UserModel as User, PostModel as Post, LikeModel as Like, ReplyModel as Reply } from "../../database/model";
import IndexService from "../index.service";
import type { CreatePostData, DeletePostBody, GetPostsByUserIdParams, GetPostsByUsernameParams, LikePostBody, ReplyToPostData, DeleteReplyBody } from "./post.types";
import { EventTemplate } from "nostr-tools";

class PostService {
    static async createPost(postData: CreatePostData) {
        const userExists = await User.findById({ _id: postData.user_id });

        if (!userExists) {
            throw new Error("User not found");
        }

        const nostrEvent: EventTemplate = {
            kind: 1,
            content: postData.content,
            tags: postData.tags,
            created_at: Math.floor(Date.now() / 1000),
        };

        const nostrId = await IndexService.sendNostrEvent(nostrEvent, Buffer.from(userExists.priKey, "base64"));

        const post = Post.create({
            user_id: postData.user_id,
            content: postData.content,
            tags: postData.tags,
            nostr_id: nostrId,
        });

        return post;
    }

    static async getPostsByUserId(userData: GetPostsByUserIdParams) {

        const userExists = await User.findById({ _id: userData.user_id });

        if (!userExists) {
            throw new Error("User not found");
        }

        return await Post.find({ user_id: userData.user_id });
    }

    static async getPostsByUsername(userData: GetPostsByUsernameParams) {

        const userExists = await User.findOne({ name: userData.username });

        if (!userExists) {
            throw new Error("User not found");
        }

        return await Post.find({ user_id: userExists._id });
    }

    static async likePost(likeData: LikePostBody) {
        const { user_id, post_id } = likeData;

        const userExists = await User.findById(user_id);

        if (!userExists) {
            throw new Error("User not found");
        }

        const post: any = await Post.findById(post_id).populate("user_id", "pubKey");

        if (!post) {
            throw new Error("Post not found");
        }

        const existingLike = await Like.findOne({ user_id, post_id });

        if (existingLike) {
            throw new Error("Post already liked");
        }

        const nostrEvent: EventTemplate = {
            kind: 7,
            tags: [
                ["e", post.nostr_id, RELAY_URLS[0]],
                ["p", post.user_id.pubKey],
                ["k", "1"]
            ],
            content: "+",
            created_at: Math.floor(Date.now() / 1000),
        }

        const nostrId = await IndexService.sendNostrEvent(nostrEvent, Buffer.from(userExists.priKey, "base64"));

        await Like.create({ user_id, post_id, nostr_id: nostrId });

        return await Post.findByIdAndUpdate(
            post_id,
            { $inc: { likes: 1 } },
            { returnDocument: "after" }
        );
    }

    static async unlikePost(unlikeData: LikePostBody) {
        const { user_id, post_id } = unlikeData;

        const userExists = await User.findById(user_id);

        if (!userExists) {
            throw new Error("User not found");
        }

        const post = await Post.findById(post_id);

        if (!post) {
            throw new Error("Post not found");
        }

        const existingLike = await Like.findOne({ user_id, post_id });

        if (!existingLike) {
            throw new Error("Post not liked yet");
        }

        const nostrEvent: EventTemplate = {
            kind: 5,
            tags: [
                ["e", existingLike.nostr_id],
                ["k", "7"],
            ],
            content: `Post unliked by ${userExists.name}`,
            created_at: Math.floor(Date.now() / 1000),
        }

        await IndexService.sendNostrEvent(nostrEvent, Buffer.from(userExists.priKey, "base64"));

        await Like.deleteOne({ user_id, post_id });

        return await Post.findByIdAndUpdate(
            post_id,
            { $inc: { likes: -1 } },
            { returnDocument: "after" }
        );
    }

    static async replyToPost(replyData: ReplyToPostData) {
        const { user_id, post_id, content, tags } = replyData;

        const userExists = await User.findById(user_id);

        if (!userExists) {
            throw new Error("User not found");
        }

        const post: any = await Post.findById(post_id).populate("user_id", "pubKey");

        if (!post) {
            throw new Error("Post not found");
        }

        const nostrEvent: EventTemplate = {
            kind: 1,
            content,
            tags: [
                ["e", post.nostr_id, RELAY_URLS[0], "root"],
                ["p", post.user_id.pubKey],
                ...tags.map(tag => ["t", tag])
            ],
            created_at: Math.floor(Date.now() / 1000),
        }

        const nostrId = await IndexService.sendNostrEvent(nostrEvent, Buffer.from(userExists.priKey, "base64"));

        const reply = await Reply.create({
            nostr_id: nostrId,
            user_id,
            post_id,
            content,
            tags,
        });

        return reply;
    }

    static async deleteReply(deleteReplyData: DeleteReplyBody) {
        const { user_id, reply_id } = deleteReplyData;

        const userExists = await User.findById(user_id);

        if (!userExists) {
            throw new Error("User not found");
        }

        const reply = await Reply.findOne({ _id: reply_id, user_id });

        if (!reply) {
            throw new Error("Reply not found");
        }

        const nostrEvent: EventTemplate = {
            kind: 5,
            tags: [
                ["e", reply.nostr_id],
                ["k", "1"]
            ],
            content: `Reply deleted by ${userExists.name}`,
            created_at: Math.floor(Date.now() / 1000),
        }

        await IndexService.sendNostrEvent(nostrEvent, Buffer.from(userExists.priKey, "base64"));

        return await Reply.findByIdAndDelete(reply_id);
    }

    static async deletePost(deletePostData: DeletePostBody) {
        const { user_id, post_id } = deletePostData;
        const userExists = await User.findById(user_id);

        if (!userExists) {
            throw new Error("User not found");
        }

        const post = await Post.findOne({ _id: post_id, user_id });

        if (!post) {
            throw new Error("Post not found");
        }

        const nostrEvent: EventTemplate = {
            kind: 5,
            tags: [
                ["e", post.nostr_id],
                ["k", "1"]
            ],
            content: `Post deleted by ${userExists.name}`,
            created_at: Math.floor(Date.now() / 1000),
        }

        await IndexService.sendNostrEvent(nostrEvent, Buffer.from(userExists.priKey, "base64"));

        await Reply.deleteMany({ post_id: post._id });

        await Like.deleteMany({ post_id: post._id });

        return await Post.findByIdAndDelete(post_id);
    }

    static async getTrendingPosts() {
        const posts = await Post.find().sort({ likes: -1 }).limit(10);

        return posts;
    }

    static async getLatestPosts() {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(10);

        return posts;
    }
}

export default PostService;