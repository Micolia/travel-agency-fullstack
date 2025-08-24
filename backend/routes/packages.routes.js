import { Router } from "express";
import {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
} from "../controllers/packages.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", listPackages);
router.get("/:id", getPackage);
router.post("/", auth, createPackage);
router.put("/:id", auth, updatePackage);
router.delete("/:id", auth, deletePackage);

export default router;
