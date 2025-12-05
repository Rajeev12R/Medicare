import express from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { 
  createAppointment,
  getAppointments,
  getAppointmentById,
  approveAppointment,
  rejectAppointment,
  cancelAppointment,
  completeAppointment
} from "../controllers/appointmentController.js";
import { validateAppointment, handleValidationErrors } from "../middlewares/validation.js";

const router = express.Router();

// Patient routes
router.post("/", 
  auth, 
  requireRole("patient"), 
  validateAppointment, 
  handleValidationErrors, 
  createAppointment
);

// Common routes for patients and doctors
router.get("/", auth, requireRole("patient", "doctor"), getAppointments);
router.get("/:id", auth, requireRole("patient", "doctor"), getAppointmentById);

// Doctor routes
router.patch("/:id/approve", auth, requireRole("doctor"), approveAppointment);
router.patch("/:id/reject", auth, requireRole("doctor"), rejectAppointment);
router.patch("/:id/complete", auth, requireRole("doctor"), completeAppointment);

// Patient and doctor can cancel
router.patch("/:id/cancel", auth, requireRole("patient", "doctor"), cancelAppointment);

export default router;