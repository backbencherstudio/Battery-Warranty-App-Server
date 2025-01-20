import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Check if required environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing required Google OAuth credentials in environment variables');
  process.exit(1); // Exit the process if credentials are missing
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL || 'http://localhost:3000'}/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.emails?.[0].value }
        });

        if (existingUser) {
          if (!existingUser.googleLogin) {
            return done(null, false, { message: "Email already registered with password" });
          }
          return done(null, existingUser);
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: profile.emails?.[0].value as string,
            name: profile.displayName,
            googleLogin: true,
            role: "USER",
            image: profile.photos?.[0].value || null,
          }
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 