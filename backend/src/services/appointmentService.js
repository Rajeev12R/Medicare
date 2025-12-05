import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

export class AppointmentService {
  static async checkSlotAvailability(doctorId, date, slot) {
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      slot,
      status: { $in: ["pending", "approved"] }
    });

    return !existingAppointment;
  }

  static async validateDoctorAvailability(doctorId, date, slot) {
  const doctor = await Doctor.findById(doctorId).populate("user");
  
  if (!doctor || !doctor.isVerified || !doctor.isActive) {
    throw new Error("Doctor not available for appointments");
  }

  const appointmentDate = new Date(date);
  const dayName = appointmentDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  
  if (!doctor.availableDays.includes(dayName)) {
    throw new Error("Doctor not available on this day");
  }

  // Check if slot is within doctor's time slots
  const [startTime] = slot.split("-");
  const isSlotValid = doctor.timeSlots.some(timeSlot => {
    return startTime >= timeSlot.start && startTime < timeSlot.end;
  });

  if (!isSlotValid) {
    throw new Error("Invalid time slot for this doctor");
  }

  return doctor;
}

  static async getAppointmentsForUser(userId, role, filters = {}) {
    const query = {};
    
    if (role === "patient") {
      query.patient = userId;
    } else if (role === "doctor") {
      query.doctor = userId;
    }

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.from || filters.to) {
      query.date = {};
      if (filters.from) query.date.$gte = new Date(filters.from);
      if (filters.to) query.date.$lte = new Date(filters.to);
    }

    const appointments = await Appointment.find(query)
      .populate(role === "patient" ? "doctor" : "patient")
      .populate(role === "patient" ? "doctor.user" : "patient")
      .sort({ date: -1, createdAt: -1 });

    return appointments;
  }
}