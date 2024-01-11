import { PostType, ResponseType, CreatePostRequestParams } from '../types';
import { Post } from '../entities';
import { AppDataSource } from '../';

export class PostController {
	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Posts:
	 *       type: object
	 *       required: [record, status]
	 *       properties:
	 *         record:
	 *           type: array
	 *           items:
	 *             type: object
	 *             required: [id, title, content, likes, authorId, author]
	 *             properties:
	 *               id:
	 *                 type: string
	 *               title:
	 *                 type: string
	 *               content:
	 *                 type: string
	 *               likes:
	 *                 type: number
	 *               authorId:
	 *                 type: string
	 *               createdAt:
	 *                 type: string
	 *               updatedAt:
	 *                 type: string
	 *               author:
	 *                 type: object
	 *                 required: [id, username, email]
	 *                 properties:
	 *                  id:
	 *                   type: string
	 *                  username:
	 *                    type: string
	 *                  email:
	 *                   type: string
	 *         status:
	 *           type: number
	 *           default: 200
	 */

	async getPosts(limit: number, cursor?: string): Promise<ResponseType<PostType[]>> {
		const postRespository = AppDataSource?.getRepository(Post);

		// max number of posts to return should be 50.
		const maxLimit = Math.min(50, limit);
		try {
			if (cursor) {
				const posts = await postRespository
					.createQueryBuilder('post')
					.leftJoinAndSelect('post.user', 'user')
					.where('post.createdAt < :cursor', { cursor })
					.orderBy('post.createdAt', 'DESC')
					.limit(maxLimit)
					.getMany();

				return {
					record: posts,
					status: 200,
				};
			}

			const posts = await postRespository
				.createQueryBuilder('post')
				.leftJoinAndSelect('post.user', 'user')
				.orderBy('post.createdAt', 'ASC')
				.limit(maxLimit)
				.getMany();

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

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Post:
	 *       type: object
	 *       required: [record, status]
	 *       properties:
	 *         record:
	 *           required: [id, title, content, likes, authorId, author]
	 *           type: object
	 *           properties:
	 *             id:
	 *               type: string
	 *             title:
	 *               type: string
	 *             content:
	 *               type: string
	 *             likes:
	 *               type: number
	 *             authorId:
	 *               type: string
	 *             createdAt:
	 *               type: string
	 *             updatedAt:
	 *               type: string
	 *             author:
	 *               type: object
	 *               required: [id, username, email]
	 *               properties:
	 *                id:
	 *                 type: string
	 *                username:
	 *                  type: string
	 *                email:
	 *                 type: string
	 *         status:
	 *           type: number
	 *           default: 200
	 */
	async getPostById(id: string) {
		const postRespository = AppDataSource?.getRepository(Post);
		try {
			const postWithAuthor = await postRespository
				.createQueryBuilder('post')
				.leftJoinAndSelect('post.user', 'user')
				.where('post.id = :id', { id })
				.getOne();

			return {
				record: postWithAuthor,
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

	async deletePost(id: string) {
		try {
			await Post.delete({ id });
			return {
				record: 'Post deleted',
				status: 200,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
