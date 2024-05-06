import {
	CreatePostRequestParams,
	ResponseType,
	UpdatePostRequestBody,
	UserType,
	getUserPostByIdRequestParams,
} from '@/types';
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
	private userRepository = AppDataSource.getRepository(User);
	private postRepository = AppDataSource.getRepository(Post);

	private userQueryBuilder = this.userRepository.createQueryBuilder('user');
	private postQueryBuilder = this.postRepository.createQueryBuilder('post');

	async geAuthorPosts(authorId: string): Promise<ResponseType<PostType[]>> {
		if (!authorId) {
			throw new Error('Must be logged in to view posts');
		}

		try {
			const posts = await this.postQueryBuilder.where('post.authorId = :authorId', { authorId }).getMany();

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

	async getUserPostById({ authorId, postId }: getUserPostByIdRequestParams) {
		if (!authorId || !postId) {
			throw new Error('Invalid input');
		}

		try {
			const post = await this.postQueryBuilder
				.where('post.id = :postId', { postId })
				.andWhere('post.authorId = :authorId', { authorId })
				.getOne();

			return {
				record: post,
				status: 200,
				error: null,
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
			const users = await this.userQueryBuilder.getMany();

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

			const post = await this.postQueryBuilder
				.insert()
				.into(Post)
				.values({ title, content, authorId })
				.returning(['id', 'title', 'content', 'authorId', 'createdAt', 'updatedAt'])
				.execute();

			return {
				record: post.raw[0],
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
		try {
			const updatedPost = await this.postQueryBuilder
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

	async deletePost(authorId: string, postId: string) {
		try {
			const result = await this.postQueryBuilder
				.delete()
				.from(Post)
				.where('id = :id', { id: postId })
				.andWhere('authorId = :authorId', { authorId })
				.execute();

			if (!result || result.affected === 0) {
				throw new Error('Could not delete post!!!!');
			}
			return {
				record: result,
				status: 200,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
