import { Router } from "express";
import PostController from "./post.controller";
import PostValidator from "./post.validator";

class PostRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/create", PostController.createPost);
        this.router.get("/user/:user_id", PostValidator.paramValidator("user_id"), PostController.getPostsByUserId);
        this.router.get("/username/:username", PostValidator.paramValidator("username"), PostController.getPostsByUsername);
        this.router.post("/like", PostController.likePost);
        this.router.delete("/unlike", PostController.unlikePost);
        this.router.post("/reply", PostController.replyToPost);
        this.router.delete("/replyDelete", PostController.deleteReply);
        this.router.delete("/delete", PostController.deletePost);
        this.router.get("/trending", PostController.getTrendingPosts);
        this.router.get("/latest", PostController.getLatestPosts);
    }
}

export default PostRoute;