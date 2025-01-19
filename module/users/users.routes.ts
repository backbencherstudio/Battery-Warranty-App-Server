// Routes and Controllers for User
// Express.js routes
import express, { Router } from "express";
import UserController from "./users.controllers";

const router: Router = express.Router();

router.post('/signup/send-otp', UserController.sendOtp);
router.post('/signup/verify-otp', UserController.verifyOtp);
router.post('/signup/register', UserController.register);

// // Login
router.post('/login', UserController.login);
// router.post('/login/google', userController.googleLogin);

// // Forgot Password
// router.post('/forgot-password/send-otp', userController.forgotPasswordSendOtp);
// router.post('/forgot-password/verify-otp', userController.forgotPasswordVerifyOtp);
// router.post('/forgot-password/reset', userController.resetPassword);

export default router
