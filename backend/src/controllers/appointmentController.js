import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js"; // Added missing import
import { AppointmentService } from "../services/appointmentService.js";
import { createNotification } from "../utils/createNotification.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, slot, reason } = req.body;

    // Validate doctor availability and slot
    const doctor = await AppointmentService.validateDoctorAvailability(doctorId, date, slot);
    
    // Check slot availability
    const isSlotAvailable = await AppointmentService.checkSlotAvailability(doctorId, date, slot);
    if (!isSlotAvailable) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      slot,
      reason,
      createdBy: "patient"
    });

    // Notify doctor
    await createNotification(
      doctor.user._id,
      "appointment_request",
      "New Appointment Request",
      `You have a new appointment request from ${req.user.name}`,
      { appointmentId: appointment._id, patientId: req.user._id }
    );

    // Populate and return appointment
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor")
      .populate("patient", "name email phone");

    res.status(201).json({
      success: true,
      message: "Appointment requested successfully",
      data: populatedAppointment
    });

  } catch (error) {
    console.error("Create appointment error:", error);
    
    if (error.message.includes("not available") || error.message.includes("Invalid")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating appointment"
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentService.getAppointmentsForUser(
      req.user._id, 
      req.user.role, 
      req.query
    );

    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments"
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone age gender")
      .populate("doctor")
      .populate("doctor.user", "name email phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check authorization
    if (req.user.role === "patient" && !appointment.patient._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (req.user.role === "doctor") {
      // For doctors, we need to check if they own the doctor profile associated with the appointment
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || !appointment.doctor._id.equals(doctor._id)) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment"
    });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if doctor owns this appointment
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor || !appointment.doctor.equals(doctor._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied - You can only approve your own appointments"
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be approved"
      });
    }

    appointment.status = "approved";
    await appointment.save();

    // Notify patient
    await createNotification(
      appointment.patient._id,
      "appointment_approved",
      "Appointment Approved",
      `Your appointment with Dr. ${req.user.name} has been approved`,
      { appointmentId: appointment._id, doctorId: doctor._id }
    );

    res.json({
      success: true,
      message: "Appointment approved successfully",
      data: appointment
    });

  } catch (error) {
    console.error("Approve appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error approving appointment"
    });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if doctor owns this appointment
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor || !appointment.doctor.equals(doctor._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be rejected"
      });
    }

    appointment.status = "rejected";
    appointment.cancellationReason = reason;
    await appointment.save();

    // Notify patient
    await createNotification(
      appointment.patient._id,
      "appointment_rejected", 
      "Appointment Rejected",
      `Your appointment has been rejected${reason ? `: ${reason}` : ''}`,
      { appointmentId: appointment._id }
    );

    res.json({
      success: true, // Fixed: changed from false to true
      message: "Appointment rejected successfully",
      data: appointment
    });

  } catch (error) {
    console.error("Reject appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting appointment"
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor")
      .populate("patient");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check authorization
    if (req.user.role === "patient" && !appointment.patient._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || !appointment.doctor._id.equals(doctor._id)) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    if (!["pending", "approved"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: "Only pending or approved appointments can be cancelled"
      });
    }

    // Check cancellation window (at least 2 hours before)
    const appointmentTime = new Date(appointment.date);
    const now = new Date();
    const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursDifference < 2) {
      return res.status(400).json({
        success: false,
        message: "Appointments can only be cancelled at least 2 hours in advance"
      });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = reason;
    await appointment.save();

    // Notify the other party
    const notifyUserId = req.user.role === "patient" 
      ? appointment.doctor.user 
      : appointment.patient._id;

    const notificationMessage = req.user.role === "patient"
      ? `Patient ${req.user.name} cancelled their appointment`
      : `Dr. ${req.user.name} cancelled your appointment`;

    await createNotification(
      notifyUserId,
      "appointment_cancelled",
      "Appointment Cancelled",
      notificationMessage,
      { appointmentId: appointment._id }
    );

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment
    });

  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling appointment"
    });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const { notes, prescription } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if doctor owns this appointment
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor || !appointment.doctor.equals(doctor._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved appointments can be completed"
      });
    }

    appointment.status = "completed";
    appointment.notes = notes;
    appointment.prescription = prescription;
    await appointment.save();

    // Notify patient
    await createNotification(
      appointment.patient._id,
      "appointment_completed",
      "Appointment Completed",
      "Your appointment has been completed. Check your prescription and notes.",
      { appointmentId: appointment._id }
    );

    res.json({
      success: true,
      message: "Appointment completed successfully",
      data: appointment
    });

  } catch (error) {
    console.error("Complete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error completing appointment"
    });
  }
};