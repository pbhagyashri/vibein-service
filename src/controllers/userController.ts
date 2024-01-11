import { ResponseType, UserType } from '@/types';
import { PostType } from '@/types';
import { Post, User } from '../entities';

export class UserController {
	async getUserPosts(id: string): Promise<ResponseType<PostType[]>> {
		if (!id) {
			throw new Error('Must be logged in to view posts');
		}

		try {
			const posts = await Post.find({ where: { authorId: id } });

			return {
				record: posts,
				status: 200,
			};
		} catch (error) {
			return {
				error: error.message,
				status: 400,
			};
		}
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
