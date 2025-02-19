import jwt from "jsonwebtoken";
import User from "../models/users.js"; // Importing the User model
import asyncHandler from "express-async-handler"; // To handle asynchronous errors

// Middleware to protect routes and validate user tokens
export const userProtect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the Authorization header contains a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID stored in the decoded token
      req.user = await User.findByPk(decoded.id); // Use Sequelize's findByPk method

      // If no user is found, send an unauthorized error
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Optionally, add the userId to the body for easier access in routes
      req.body.userId = req.user.id;

      // Proceed to the next middleware or route
      next();
    } catch (error) {
      console.error("Authentication error:", error);

      // Handle expired token case
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again" });
      }

      res.status(401).json({ message: "Not authorized, token failed", error: error.message });
    }
  } else {
    // Send an error if no token is provided
    res.status(401).json({ message: "No token, authorization denied" });
  }
});