"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = auth;
const jsonwebtoken_1 = require("jsonwebtoken");
const model_1 = require("../components/user/model");
const model_2 = __importDefault(require("../components/permission/model"));
const commons_1 = __importDefault(require("../config/commons"));
function auth(module = "") {
    return async (req, res, next) => {
        var _a;
        try {
            const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
            if (!token) {
                throw new Error("Token not provided");
            }
            const data = (0, jsonwebtoken_1.verify)(token, commons_1.default.JWT_KEY);
            if (data.date) {
                const dateLimit = sumDays(new Date(data.date), 5);
                const dateNow = new Date();
                if (+dateNow <= +dateLimit) {
                    //throw new Error('Expired token');
                }
            }
            else {
                //throw new Error('Undated Token');
            }
            const user = await model_1.User.findOne({
                _id: data._id,
                "tokens.token": token,
                active: true,
            }).populate("role");
            if (!user) {
                throw new Error("User not found");
            }
            const { _id, name, lastName, email, phone, companies, role } = user;
            const company = companies.filter((item) => item.selected);
            req.user = {
                _id,
                name,
                lastName,
                email,
                phone,
                company: company[0].company,
                role: role.map((r) => r.name),
            };
            req.token = token;
            // Verificar permisos dinámicos
            const userRoles = role.map((r) => r._id.toString());
            // console.log("userRoles", userRoles);
            const permission = await model_2.default.findOne({
                route: `/${module}${req.path}`,
                method: req.method,
            });
            if (permission &&
                !permission.roles.some((role) => {
                    return userRoles.includes(role);
                })) {
                throw new Error("Insufficient permissions");
            }
            next();
        }
        catch (error) {
            console.log("AUTH ERROR", error);
            let message = "Not authorized to access this resource";
            if (error.message) {
                message = `Not authorized to access this resource - ${error.message}`;
            }
            res.status(401).send({ error: message });
        }
    };
}
const sumDays = (date, days) => {
    const newDate = date.getDate() + days;
    date.setDate(newDate);
    return date;
};
