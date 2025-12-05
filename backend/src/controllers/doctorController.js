import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export const getDoctors = async (req, res) => {
  try {
    const { 
      specialization, 
      city, 
      minExperience, 
      maxFee,
      page = 1, 
      limit = 10 
    } = req.query;

    const query = { isVerified: true, isActive: true };

    if (specialization) {
      query.specialization = new RegExp(specialization, "i");
    }
    if (city) {
      query["address.city"] = new RegExp(city, "i");
    }
    if (minExperience) {
      query.experienceYears = { $gte: parseInt(minExperience) };
    }
    if (maxFee) {
      query.consultationFee = { $lte: parseInt(maxFee) };
    }

    const skip = (page - 1) * limit;

    const doctors = await Doctor.find(query)
      .populate("user", "name email phone")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, experienceYears: -1 });

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

    if (!doctor || !doctor.isVerified || !doctor.isActive) {
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

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const allowedUpdates = [
      "specialization", "experienceYears", "qualification", "clinicName",
      "address", "consultationFee", "availableDays", "timeSlots", "bio"
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      updates,
      { new: true, runValidators: true }
    ).populate("user", "name email phone");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedDoctor
    });

  } catch (error) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating doctor profile"
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    console.log('Getting appointments for user:', req.user._id);
    
    // Find the doctor profile for this user
    const doctor = await Doctor.findOne({ user: req.user._id });
    console.log('Found doctor:', doctor);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const { status, date } = req.query;
    let query = { doctor: doctor._id };
    console.log('Query filters:', { status, date });

    // Apply filters
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    console.log('Final query:', query);
    
    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone age gender")
      .sort({ date: -1, createdAt: -1 });

    console.log('Found appointments:', appointments.length);

    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments"
    });
  }
};