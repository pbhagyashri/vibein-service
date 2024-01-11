"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    console.log({ email, username, password });
    const controller = new authController_1.AuthController();
    try {
        const user = await controller.register({ email, username, password }, res);
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const controller = new authController_1.AuthController();
    try {
        const accessToken = await controller.login({ email, password }, res);
        return res.json(accessToken);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
authRouter.post('/logout', async (req, res) => {
    const { email } = req.body;
    const controller = new authController_1.AuthController();
    try {
        await controller.logout(email, res);
        return res.json({ message: 'User logged out successfully' });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
authRouter.get('/refresh-token', async (req, res) => {
    const controller = new authController_1.AuthController();
    try {
        const accessToken = await controller.refreshToken(req, res);
        console.log({ accessToken });
        return res.json(accessToken);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map