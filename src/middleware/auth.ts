import { JwtPayload, verify } from "jsonwebtoken";
import { User } from "../components/user/model";
import Permission from "../components/permission/model";
import config from "../config/commons";
import { Response, NextFunction } from "express";
import { IGetUserAuthInfoRequest } from "../types/general";

export default function auth(module: string = "") {
  return async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new Error("Token not provided");
      }
      const data = verify(token, config.JWT_KEY) as JwtPayload;
      if (data.date) {
        const dateLimit = sumDays(new Date(data.date), 5);
        const dateNow = new Date();
        if (+dateNow <= +dateLimit) {
          //throw new Error('Expired token');
        }
      } else {
        //throw new Error('Undated Token');
      }
      const user = await User.findOne({
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
        role: role.map((r: any) => r.name),
      };
      req.token = token;

      // Verificar permisos dinámicos
      const userRoles = role.map((r: any) => r._id.toString());
      // console.log("userRoles", userRoles);
      const permission = await Permission.findOne({
        route: `/${module}${req.path}`,
        method: req.method,
      });
      if (
        permission &&
        !permission.roles.some((role: any) => {
          return userRoles.includes(role);
        })
      ) {
        throw new Error("Insufficient permissions");
      }

      next();
    } catch (error) {
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
