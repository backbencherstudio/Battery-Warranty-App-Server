import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class NotificationController {
  // Get user's notifications
  static getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
        error: (error as Error).message,
      });
    }
  };

  // Get admin notifications
  static getAdminNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      if ((req as any).user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Only admin can access admin notifications",
        });
        return;
      }

      const userId = (req as any).user?.id;

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin notifications",
        error: (error as Error).message,
      });
    }
  };

  // Mark notification as read
  static markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      const notification = await prisma.notification.findFirst({
        where: { id: Number(id), userId },
      });

      if (!notification) {
        res.status(404).json({
          success: false,
          message: "Notification not found",
        });
        return;
      }

      await prisma.notification.update({
        where: { id: Number(id) },
        data: { isRead: true },
      });

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
        error: (error as Error).message,
      });
    }
  };

  // Mark all notifications as read
  static markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to mark all notifications as read",
        error: (error as Error).message,
      });
    }
  };

  // Delete a notification
  static deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      const notification = await prisma.notification.findFirst({
        where: { id: Number(id), userId },
      });

      if (!notification) {
        res.status(404).json({
          success: false,
          message: "Notification not found",
        });
        return;
      }

      await prisma.notification.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete notification",
        error: (error as Error).message,
      });
    }
  };

  // Delete all notifications
  static deleteAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      await prisma.notification.deleteMany({
        where: { userId },
      });

      res.status(200).json({
        success: true,
        message: "All notifications deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete all notifications",
        error: (error as Error).message,
      });
    }
  };
}

export default NotificationController; 