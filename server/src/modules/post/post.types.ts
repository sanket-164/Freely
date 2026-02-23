export type CreatePostData = {
    user_id: string;
    content: string;
    tags: string[][];
}

export type ReplyToPostData = CreatePostData & {
    post_id: string;
}

export type GetPostsByUserIdParams = {
    user_id: string;
}

export type GetPostsByUsernameParams = {
    username: string;
}

export type LikePostBody = {
    user_id: string;
    post_id: string;
}

export type DeletePostBody = {
    user_id: string;
    post_id: string;
}

export type DeleteReplyBody = {
    user_id: string;
    reply_id: string;
}