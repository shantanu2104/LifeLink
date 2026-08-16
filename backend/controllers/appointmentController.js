const Appointment = require("../models/Appointment");
const User = require("../models/User");


// ================= GET ALL APPOINTMENTS =================
exports.getAllAppointments = async (req, res) => {

  try {

    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialization email phone");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// ================= BOOK APPOINTMENT =================
exports.bookAppointment = async (req, res) => {

  try {

    const { doctor, appointmentDate } = req.body;

    if (!doctor || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Doctor and date are required"
      });
    }

    // 1-month date restriction check
    const apptDateObj = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    maxDate.setHours(23, 59, 59, 999);

    if (apptDateObj < today || apptDateObj > maxDate) {
      return res.status(400).json({
        success: false,
        message: "Appointments can only be booked within 1 month from today"
      });
    }

    // Doctor leave check
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    if (doctorUser.leaves && doctorUser.leaves.length > 0) {
      const dateStr = apptDateObj.toISOString().split("T")[0];
      if (doctorUser.leaves.includes(dateStr)) {
        return res.status(400).json({
          success: false,
          message: "The selected doctor is on leave on this date"
        });
      }
    }

    // prevent duplicate booking
    const existing = await Appointment.findOne({
      doctor,
      appointmentDate,
      status: { $in: ["pending", "accepted"] }
    });

    if (existing) {

      return res.status(400).json({
        success: false,
        message: "This slot is already requested or booked"
      });

    }

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



// ================= UPDATE STATUS =================
exports.updateAppointmentStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {

      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });

    }

    // prevent double acceptance
    if (status === "accepted") {

      const existing = await Appointment.findOne({
        doctor: appointment.doctor,
        appointmentDate: appointment.appointmentDate,
        status: "accepted"
      });

      if (existing) {

        return res.status(400).json({
          success: false,
          message: "This slot is already taken"
        });

      }

    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// ================= UPDATE MEDICAL RECORD =================
exports.updateAppointmentRecord = async (req, res) => {

  try {

    const { prescription, history, medicines, nextAppointmentDate } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        prescription,
        history,
        medicines,
        nextAppointmentDate,
        status: "completed"
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ================= GET APPOINTMENT BY ID =================
exports.getAppointmentById = async (req, res) => {

  try {

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email role phone createdAt")
      .populate("doctor", "name specialization email phone experience");

    if (!appointment) {

      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });

    }

    // Role-based privacy check
    if (req.user) {
      const userId = req.user.id.toString();
      const patientId = appointment.patient ? appointment.patient._id.toString() : "";
      const doctorId = appointment.doctor ? appointment.doctor._id.toString() : "";

      const isPatient = patientId === userId;
      const isDoctor = doctorId === userId;
      const isAdmin = req.user.role === "admin";

      if (!isPatient && !isDoctor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not authorized to view this patient medical chart"
        });
      }
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};




// ================= GET DOCTOR BOOKED SLOTS =================
exports.getDoctorSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and date are required"
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: { $in: ["pending", "accepted"] },
      appointmentDate: {
        $gte: start,
        $lte: end
      }
    });

    const bookedSlots = [];
    const pendingSlots = [];

    appointments.forEach((app) => {
      const time = new Date(app.appointmentDate);

      // IMPORTANT:
      // Always convert appointment time to IST.
      // This prevents Render/production UTC timezone
      // from changing the displayed slot time.
      const slot = time.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      if (app.status === "accepted") {
        bookedSlots.push(slot);
      }

      if (app.status === "pending") {
        pendingSlots.push(slot);
      }
    });

    res.json({
      success: true,
      bookedSlots,
      pendingSlots
    });

  } catch (error) {
    console.error("Error getting doctor slots:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};