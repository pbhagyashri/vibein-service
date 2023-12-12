"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const verifyJWT_1 = require("../middlewares/verifyJWT");
const PostRouter = (0, express_1.Router)();
PostRouter.get('/posts', verifyJWT_1.verifyJWT, async (_, res) => {
    const postController = new postController_1.PostController();
    const response = await postController.getPosts();
    res.status(response.status).json(response);
});
exports.default = PostRouter;
//# sourceMappingURL=postRoutes.js.map