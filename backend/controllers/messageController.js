const Message = require("../models/Message");
const Appointment = require("../models/Appointment");

// ================= GET MESSAGES FOR APPOINTMENT =================
exports.getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Role check: User must be patient, doctor, or admin
    const userId = req.user.id.toString();
    const isPatient = appointment.patient && appointment.patient.toString() === userId;
    const isDoctor = appointment.doctor && appointment.doctor.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access conversation for this appointment",
      });
    }

    const messages = await Message.find({ appointment: appointmentId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= SEND MESSAGE FOR APPOINTMENT =================
exports.sendMessage = async (req, res) => {
  try {
    const { appointmentId, text } = req.body;

    if (!appointmentId || !text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and message text are required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Role check
    const userId = req.user.id.toString();
    const isPatient = appointment.patient && appointment.patient.toString() === userId;
    const isDoctor = appointment.doctor && appointment.doctor.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send message in this appointment",
      });
    }

    const message = await Message.create({
      appointment: appointmentId,
      sender: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      text: text.trim(),
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
