"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const PostRouter = (0, express_1.Router)();
PostRouter.get('/posts', async (req, res) => {
    const { limit, cursor } = req.query;
    console.log({ limit, cursor });
    const postController = new postController_1.PostController();
    const response = await postController.getPosts(parseInt(limit), cursor);
    res.status(response.status).json(response);
});
PostRouter.post('/posts', authenticateUser_1.authenticateUser, async (req, res) => {
    const { title, content, authorId } = req.body;
    console.log('req.body', { req });
    const postController = new postController_1.PostController();
    const response = await postController.createPost({ title, content, authorId });
    res.status(response.status).json(response);
});
PostRouter.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const postController = new postController_1.PostController();
    const response = await postController.getPostById(id);
    res.status(response.status).json(response);
});
PostRouter.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const postController = new postController_1.PostController();
    const response = await postController.deletePost(id);
    res.status(200).json(response);
});
exports.default = PostRouter;
//# sourceMappingURL=postRoutes.js.map