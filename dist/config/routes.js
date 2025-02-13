"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_1 = __importDefault(require("../components/user/network"));
const network_2 = __importDefault(require("../components/company/network"));
const network_3 = __importDefault(require("../components/roles/network"));
const network_4 = __importDefault(require("../components/categories/network"));
const network_5 = __importDefault(require("../components/post/network"));
const network_6 = __importDefault(require("../components/products/network"));
const network_7 = __importDefault(require("../components/plan/network"));
const network_8 = __importDefault(require("../components/permission/network"));
const urlApi = "";
const routes = function (server) {
    server.use(urlApi + "/user", network_1.default);
    server.use(urlApi + "/company", network_2.default);
    server.use(urlApi + "/role", network_3.default);
    server.use(urlApi + "/categories", network_4.default);
    server.use(urlApi + "/post", network_5.default);
    server.use(urlApi + "/products", network_6.default);
    server.use(urlApi + "/plan", network_7.default);
    server.use(urlApi + "/permission", network_8.default);
};
exports.default = routes;
