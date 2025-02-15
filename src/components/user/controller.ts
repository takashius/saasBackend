import {
  getUsers as _getUsers,
  getUser as _getUser,
  addUser as _addUser,
  getSimple,
  getPaginate,
  updateUser as update,
  deleteUser as _deleteUser,
  loginUser as login,
  logoutUser as logout,
  logoutAll as _logoutAll,
  changePassword as _changePassword,
  addCompany as _addCompany,
  removeCompany as _removeCompany,
  selectCompany as _selectCompany,
  recoveryStepOne as _recoveryStepOne,
  recoveryStepTwo as _recoveryStepTwo,
  registerUserPublic as _registerUserPublic,
  updateUserRoles as _updateUserRoles,
  uploadImage as _uploadImage,
} from "./store";
import config from "../../config/commons";
import { mailer } from "../../middleware/mailer";
import { getCompany } from "../company/store";
import * as validator from "email-validator";

// export async function getUsers(filterUsers: any) {
//   try {
//     const result = await _getUsers(filterUsers);
//     return result;
//   } catch (e) {
//     console.log(e);
//     return {
//       status: 500,
//       message: "Unexpected error",
//       detail: e,
//     };
//   }
// }

export async function getUsers(
  filter: string,
  page: number,
  simple: boolean,
  user?: any
) {
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
      result = await getSimple();
      result.message.map((item: any) => {
        newArray.push({
          id: item._id,
          name: item.name,
        });
      });
    } else {
      if (user) {
        const roles = user.role;
        if (roles.includes("SUPER_ADMIN")) {
          result = await getPaginate(filter, page);
        } else {
          result = await getPaginate(filter, page, user.company);
        }
      } else {
        result = await getPaginate(filter, page, user.company);
      }
    }
    return {
      status: result.status,
      message: simple ? newArray : result.message,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getUser(id: string) {
  try {
    if (!id) {
      return {
        status: 400,
        message: "User ID is required",
      };
    }
    const result = await _getUser(id);
    const newResult = {
      status: result.status,
      message: {
        _id: result.message._id,
        name: result.message.name,
        lastName: result.message.lastName,
        email: result.message.email,
        date: result.message.date,
        companies: result.message.companies,
        phone: result.message.phone,
        photo: result.message.photo,
        banner: result.message.banner,
        bio: result.message.bio,
        address: result.message.address,
        role: result.message.role,
      },
    };

    if (result.status === 200 && result.message.photo) {
      const photoUrl = result.message.banner
        ? result.message.banner
        : result.message.photo;
      const c_fill = "c_fill,g_auto,h_250,w_970/";
      const gradient = "b_rgb:ffffff,e_gradient_fade,y_-0.50";
      const bannerUrl = photoUrl.replace(
        "https://res.cloudinary.com/erdesarrollo/image/upload",
        `https://res.cloudinary.com/erdesarrollo/image/upload/${c_fill}`
      );
      newResult.message.banner = bannerUrl;
    }
    return newResult;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function addUser(user: any, company: any, file: any) {
  try {
    const fullUser = await _addUser(user, company, file);
    return fullUser;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateUser(user: any, file: any) {
  try {
    if (!user._id) {
      return {
        status: 400,
        message: "No user ID received",
      };
    }
    const result = await update(user, file);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateProfile(id: string, user: any) {
  try {
    user.id = id;
    const result = await update(user, null);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function deleteUser(id: string) {
  try {
    const result = await _deleteUser(id);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function loginUser(user: any) {
  try {
    const { email, password } = user;
    const result = await login(email, password);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function logoutUser(id: string, token: string) {
  try {
    const result = await logout(id, token);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function logoutAll(id: string) {
  try {
    const result = await _logoutAll(id);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function changePassword(user: any, newPass: string) {
  try {
    if (!user || !newPass) {
      return {
        status: 400,
        message: "User or Password not received",
      };
    }
    return _changePassword(user, newPass);
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function addCompany(user: string, company: string) {
  try {
    const fullUser = await _addCompany(user, company);
    return fullUser;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function removeCompany(user: string, company: string) {
  try {
    const fullUser = await _removeCompany(user, company);
    return fullUser;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function selectCompany(user: string, company: string) {
  try {
    const fullUser = await _selectCompany(user, company);
    return fullUser;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function recoveryStepOne(mail: string) {
  try {
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1) + min);
    const foundUser = await _recoveryStepOne(mail, code);
    if (!foundUser.status) {
      return {
        status: 400,
        message: "Correo no encontrado",
      };
    }
    const configCrud = await getCompany(config.companyDefault!);
    const configCompany = configCrud.message;
    const message = `
    <p>Ha solicitado restaurar su clave de acceso, copia el siguiente código en la pantalla de la aplicación para reestablecer su contraseña.</br>
    Si usted no solicitó este correo solo debe ignorarlo.</p>
    <p>
      Sus código es el siguiente: </br>
      <center>
        <h1 style="color: #153643; font-family: Arial, sans-serif; font-size: 42px;">${code}</h1>
      </center>
    </p>
    `;
    mailer(
      configCompany,
      mail,
      `${foundUser.user?.name} ${
        foundUser.user?.lastName ? foundUser.user?.lastName : ""
      }`,
      "Recuperar contraseña",
      "Recuperación de clave",
      message,
      2
    );
    return {
      status: 200,
      message: "Email sent with the generated code",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function recoveryStepTwo(data: any) {
  try {
    const foundUser = await _recoveryStepTwo(
      data.email,
      data.code,
      data.newPass
    );
    if (!foundUser.status) {
      return {
        status: 400,
        message: "Codigo incorrecto",
      };
    }
    const configCrud = await getCompany(config.companyDefault!);
    const configCompany = configCrud.message;
    const message = `
    <p>Se ha cambiado su contraseña exitosamente.</p>
    `;
    mailer(
      configCompany,
      data.email,
      `${foundUser.user?.name} ${foundUser.user?.lastName}`,
      "Cambio de clave exitoso",
      "Cambio de clave",
      message,
      2
    );
    return {
      status: 200,
      message: "Your password has been changed successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function registerUserPublic(data: any) {
  try {
    if (!data.email) {
      return { status: 400, message: { email: "Email is required" } };
    }
    const isValid = validator.validate(data.email);

    if (!isValid) {
      return { status: 400, message: { email: "Email is not valid" } };
    }

    if (data.password.length < 8) {
      return {
        status: 400,
        message: {
          password: "Your password must contain at least 8 characters",
        },
      };
    }
    const user = await _registerUserPublic(data);
    const userData = user.message;
    const configCrud = await getCompany(config.companyDefault!);
    const configCompany = configCrud.message;
    const message = `
    <p>Se ha registrado de forma exitosa en el sistema, a continuacion sus datos registrados en nuesta App.</p>
    <p>
      <ul>
        <li><strong>Nombre:</strong> ${userData.name}</li>
        <li><strong>Empresa:</strong> ${userData.company}</li>
        <li><strong>Rif:</strong> ${userData.docId}</li>
        <li><strong>Correo:</strong> ${userData.email}</li>
        <li><strong>Clave:</strong> ${userData.clave}</li>
      </ul>
    </p>
    `;
    if (user.status !== 201) {
      return user;
    }
    mailer(
      configCompany,
      userData.email,
      `${userData.name}`,
      "Registro Exitoso",
      "Nuevo registro en el sistema",
      message,
      2
    );
    return {
      status: 201,
      message: {
        _id: userData._id,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        date: userData.date,
        token: userData.token,
      },
    };
  } catch (e) {
    console.log("Controller -> registerUserPublic", e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function uploadImage(user: any, file: any, type: string) {
  try {
    const result = await _uploadImage(user, file, type);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateUserRoles(user: string, roles: any) {
  try {
    const fullUser = await _updateUserRoles(user, roles);
    return fullUser;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
