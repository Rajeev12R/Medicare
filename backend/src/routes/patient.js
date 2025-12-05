import express from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { updateProfile } from "../controllers/patientController.js";

const router = express.Router();

// All routes require patient role
router.use(auth, requireRole("patient"));

router.get("/me", (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

router.put("/me", updateProfile);

export default router;