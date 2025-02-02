import { PrismaClient } from "@prisma/client";
import admin from '../config/firebase.config';
import { getImageUrl } from "./image_path";

const prisma = new PrismaClient();

interface NotificationData {
  title: string;
  message: string;
  userId: number;
  image?: string;
  eventType?: string;
  data?: Record<string, any>;
  battery?: boolean;
  warranty?: boolean;
}

class NotificationService {
  static testNotification(fcmToken: any) {
    throw new Error("Method not implemented.");
  }
  static async send(notification: NotificationData) {
    try {
      // 1. Save to database
      const savedNotification = await prisma.notification.create({
        data: {
          title: notification.title,
          message: notification.message,
          userId: notification.userId,
          image: notification.image,
          eventType: notification.eventType,
          battery: notification.battery || false,
          warranty: notification.warranty || false,
          data: notification.data
        }
      });

      // 2. Send push notification
      const user = await prisma.user.findUnique({
        where: { id: notification.userId },
        select: { fcmToken: true }
      });

      if (user?.fcmToken) {
        const message = {
          token: user.fcmToken,
          notification: {
            title: notification.title,
            body: notification.message,
          },
          android: {
            notification: {
              imageUrl: notification.image ? getImageUrl(notification.image) : undefined,
              clickAction: "FLUTTER_NOTIFICATION_CLICK",
              sound: "default"
            }
          },
          data: {
            ...notification.data,
            image: notification.image ? getImageUrl(notification.image) : '',
            eventType: notification.eventType || '',
            battery: notification.battery?.toString() || 'false',
            warranty: notification.warranty?.toString() || 'false',
            notificationId: savedNotification.id.toString()
          }
        };

        await admin.messaging().send(message);
      }

      return savedNotification;
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }
}

export default NotificationService;
