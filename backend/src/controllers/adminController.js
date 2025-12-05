import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import { createNotification } from "../utils/createNotification.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments
    ] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "completed" })
    ]);

    // Recent appointments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        recentAppointments
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics"
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const { isVerified, isActive, specialization, page = 1, limit = 10 } = req.query;

    const query = {};
    if (isVerified !== undefined) query.isVerified = isVerified === "true";
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (specialization) query.specialization = new RegExp(specialization, "i");

    const skip = (page - 1) * limit;

    const doctors = await Doctor.find(query)
      .populate("user", "name email phone")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors"
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name email phone age gender");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      data: doctor
    });

  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor details"
    });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { userData, doctorProfile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Create user
    const user = await User.create({
      ...userData,
      role: "doctor"
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      ...doctorProfile,
      isVerified: true // Auto-verify when created by admin
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate("user", "name email phone");

    // Notify doctor
    await createNotification(
      user._id,
      "doctor_verified",
      "Profile Verified",
      "Your doctor profile has been verified and is now active",
      { doctorId: doctor._id }
    );

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: populatedDoctor
    });

  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating doctor"
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email phone");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor
    });

  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating doctor"
    });
  }
};

export const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate("user");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Notify doctor
    await createNotification(
      doctor.user._id,
      "doctor_verified",
      "Profile Verified",
      "Your doctor profile has been verified and is now active",
      { doctorId: doctor._id }
    );

    res.json({
      success: true,
      message: "Doctor verified successfully",
      data: doctor
    });

  } catch (error) {
    console.error("Verify doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying doctor"
    });
  }
};

export const getPatients = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;

    const query = { role: "patient" };
    if (isActive !== undefined) query.isActive = isActive === "true";

    const skip = (page - 1) * limit;

    const patients = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patients"
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, from, to, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email phone"
        }
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1, createdAt: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments"
    });
  }
};