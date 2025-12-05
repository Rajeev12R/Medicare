import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true }
});

const addressSchema = new mongoose.Schema({
  street: String,
  city: { type: String, required: true },
  state: String,
  pincode: String,
  country: { type: String, default: "India" }
});

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience years is required"],
      min: 0
    },
    qualification: {
      type: [String], // ["MBBS", "MD"]
      required: [true, "Qualification is required"]
    },
    clinicName: {
      type: String,
      required: [true, "Clinic name is required"]
    },
    address: addressSchema,
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: 0
    },
    availableDays: {
      type: [String], // ["monday", "tuesday", ...]
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    timeSlots: [timeSlotSchema],
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    bio: {
      type: String,
      maxlength: 500
    }
  },
  { timestamps: true }
);


doctorSchema.index({ specialization: 1, "address.city": 1 });
doctorSchema.index({ isVerified: 1, isActive: 1 });

export default mongoose.model("Doctor", doctorSchema);