const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  bookAppointment,
  cancelAppointment
} = require("../controllers/appointmentController");


// GET all appointments
router.get("/", getAllAppointments);


// BOOK appointment
router.post("/", bookAppointment);


// CANCEL appointment
router.delete("/:id", cancelAppointment);


module.exports = router;