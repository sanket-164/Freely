export type UserSignUpData = {
    name: string;
    display_name: string;
    about: string;
    picture: string;
    birthday: {
        year: number;
        month: number;
        day: number;
    };
};

export type UserUpdateData = {
    name: string;
    pubKey: string;
    display_name: string;
    about?: string;
    picture?: string;
    birthday?: {
        year: number;
        month: number;
        day: number;
    };
}