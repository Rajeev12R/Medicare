import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        "appointment_request",
        "appointment_approved", 
        "appointment_rejected",
        "appointment_cancelled",
        "appointment_completed",
        "doctor_verified",
        "new_review"
      ]
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    meta: {
      appointmentId: mongoose.Schema.Types.ObjectId,
      doctorId: mongoose.Schema.Types.ObjectId,
      patientId: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);


notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);