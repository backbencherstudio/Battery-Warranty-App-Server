import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  generateOTP,
  sendForgotPasswordOTP,
  sendRegistrationOTPEmail,
} from "../../util/otpUtils";
import path from "path";
import fs from "fs";
import { getImageUrl } from "../../util/image_path";
import { formatDate, calculateWarrantyLeft } from "../../util/warranty.utils";
dotenv.config();

const prisma = new PrismaClient();

class UserController {
  private static otpExpiryTime: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  static sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, name, phone } = req.body;

    if (!email || !name || !phone) {
      res.status(400).json({
        success: false,
        message: "Email, name and phone are required"
      });
      return;
    }

    try {
      const otp = generateOTP();
      const expiry = new Date(Date.now() + UserController.otpExpiryTime);

      // Check if user already exists in the "user" schema
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User already exists. Please log in."
        });
        return;
      }

      // Save all user data in ucode
      await prisma.ucode.upsert({
        where: { email },
        update: {
          otp,
          expired_at: expiry,
          name,
          phone,
        },
        create: {
          name,
          email,
          otp,
          expired_at: expiry,
          phone,
        },
      });

      // Send email asynchronously
      sendRegistrationOTPEmail(name, email, otp).catch((error) =>
        console.error("Failed to send email:", error)
      );

      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        email,
        name
      });
    } catch (error) {
      console.error("Error in sendOtp:", error);
      res.status(500).json({
        success: false,
        message: `Failed to send OTP. Please try again later. ${error}`
        
      });
    }
  };

  static verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }

    try {
      const ucode = await prisma.ucode.findUnique({ where: { email } });

      if (
        !ucode ||
        ucode.otp !== otp ||
        !ucode.expired_at ||
        new Date() > ucode.expired_at
      ) {
        res.status(400).json({ error: "Invalid or expired OTP" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  };

  static register = async (req: Request, res: Response): Promise<void> => {
    try {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      return;
    }

      // Get user data from ucode
      const ucodeData = await prisma.ucode.findUnique({
        where: { email }
      });

      if (!ucodeData) {
        res.status(400).json({
          success: false,
          message: "Please verify your OTP first",
        });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with data from ucode
      const user = await prisma.user.create({
        data: {
          name: ucodeData.name,
          email: ucodeData.email,
          phone: ucodeData.phone,
          password: hashedPassword,
          role: "USER",
        },
      });

      // Delete the ucode entry after successful registration
      await prisma.ucode.delete({
        where: { email }
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to register user",
        error: (error as Error).message,
      });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      // Validate credentials
      if (
        !user ||
        !user.password ||
        !(await bcrypt.compare(password, user.password))
      ) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" }
      );

      // Transform the image URL
      const transformedUser = {
        ...user,
        image: user.image ? getImageUrl(user.image) : null,
      };

      res.status(200).json({ success: true, token, user: transformedUser });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  };

  static adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      // Validate credentials
      if (
        !user ||
        !user.password ||
        !(await bcrypt.compare(password, user.password))
      ) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      if (user.role !== "ADMIN") {
        res.status(401).json({ error: "You are not an admin" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" }
      );

      // Transform the image URL
      const transformedUser = {
        ...user,
        image: user.image ? getImageUrl(user.image) : null,
      };

      res.status(200).json({ success: true, token, user: transformedUser });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  };

  static getSingleUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Transform the image URL
      const transformedUser = {
        ...user,
        image: user.image ? getImageUrl(user.image) : null,
      };

      res.status(200).json(transformedUser);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  static getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          address: true,
          phone: true,  // Add phone field
          role: true,
        },
      });

      const transformedUsers = users.map(user => ({
        ...user,
        image: user.image ? getImageUrl(user.image) : null,
      }));

      res.status(200).json({
        success: true,
        users: transformedUsers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: (error as Error).message,
      });
    }
  };

  static forgotPasswordSendOtp = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const otp = generateOTP();
      const expiry = new Date(Date.now() + UserController.otpExpiryTime);

      await prisma.ucode.upsert({
        where: { email },
        update: { otp, expired_at: expiry, name: user.name },
        create: { name: user.name, email, otp, expired_at: expiry },
      });

      sendForgotPasswordOTP(user.name, email, otp).catch((error) =>
        console.error("Failed to send email:", error)
      );

      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error in forgotPasswordSendOtp:", error);
      res
        .status(500)
        .json({ error: "Failed to send OTP. Please try again later." });
    }
  };

  static forgotPasswordVerifyOtp = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }

    try {
      const ucode = await prisma.ucode.findUnique({ where: { email } });
      console.log(ucode);
      if (!ucode) {
        res.status(400).json({ error: "Please request a new one." });
        return;
      }

      if (new Date() > ucode.expired_at) {
        res.status(400).json({ error: "Expired OTP" });
        return;
      }

      if (ucode.otp !== otp) {
        res.status(400).json({ error: "Invalid OTP" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error in forgotPasswordVerifyOtp:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  };

  static resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and new password are required" });
      return;
    }

    try {
      const ucode = await prisma.ucode.findUnique({ where: { email } });

      if (!ucode) {
        res.status(400).json({
          error: "OTP verification required before resetting password",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      await prisma.ucode.delete({ where: { email } });

      res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  };

  static verify = async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    console.log(authHeader);
    const token = authHeader; //.split(" ")[1];

    // if (!token) {
    //   res.status(401).json({ error: "Malformed token" });
    //   return;
    // }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
        role: string;
      };

      // 2. Check if the user still exists in the DB (optional, but recommended)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          phone: true,
          fcmToken: true,
          address: true,
          googleLogin: true,
          image: true,
          isLogin: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (user.isLogin === false) {
        console.log("user.address", user)
        await prisma.user.update({
          where: { id: decoded.id },
          data: { isLogin: true },
        });
      }

      // Transform the image URL
      const transformedUser = {
        ...user,
        image: user.image ? getImageUrl(user.image) : null,
      };


      res.status(200).json({
        success: true,
        // message: "Token is valid",
        token: authHeader,
        user: transformedUser,
      });
    } catch (error) {
      res.status(401).json({
        error: "Invalid or expired token",
        message: (error as Error).message,
      });
    }
  };

  static editProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { name, address, phone, fcmToken } = req.body;  // Add phone to destructuring
      
      const updateData: any = {};
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (phone) updateData.phone = phone;  // Add phone to updateData
      if (req.file) updateData.image = `/uploads/${req.file.filename}`;
      if (fcmToken) updateData.fcmToken = fcmToken;
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          address: true,
          phone: true,  // Add phone to select
          fcmToken: true,
          role: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          ...updatedUser,
          image: updatedUser.image ? getImageUrl(updatedUser.image) : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: (error as Error).message,
      });
    }
  };

  // static googleLogin = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { email, name, googleId } = req.body;

  //     if (!email || !name || !googleId) {
  //       res
  //         .status(400)
  //         .json({ error: "Email, name and googleId are required" });
  //       return;
  //     }

  //     // Find or create user
  //     let user = await prisma.user.findUnique({ where: { email } });

  //     if (!user) {
  //       // Create new user if doesn't exist
  //       user = await prisma.user.create({
  //         data: {
  //           email,
  //           name,
  //           googleLogin: true,
  //           role: "USER",
  //         },
  //       });
  //     } else if (!user.googleLogin) {
  //       // If user exists but hasn't used Google login before
  //       res.status(400).json({
  //         error:
  //           "Email already registered with password. Please use password login.",
  //       });
  //       return;
  //     }

  //     // Generate JWT token
  //     const token = jwt.sign(
  //       { id: user.id, role: user.role },
  //       process.env.JWT_SECRET as string,
  //       { expiresIn: "30d" }
  //     );

  //     // Transform user data if needed
  //     const transformedUser = {
  //       ...user,
  //       image: user.image ? getImageUrl(user.image) : null,
  //     };

  //     res.status(200).json({
  //       success: true,
  //       message: "Google login successful",
  //       user: transformedUser,
  //       token,
  //     });
  //   } catch (error) {
  //     console.error("Error in googleLogin:", error);
  //     res.status(500).json({
  //       message: "Failed to login with Google.",
  //       error: (error as Error).message,
  //     });
  //   }
  // };

  // static googleSignIn = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { email, name, photoUrl, googleId } = req.body;

  //     if (!email || !name || !googleId) {
  //       res
  //         .status(400)
  //         .json({ error: "Email, name and googleId are required" });
  //       return;
  //     }

  //     // Find if user exists
  //     let user = await prisma.user.findUnique({ where: { email } });

  //     if (user) {
  //       // If user exists but is not a Google user
  //       if (!user.googleLogin) {
  //         res.status(400).json({
  //           error: "Email already registered. Please login with password.",
  //         });
  //         return;
  //       }

  //       // If Google user exists, generate token and return user
  //       const token = jwt.sign(
  //         { id: user.id, role: user.role },
  //         process.env.JWT_SECRET as string,
  //         { expiresIn: "30d" }
  //       );

  //       const transformedUser = {
  //         ...user,
  //         image: user.image ? getImageUrl(user.image) : null,
  //       };

  //       res.status(200).json({
  //         success: true,
  //         message: "Google login successful",
  //         user: transformedUser,
  //         token,
  //       });
  //       return;
  //     }

  //     // If user doesn't exist, create new user with Google data
  //     const newUser = await prisma.user.create({
  //       data: {
  //         email,
  //         name,
  //         googleLogin: true,
  //         role: "USER",
  //         image: photoUrl || null, // Save Google profile image if provided
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         role: true,
  //         image: true,
  //         address: true,
  //         googleLogin: true,
  //       },
  //     });

  //     const token = jwt.sign(
  //       { id: newUser.id, role: newUser.role },
  //       process.env.JWT_SECRET as string,
  //       { expiresIn: "30d" }
  //     );

  //     const transformedUser = {
  //       ...newUser,
  //       image: newUser.image ? getImageUrl(newUser.image) : null,
  //     };

  //     res.status(201).json({
  //       success: true,
  //       message: "Google signup successful",
  //       user: transformedUser,
  //       token,
  //     });
  //   } catch (error) {
  //     console.error("Error in googleSignIn:", error);
  //     res.status(500).json({
  //       message: "Failed to authenticate with Google.",
  //       error: (error as Error).message,
  //     });
  //   }
  // };

  // static handleGoogleCallback = async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   try {
  //     const user = req.user as any;

  //     if (!user) {
  //       res.redirect(process.env.CLIENT_URL + "/login?error=auth_failed");
  //       return;
  //     }

  //     const token = jwt.sign(
  //       { id: user.id, role: user.role },
  //       process.env.JWT_SECRET as string,
  //       { expiresIn: "30d" }
  //     );

  //     // Redirect to frontend with token
  //     res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  //   } catch (error) {
  //     console.error("Error in handleGoogleCallback:", error);
  //     res.redirect(process.env.CLIENT_URL + "/login?error=server_error");
  //   }
  // };

  static updateFcmToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { fcmToken } = req.body;

      if (!fcmToken) {
        res.status(400).json({
          success: false,
          message: "FCM token is required",
        });
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: { fcmToken },
      });

      res.status(200).json({
        success: true,
        message: "FCM token updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update FCM token",
        error: (error as Error).message,
      });
    }
  };

  static getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          address: true,
          phone: true,  // Add phone field
          role: true,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
          });
          return;
        }

        res.status(200).json({
          success: true,
        user: {
          ...user,
          image: user.image ? getImageUrl(user.image) : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch user profile",
        error: (error as Error).message,
      });
    }
  };

  // Get users with statistics
  static getUsersWithStats = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get all users with their batteries and warranties
      const users = await prisma.user.findMany({
        where: { role: "USER" },
        include: {
          batteries: {
            select: {
              id: true,
              status: true,
              name: true,
              purchaseDate: true,
              warrantyEndDate: true,
            },
          },
          warranties: {
            orderBy: { id: 'desc' },
            select: {
              id: true,
              status: true,
              requestDate: true,
              serialNumber: true,
              batteryId: true,
              image: true,
            
            },
          },
          _count: {
            select: {
              batteries: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      });

      // Get all warranties in descending order
      const allWarranties = await prisma.warranty.findMany({
        orderBy: { id: 'desc' },
        include: {
          user: {
        select: {
          id: true,
          name: true,
          email: true,
            }
          },
          battery: {
            select: {
              name: true,
              purchaseDate: true,
              serialNumber: true,
              warrantyEndDate: true,
            
            }
          }
        }
      });

      // Transform warranties with status
      const transformedWarranties = allWarranties.map(warranty => {
        const warrantyStatus = warranty.battery ? 
          (warranty.battery.warrantyEndDate && warranty.battery.purchaseDate
            ? calculateWarrantyLeft(warranty.battery.warrantyEndDate, warranty.battery.purchaseDate).day > 0 
            : false)
          ? "ACTIVE" 
          : "EXPIRED"
          : "UNKNOWN";

        return {
          id: warranty.id,
          serialNumber: warranty.serialNumber,
          batteryName: warranty.battery?.name,
          status: warranty.status,
          warrantyStatus,
          requestDate: formatDate(new Date(warranty.requestDate)),
          image: getImageUrl(warranty.image),
          user: {
            id: warranty.user.id,
            name: warranty.user.name,
            email: warranty.user.email
          }
        };
      });

      // Calculate statistics
      const stats = {
        activeUsers: users.length,
        totalBatteries: users.reduce(
          (acc, user) => acc + user.batteries.length,
          0
        ),
        activeBatteries: users.reduce(
          (acc, user) =>
            acc +
            user.batteries.filter((battery) => battery.status === "APPROVED")
              .length,
          0
        ),
        totalWarranties: transformedWarranties.length,
        activeWarranties: transformedWarranties.filter(w => w.warrantyStatus === "ACTIVE").length,
        expiredWarranties: transformedWarranties.filter(w => w.warrantyStatus === "EXPIRED").length
      };

      // Transform user data
      const transformedUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ? getImageUrl(user.image) : null,
        totalBatteries: user.batteries.length,
        activeBatteries: user.batteries.filter(
          (battery) => battery.status === "APPROVED"
        ).length,
        warranties: user.warranties.length
      }));

      res.status(200).json({
        success: true,
        statistics: stats,
        users: transformedUsers,
        warranties: transformedWarranties
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users statistics",
        error: (error as Error).message,
      });
    }
  };

  // Get user's complete profile with batteries and warranties
  static getMyCompleteProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestedUserId = parseInt(req.params.id);
      const currentUserId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      // Check if user has permission to access this profile
      if (requestedUserId !== currentUserId && userRole !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Access denied. You can only view your own profile or need admin rights."
        });
        return;
      }

      // Get all data in a single query with battery details for warranties
      const userData = await prisma.user.findUnique({
        where: { id: requestedUserId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          address: true,
          phone: true,  // Add phone field
          role: true,
          batteries: {
            orderBy: { id: 'desc' },
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true,
              image: true,
              purchaseDate: true,
              warrantyEndDate: true,
            }
          },
          warranties: {
            orderBy: { id: 'desc' },
            select: {
              id: true,
              serialNumber: true,
              status: true,
              image: true,
              requestDate: true,
              batteryId: true,
              battery: {
                select: {
                  id: true,
                  name: true,
                  serialNumber: true,
                  purchaseDate: true,
                  status: true
                }
              }
            }
          }
        }
      });

      if (!userData) {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
        return;
      }

      // Transform the response
      const transformedData = {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image ? getImageUrl(userData.image) : null,
          address: userData.address,
          phone: userData.phone,  // Add phone to transformed data
          role: userData.role
        },
        batteries: userData.batteries.map(battery => ({
          ...battery,
          image: getImageUrl(battery.image),
          purchaseDate: formatDate(new Date(battery.purchaseDate)),
          warranty_left: battery.warrantyEndDate && battery.purchaseDate
            ? calculateWarrantyLeft(battery.warrantyEndDate, battery.purchaseDate)
            : null
        })),
        warranties: userData.warranties.map(warranty => {
          let warranty_left = null;
          let warrantyStatus = "UNKNOWN";
          
          if (warranty.battery) {
            const purchaseDate = new Date(warranty.battery.purchaseDate);
            const currentDate = new Date();
            const warrantyEndDate = new Date(purchaseDate);
            warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 1);
            
            if (currentDate <= warrantyEndDate) {
              const diffTime = Math.abs(warrantyEndDate.getTime() - currentDate.getTime());
              const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              // Calculate total months and remaining days
              const totalMonths = Math.floor(totalDays / 30);
              const remainingDays = totalDays - (totalMonths * 30);
              
              warranty_left = {
                month: totalMonths,
                day: remainingDays,
                percentage: Math.round((totalDays / 365) * 100)  // Round to nearest integer
              };
              warrantyStatus = "ACTIVE";
            } else {
              warranty_left = {
                month: 0,
                day: 0,
                percentage: 0
              };
              warrantyStatus = "EXPIRED";
            }
          }

          return {
            id: warranty.id,
            serialNumber: warranty.serialNumber,
            status: warranty.status,
            image: getImageUrl(warranty.image),
            requestDate: formatDate(new Date(warranty.requestDate)),
            batteryId: warranty.batteryId,
            battery: warranty.battery ? {
              id: warranty.battery.id,
              name: warranty.battery.name,
              serialNumber: warranty.battery.serialNumber,
              status: warranty.battery.status,
              warrantyStatus,
              warranty_left
            } : null
          };
        })
      };

      res.status(200).json({
        success: true,
        data: transformedData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch complete profile",
        error: (error as Error).message
      });
    }
  };

  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required for account deletion.",
            });
            return;
        }

        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: {
                batteries: true,
                warranties: true,
                notification: true
            }
        });

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "Incorrect email.",
            });
            return;
        }

        // Check if the authenticated user is deleting their own account
        if (existingUser.id !== userId && userRole !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "You are not authorized to delete this account.",
            });
            return;
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password || "");
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Incorrect password.",
            });
            return;
        }

        // Delete notifications related to the user
        await prisma.notification.deleteMany({
            where: { userId: existingUser.id }
        });

        // Delete warranties related to the user's batteries
        await prisma.warranty.deleteMany({
            where: { batteryId: { in: existingUser.batteries.map(b => b.id) } }
        });

        // Delete the user's batteries
        await prisma.battery.deleteMany({
            where: { userId: existingUser.id }
        });

        // Delete warranties requested by the user
        await prisma.warranty.deleteMany({
            where: { userId: existingUser.id }
        });

        // Delete the user
        await prisma.user.delete({
            where: { id: existingUser.id }
        });

        res.status(200).json({
            success: true,
            message: "Your account and all related data have been deleted successfully.",
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete account.",
            error: (error as Error).message,
        });
    }
};

  
  
  
}

export default UserController;
