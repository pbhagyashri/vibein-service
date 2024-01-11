"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeUser = (req, res, next) => {
    const { id } = req.params;
    const refreshToken = req.headers.cookie?.split('=')[1];
    if (!refreshToken) {
        throw new Error('No refreshToken found');
    }
    return jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            throw new Error('Invalid refreshToken');
        }
        const { userId } = decoded;
        const loggedInUserId = userId === id;
        if (!loggedInUserId) {
            return res.status(403).send('You can only access your own posts');
        }
        next();
    });
};
exports.authorizeUser = authorizeUser;
//# sourceMappingURL=authorizeUser.js.map