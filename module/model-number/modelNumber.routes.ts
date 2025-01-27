import express, { Router } from "express";
import ModelNumberController from "./modelNumber.controller";

const router: Router = express.Router();

router.get("/get-all-model-number", ModelNumberController.getAllModelNumber);

export default router;
