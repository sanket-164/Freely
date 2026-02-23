import express from "express";
import cors from "cors";
import WebSocket from "ws";
import UserRoute from "../modules/user/user.route";
import IndexMiddleware from "../modules/index.middleware";
import PostRoute from "../modules/post/post.route";

class App {
    private app: express.Application;

    constructor() {
        this.app = express();

        // 👇 Inject WebSocket into global scope
        (globalThis as any).WebSocket = WebSocket;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(IndexMiddleware.validateRequest);
        this.app.use("/user", new UserRoute().router);
        this.app.use("/post", new PostRoute().router);
        this.app.use(IndexMiddleware.errorHandler);
        this.app.use("/", (_req, res) => {
            res.status(404).json({ message: "Not Found" });
        });
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            console.log(`Server is running http://localhost:${port}`);
        });
    }
}

export default App;
