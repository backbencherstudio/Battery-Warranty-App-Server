import express, { Router } from "express";
import WarrantyController from "./warranty.controllers";
import verifyuser from "../../middleware/verifyUser";
import upload from "../../middleware/Multer.config";

const router: Router = express.Router();

// Admin routes
router.get("/get-all", verifyuser, WarrantyController.getAllWarranties);
router.patch("/approve/:id", verifyuser, WarrantyController.approveWarranty);
router.patch("/reject/:id", verifyuser, WarrantyController.rejectWarranty);

// General routes
router.post("/request", verifyuser, upload.single("image"), WarrantyController.requestWarranty);
router.get("/get-pending", verifyuser, WarrantyController.getPendingWarranties);
router.get("/approved", verifyuser, WarrantyController.getApprovedWarranties);

router.get("/rejected", verifyuser, WarrantyController.getRejectedWarranties);

// User specific routes
router.get("/my-requests", verifyuser, WarrantyController.getMyWarranties);
router.get("/my-rejected", verifyuser, WarrantyController.getMyRejectedWarranties);

export default router;

