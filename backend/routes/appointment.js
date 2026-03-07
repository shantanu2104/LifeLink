const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  bookAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  updateAppointmentRecord,
  getAppointmentById
} = require("../controllers/appointmentController");

// GET all appointments
router.get("/", getAllAppointments);

// GET single appointment
router.get("/:id", getAppointmentById);

// BOOK appointment
router.post("/", bookAppointment);

// UPDATE STATUS (Doctor Accept / Decline)
router.put("/status/:id", updateAppointmentStatus);

// UPDATE RECORD (Prescription / History / Next Visit)
router.put("/record/:id", updateAppointmentRecord);

// CANCEL appointment
router.delete("/:id", cancelAppointment);

module.exports = router;