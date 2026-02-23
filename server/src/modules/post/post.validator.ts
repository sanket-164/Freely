import IndexValidator from "../index.validator";

class PostValidator extends IndexValidator {
    static createPostValidator = [
        this.userIdValidator(),
        this.contentValidator(),
    ];

    static getPostsByUserIdValidator = [
        this.userIdValidator()
    ];

    static getPostsByUsernameValidator = [
        this.nameParamValidator()
    ];

    static likePostValidator = [
        this.userIdValidator(),
        this.postIdValidator()
    ]

    static unlikePostValidator = [
        this.userIdValidator(),
        this.postIdValidator()
    ]

    static replyToPostValidator = [
        this.userIdValidator(),
        this.postIdValidator(),
        this.contentValidator(),
        this.tagsValidator()
    ]

    static deleteReplyValidator = [
        this.userIdValidator(),
        this.replyIdValidator()
    ]

    static deletePostValidator = [
        this.userIdValidator(),
        this.postIdValidator()
    ]
}

export default PostValidator;