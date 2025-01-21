import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModels";

export interface ExtendRequest extends Request {
  user?: any;
}

const ValidateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    res.status(403).send("header not provided");
    return;
  }
  
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(token, "F5F797627CE9812FDDEEAD86579F8", async (err, payload) => {
    if (err) {
      res.status(403).send("invalid token");
      return;
    }
    
    if (!payload) {
      res.status(403).send("invalid payload");
      return;
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    const user = await userModel.findOne({ email: userPayload.email });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).send("User not found");
    }
  });
};

export default ValidateJWT;
