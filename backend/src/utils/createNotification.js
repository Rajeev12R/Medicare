import Notification from "../models/Notification.js";

export const createNotification = async (userId, type, title, message, meta = {}) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      meta
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const NOTIFICATION_TEMPLATES = {
  APPOINTMENT_REQUEST: (doctorName, patientName) => ({
    title: "New Appointment Request",
    message: `You have a new appointment request from ${patientName}`
  }),
  APPOINTMENT_APPROVED: (patientName, doctorName) => ({
    title: "Appointment Approved",
    message: `Your appointment with Dr. ${doctorName} has been approved`
  }),
  APPOINTMENT_REJECTED: (patientName, doctorName) => ({
    title: "Appointment Rejected", 
    message: `Your appointment with Dr. ${doctorName} has been rejected`
  }),
  DOCTOR_VERIFIED: (doctorName) => ({
    title: "Profile Verified",
    message: `Congratulations! Your doctor profile has been verified and is now active`
  })
};