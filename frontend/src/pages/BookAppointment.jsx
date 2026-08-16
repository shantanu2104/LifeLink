import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSearch,
  FaClinicMedical,
} from "react-icons/fa";

export default function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    reason: "",
  });

  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [doctorLeaves, setDoctorLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  // =========================================================
  // DATE LIMITS
  // =========================================================

  const todayStr = new Date().toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);

  const maxDateStr = maxDateObj.toISOString().split("T")[0];

  // =========================================================
  // LOAD DOCTORS
  // =========================================================

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/doctors`
      );

      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      toast.error("Failed to load doctor list");
    }
  };

  // =========================================================
  // DEPARTMENT MAP
  // =========================================================

  const departmentMap = {};

  doctors.forEach((doc) => {
    const dept = doc.specialization || "General Medicine";

    departmentMap[dept] = (departmentMap[dept] || 0) + 1;
  });

  const registeredDepartments = Object.keys(departmentMap).map(
    (deptName) => ({
      name: deptName,
      count: departmentMap[deptName],
    })
  );

  // =========================================================
  // FILTER DOCTORS
  // =========================================================

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept
      ? (doc.specialization || "General Medicine") === selectedDept
      : true;

    const matchesSearch = searchQuery
      ? doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    return matchesDept && matchesSearch;
  });

  // =========================================================
  // FETCH DOCTOR LEAVES
  // =========================================================

  useEffect(() => {
    if (form.doctor) {
      fetchDoctorLeaves(form.doctor);
    } else {
      setDoctorLeaves([]);
    }
  }, [form.doctor]);

  const fetchDoctorLeaves = async (doctorId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/doctors/leave/${doctorId}`
      );

      setDoctorLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching doctor leaves:", err);
      setDoctorLeaves([]);
    }
  };

  const isDoctorOnLeave =
    form.date && doctorLeaves.includes(form.date);

  // =========================================================
  // GENERATE TIME SLOTS
  // =========================================================

  const generateSlots = () => {
    const slotList = [];

    const createSlots = (start, end) => {
      let time = new Date();
      time.setHours(start, 0, 0, 0);

      const endTime = new Date();
      endTime.setHours(end, 0, 0, 0);

      while (time < endTime) {
        slotList.push(
          time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );

        time = new Date(time.getTime() + 20 * 60000);
      }
    };

    // 10 AM - 1 PM
    createSlots(10, 13);

    // 2 PM - 5 PM
    createSlots(14, 17);

    setSlots(slotList);
  };

  // =========================================================
  // LOAD BOOKED + PENDING SLOTS
  // =========================================================

  const loadBookedSlots = async () => {
    if (!form.doctor || !form.date || isDoctorOnLeave) {
      return;
    }

    try {
      setSlotsLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointments/slots`,
        {
          params: {
            doctorId: form.doctor,
            date: form.date,
          },
        }
      );

      const booked = res.data.bookedSlots || [];
      const pending = res.data.pendingSlots || [];

      setBookedSlots(booked);
      setPendingSlots(pending);

      // Helpful for checking production API response
      console.log("BOOKED SLOTS:", booked);
      console.log("PENDING SLOTS:", pending);
    } catch (err) {
      console.error("Error fetching slots:", err);

      setBookedSlots([]);
      setPendingSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  // =========================================================
  // AUTO LOAD SLOTS
  // =========================================================

  useEffect(() => {
    if (
      form.doctor &&
      form.date &&
      !isDoctorOnLeave
    ) {
      generateSlots();
      loadBookedSlots();
      setSelectedSlot("");
    } else {
      setSlots([]);
      setBookedSlots([]);
      setPendingSlots([]);
      setSelectedSlot("");
    }
  }, [form.doctor, form.date, isDoctorOnLeave]);

  // =========================================================
  // SUBMIT APPOINTMENT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDoctorOnLeave) {
      toast.error(
        "Doctor is on leave on the selected date"
      );
      return;
    }

    if (!selectedSlot) {
      toast.error(
        "Please click to select an available time slot"
      );
      return;
    }

    try {
      setLoading(true);

      const time = new Date(
        `1970-01-01 ${selectedSlot}`
      );

      const appointmentDate = new Date(form.date);

      appointmentDate.setHours(time.getHours());
      appointmentDate.setMinutes(time.getMinutes());

      await axios.post(
        `${import.meta.env.VITE_URL}/api/appointments`,
        {
          doctor: form.doctor,
          patient: user?._id || user?.id,
          appointmentDate,
          reason: form.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Appointment request submitted successfully!"
      );

      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SLOT STYLE
  // IMPORTANT:
  // INLINE COLORS ARE USED FOR PRODUCTION/Vercel
  // =========================================================

  const getSlotStyle = (
    isBooked,
    isPending,
    isSelected
  ) => {
    if (isBooked) {
      return {
        backgroundColor: "#fff1f2",
        borderColor: "#fecdd3",
        color: "#f43f5e",
        cursor: "not-allowed",
        opacity: 0.6,
      };
    }

    if (isPending) {
      return {
        backgroundColor: "#fffbeb",
        borderColor: "#fcd34d",
        color: "#92400e",
        cursor: "not-allowed",
        opacity: 0.75,
      };
    }

    if (isSelected) {
      return {
        background:
          "linear-gradient(to right, #059669, #0d9488)",
        borderColor: "#059669",
        color: "#ffffff",
        boxShadow:
          "0 4px 12px rgba(16, 185, 129, 0.20)",
      };
    }

    return {
      backgroundColor: "#ffffff",
      borderColor: "#10b981",
      color: "#1e293b",
      cursor: "pointer",
    };
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-8 lg:p-10 space-y-8 max-w-5xl w-full mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex justify-between items-center">
            <div>
              <Link
                to="/patient/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition mb-2"
              >
                <FaArrowLeft />
                Back to Dashboard
              </Link>

              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Book Consultation Appointment
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                Select your department, specialist doctor,
                date (up to 1 month ahead), and available slot.
              </p>
            </div>
          </div>

          {/* =================================================
              REGISTERED DEPARTMENTS
          ================================================= */}

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FaClinicMedical className="text-blue-600" />

                <span>
                  Registered Hospital Departments
                </span>
              </h3>

              {selectedDept && (
                <button
                  type="button"
                  onClick={() => setSelectedDept("")}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Clear Filter (Show All)
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {registeredDepartments.length === 0 ? (
                <div className="col-span-full p-4 bg-white rounded-2xl border text-xs text-slate-400">
                  No registered doctors/departments available
                  currently.
                </div>
              ) : (
                registeredDepartments.map((dept) => {
                  const isSelected =
                    selectedDept === dept.name;

                  return (
                    <button
                      key={dept.name}
                      type="button"
                      onClick={() =>
                        setSelectedDept(
                          isSelected ? "" : dept.name
                        )
                      }
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md"
                          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs text-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm">
                        {dept.name}
                      </div>

                      <div
                        className={`text-xs mt-1 font-semibold ${
                          isSelected
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {dept.count}{" "}
                        {dept.count === 1
                          ? "Doctor"
                          : "Doctors"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* =================================================
              FORM CARD
          ================================================= */}

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">

            {/* Form Header */}

            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FaCalendarAlt className="text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Appointment Booking Form
                </h3>

                <p className="text-xs text-slate-500">
                  Bookings permitted up to 30 days in advance
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =================================================
                  DOCTOR SELECTION
              ================================================= */}

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Choose Medical Specialist *
                  </label>

                  {/* Doctor Search */}

                  <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

                    <input
                      type="text"
                      placeholder="Search doctor or specialty..."
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none transition"
                    />
                  </div>
                </div>

                <div className="relative">
                  <FaUserMd className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                  <select
                    value={form.doctor}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        doctor: e.target.value,
                      })
                    }
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium"
                  >
                    <option value="">
                      -- Select Specialist Doctor --
                    </option>

                    {filteredDoctors.map((doc) => (
                      <option
                        key={doc._id}
                        value={doc._id}
                      >
                        Dr. {doc.name} (
                        {doc.specialization ||
                          "General Medicine"}
                        )
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* =================================================
                  DATE
              ================================================= */}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Consultation Date
                  (Max 1 Month Ahead) *
                </label>

                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                  <input
                    type="date"
                    min={todayStr}
                    max={maxDateStr}
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* =================================================
                  DOCTOR LEAVE
              ================================================= */}

              {form.doctor &&
                form.date &&
                isDoctorOnLeave && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                    <FaExclamationTriangle className="text-lg text-rose-600 shrink-0" />

                    <div>
                      <p className="font-extrabold text-rose-900">
                        Doctor is Unavailable / On Leave
                      </p>

                      <p className="font-medium text-rose-700 mt-0.5">
                        The selected doctor has marked leave
                        on {form.date}. Please select a
                        different date or another doctor.
                      </p>
                    </div>
                  </div>
                )}

              {/* =================================================
                  SLOTS
              ================================================= */}

              {form.doctor &&
                form.date &&
                !isDoctorOnLeave && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">

                    {/* Slot Header */}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <FaClock className="text-blue-600" />

                        <span>
                          Available Time Slots *
                        </span>
                      </label>

                      {/* =================================================
                          COLOR LEGEND
                      ================================================= */}

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">

                        {/* Available */}

                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                "#10b981",
                            }}
                          ></span>

                          Available (Green)
                        </span>

                        {/* Pending */}

                        <span className="flex items-center gap-1.5 text-amber-700">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                "#fbbf24",
                            }}
                          ></span>

                          Pending (Orange)
                        </span>

                        {/* Booked */}

                        <span className="flex items-center gap-1.5 text-rose-700">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                "#f43f5e",
                            }}
                          ></span>

                          Booked (Red)
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        PENDING MESSAGE
                    ================================================= */}

                    {pendingSlots.length > 0 && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 flex items-start gap-2.5">
                        <FaExclamationTriangle className="text-amber-600 text-sm shrink-0 mt-0.5" />

                        <span>
                          <strong>Note:</strong> Yellow/orange
                          slots are already requested by
                          another patient and are currently
                          pending approval.
                        </span>
                      </div>
                    )}

                    {/* =================================================
                        SLOT LOADING
                    ================================================= */}

                    {slotsLoading ? (
                      <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                        <span>
                          Checking slot availability...
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                        {slots.map((slot, i) => {
                          const normalizedSlot =
                            slot.toUpperCase();

                          const normalizedBookedSlots =
                            bookedSlots.map((s) =>
                              String(s).toUpperCase()
                            );

                          const normalizedPendingSlots =
                            pendingSlots.map((s) =>
                              String(s).toUpperCase()
                            );

                          const isBooked =
                            normalizedBookedSlots.includes(
                              normalizedSlot
                            );

                          const isPending =
                            normalizedPendingSlots.includes(
                              normalizedSlot
                            );

                          const isSelected =
                            selectedSlot === slot;

                          // =================================================
                          // IMPORTANT:
                          // COLOR IS APPLIED USING INLINE STYLE
                          // SO VERCEL PRODUCTION BUILD CANNOT PURGE IT
                          // =================================================

                          const slotStyle =
                            getSlotStyle(
                              isBooked,
                              isPending,
                              isSelected
                            );

                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={
                                isBooked || isPending
                              }
                              onClick={() => {
                                if (isBooked) {
                                  toast.error(
                                    "This appointment slot is already booked."
                                  );
                                  return;
                                }

                                if (isPending) {
                                  toast.warning(
                                    "This appointment slot is already requested by another patient and is currently pending. Your appointment is not confirmed."
                                  );
                                  return;
                                }

                                setSelectedSlot(slot);
                              }}
                              style={slotStyle}
                              className="p-3 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 hover:shadow-sm"
                            >
                              <span>{slot}</span>

                              {isSelected && (
                                <FaCheckCircle className="text-white text-xs" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              {/* =================================================
                  REASON FOR VISIT
              ================================================= */}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reason for Visit / Symptoms *
                </label>

                <textarea
                  rows="3"
                  placeholder="Please describe your health symptoms or reason for booking..."
                  value={form.reason}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reason: e.target.value,
                    })
                  }
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">

                <Link
                  to="/patient/dashboard"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    loading || isDoctorOnLeave
                  }
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>
                      Submit Appointment Request
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}                 