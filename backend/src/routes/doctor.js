import express from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { 
  getDoctors, 
  getDoctorById, 
  updateDoctorProfile,
  getDoctorAppointments
} from "../controllers/doctorController.js";

const router = express.Router();

// Public routes
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// Protected doctor routes
router.use(auth, requireRole("doctor"));

router.get("/me/profile", (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

router.put("/me/profile", updateDoctorProfile);

// Doctor's appointments route - MAKE SURE THIS EXISTS
router.get("/me/appointments", getDoctorAppointments);

export default router;