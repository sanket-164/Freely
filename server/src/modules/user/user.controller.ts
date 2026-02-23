import { Request, Response, NextFunction } from "express";
import UserService from "./user.service";
import { UserSignUpData, UserUpdateData } from "./user.types";

class UserController {
    static async signUp(req: Request<{}, {}, UserSignUpData, {}>, res: Response, next: NextFunction) {

        try {
            const newUser = await UserService.signUp(req.body);

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    static async signIn(req: Request<{}, {}, { priKey: string }, {}>, res: Response, next: NextFunction) {
        try {
            const { priKey } = req.body;

            const user = await UserService.signIn(priKey);

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async getUser(req: Request<{ name: string }>, res: Response, next: NextFunction) {
        try {
            const { name: userName } = req.params;

            const user = await UserService.getUserByName(userName);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async updateUser(req: Request<{}, {}, UserUpdateData, {}>, res: Response, next: NextFunction) {
        try {
            const updateData = req.body;

            const updatedUser = await UserService.updateUser(updateData);

            res.status(200).json(updatedUser);
        }
        catch (error: any) {
            console.error("Error updating user:", error.message);
            next(error);
        }
    }
}

export default UserController;