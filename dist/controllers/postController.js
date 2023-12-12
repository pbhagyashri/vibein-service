"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const entities_1 = require("../entities");
class PostController {
    async getPosts() {
        try {
            const posts = await entities_1.Post.find();
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
}
exports.PostController = PostController;
//# sourceMappingURL=postController.js.map