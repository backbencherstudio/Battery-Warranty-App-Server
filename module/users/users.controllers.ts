import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { generateOTP, sendRegistrationOTPEmail } from "../../util/otpUtils";
dotenv.config();

const prisma = new PrismaClient();

class UserController {
  private static otpExpiryTime: number = 5 * 60 * 1000;

  static sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, name } = req.body;
  
    if (!email || !name) {
      res.status(400).json({ error: "Email and name are required" });
      return;
    }
  
    try {
      const otp = generateOTP();
      const expiry = new Date(Date.now() + UserController.otpExpiryTime);
  
      // Database operation to save or update OTP
      await prisma.ucode.upsert({
        where: { email },
        update: { otp, expired_at: expiry, name },
        create: { name, email, otp, expired_at: expiry },
      });
  
      // Send email asynchronously without delaying response
      sendRegistrationOTPEmail(name, email, otp).catch((error) =>
        console.error("Failed to send email:", error)
      );
  
      // Respond immediately after saving OTP
      res.status(200).json({ message: "OTP sent successfully", email, name });
    } catch (error) {
      console.error("Error in sendOtp:", error);
      res.status(500).json({ error: "Failed to send OTP. Please try again later." });
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

      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  };

  static register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const ucode = await prisma.ucode.findUnique({ where: { email } });

      if (!ucode) {
        res
          .status(400)
          .json({ error: "OTP verification required before registration" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      let user = await prisma.user.create({
        data: {
          name: ucode.name,
          email: ucode.email,
          password: hashedPassword,
          role: "USER",
          googleLogin: false,
        },
      });

      await prisma.ucode.delete({ where: { email } });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );


      res.status(200).json({ success: true, user, token });
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      // Validate credentials
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({ success: true, token, user });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  }; 
      
    



}

export default UserController;
