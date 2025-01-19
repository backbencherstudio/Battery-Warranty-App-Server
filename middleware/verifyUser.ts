import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.WEBTOKEN_SECRET_KEY;


declare module "express" {

  export interface Request {

    userId?: string;

    userRole?: string;

  }

}


export const verifyUser = (req: Request, res: Response, next: NextFunction): void => {
  // Extract token directly from headers
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token not provided" });
    return;
  }

  try {
    // Verify the token
    const decodedToken = verify(token, JWT_SECRET as string) as { userId: string; role?: string };

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role || "USER"; // Default role if not present

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
