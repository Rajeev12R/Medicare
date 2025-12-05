import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import { generateToken, setTokenCookie } from "../utils/generateToken.js";
import { createNotification } from "../utils/createNotification.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, role, doctorProfile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      age,
      gender,
      role: role || "patient"
    });

    if (role === "doctor" && doctorProfile) {
      await Doctor.create({
        user: user._id,
        ...doctorProfile
      });
    }

    // Generate token
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error during registration"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or account inactive"
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: "Login successful",
      data: user,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login"
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};

export const getMe = async (req, res) => {
  try {
    let userData = req.user;

    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      userData = { ...userData.toObject(), doctorProfile };
    }

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data"
    });
  }
};