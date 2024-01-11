"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const entities_1 = require("../entities");
class UserController {
    async getUserPosts(id) {
        if (!id) {
            throw new Error('Must be logged in to view posts');
        }
        try {
            const posts = await entities_1.Post.find({ where: { authorId: id } });
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
    async getUsers() {
        try {
            const users = await entities_1.User.find();
            return {
                record: users,
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
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map