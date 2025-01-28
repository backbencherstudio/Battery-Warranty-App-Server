import admin from "../config/firebase.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface NotificationData {
  title: string;
  body: string;
  userId: number;
  data?: Record<string, string>;
}

export const sendNotification = async ({
  title,
  body,
  userId,
  data = {},
}: NotificationData) => {
  try {
    // Get user's FCM token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) {
      return Error("No FCM token found for user");
    }

    // Save notification to database
    await prisma.notification.create({
      data: {
        message: body,
        userId: userId,
      },
    });

    // Send FCM notification
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      token: user.fcmToken,
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

export const sendNotificationToAdmin = async (
  title: string,
  body: string,
  data = {}
) => {
  try {
    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, fcmToken: true },
    });

    // Send notification to each admin
    const promises = adminUsers.map(async (admin) => {
      if (admin.fcmToken) {
        await sendNotification({
          title,
          body,
          userId: admin.id,
          data,
        });
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error sending admin notifications:", error);
    throw error;
  }
};
