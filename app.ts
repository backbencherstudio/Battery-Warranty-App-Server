import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

import users from "./module/users/users.routes";
import path from "path";
// import chat from "./routes/chat.routes";
// import message from "./routes/message.routes";


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", users);
// app.use("/chat", chat);
// app.use("/message", message);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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