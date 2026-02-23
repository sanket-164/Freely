import IndexValidator from "../index.validator";

class UserValidator extends IndexValidator {
    static signUpValidator = [
        this.nameValidator(),
        this.displayNameValidator(),
        this.aboutValidator(),
        this.pictureValidator(),
        this.birthdayValidator(),
    ];

    static signInValidator = [
        this.priKeyValidator()
    ];

    static getUserValidator = [
        this.nameParamValidator()
    ];

    static updateUserValidator = [
        this.nameValidator(),
        this.displayNameValidator(),
        this.aboutValidator(),
        this.pictureValidator(),
        this.birthdayValidator(),
        this.pubKeyValidator()
    ];
}

export default UserValidator;