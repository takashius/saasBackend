"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
function toUserResponse(user) {
    var _a;
    return {
        _id: user._id.toString(),
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        photo: user.photo,
        banner: user.banner,
        date: user.date,
        email: user.email,
        role: user.role,
        bio: user.bio,
        address: user.address,
        password: user.password,
        companies: (_a = user.companies) === null || _a === void 0 ? void 0 : _a.map((company) => ({
            company: company.company,
            selected: company.selected,
        })),
        active: user.active,
    };
}
