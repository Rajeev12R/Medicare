import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"]
    },
    slot: {
      type: String, // "10:00-10:30"
      required: [true, "Time slot is required"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending"
    },
    reason: {
      type: String,
      required: [true, "Reason for appointment is required"],
      maxlength: 500
    },
    notes: {
      type: String,
      maxlength: 1000
    },
    prescription: {
      type: String,
      maxlength: 1000
    },
    createdBy: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient"
    },
    cancellationReason: String
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctor: 1, date: 1, slot: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { 
      status: { $in: ["pending", "approved"] } 
    } 
  }
);

appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model("Appointment", appointmentSchema);