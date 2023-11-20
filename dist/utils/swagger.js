"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
        },
        host: 'localhost:4000',
        basePath: '/',
    },
    apis: ['src/routes/authRoutes.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function getSwaggerSpec(app) {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get('/api-docs.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
exports.getSwaggerSpec = getSwaggerSpec;
//# sourceMappingURL=swagger.js.map