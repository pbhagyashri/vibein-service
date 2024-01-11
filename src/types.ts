import { Request } from 'express';

export type UserType = {
	id: string;
	username: string;
	email: string;
	refereshToken?: string;
	accesstoken?: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export type RegisterUserRequestParams = {
	username: string;
	password: string;
	email: string;
};

export type LoginUserRequestParams = {
	email: string;
	password: string;
};

export type PostAuthor = {
	id: string;
	username: string;
	email: string;
};

export type PostType = {
	id: string;
	title: string;
	content: string;
	likes: number;
	authorId: string;
	user?: PostAuthor;
	createdAt?: Date;
	updatedAt?: Date;
};

export type GetPostsResponse = {
	posts: PostType[];
};

export type CreatePostRequestParams = {
	title: string;
	content: string;
	authorId: string;
};

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

export type ResponseType<T> = {
	error?: string;
	record?: T;
	status: number;
};

export interface RequestWithUser extends Request {
	user: UserType;
	userId: string;
}

export enum ErrorCodes {
	INVALID_OR_EXPIRED_REFRESH_TOKEN = 'INVALID_OR_EXPIRED_REFRESH_TOKEN',
}
