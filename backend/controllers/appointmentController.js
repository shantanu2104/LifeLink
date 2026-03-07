const Appointment = require("../models/Appointment");


// ================= GET ALL APPOINTMENTS =================
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

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

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
exports.updateAppointmentRecord = async(req,res)=>{

  try{

    const {prescription,history,medicines,nextAppointmentDate} = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        prescription,
        history,
        medicines,
        nextAppointmentDate,
        status:"completed"
      },
      {new:true}
    );

    res.status(200).json({
      success:true,
      data:appointment
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }

}
exports.getAppointmentById = async (req, res) => {

  try {

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor", "name specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

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