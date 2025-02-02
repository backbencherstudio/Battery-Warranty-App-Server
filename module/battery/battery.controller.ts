import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getImageUrl } from "../../util/image_path";
import { calculateWarrantyLeft, formatDate } from "../../util/warranty.utils";

import { BatteryNotifications } from "../../util/notification.templates";
import NotificationService from "../../util/notification.utils";

const prisma = new PrismaClient();

class BatteryController {
  private static transformBatteryResponse(battery: any) {
    return {
      ...battery,
      purchaseDate: formatDate(new Date(battery.purchaseDate)),
      image: getImageUrl(battery.image),
      warranty_left: battery.warrantyEndDate && battery.purchaseDate
        ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
        : null,
    };
  }


  private static transformWithoutLeft(battery: any) {

    return {
      ...battery,
      purchaseDate: formatDate(new Date(battery.purchaseDate)),
      image: getImageUrl(battery.image),
    };
  }

  // Register new battery
  static registration = async (req: Request, res: Response): Promise<void> => {

    try {
      const { name, serialNumber, purchaseDate } = req.body;
      const userId = (req as any).user?.id;

      if (!name || !serialNumber || !purchaseDate || !req.file) {
        res.status(400).json({
          success: false,
          message: "All fields are required",
        });
        return;
      }

      const existingBattery = await prisma.battery.findUnique({
        where: { serialNumber },
      });

      if (existingBattery) {
        res.status(400).json({
          success: false,
          message: "Battery with this serial number already exists",
        });
        return;
      }

      const battery = await prisma.battery.create({
        data: {
          name,
          serialNumber,
          purchaseDate: new Date(purchaseDate),
          image: `/uploads/${req.file.filename}`,
          userId,
          status: "PENDING",
        },
        include: {
          user: true
        }
      });

      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });

      await NotificationService.send({
        title: BatteryNotifications.REGISTRATION.title,
        message: BatteryNotifications.REGISTRATION.message({ batteryName: battery.name }),
        userId: adminUser.id,
        eventType: BatteryNotifications.REGISTRATION.eventType,
        data: {
          batteryId: battery.id.toString(),
          batteryName: battery.name,
          serialNumber: battery.serialNumber,
          status: "PENDING",
          userId: battery.userId.toString(),
          userName: battery.user.name,
        },
        battery: true
      });

