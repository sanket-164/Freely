import { Request, Response, NextFunction } from "express";
import PostService from "./post.service";
import type { CreatePostData, DeletePostBody, GetPostsByUserIdParams, GetPostsByUsernameParams, LikePostBody, ReplyToPostData, DeleteReplyBody } from "./post.types";

class PostController {
    static async createPost(req: Request<unknown, unknown, CreatePostData, unknown>, res: Response, next: NextFunction) {
        try {
            const newPost = await PostService.createPost(req.body);

            res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    }

    static async getPostsByUserId(req: Request<GetPostsByUserIdParams>, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getPostsByUserId(req.params);

            res.json(posts);
        } catch (error) {
            next(error);
        }
    }

    static async getPostsByUsername(req: Request<GetPostsByUsernameParams>, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getPostsByUsername(req.params);

            res.json(posts);
        } catch (error) {
            next(error);
        }
    }

    static async likePost(req: Request<unknown, unknown, LikePostBody>, res: Response, next: NextFunction) {
        try {
            const post = await PostService.likePost(req.body);

            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    }

    static async unlikePost(req: Request<unknown, unknown, LikePostBody>, res: Response, next: NextFunction) {
        try {

            const post = await PostService.unlikePost(req.body);

            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    static async replyToPost(req: Request<unknown, unknown, ReplyToPostData>, res: Response, next: NextFunction) {
        try {
            const reply = await PostService.replyToPost(req.body);

            res.status(201).json(reply);
        } catch (error) {
            next(error);
        }
    }

    static async deleteReply(req: Request<unknown, unknown, DeleteReplyBody>, res: Response, next: NextFunction) {
        try {
            const reply = await PostService.deleteReply(req.body);

            res.json(reply);
        } catch (error) {
            next(error);
        }
    }

    static async deletePost(req: Request<unknown, unknown, DeletePostBody>, res: Response, next: NextFunction) {
        try {

            const post = await PostService.deletePost(req.body);

            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    static async getTrendingPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getTrendingPosts();

            res.json(posts);
        } catch (error) {
            next(error);
        }
    }

    static async getLatestPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getLatestPosts();

            res.json(posts);
        } catch (error) {
            next(error);
        }
    }
}

export default PostController;