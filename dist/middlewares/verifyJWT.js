"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).send('Access Denied');
    const token = authHeader.split(' ')[1];
    try {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            console.log('decoded', { decoded });
            if (err) {
                console.log('err', err);
                return res.status(401).send('Access Denied');
            }
            req.user = decoded?.username;
            next();
        });
    }
    catch (err) {
        res.status(400).send('Invalid Token');
    }
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map