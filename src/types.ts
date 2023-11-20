export type UserType = {
	username: string;
	password: string;
	email: string;
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

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

export type ResponseType<T> = {
	error?: string;
	record?: T;
	status: number;
};
