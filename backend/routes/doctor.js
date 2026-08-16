const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

// LEAVE ROUTES
router.post("/leave", protect, doctorController.addLeave);
router.get("/leave/:doctorId", doctorController.getLeaves);
router.delete("/leave/:date", protect, doctorController.removeLeave);

// @route   POST /api/doctors
// @desc    Create a new doctor
// @access  Admin
router.post("/", doctorController.createDoctor);

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get("/", doctorController.getAllDoctors);

router.delete("/:id", doctorController.deleteDoctor);
// UPDATE doctor profile
router.put("/:id", doctorController.updateDoctorProfile);

module.exports = router;