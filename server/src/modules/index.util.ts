import UserValidator from "./user/user.validator";
import { ValidationChain } from "express-validator";
import PostValidator from "./post/post.validator";

class IndexUtil {
    static getEndpointValidator(requestPath: string): ValidationChain[] | undefined {
        const apiMapping: { [key: string]: { [key: string]: ValidationChain[] } } = {
            ["user"]: {
                "signup": UserValidator.signUpValidator,
                "signin": UserValidator.signInValidator,
                "update": UserValidator.updateUserValidator,
            },
            ["post"]: {
                "create": PostValidator.createPostValidator,
                "like": PostValidator.likePostValidator,
                "unlike": PostValidator.unlikePostValidator,
                "reply": PostValidator.replyToPostValidator,
                "replyDelete": PostValidator.deleteReplyValidator,
                "delete": PostValidator.deletePostValidator,
            }
        };

        const pathParts = requestPath.split("/").filter(part => part !== "");

        if (pathParts.length < 2) {
            return undefined;
        }

        const module = pathParts[0] || "";
        const endpoint = pathParts[1] || "";

        const validator = apiMapping[module]?.[endpoint];

        return validator;
    }
}

export default IndexUtil;