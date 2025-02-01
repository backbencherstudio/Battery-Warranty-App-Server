import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getImageUrl } from "../../util/image_path";
import { calculateWarrantyLeft } from "../../util/warranty.utils";
import {
  sendNotification,
  sendNotificationToAdmin,
} from "../../util/notification.utils";

const prisma = new PrismaClient();

class WarrantyController {
  private static async validateWarrantyEligibility(
    batteryId: number
  ): Promise<boolean> {
    const battery = await prisma.battery.findUnique({
      where: { id: batteryId },
    });

    if (!battery || battery.status !== "APPROVED") {
      return false;
    }

    const purchaseDate = new Date(battery.purchaseDate);
    const currentDate = new Date();
    const oneYearFromPurchase = new Date(purchaseDate);
    oneYearFromPurchase.setFullYear(oneYearFromPurchase.getFullYear() + 1);

    return currentDate <= oneYearFromPurchase;
  }

  // Request warranty

  static requestWarranty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { serialNumber } = req.body;
      const userId = (req as any).user?.id;

      if (!serialNumber || !req.file) {
        res.status(400).json({
          success: false,
          message: "Serial number and image are required",
        });
        return;
      }

      // Find battery by serial number
      const battery = await prisma.battery.findUnique({
        where: { serialNumber },
      });

      const existingWarranty = await prisma.warranty.findFirst({
        where: { batteryId: battery?.id, userId },
      });
      if (existingWarranty) {
        if (
          existingWarranty.status !== "REJECTED" &&
          existingWarranty.status !== "APPROVED"
        ) {
          res.status(400).json({
            success: false,
            message:
              "You have already submitted a warranty request for this battery",
          });
          return;
        }
      }

      if (!battery) {
        res.status(404).json({
          success: false,
          message: "Battery not found with this serial number",
        });
        return;
      }

      // Check warranty eligibility
      const isEligible = await this.validateWarrantyEligibility(battery.id);
      if (!isEligible) {
        res.status(400).json({
          success: false,
          message: "Battery is not eligible for warranty or not approved",
        });
        return;
      }

      // Override existing REJECTED warranty or create a new one
      const warranty = await prisma.warranty.upsert({
        where: {
          batteryId_userId: { batteryId: battery.id, userId },
        },
        create: {
          serialNumber,
          image: `/uploads/${req.file.filename}`,
          batteryId: battery.id,
          userId,
          status: "PENDING",
        },
        update: {
          serialNumber,
          image: `/uploads/${req.file.filename}`,
          status: "PENDING",
        },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      // Send notification to admin
      try {
        await sendNotificationToAdmin(
          "New Warranty Request",
          `New warranty request from ${warranty.user.name} for battery ${warranty.serialNumber}`,
          warranty.image,
          warranty.id.toString(),
          "WARRANTY_REQUEST",
          {
            status: "PENDING",
            userId: warranty.userId.toString(),
            userName: warranty.user.name,
            warrantyId: warranty.id.toString(),
            userEmail: warranty.user.email,
            serialNumber: warranty.serialNumber,
            batteryName: warranty.battery.name,
            purchaseDate: warranty.battery.purchaseDate,
          }
        );
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
      }

      const transformedWarranty = {
        ...warranty,
        image: getImageUrl(warranty.image),
        battery: {
          ...warranty.battery,
          image: getImageUrl(warranty.battery.image),
          warranty_left:
            warranty.battery.warrantyEndDate && warranty.battery.purchaseDate
              ? calculateWarrantyLeft(
                  warranty.battery.warrantyEndDate,
                  warranty.battery.purchaseDate
                )
              : null,
        },
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      };

      res.status(201).json({
        success: true,
        message: "Warranty request submitted successfully",
        warranty: transformedWarranty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to submit warranty request",
        error: (error as Error).message,
      });
    }
  };

