import express from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import {
  getDashboardStats,
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  verifyDoctor,
  getPatients,
  getAppointments
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require admin role
router.use(auth, requireRole("admin"));

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Doctor management
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.patch("/doctors/:id/verify", verifyDoctor);

// Patient management
router.get("/patients", getPatients);

// Appointment management
router.get("/appointments", getAppointments);

export default router;