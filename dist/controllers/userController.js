"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const entities_1 = require("../entities");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    async register({ email, username, password }) {
        if (!email || !username || !password) {
            throw new Error('Invalid input');
        }
        const salt = await bcrypt_1.default.genSalt(12);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        try {
            const user = await entities_1.User.create({ username, password: hashedPassword, email }).save();
            return {
                status: 200,
                record: user,
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
    async login({ email, password }) {
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
        return {
            status: 200,
            record: user,
            error: undefined,
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=userController.js.map