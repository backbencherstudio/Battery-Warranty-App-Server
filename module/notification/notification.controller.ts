import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getImageUrl } from "../../util/image_path";
import { calculateWarrantyLeft } from "../../util/warranty.utils";
import  NotificationService from "../../util/notification.utils";

const prisma = new PrismaClient();

interface NotificationWithWarrantyInfo {
  id: number;
  title: string;
  message: string;
  image: string | null;
  eventId: string | null;
  eventType: string | null;
  data: {
    status: string;
    userId: string;
    userName: string;
    batteryId?: string;
    warrantyId?: string;
    userEmail: string;
    serialNumber: string;
    batteryName: string;
    purchaseDate?: string;
    congratulation?: string;
    sorry?: string;
    burryy?: string;
    batteryImage?: string | null;
  };
  userId: number;
  isRead: boolean;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
  warranty_left?: {
    month: number;
    day: number;
    percentage: number;
  };
}

class NotificationController {
  private static async transformNotification(notification: any): Promise<NotificationWithWarrantyInfo> {
    let warranty_left;
    let batteryName = notification.data?.batteryName;
    let batteryImage = notification.data?.batteryImage;
    
    if (notification.eventType?.includes('BATTERY_') || notification.eventType?.includes('WARRANTY_')) {
      const battery = await prisma.battery.findFirst({
        where: { serialNumber: notification.data?.serialNumber },
        select: { 
          name: true,
          image: true,
          warrantyEndDate: true,
          purchaseDate: true
        }
      });
      
      if (battery) {
        if (battery.warrantyEndDate && battery.purchaseDate) {
          warranty_left = calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate);
        }
        batteryName = battery.name;
        batteryImage = battery.image ? getImageUrl(battery.image) : null;
      }
    }

    // Ensure batteryName and batteryImage exist in data
    const data = {
      ...notification.data,
      batteryName: batteryName || notification.data?.name || 'Unknown Battery',
      batteryImage: batteryImage || notification.data?.batteryImage || null
    };

    return {
      ...notification,
      image: notification.image ? getImageUrl(notification.image) : null,
      warranty_left,
      data,
    };
  }

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
              image: true
           
            }
          }
        },
      });

      // Transform notifications with proper image URLs and warranty info
      const transformedNotifications = await Promise.all(
        notifications.map(notification => this.transformNotification(notification))
      );

      res.status(200).json({
        success: true,
        notifications: transformedNotifications,
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

      const notifications = await prisma.notification.findMany({
        where: {
          eventType: {
            in: ["BATTERY_REGISTRATION", "WARRANTY_REQUEST"],
          },
        },
        orderBy: { createdAt: "desc" }
      });

      console.log("notifications", notifications);
      

      const transformedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          // Get the requesting user's information
          const requestingUser = await prisma.user.findUnique({
            where: { 
              id: parseInt((notification.data as any).userId) 
            },
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
            }
          });

          let batteryInfo = null;
          if ((notification.data as any)?.serialNumber) {
            batteryInfo = await prisma.battery.findFirst({
              where: { serialNumber: (notification.data as any).serialNumber },
              select: {
                name: true,
                image: true,
                warrantyEndDate: true,
                purchaseDate: true,
              },
            });
          }

          const transformed = await this.transformNotification(notification);

          if (batteryInfo?.image) {
            transformed.data.batteryImage = getImageUrl(batteryInfo.image);
          }

          // Return with requesting user's information and format user image
          return {
            ...transformed,
            user: requestingUser ? {
              ...requestingUser,
              image: requestingUser.image ? getImageUrl(requestingUser.image) : null
            } : null,  // Format user image URL
            userId: parseInt((notification.data as any).userId),
          };
        })
      );

      res.status(200).json({
        success: true,
        notifications: transformedNotifications,
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

  // Delete selected notifications
  static deleteSelectedNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { notificationIds } = req.body;

      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        res.status(400).json({
          success: false,
          message: "Please provide an array of notification IDs",
        });
        return;
      }

      // Verify all notifications belong to the user
      const notifications = await prisma.notification.findMany({
        where: {
          id: { in: notificationIds.map(Number) },
          userId,
        },
      });

      if (notifications.length !== notificationIds.length) {
        res.status(403).json({
          success: false,
          message: "Some notifications don't belong to the user or don't exist",
        });
        return;
      }

      // Delete the selected notifications
      await prisma.notification.deleteMany({
        where: {
          id: { in: notificationIds.map(Number) },
          userId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Selected notifications deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete selected notifications",
        error: (error as Error).message,
      });
    }
  };

  // Get unread notifications count
  static getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get unread notifications count",
        error: (error as Error).message,
      });
    }
  };

  // Get latest notifications with pagination
  static getLatestNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.notification.count({
          where: { userId },
        }),
      ]);

      // Transform notifications with proper image URLs and warranty info
      const transformedNotifications = await Promise.all(
        notifications.map(notification => this.transformNotification(notification))
      );

      res.status(200).json({
        success: true,
        notifications: transformedNotifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
        error: (error as Error).message,
      });
    }
  };

  // Add this method to your NotificationController class
  static testFCM = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fcmToken } = req.body;
      
      if (!fcmToken) {
        res.status(400).json({
          success: false,
          message: "FCM token is required"
        });
        return;
      }

      const result = await NotificationService.testNotification(fcmToken);
      
      res.status(200).json({
        success: true,
        message: "Test notification sent successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send test notification",
        error: (error as Error).message
      });
    }
  };
}

export default NotificationController; 
