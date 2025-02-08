import user from "./user";
import company from "./company";
import role from "./role";
import categories from "./categories";
import post from "./post";
import product from "./product";
import plan from "./plan";
import permissions from "./permissions";

const definition = {
  swagger: "2.0",
  info: {
    version: "2.0.0",
    title: "Detallitos24's API",
    description: "API for Detallitos24 App",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  host: "localhost:5000",

  servers: [
    {
      url: "localhost:5000",
      description: "Local server",
    },
  ],

  tags: [
    {
      name: "Users",
      description: "User management",
    },
    {
      name: "Company",
      description: "Company users",
    },
    {
      name: "Role",
      description: "Roles users",
    },
    {
      name: "Categories",
      description: "Product categories",
    },
    {
      name: "Posts",
      description: "Blog posts",
    },
    {
      name: "Products",
      description: "Products",
    },
    {
      name: "Plan",
      description: "Planes",
    },
    {
      name: "Permissions",
      description: "Permissions",
    },
  ],
  consumes: ["application/json"],
  produces: ["application/json"],
  paths: {
    "/user/login": user.login,
    "/user/logout": user.logout,
    "/user/register": user.register,
    "/user/updateRoles": user.updateRoles,
    "/user": user.create,
    "/user ": user.update,
    "/user  ": user.list,
    "/user/{id}": user.userByID,
    "/user/account": user.account,
    "/user/change_password": user.changePassword,
    "/user/recovery/{email}": user.recoveryPass1,
    "/user/recovery": user.recoveryPass2,
    "/user/add_company": user.addCompany,
    "/user/select_company": user.selectCompany,
    "/user/upload": user.upload,
    "/user/del_company": user.removeCompany,
    "/company": company.create,
    "/company ": company.update,
    "/company  ": company.list,
    "/company/{id}": company.companyByID,
    "/company/{id} ": company.deleted,

    "/role/list/{page}/{pattern}": role.list,
    "/role/simple": role.simple,
    "/role": role.create,
    "/role ": role.update,
    "/role/{id}": role.roleByID,
    "/role/{id} ": role.deleted,

    "/categories/list/{page}/{pattern}": categories.list,
    "/categories/simple": categories.simple,
    "/categories": categories.create,
    "/categories ": categories.update,
    "/categories/{id}": categories.categoryByID,
    "/categories/{id} ": categories.deleted,

    "/posts/list/{page}/{pattern}": post.list,
    "/posts/simple": post.simple,
    "/posts": post.create,
    "/posts ": post.update,
    "/posts/{id}": post.postByID,
    "/posts/{id} ": post.deleted,

    "/products/list/{page}/{pattern}": product.list,
    "/products/simple": product.simple,
    "/products": product.create,
    "/products ": product.update,
    "/products/{id}": product.productByID,
    "/products/{id} ": product.deleted,

    "/plan/list/{page}/{pattern}": plan.list,
    "/plan/simple": plan.simple,
    "/plan": plan.create,
    "/plan ": plan.update,
    "/plan/{id}": plan.planByID,
    "/plan/{id} ": plan.deleted,

    "/permission/list/{pattern}": permissions.list,
    "/permission": permissions.create,
    "/permission ": permissions.update,
    "/permission/{id}": permissions.permissionByID,
    "/permission/{id} ": permissions.deleted,
  },
  definitions: {
    User: user.definitions.User,
    Users: user.definitions.Users,
    ResponseUserLoginData: user.definitions.ResponseUserLoginData,
    ResponseUserData: user.definitions.ResponseUserData,
    CreatedUser: user.definitions.CreatedUser,
    MiniDataUser: user.definitions.MiniDataUser,
    ResponseCloudinary: user.definitions.ResponseCloudinary,
    Company: company.definitions.Company,
    CreatedCompany: company.definitions.CreatedCompany,
    ListCompany: company.definitions.ListCompany,

    Role: role.definitions.Role,
    CreatedRole: role.definitions.CreatedRole,
    ListRole: role.definitions.ListRole,

    Categories: categories.definitions.Categories,
    CreatedCategory: categories.definitions.CreatedCategory,
    ListCategory: categories.definitions.ListCategory,

    Posts: post.definitions.Posts,
    CreatedPost: post.definitions.CreatedPost,
    ListPost: post.definitions.ListPost,

    Product: product.definitions.Product,
    CreatedProduct: product.definitions.CreatedProduct,
    ProductForList: product.definitions.ProductForList,
    ListProduct: product.definitions.ListProduct,

    FormatSimple: role.definitions.FormatSimple,
    ListSimple: role.definitions.ListSimple,

    Plan: plan.definitions.Plan,
    CreatedPlan: plan.definitions.CreatedPlan,
    ListPlan: plan.definitions.ListPlan,

    Permissions: permissions.definitions.Permissions,
    CreatedPermission: permissions.definitions.CreatedPermission,
    ListPermission: permissions.definitions.ListPermission,
  },
};

export default definition;
