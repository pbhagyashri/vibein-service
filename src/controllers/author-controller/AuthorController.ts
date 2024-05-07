import { CreatePostRequestParams, ResponseType, UpdatePostRequestBody, UserType } from '@/types';
import { PostType } from '@/types';
import { Post, User } from '../../entities';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../..';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         record:
 *           type: object
 *           required: [id, username, email, accessToken]
 *           properties:
 *             id:
 *               type: string
 *         status:
 *           type: number
 *           default: 200
 */
export class AuthorController {
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

	async me(token: string | undefined) {
		if (!token) {
			throw new Error('Must be logged in to view profile');
		}

		const user = await jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET as string,
			(err: Error | null, decoded: any) => {
				if (err) {
					throw new Error('Invalid token');
				}

				const userId = decoded.userId;
				return User.findOne({ where: { id: userId } });
			},
		);

		return {
			record: user,
			status: 200,
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

	async createPost({ title, content, authorId }: CreatePostRequestParams): Promise<ResponseType<PostType>> {
		try {
			if (!title || !content || !authorId) {
				throw new Error('Invalid input');
			}

			const post = await Post.create({ title, content, authorId }).save();

			return {
				record: post,
				status: 200,
			};
		} catch (error) {
			return {
				error: error.message,
				status: 400,
			};
		}
	}

	async updatePost({ authorId, postId, postParam }: UpdatePostRequestBody): Promise<ResponseType<PostType>> {
		const postRespository = AppDataSource.getRepository(Post);

		try {
			const updatedPost = await postRespository
				.createQueryBuilder()
				.update(Post)
				.set({
					...postParam,
				})
				.where('id = :id', { id: postId })
				.andWhere('authorId = :authorId', { authorId })
				.returning(['id', 'title', 'content', 'createdAt', 'updatedAt'])
				.execute();

			if (!updatedPost.raw[0]) {
				throw new Error('Something went wrong. Could not update post.');
			}

			return {
				status: 200,
				record: updatedPost.raw[0],
			};
		} catch (error) {
			return {
				error: error.message,
				status: 400,
			};
		}
	}
}
