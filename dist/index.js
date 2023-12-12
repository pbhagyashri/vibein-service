"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const index_1 = __importDefault(require("./routes/index"));
const swagger_1 = require("./utils/swagger");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'lireddit',
    entities: [entities_1.Post, entities_1.User],
    migrations: [],
    logging: true,
    synchronize: true,
});
const main = async () => {
    await exports.AppDataSource.initialize();
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(index_1.default);
    app.listen(4000, () => {
        console.log('Listening on port http://localhost:4000');
        (0, swagger_1.getSwaggerSpec)(app);
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map