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
	// likes: number;
	authorId: string;
	author?: PostAuthor;
	createdAt?: Date;
	updatedAt?: Date;
};

export type getUserPostByIdRequestParams = {
	authorId: string;
	postId: string;
};

export type GetPostsResponse = {
	posts: PostType[];
};

export type CreatePostRequestParams = {
	title: string;
	content: string;
	authorId: string;
};

export type Cursor = {
	createdAt: Date;
	id: string;
};

export type PaginationReqestParams = {
	cursor?: Cursor;
	limit?: number;
	authorId?: string;
};

export type PaginationResponse<T> = {
	records: T[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export type UpdatePostRequestBody = {
	authorId: string;
	postId: string;
	postParam: PostType;
};

export interface TypedRequestBody<T> extends Express.Request {
	params: any;
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
