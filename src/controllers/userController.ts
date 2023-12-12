import { Response } from 'express';
import { User } from '../entities';
import { ResponseType, RegisterUserRequestParams, UserType, LoginUserRequestParams } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         record:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *         accessToken:
 *           type: string
 */
export class AuthController {
	async register(
		{ email, username, password }: RegisterUserRequestParams,
		res: Response,
	): Promise<ResponseType<UserType> & { accessToken: string }> {
		if (!email || !username || !password) {
			throw new Error('Invalid input');
		}

		// Hash password
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		// generate accessToken and refreshToken
		const accessToken = jwt.sign(
			{
				username: username,
			},
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: '30s' },
		);
		const refreshToken = jwt.sign(
			{
				username: username,
			},
			process.env.REFRESH_TOKEN_SECRET as string,
			{ expiresIn: '1d' },
		);

		try {
			// create user in db. Save refreshToken with user in db.
			const user = await User.create({ username, password: hashedPassword, email, refreshToken }).save();

			// set refreshToken in the cookie
			res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });

			return {
				status: 200,
				record: {
					id: user.id,
					username: user.username,
					email: user.email,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				},
				accessToken,
				error: undefined,
			};
		} catch (error) {
			// Handle specific errors here
			if (error.code === '23505') {
				throw new Error('Username or email already exists');
			}
			throw new Error('Failed to register user');
		}
	}

	async login(
		{ email, password }: LoginUserRequestParams,
		res: Response,
	): Promise<ResponseType<UserType> & { accessToken: string }> {
		if (!email || !password) {
			throw new Error('Invalid input');
		}

		// find user by email
		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			throw new Error('Invalid email, please enter a valid email');
		}

		// validate password
		const validPassword = await bcrypt.compare(password, user?.password);
		if (!validPassword) {
			throw new Error('Invalid password');
		}

		// generate accessToken and refreshToken
		const accessToken = jwt.sign(
			{
				username: user.username,
			},
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: 15000 },
		);
		const refreshToken = jwt.sign(
			{
				username: user.username,
			},
			process.env.REFRESH_TOKEN_SECRET as string,
			{ expiresIn: '1d' },
		);

		// update refreshToken in db
		user.refreshToken = refreshToken;
		await user.save();

		// set refreshToken in the cookie
		res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });

		// only return accessToken
		return {
			status: 200,
			record: {
				id: user.id,
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			accessToken,
		};
	}

	async getUsers(): Promise<ResponseType<UserType[]>> {
		try {
			const users = await User.find();
			return {
				record: users,
				status: 200,
			};
		} catch (error) {
			return {
				error: error.message,
				status: 400,
			};
		}
	}
}
