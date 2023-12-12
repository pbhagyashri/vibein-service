export type UserType = {
	id: number;
	username: string;
	email: string;
	posts?: PostType[];
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

export type PostType = {
	id: number;
	title: string;
	content: string;
	likes: number;
	creatorId: number;
	creator: UserType;
	createdAt?: Date;
	updatedAt?: Date;
};

export type GetPostsResponse = {
	posts: PostType[];
};

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

export type ResponseType<T> = {
	error?: string;
	record?: T;
	status: number;
};
