import user from "../components/user/network";
import company from "../components/company/network";
import role from "../components/roles/network";
import category from "../components/categories/network";
import post from "../components/post/network";
import products from "../components/products/network";
import plan from "../components/plan/network";
import permission from "../components/permission/network";

const urlApi = "";

const routes = function (server: any) {
  server.use(urlApi + "/user", user);
  server.use(urlApi + "/company", company);
  server.use(urlApi + "/role", role);
  server.use(urlApi + "/categories", category);
  server.use(urlApi + "/post", post);
  server.use(urlApi + "/products", products);
  server.use(urlApi + "/plan", plan);
  server.use(urlApi + "/permission", permission);
};

export default routes;
