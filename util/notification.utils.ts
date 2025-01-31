import admin from "../config/firebase.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface NotificationData {
  title: string;
  message: string;
  image?: string;
  eventId?: string;
  eventType?: string;
  userId: number;
  data?: Record<string, any>;
}

export const sendNotification = async ({
  title,
  message,
  image,
  eventId,
  eventType,
  userId,
  data = {},
}: NotificationData) => {
  console.log("sendNotification", title, message, image, eventId, eventType, userId);
  try {
    // Save notification to database with complete data
    const notification = await prisma.notification.create({
      data: {
        message,
        userId,
        title,
        image: image || null,
        eventId: eventId || null,
        eventType: eventType || null,
        data: data ? (data as any) : null,
        isRead: false,
      },
    });
    console.log(notification);
    // If Firebase admin isn't initialized, just return after saving to database
    if (!admin) {
      console.log("Firebase admin not initialized, skipping FCM notification");
      return notification;
    }

    console.log("admin", admin);
    // Get user's FCM token
    console.log("userId", userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("user", user);

    if (!user?.fcmToken) {
      console.log("No FCM token found for user, skipping FCM notification");
      return notification;
    }

    // Try to send FCM notification with complete data
    try {
      const fcmMessage = {
        notification: {
          title,
          body: message,
          imageUrl: image,
        },
        data: {
          ...data,
          eventId: eventId?.toString() || "",
          eventType: eventType || "",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        token: user.fcmToken,
      };

      await admin.messaging().send(fcmMessage);
    } catch (fcmError) {
      console.error("Failed to send FCM notification:", fcmError);
    }

    return notification;
  } catch (error) {
    console.error("Error in sendNotification:", error);
    throw error;
  }
};

export const sendNotificationToAdmin = async (
  title: string,
  message: string,
  image?: string,
  eventId?: string,
  eventType?: string,
  data = {}
) => {
  try {
    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, fcmToken: true },
    });
   console.log("sendNotificationToAdmin", adminUsers)
    // Send not  ification to each admin
    const notifications = await Promise.all(
      adminUsers.map((admin) =>
        sendNotification({
          title,
          message,
          image,
          eventId,
          eventType,
          userId: admin.id,
          data,
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error("Error sending admin notifications:", error);
    throw error;
  }
};
