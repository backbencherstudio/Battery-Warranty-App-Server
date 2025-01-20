// Routes and Controllers for User
// Express.js routes
import express, { Router } from "express";
import UserController from "./users.controllers";
import verifyuser from "../../middleware/verifyUser";
import upload from "../../middleware/Multer.config";

const router: Router = express.Router();

router.post("/signup/send-otp", UserController.sendOtp);
router.post("/signup/verify-otp", UserController.verifyOtp);
router.post("/signup/register", UserController.register);

// user get
router.get("/get-one-users/:id", UserController.getSingleUser);
router.get("/get-all-users", UserController.getAllUsers);

// Login routes
router.post("/login", UserController.login);

// Forgot Password
router.post('/forgot-password/send-otp', UserController.forgotPasswordSendOtp);
router.post('/forgot-password/verify-otp', UserController.forgotPasswordVerifyOtp);
router.post('/forgot-password/reset', UserController.resetPassword);

//check authentication
router.get("/verify", UserController.verify);

//edit user profile
router.patch('/edit-profile', verifyuser, upload.single("image"), UserController.editProfile)

// Google Sign In for Flutter
router.post('/auth/google', UserController.googleSignIn);

export default router;
