import express, { Router } from "express";
import BatteryController from "./battery.controller";
import verifyuser from "../../middleware/verifyUser";
import upload from "../../middleware/Multer.config";

const router: Router = express.Router();

// Battery registration routes
router.post("/registration", verifyuser, upload.single("image"), BatteryController.registration);
router.patch("/registration/accept/:id", verifyuser, BatteryController.acceptRegistration);
router.patch("/registration/reject/:id", verifyuser, BatteryController.rejectRegistration);

// Battery get routes
router.get("/get-all", verifyuser, BatteryController.getAllBatteries);
router.get("/get-pending", verifyuser, BatteryController.getPendingBatteries);
router.get("/get-rejected", verifyuser, BatteryController.getRejectedBatteries); 

// My batteries routes
router.get("/my-batteries", verifyuser, BatteryController.getMyBatteries);
router.get("/my-pending-batteries", verifyuser, BatteryController.getMyPendingBatteries);
router.get("/my-rejected-batteries", verifyuser, BatteryController.getMyRejectedBatteries);


export default router;