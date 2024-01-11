"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const entities_1 = require("../entities");
const types_1 = require("../types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    async register({ email, username, password }, res) {
        if (!email || !username || !password) {
            throw new Error('Invalid input');
        }
        const salt = await bcrypt_1.default.genSalt(12);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const accessToken = jsonwebtoken_1.default.sign({
            username: username,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15000 });
        const refreshToken = jsonwebtoken_1.default.sign({
            username: username,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        try {
            const user = await entities_1.User.create({ username, password: hashedPassword, email, refreshToken }).save();
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
            return {
                status: 200,
                record: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                accessToken,
                error: undefined,
            };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('Username or email already exists');
            }
            throw new Error('Failed to register user');
        }
    }
    async login({ email, password }, res) {
        if (!email || !password) {
            throw new Error('Invalid input');
        }
        const user = await entities_1.User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error('Invalid email, please enter a valid email');
        }
        const validPassword = await bcrypt_1.default.compare(password, user?.password);
        if (!validPassword) {
            throw new Error('Invalid password');
        }
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15000 });
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
        return {
            status: 200,
            record: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            accessToken,
        };
    }
    async logout(email, res) {
        try {
            const user = await entities_1.User.findOne({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new Error('Invalid email, please enter a valid email');
            }
            user.refreshToken = '';
            res.clearCookie('refreshToken');
            return {
                status: 200,
                record: undefined,
            };
        }
        catch (error) {
            return {
                error: error.message,
                status: 400,
            };
        }
    }
    async refreshToken(req, res) {
        const refreshToken = req.headers.cookie?.split('=')[1];
        if (!refreshToken) {
            throw new Error('No refreshToken found');
        }
        return jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                throw new Error('Invalid refreshToken');
            }
            const user = await entities_1.User.findOne({
                where: {
                    id: decoded.userId,
                },
            });
            if (!user) {
                throw new Error('Invalid refreshToken');
            }
            if (user.refreshToken !== refreshToken || Date.now() > decoded.exp * 1000) {
                return res.status(403).json({
                    error: 'Refresh token is invalid or expired',
                    code: types_1.ErrorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({
                userId: user.id,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15000 });
            return {
                status: 200,
                accessToken,
            };
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map