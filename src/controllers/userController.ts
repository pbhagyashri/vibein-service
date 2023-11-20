import { User } from '../entities';
import { ResponseType, RegisterUserRequestParams, UserType, LoginUserRequestParams } from '../types';
import bcrypt from 'bcrypt';

export class AuthController {
	async register({ email, username, password }: RegisterUserRequestParams): Promise<ResponseType<UserType>> {
		if (!email || !username || !password) {
			throw new Error('Invalid input');
		}

		// Hash password
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		try {
			const user = await User.create({ username, password: hashedPassword, email }).save();

			return {
				status: 200,
				record: user,
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

	async login({ email, password }: LoginUserRequestParams): Promise<ResponseType<UserType>> {
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

		const validPassword = await bcrypt.compare(password, user?.password);
		if (!validPassword) {
			throw new Error('Invalid password');
		}

		return {
			status: 200,
			record: user,
			error: undefined,
		};
	}
}
