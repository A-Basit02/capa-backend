import jwt from "jsonwebtoken";
import Admin  from "../models/adminModel.js";
import asyncHandler from "express-async-handler";

export const adminProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findByPk(decoded.id);

      if (!req.admin) {
        return res.status(401).json({ message: "Not authorized as admin" });
      }

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
});


