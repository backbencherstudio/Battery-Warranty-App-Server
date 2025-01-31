import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
// import passport from './config/passport.config';
import session from 'express-session';

import users from "./module/users/users.routes";
import path from "path";
import battery from "./module/Battery/battery.routes";
import warranty from "./module/warranty/warranty.routes";
import modelNumber from "./module/model-number/modelNumber.routes";
import notificationRoutes from "./module/notification/notification.routes";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://10.0.2.2:8081",
      "http://localhost:*",
      "http://localhost:58626",
      "http://localhost:61801",
      "http://192.168.40.47:3000",
      "http://192.168.40.47:*"
    ],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// app.use(passport.initialize());
// app.use(passport.session());

app.use("/users", users);
app.use("/battery", battery)
app.use("/warranty", warranty)
app.use("/model-number", modelNumber)
app.use("/notification", notificationRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log("json", process.cwd() + "\\firebase-service-account.json")


app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: `404 route not found`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: `500 Something broken!`,
    error: err.message,
  });
});

export default app;