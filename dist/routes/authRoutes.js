"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const controller = new userController_1.AuthController();
    try {
        const user = await controller.register({ email, username, password });
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const controller = new userController_1.AuthController();
    try {
        const user = await controller.login({ email, password });
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map