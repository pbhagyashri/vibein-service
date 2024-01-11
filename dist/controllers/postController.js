"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const entities_1 = require("../entities");
const __1 = require("../");
class PostController {
    async getPosts(limit, cursor) {
        const postRespository = __1.AppDataSource?.getRepository(entities_1.Post);
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
        }
        catch (error) {
            return {
                error: error.message,
                status: 400,
            };
        }
    }
    async getPostById(id) {
        const postRespository = __1.AppDataSource?.getRepository(entities_1.Post);
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
        }
        catch (error) {
            return {
                error: error.message,
                status: 400,
            };
        }
    }
    async createPost({ title, content, authorId }) {
        try {
            if (!title || !content || !authorId) {
                throw new Error('Invalid input');
            }
            const post = await entities_1.Post.create({ title, content, authorId }).save();
            return {
                record: post,
                status: 200,
            };
        }
        catch (error) {
            return {
                error: error.message,
                status: 400,
            };
        }
    }
    async deletePost(id) {
        try {
            await entities_1.Post.delete({ id });
            return {
                record: 'Post deleted',
                status: 200,
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.PostController = PostController;
//# sourceMappingURL=postController.js.map