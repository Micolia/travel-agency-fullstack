import { Router } from "express";
import {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
} from "../controllers/packages.controller.js";

const router = Router();

router.get("/", listPackages);
router.get("/:id", getPackage);
router.post("/", createPackage);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

export default router;