  // Get all warranties (Admin only)
  static getAllWarranties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if ((req as any).user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Only admin can access all warranties",
        });
        return;
      }

      const warranties = await prisma.warranty.findMany({
        orderBy: { id: "desc" },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformedWarranties = warranties.map((warranty) => ({
        ...warranty,
        image: getImageUrl(warranty.image),
        battery: {
          ...warranty.battery,
          image: getImageUrl(warranty.battery.image),
          warranty_left: warranty.battery.warrantyEndDate
            ? calculateWarrantyLeft(
                warranty.battery.warrantyEndDate,
                new Date()
              )
            : null,
        },
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      }));

      res.status(200).json({
        success: true,
        warranties: transformedWarranties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch warranties",
        error: (error as Error).message,
      });
    }
  };

  // Approve warranty request (Admin only)
  static approveWarranty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Check admin permission
      if ((req as any).user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Only admin can approve warranty requests",
        });
        return;
      }

      const { id } = req.params;

      // Update warranty status and get minimal required data
      const warranty = await prisma.warranty.update({
        where: { id: Number(id) },
        data: { status: "APPROVED" },
        include: {
          battery: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              purchaseDate: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Send notification to user
      try {
        await sendNotification({
          title: "Congratulations! Warranty Request Approved",
          message: `Congratulations ${warranty.user.name}! Your warranty request for battery ${warranty.serialNumber} has been approved`,
          userId: warranty.userId,
          eventId: warranty.id.toString(),
          eventType: "WARRANTY_APPROVED",
          data: {
            status: "APPROVED",
            congratulation: `Congratulations ${warranty.user.name}!`,
            userId: warranty.userId.toString(),
            userName: warranty.user.name,
            warrantyId: warranty.id.toString(),
            userEmail: warranty.user.email,
            serialNumber: warranty.serialNumber,
            batteryName: warranty.battery.name,
            purchaseDate: warranty.battery.purchaseDate,
          },
        });
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
      }

      res.status(200).json({
        success: true,
        message: "Warranty request approved successfully",
        warrantyId: warranty.id,
      });
    } catch (error: unknown) {
      // Handle specific Prisma errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2025"
      ) {
        res.status(404).json({
          success: false,
          message: "Warranty not found",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Failed to approve warranty request",
        error: (error as Error).message,
      });
    }
  };

  // Reject warranty request (Admin only)
  static rejectWarranty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if ((req as any).user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Only admin can reject warranty requests",
        });
        return;
      }

      const { id } = req.params;
      const warranty = await prisma.warranty.update({
        where: { id: Number(id) },
        data: { status: "REJECTED" },
        include: {
          battery: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              purchaseDate: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Send notification to user
      try {
        await sendNotification({
          title: "Warranty Request Update",
          message: `Sorry ${warranty.user.name}, your warranty request for battery ${warranty.serialNumber} has been rejected`,
          userId: warranty.userId,
          eventId: warranty.id.toString(),
          eventType: "WARRANTY_REJECTED",
          data: {
            status: "REJECTED",
            sorry: `Sorry ${warranty.user.name}`,
            userId: warranty.userId.toString(),
            userName: warranty.user.name,
            warrantyId: warranty.id.toString(),
            userEmail: warranty.user.email,
            serialNumber: warranty.serialNumber,
            batteryName: warranty.battery.name,
            purchaseDate: warranty.battery.purchaseDate,
          },
        });
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
      }

      const transformedWarranty = {
        ...warranty,
        image: getImageUrl(warranty.image),
        user: {
          ...warranty.user,
        },
      };

      res.status(200).json({
        success: true,
        message: "Warranty request rejected successfully",
        warranty: transformedWarranty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to reject warranty request",
        error: (error as Error).message,
      });
    }
  };

  // Get all approved warranties
  static getApprovedWarranties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const warranties = await prisma.warranty.findMany({
        where: { status: "APPROVED" },
        orderBy: { id: "desc" },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformedWarranties = warranties.map((warranty) => ({
        ...warranty,
        image: getImageUrl(warranty.image),
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      }));

      res.status(200).json({
        success: true,
        warranties: transformedWarranties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch approved warranties",
        error: (error as Error).message,
      });
    }
  };

  static getPendingWarranties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const warranties = await prisma.warranty.findMany({
        where: { status: "PENDING" },
        orderBy: { id: "desc" },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformedWarranties = warranties.map((warranty) => ({
        ...warranty,
        image: getImageUrl(warranty.image),
        battery: {
          ...warranty.battery,
          image: getImageUrl(warranty.battery.image),
          warranty_left:
            warranty.battery.warrantyEndDate && warranty.battery.purchaseDate
              ? calculateWarrantyLeft(
                  warranty.battery.warrantyEndDate,
                  warranty.battery.purchaseDate
                )
              : null,
        },
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      }));

      res.status(200).json({
        success: true,
        warranties: transformedWarranties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending warranties",
        error: (error as Error).message,
      });
    }
  };

  // Get all rejected warranties
  static getRejectedWarranties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const warranties = await prisma.warranty.findMany({
        where: { status: "REJECTED" },
        orderBy: { id: "desc" },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformedWarranties = warranties.map((warranty) => ({
        ...warranty,
        image: getImageUrl(warranty.image),
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      }));

      res.status(200).json({
        success: true,
        warranties: transformedWarranties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch rejected warranties",
        error: (error as Error).message,
      });
    }
  };

  // Get user's own warranty requests
  static getMyWarranties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const warranties = await prisma.warranty.findMany({
        where: { userId },
        orderBy: { id: "desc" },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformedWarranties = warranties.map((warranty) => ({
        ...warranty,
        image: getImageUrl(warranty.image),
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      }));

      res.status(200).json({
        success: true,
        warranties: transformedWarranties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your warranty requests",
        error: (error as Error).message,
      });
    }
  };

  // Get user's own rejected warranty requests
  static getMyRejectedWarranties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const warranties = await prisma.warranty.findMany({
        where: {
          userId,
          status: "REJECTED",
        },
        orderBy: { id: "desc" },
        include: {
          battery: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformedWarranties = warranties.map((warranty) => ({
        ...warranty,
        image: getImageUrl(warranty.image),
        user: {
          ...warranty.user,
          image: warranty.user.image ? getImageUrl(warranty.user.image) : null,
        },
      }));

      res.status(200).json({
        success: true,
        warranties: transformedWarranties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your rejected warranty requests",
        error: (error as Error).message,
      });
    }
  };
}

export default WarrantyController;
