import { Router } from "express";
import UserController from "./user.controller";
import UserValidator from "./user.validator";

class UserRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/signup", UserController.signUp);
        this.router.post("/signin", UserController.signIn);
        this.router.get("/profile/:name", UserValidator.getUserValidator, UserController.getUser);
        this.router.put("/update", UserController.updateUser);
    }
};

export default UserRoute;