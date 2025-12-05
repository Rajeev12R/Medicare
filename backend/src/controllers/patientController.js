import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { phone, age, gender } = req.body;
    const updates = {};

    if (phone !== undefined) updates.phone = phone;
    if (age !== undefined) updates.age = age;
    if (gender !== undefined) updates.gender = gender;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile"
    });
  }
};