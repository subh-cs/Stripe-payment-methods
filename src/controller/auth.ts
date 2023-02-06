import { Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export const auth = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    token = token.split(" ")[1];
    let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.stripeId = user.stripeId;
    req.id = user.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};