import { PostType, ResponseType, PaginationResponse, PaginationReqestParams, Cursor } from '../../types';
import { Post } from '../../entities';
import { AppDataSource } from '../..';
// import { redis } from '../../lib';

export class PaginationController {
	cursor: Cursor;
	limit: number;
	maxLimit: number;

	constructor(cursor: Cursor, limit: number) {
		this.cursor = cursor;
		this.limit = limit;
		this.maxLimit = this.limit + 1;
	}

	private postRespository = AppDataSource?.getRepository(Post);
	private qb = this.postRespository.createQueryBuilder('post');

	async hasPreviousPage(): Promise<boolean> {
		const { createdAt, id } = this.cursor;

		return await this.qb
			.leftJoinAndSelect('post.user', 'user1')
			.where('post.createdAt > :createdAt', { createdAt })
			.andWhere('post.id != :id', { id }) // Exclude the first post
			.orderBy('post.createdAt', 'ASC')
			.limit(1)
			.getExists();
	}

	async getFirstPage(): Promise<PostType[]> {
		const posts = await this.qb.leftJoinAndSelect('post.author', 'author2').limit(this.maxLimit).getMany();
		// set posts in cache
		// redis.set(`first-posts-${this.limit}`, JSON.stringify(posts), 'PX', 600000);

		return posts;
	}

	async hasNextPage(posts: PostType[]): Promise<boolean> {
		return posts.length > this.limit;
	}

	// async getCachedPosts(key: string): Promise<PostType[] | undefined> {
	// 	const cachedPosts = await redis.get(key);

	// 	if (!cachedPosts) {
	// 		return;
	// 	}

	// 	return JSON.parse(cachedPosts).slice(0, this.maxLimit);
	// }

	async getPage(): Promise<PostType[]> {
		const { createdAt, id } = this.cursor;

		const posts = await this.qb
			.leftJoinAndSelect('post.author', 'author2')
			.where('post.createdAt <= :createdAt', { createdAt })
			.andWhere('post.id != :id', { id }) // Exclude the post with the cursor
			.orderBy('post.createdAt', 'DESC')
			.limit(this.maxLimit)
			.getMany();

		// redis.set(`posts:${id}-${this.limit}`, JSON.stringify(posts), 'PX', 600000);

		return posts;
	}

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Posts:
	 *       type: object
	 *       required: [record, hasNextPage, hasPreviousPage status]
	 *       properties:
	 *         record:
	 *           type: object
	 *           required: [posts, hasNextPage, hasPreviousPage]
	 *           properties:
	 *             hasNextPage:
	 *               type: boolean
	 *             hasPreviousPage:
	 *               type: boolean
	 *             posts:
	 *               type: array
	 *               items:
	 *                 type: object
	 *                 required: [id, title, content, likes, authorId, author]
	 *                 properties:
	 *                   id:
	 *                     type: string
	 *                   title:
	 *                     type: string
	 *                   content:
	 *                     type: string
	 *                   likes:
	 *                     type: number
	 *                   authorId:
	 *                     type: string
	 *                   createdAt:
	 *                     type: string
	 *                   author:
	 *                     type: object
	 *                     required: [id, username, email]
	 *                     properties:
	 *                       id:
	 *                         type: string
	 *                       username:
	 *                         type: string
	 *                       email:
	 *                         type: string
	 *         status:
	 *           type: number
	 *           default: 200
	 */
	async getPosts({ limit, cursor }: PaginationReqestParams): Promise<ResponseType<PaginationResponse>> {
		/*
			Philosophy:
			Why I did not set a default value for limit?
			- It allows users to choose the number of posts they want to see on a page.
			- It allows us to reuse logic for jumping to a specific page more efficiently.
			  By using the createdAt timestamp of the last post on the page user was when they jumped to a random page as a starting point and multiplying limit by page number.
			  This way, we don't have to use offset and limit in the database query.
			- We can reuse the same logic for infinite scrolling. Which makes it truely versatile.
		*/

		try {
			// if cursor is not provided, we want to return the latest posts.
			if (!cursor) {
				// check if posts are in cache
				// if they are, return them
				// const cachedPosts = await this.getCachedPosts(`first-posts-${limit}`);
				// if (cachedPosts) {
				// 	return {
				// 		record: {
				// 			posts: cachedPosts.slice(0, this.limit),
				// 			hasNextPage: await this.hasNextPage(cachedPosts),
				// 			hasPreviousPage: false,
				// 		},
				// 		status: 200,
				// 	};
				// }

				// get posts from database
				const posts = await this.getFirstPage();

				return {
					record: {
						posts: posts.slice(0, this.limit),
						hasNextPage: await this.hasNextPage(posts),
						hasPreviousPage: false,
					},
					status: 200,
				};
			}

			// check if posts are in cache
			// if they are, return them
			// const cachedPosts = await this.getCachedPosts(`posts:${cursor.id}-${limit}`);
			// if (cachedPosts) {
			// 	return {
			// 		record: {
			// 			posts: cachedPosts.slice(0, this.limit),
			// 			hasNextPage: await this.hasNextPage(cachedPosts),
			// 			hasPreviousPage: await this.hasPreviousPage(),
			// 		},
			// 		status: 200,
			// 	};
			// }

			const posts = await this.getPage();

			return {
				record: {
					posts: posts.slice(0, this.limit),
					hasNextPage: await this.hasNextPage(posts),
					hasPreviousPage: await this.hasPreviousPage(),
				},
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