      res.status(201).json({
        success: true,
        message: "Battery registration request submitted successfully",
        battery: this.transformWithoutLeft(battery),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to register battery",
        error: (error as Error).message,
      });
    }
  };

  // Accept battery registration
  static acceptRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      if ((req as any).user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Only admin can accept registrations",
        });
        return;
      }

      const { id } = req.params;
      const { warrantyEndDate } = req.body;

      if (!warrantyEndDate) {
        res.status(400).json({
          success: false,
          message: "Warranty end date is required",
        });
        return;
      }

      const battery = await prisma.battery.update({
        where: { id: Number(id) },
        data: { 
          status: "APPROVED",
          warrantyEndDate: new Date(warrantyEndDate)
        },
        include: {
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

      

      const transformedBattery = {
        ...battery,
        image: getImageUrl(battery.image),
        purchaseDate: formatDate(new Date(battery.purchaseDate)),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      };

      await NotificationService.send({
        title: BatteryNotifications.APPROVED.title,
        message: BatteryNotifications.APPROVED.message({ batteryName: battery.name }),
        userId: battery.userId,
        eventType: BatteryNotifications.APPROVED.eventType,
        data: {
          batteryId: battery.id.toString(),
          batteryName: battery.name,
          serialNumber: battery.serialNumber,
          status: "APPROVED",
          userId: battery.userId.toString(),
          userName: battery.user.name,
        },
        battery: true
      });

      res.status(200).json({
        success: true,
        message: "Battery registration request APPROVED successfully",
        battery: transformedBattery,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to approve battery registration",
        error: (error as Error).message,
      });
    }
  };

  // Reject battery registration
  static rejectRegistration = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;

      if ((req as any).user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Only admin can reject registrations",
        });
        return;
      }

      const battery = await prisma.battery.update({
        where: { id: Number(id) },
        data: { status: "REJECTED" },
        include: {
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

      const transformedBattery = {
        ...battery,
        image: getImageUrl(battery.image),
        purchaseDate: formatDate(new Date(battery.purchaseDate)),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      };

      await NotificationService.send({
        title: BatteryNotifications.REJECTED.title,
        message: BatteryNotifications.REJECTED.message({ batteryName: battery.name }),
        userId: battery.userId,
        eventType: BatteryNotifications.REJECTED.eventType,
        data: {
          batteryId: battery.id.toString(),
          batteryName: battery.name,
          serialNumber: battery.serialNumber,
          status: "REJECTED",
          userId: battery.userId.toString(),
          userName: battery.user.name,
        },
        battery: true
      });

      res.status(200).json({
        success: true,
        message: "Battery registration request REJECTED successfully",
        battery: transformedBattery,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to reject battery registration",
        error: (error as Error).message,
      });
    }
  };

  // Get all batteries
  static getAllBatteries = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const batteries = await prisma.battery.findMany({
        orderBy: { id: "desc" },
        include: {
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

      const transformedBatteries = batteries.map((battery) => ({
        ...battery,
        image: getImageUrl(battery.image),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      }));

      res.status(200).json({
        success: true,
        batteries: transformedBatteries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch batteries",
        error: (error as Error).message,
      });
    }
  };

  // Get pending registration batteries
  static getPendingBatteries = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const batteries = await prisma.battery.findMany({
        where: { status: "PENDING" },
        orderBy: { id: "desc" },
        include: {
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

      const transformedBatteries = batteries.map((battery) => ({
        ...battery,
        image: getImageUrl(battery.image),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      }));

      res.status(200).json({
        success: true,
        batteries: transformedBatteries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending batteries",
        error: (error as Error).message,
      });
    }
  };

  // Get rejected batteries
  static getRejectedBatteries = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const batteries = await prisma.battery.findMany({
        where: { status: "REJECTED" },
        orderBy: { id: "desc" },
        include: {
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

      const transformedBatteries = batteries.map((battery) => ({
        ...battery,
        image: getImageUrl(battery.image),
        purchaseDate: formatDate(new Date(battery.purchaseDate)),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      }));

      res.status(200).json({
        success: true,
        batteries: transformedBatteries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch rejected batteries",
        error: (error as Error).message,
      });
    }
  };

  // Get my batteries
  static getMyBatteries = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const batteries = await prisma.battery.findMany({
        where: { userId },
        orderBy: { id: "desc" },
        include: {
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

      const transformedBatteries = batteries.map((battery) => ({
        ...battery,
        image: getImageUrl(battery.image),
        purchaseDate: formatDate(new Date(battery.purchaseDate)),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      }));

      res.status(200).json({
        success: true,
        batteries: transformedBatteries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your batteries",
        error: (error as Error).message,
      });
    }
  };

  // Get my pending batteries
  static getMyPendingBatteries = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const batteries = await prisma.battery.findMany({
        where: { 
          userId,
          status: "PENDING" 
        },
        orderBy: { id: "desc" },
        include: {
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

      const transformedBatteries = batteries.map((battery) => ({
        ...battery,
        image: getImageUrl(battery.image),
        purchaseDate: formatDate(new Date(battery.purchaseDate)),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      }));

      res.status(200).json({
        success: true,
        batteries: transformedBatteries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your pending batteries",
        error: (error as Error).message,
      });
    }
  };

  // Get my rejected batteries
  static getMyRejectedBatteries = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      const batteries = await prisma.battery.findMany({
        where: { 
          userId,
          status: "REJECTED" 
        },
        orderBy: { id: "desc" },
        include: {
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

      const transformedBatteries = batteries.map((battery) => ({
        ...battery,
        image: getImageUrl(battery.image),
        purchaseDate: formatDate(new Date(battery.purchaseDate)),
        user: {
          ...battery.user,
          image: battery.user.image ? getImageUrl(battery.user.image) : null,
        },
        warranty_left: battery.warrantyEndDate && battery.purchaseDate
          ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
          : null,
      }));

      res.status(200).json({
        success: true,
        batteries: transformedBatteries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your rejected batteries",
        error: (error as Error).message,
      });
    }
  };
}

export default BatteryController;