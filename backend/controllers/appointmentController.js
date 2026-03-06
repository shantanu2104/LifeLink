const Appointment = require("../models/Appointment");

// ================= GET ALL APPOINTMENTS =================
// @route   GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialization");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= BOOK APPOINTMENT =================
// @route   POST /api/appointments
exports.bookAppointment = async (req, res) => {

  try {

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }

};


// ================= CANCEL APPOINTMENT =================
// @route   DELETE /api/appointments/:id
exports.cancelAppointment = async (req, res) => {

  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};