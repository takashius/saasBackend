import Permission from "../components/permission/model";
import { Role } from "../components/user/model";

export default async function registerRoutes(app) {
  // Definir los roles necesarios
  const roles = [
    { name: "SUPER_ADMIN", description: "Super Administrator" },
    { name: "PROV_ADMIN", description: "Provider Administrator" },
    { name: "PROV_USER", description: "Provider User" },
    { name: "PUBLIC", description: "Public User" },
  ];
  // Buscar o crear los roles
  const rolePromises = roles.map(async (role) => {
    let existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      existingRole = await Role.create(role);
    }
    return existingRole;
  });
  // Esperar a que todos los roles sean creados o encontrados
  const [superAdminRole, adminRole, provUserRole, publicRole] =
    await Promise.all(rolePromises);

  app._router.stack.forEach(async (middleware) => {
    if (middleware.route) {
      const route = middleware.route;
      const path = route.path;
      const method = Object.keys(route.methods)[0].toUpperCase();
      const moduleName = path.split("/")[1];
      let title = "";
      let roleName = `ROLE_${moduleName.toUpperCase()}`;

      if (path === `/${moduleName}/`) {
        switch (method) {
          case "GET":
            roleName += "_LIST";
            title = "List";
            break;
          case "POST":
            roleName += "_CREATE";
            title = "Create";
            break;
          case "PATCH":
            roleName += "_EDIT";
            title = "Update";
            break;
        }
      } else if (path.includes("/:id")) {
        switch (method) {
          case "GET":
            roleName += "_GET";
            title = `Get ${moduleName}`;
            break;
          case "DELETE":
            roleName += "_DELETE";
            title = `Delete ${moduleName}`;
            break;
        }
      } else if (path.split("/").length > 1) {
        roleName += `_${path.split("/")[1].toUpperCase()}`;
        title = path
          .split("/")[1]
          .split(/(?=[A-Z])/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      } else if (path.split("/").length > 2) {
        roleName += `_${path.split("/")[2].toUpperCase()}`;
        title = path
          .split("/")[2]
          .split(/(?=[A-Z])/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Verificar si el rol ya existe
      let role = await Role.findOne({ name: roleName });
      if (!role) {
        // Crear el rol si no existe
        role = new Role({
          name: roleName,
          description: `Automatically generated permission for the route: ${method} ${path}`,
        });
        await role.save();
      }
      const roles = [superAdminRole._id, role._id];

      switch (moduleName) {
        case "user":
          if (
            path == "/user/account" ||
            path == "/user/" ||
            path == "/user/profile" ||
            path == "/user/:id" ||
            path == "/user/uploadBanner" ||
            path == "/user/list/:page?/:pattern?" ||
            path == "/user/upload"
          ) {
            roles.push(adminRole._id);
            roles.push(provUserRole._id);
          }
          break;
        case "products":
          roles.push(adminRole._id);
          roles.push(provUserRole._id);
          break;
      }

      // Verifica si la ruta ya existe en la base de datos
      const existingPermission = await Permission.findOne({
        route: path,
        method,
      });

      if (!existingPermission) {
        // Si no existe, crea un nuevo permiso con roles
        const newPermission = new Permission({
          title,
          route: path,
          module: moduleName,
          method,
          roles,
        });
        await newPermission.save();
        console.log(
          `Route registered: ${title} => ${method} ${path} with roles: ${roleName}, SUPER_ADMIN`
        );
      }
    } else if (middleware.name === "router") {
      const basePath = middleware.regexp.source
        .replace("^\\", "")
        .replace("\\/?(?=\\/|$)", "");
      middleware.handle.stack.forEach(async (handler) => {
        if (handler.route) {
          const route = handler.route;
          const path = basePath + route.path;
          const method = Object.keys(route.methods)[0].toUpperCase();
          const moduleName = basePath.split("/")[1];
          let title = "";
          let roleName = `ROLE_${moduleName.toUpperCase()}`;

          if (path === `/${moduleName}/`) {
            switch (method) {
              case "GET":
                roleName += "_LIST";
                title = "List";
                break;
              case "POST":
                roleName += "_CREATE";
                title = "Create";
                break;
              case "PATCH":
                roleName += "_EDIT";
                title = "Update";
                break;
              case "DELETE":
                roleName += "_DELETE";
                title = "Delete";
                break;
            }
          } else if (path.includes("/:id")) {
            switch (method) {
              case "GET":
                roleName += "_GET";
                title = `Get ${moduleName}`;
                break;
              case "DELETE":
                roleName += "_DELETE";
                title = `Delete ${moduleName}`;
                break;
            }
          } else {
            roleName += `_${path.split("/")[2].toUpperCase()}`;
            title = path
              .split("/")[2]
              .split(/(?=[A-Z])/)
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ");
          }

          // Verificar si el rol ya existe
          let role = await Role.findOne({ name: roleName });
          if (!role) {
            // Crear el rol si no existe
            role = new Role({
              name: roleName,
              description: `Automatically generated permission for the route: ${method} ${path}`,
            });
            await role.save();
          }
          const roles = [superAdminRole._id, role._id];

          switch (moduleName) {
            case "user":
              if (
                path == "/user/account" ||
                path == "/user/" ||
                path == "/user/profile" ||
                path == "/user/:id" ||
                path == "/user/uploadBanner" ||
                path == "/user/list/:page?/:pattern?" ||
                path == "/user/upload"
              ) {
                roles.push(adminRole._id);
                roles.push(provUserRole._id);
              }
              break;
            case "products":
              roles.push(adminRole._id);
              roles.push(provUserRole._id);
              break;
          }

          // Verifica si la ruta ya existe en la base de datos
          const existingPermission = await Permission.findOne({
            route: path,
            method,
          });
          if (!existingPermission) {
            // Si no existe, crea un nuevo permiso con roles
            const newPermission = new Permission({
              title,
              route: path,
              module: moduleName,
              method,
              roles,
            });
            await newPermission.save();
            console.log(
              `Route registered: ${title} => ${path} with roles: ${roleName}, SUPER_ADMIN, OTHER`
            );
          }
        }
      });
    }
  });
}
