import { AppDataSource } from '../..';
import { Like, Post } from '../../entities';

export class PostController {
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
				.leftJoinAndSelect('post.author', 'author')
				.leftJoinAndSelect('post.likes', 'like')
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

	async getPostCount() {
		const postRespository = AppDataSource?.getRepository(Post);
		const count = await postRespository.count();
		return count;
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

	// async likePost(userId: string, postId: string) {
	// 	try {
	// 		const likeRespository = AppDataSource.getRepository(Like);
	// 		await likeRespository.createQueryBuilder('like').insert().values({ userId, postId }).execute();

	// 		return {
	// 			record: 'Added like to post',
	// 			status: 200,
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			error: error.message,
	// 			status: 400,
	// 		};
	// 	}
	// }
}
