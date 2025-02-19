import express from "express";
import {
  createPost,
  editPost,
  deletePost,
  fetchAllPost,
  fetchPostById,
  fetchMyPosts,
  approvePost,
  unapprovePost,
  sendReviewEmail,
  fetchUnapprovedPosts,
  fetchApprovedPosts,
} from "../controllers/postController.js";
import { adminProtect } from "../middleware/adminProtect.js";
import { userProtect } from "../middleware/userProtect.js";
const router = express.Router();

// Create a new post (Protected)
router.post("/create", userProtect, createPost);

// Edit an existing post by ID (Protected)
router.put("/:id", userProtect, editPost);

// Delete a post by ID (Protected)
router.delete("/admin/:id", adminProtect, deletePost);

// Fetch all posts (Protected)
router.get("/admin/all", adminProtect, fetchAllPost);
router.get("/user/all", userProtect, fetchAllPost);

// Fetch a post by ID (Protected)
router.get("/admin/:id", adminProtect, fetchPostById);
router.get("/user/:id", userProtect, fetchPostById);

// Fetch posts created by the current user (Protected)
router.get("/mine", userProtect, fetchMyPosts);

router.put("/approve/:id", adminProtect, approvePost);
// Fetch unapproved posts (Protected)

router.put("/unapproved/:id", adminProtect, unapprovePost);

router.post("/send-review-email/:id", userProtect, sendReviewEmail);

router.get("/approved-posts", adminProtect, fetchApprovedPosts);
router.get("/unapproved-posts", adminProtect, fetchUnapprovedPosts);
// router.get("/closed-posts", adminProtect, fetchRejectPosts);
export default router;
