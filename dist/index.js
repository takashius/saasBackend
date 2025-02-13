"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_http_1 = __importDefault(require("serverless-http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const commons_1 = __importDefault(require("./config/commons"));
const routes_1 = __importDefault(require("./config/routes"));
const swagger_1 = __importDefault(require("./documentation/swagger"));
const swagger_ui_express_1 = require("swagger-ui-express");
const registerRoutes_1 = __importDefault(require("./middleware/registerRoutes"));
(0, db_1.default)(commons_1.default.dbUrl);
const server = (0, express_1.default)();
server.use(body_parser_1.default.json());
server.use((0, cors_1.default)());
(0, routes_1.default)(server);
server.use("/api-docs", swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swagger_1.default, {
    swaggerOptions: {
        defaultModelsExpandDepth: -1,
        docExpansion: "none",
    },
}));
server.use(express_1.default.static(commons_1.default.publicRoute));
server.use(express_1.default.static("./static"));
(0, registerRoutes_1.default)(server);
server.listen(commons_1.default.port, () => {
    console.log(`Listening on http://localhost:${commons_1.default.port}`);
});
exports.handler = (0, serverless_http_1.default)(server);
