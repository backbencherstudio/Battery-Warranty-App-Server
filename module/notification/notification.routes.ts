import express, { Router } from "express";
import NotificationController from "./notification.controller";
import verifyuser from "../../middleware/verifyUser";

const router: Router = express.Router();

// Get notifications
router.get("/user", verifyuser, NotificationController.getUserNotifications);
router.get("/admin", verifyuser, NotificationController.getAdminNotifications);

// Mark as read
router.patch("/mark-read/:id", verifyuser, NotificationController.markAsRead);
router.patch("/mark-all-read", verifyuser, NotificationController.markAllAsRead);

// Delete notifications
router.delete("/delete/:id", verifyuser, NotificationController.deleteNotification);
router.delete("/delete-all", verifyuser, NotificationController.deleteAllNotifications);

export default router; 