"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticateUser_1 = require("../middlewares/authenticateUser");
const userController_1 = require("../controllers/userController");
const express_1 = require("express");
const authorizeUser_1 = require("../middlewares/authorizeUser");
const UserRouter = (0, express_1.Router)();
UserRouter.get('/users/:id/posts', authenticateUser_1.authenticateUser, authorizeUser_1.authorizeUser, async (req, res) => {
    const { id } = req.params;
    const userController = new userController_1.UserController();
    const response = await userController.getUserPosts(id);
    return res.status(response.status).json(response);
});
UserRouter.get('/users', async (_, res) => {
    const userController = new userController_1.UserController();
    const response = await userController.getUsers();
    return res.status(response.status).json(response);
});
exports.default = UserRouter;
//# sourceMappingURL=userRoutes.js.map