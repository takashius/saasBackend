"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = getProduct;
exports.getFeaturedProduct = getFeaturedProduct;
exports.getProductsByCategory = getProductsByCategory;
exports.getProducts = getProducts;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const store_1 = require("./store");
async function getProduct(productId) {
    try {
        const result = await (0, store_1.getProduct)(productId);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function getFeaturedProduct() {
    try {
        const result = await (0, store_1.getFeatured)();
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function getProductsByCategory(category) {
    try {
        const result = await (0, store_1.getProductByCategory)(category);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function getProducts(filter, page, simple, user) {
    try {
        if (!page || page < 1) {
            page = 1;
        }
        if (filter === "" || filter === undefined || !filter) {
            filter = null;
        }
        let newArray = [];
        let result = null;
        if (simple) {
            result = await (0, store_1.getSimple)();
            result.message.map((item) => {
                newArray.push({
                    id: item._id,
                    name: item.name,
                });
            });
        }
        else {
            const roles = user.role;
            if (roles.includes("SUPER_ADMIN")) {
                result = await (0, store_1.getPaginate)(filter, page, null);
            }
            else if (roles.includes("PROV_USER")) {
                result = await (0, store_1.getPaginate)(filter, page, user.company, user._id.toString());
            }
            else {
                result = await (0, store_1.getPaginate)(filter, page, user.company);
            }
        }
        return {
            status: result.status,
            message: simple ? newArray : result.message,
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function addProduct(post, file, user, company) {
    try {
        return await (0, store_1.addProduct)(post, file, user, company);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function updateProduct(product, file) {
    try {
        if (!product._id) {
            return {
                status: 400,
                message: "No product ID received",
            };
        }
        const result = await (0, store_1.updateProduct)(product, file);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function deleteProduct(id) {
    try {
        return await (0, store_1.deleteProduct)(id);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
