import express from 'express';
import { registerUser, loginUser ,userRefetch ,  resetPassword , logoutUser} from '../controllers/userController.js';
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/profile", protect, userRefetch);
router.post("/reset-password", resetPassword);
router.post("/logout",  logoutUser);
export default router;
