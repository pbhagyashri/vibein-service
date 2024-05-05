import { Response, Request } from 'express';
import { User } from '../../entities';
import { ResponseType, RegisterUserRequestParams, UserType, LoginUserRequestParams, ErrorCodes } from '../../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [accessToken, record]
 *       properties:
 *         record:
 *           type: object
 *           required: [id, username, email]
 *           properties:
 *             id:
 *               type: string
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
			{ expiresIn: '15m' },
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
		const user: User = await User.findOneByOrFail({
			email,
		});

		if (!user?.email) {
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
				userId: user.id,
			},
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: '10m' },
		);

		const refreshToken = jwt.sign(
			{
				userId: user.id,
			},
			process.env.REFRESH_TOKEN_SECRET as string,
			{ expiresIn: '15m' },
		);

		// update refreshToken in db
		user.refreshToken = refreshToken;
		await user.save();

		// set refreshToken in the cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 5,
			sameSite: 'none',
			secure: true,
		});

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

	async logout(email: string, res: Response): Promise<ResponseType<UserType>> {
		try {
			const user = await User.findOne({
				where: {
					email,
				},
			});

			if (!user) {
				throw new Error('Invalid email, please enter a valid email');
			}

			user.refreshToken = '';
			res.clearCookie('refreshToken');

			return {
				status: 200,
				record: undefined,
			};
		} catch (error) {
			return {
				error: error.message,
				status: 400,
			};
		}
	}

	async refreshToken(req: Request, res: Response) {
		// refresh token endpoint is used to generate a new access token when the old one expires
		// we should receive a refreshToken in the cookie

		const refreshToken = req.headers.cookie?.split('=')[1];
		if (!refreshToken) {
			throw new Error('No refreshToken found');
		}

		return jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET as string,
			async (err: Error | null, decoded: any) => {
				if (err) {
					throw new Error('Invalid refreshToken');
				}

				const user = await User.findOne({
					where: {
						id: decoded.userId,
					},
				});

				if (!user) {
					throw new Error('Invalid refreshToken');
				}

				// verify that the refreshToken is valid and not expired
				if (user.refreshToken !== refreshToken || Date.now() > decoded.exp * 1000) {
					return res.status(403).json({
						error: 'Refresh token is invalid or expired',
						code: ErrorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
					});
				}

				const accessToken = jwt.sign(
					{
						userId: user.id,
					},
					process.env.ACCESS_TOKEN_SECRET as string,
					{ expiresIn: 15000 },
				);

				return {
					status: 200,
					accessToken,
				};
			},
		);
	}
}
