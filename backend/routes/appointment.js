const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  bookAppointment,
  cancelAppointment,
  updateAppointmentStatus
} = require("../controllers/appointmentController");


// GET all appointments
router.get("/", getAllAppointments);


// BOOK appointment
router.post("/", bookAppointment);


// CANCEL appointment
router.delete("/:id", cancelAppointment);


// UPDATE STATUS (Doctor Accept / Decline)
router.put("/status/:id", updateAppointmentStatus);


module.exports = router;