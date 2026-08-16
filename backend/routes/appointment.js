const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getAllAppointments,
  bookAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  updateAppointmentRecord,
  getAppointmentById,
  getDoctorSlots
} = require("../controllers/appointmentController");


// ================= SPECIAL ROUTES FIRST =================

// GET doctor slots
router.get("/slots", getDoctorSlots);

// UPDATE STATUS (Doctor Accept / Decline)
router.put("/status/:id", updateAppointmentStatus);

// UPDATE RECORD (Prescription / History / Next Visit)
router.put("/record/:id", updateAppointmentRecord);


// ================= NORMAL ROUTES =================

// GET all appointments
router.get("/", getAllAppointments);

// BOOK appointment
router.post("/", bookAppointment);


// ================= PARAMETER ROUTES LAST =================

// GET single appointment
router.get("/:id", protect, getAppointmentById);

// CANCEL appointment
router.delete("/:id", cancelAppointment);


module.exports = router;