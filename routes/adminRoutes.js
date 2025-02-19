import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllRCAMembers,
  createRCAMembers,
  deleteRCAMember,
  updateRCAMember,
  adminRefetch,
  fetchAllUsers,
  editUserInfo,
} from "../controllers/adminController.js"; // Importing the controller
import { adminProtect } from "../middleware/adminProtect.js";

const router = express.Router();

// @route   POST /api/admins/register
// @desc    Register a new admin
// @access  Public
router.post("/register", registerAdmin);

// @route   POST /api/admins/login
// @desc    Login an existing admin
// @access  Public
router.post("/login", loginAdmin);

router.post("/ManageRca",adminProtect, createRCAMembers);

router.get("/ManageRca", getAllRCAMembers);

router.delete("/ManageRca/:id",adminProtect, deleteRCAMember); // Delete RCA member

router.put("/ManageRca/:id",adminProtect, updateRCAMember); // Update RCA member

router.get("/profile", adminProtect, adminRefetch); // Protected route


router.put("/user/:id", adminProtect, editUserInfo);

router.get("/users", adminProtect, fetchAllUsers);

export default router;
