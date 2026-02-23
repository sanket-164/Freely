import { body, param } from "express-validator";

class IndexValidator {
    static nameValidator() {
        return body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string");
    }

    static displayNameValidator() {
        return body("display_name").notEmpty().withMessage("Display name is required").isString().withMessage("Display name must be a string");
    }

    static aboutValidator() {
        return body("about").optional().isString().withMessage("About must be a string");
    }

    static pictureValidator() {
        return body("picture").optional().isString().withMessage("Picture must be a string");
    }

    static birthdayValidator() {
        return body("birthday").optional().isObject().withMessage("Birthday must be an object")
            .custom((value) => {
                if (typeof value.year !== "number" || typeof value.month !== "number" || typeof value.day !== "number") {
                    throw new Error("Birthday must have year, month, and day as numbers");
                }
                return true;
            });
    }

    static pubKeyValidator() {
        return body("pubKey").notEmpty().withMessage("Public key is required").bail().isString().withMessage("Public key must be a string");
    }

    static priKeyValidator() {
        return body("priKey").notEmpty().withMessage("Private key is required").bail().isString().withMessage("Private key must be a string");
    }

    static nameParamValidator() {
        return param("name").notEmpty().withMessage("Name parameter is required").isString().withMessage("Name parameter must be a string");
    }

    static userIdValidator() {
        return body("user_id").notEmpty().withMessage("User ID is required").bail().isMongoId().withMessage("User ID must be a valid MongoDB ID");
    }

    static postIdValidator() {
        return body("post_id").notEmpty().withMessage("Post ID is required").bail().isMongoId().withMessage("Post ID must be a valid MongoDB ID");
    }

    static contentValidator() {
        return body("content").notEmpty().withMessage("Content is required").isString().withMessage("Content must be a string");
    }

    static tagsValidator() {
        return body("tags").optional().isArray().withMessage("Tags must be an array of strings")
            .custom((value) => {
                for (const tag of value) {
                    if (typeof tag !== "string") {
                        throw new Error("Each tag must be a string");
                    }
                }
                return true;
            });
    }

    static replyIdValidator() {
        return body("reply_id").notEmpty().withMessage("Reply ID is required").bail().isMongoId().withMessage("Reply ID must be a valid MongoDB ID");
    }

    static paramValidator(paramName: string) {
        return param(paramName).notEmpty().withMessage(`${paramName} parameter is required`).bail().isString().withMessage(`${paramName} parameter must be a string`);
    }
}

export default IndexValidator;