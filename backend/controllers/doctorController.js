const User = require("../models/User");

// ==============================
// Create Doctor
// POST /api/doctors
// ==============================
exports.createDoctor = async (req, res) => {
  try {

    const doctorData = {
      ...req.body,
      role: "doctor"
    };

    const doctor = await User.create(doctorData);

    // remove password before sending response
    doctor.password = undefined;

    res.status(201).json({
      success: true,
      message: "Doctor account created successfully",
      data: doctor
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// ==============================
// Get All Doctors
// GET /api/doctors
// ==============================
exports.getAllDoctors = async (req, res) => {
  try {

    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ==============================
// Delete Doctor
// DELETE /api/doctors/:id
// ==============================
exports.deleteDoctor = async (req, res) => {
  try {

    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "User is not a doctor"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ==============================
// Update Doctor Profile
// PUT /api/doctors/profile
// ==============================

exports.updateDoctorProfile = async (req, res) => {
  try {

   

    const { name, email, specialization, phone, experience } = req.body;

    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.specialization = specialization || doctor.specialization;
    doctor.phone = phone || doctor.phone;
    doctor.experience = experience || doctor.experience;

    const updatedDoctor = await doctor.save();

    res.status(200).json({
      success: true,
      data: updatedDoctor
    });

  } catch (error) {

    console.log("Update Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};