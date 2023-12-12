import { PostType, ResponseType } from '../types';
import { Post } from '../entities';

export class PostController {
	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Post:
	 *       type: object
	 *       properties:
	 *         id:
	 *           type: number
	 *         title:
	 *           type: string
	 *         content:
	 *           type: string
	 *         likes:
	 *           type: number
	 *         creatorId:
	 *           type: number
	 *         createdAt:
	 *           type: string
	 *         updatedAt:
	 *           type: string
	 *         creator:
	 *           type: object
	 *           properties:
	 *            id:
	 *             type: number
	 *            username:
	 *              type: string
	 *            email:
	 *             type: string
	 */
	async getPosts(): Promise<ResponseType<PostType[]>> {
		try {
			const posts = await Post.find();
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
}
