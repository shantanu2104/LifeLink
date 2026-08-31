import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, 
  FaExclamationTriangle, FaArrowLeft, FaSearch, FaClinicMedical, FaBars 
} from "react-icons/fa";

export default function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    reason: ""
  });

  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [doctorLeaves, setDoctorLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Calculate today and 1 month max date strings
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDateStr = maxDateObj.toISOString().split("T")[0];

  // ================= LOAD DOCTORS =================
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/doctors`);
      setDoctors(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load doctor list");
    }
  };

  // Derive registered departments dynamically
  const departmentMap = {};
  doctors.forEach((doc) => {
    const dept = doc.specialization || "General Medicine";
    departmentMap[dept] = (departmentMap[dept] || 0) + 1;
  });

  const registeredDepartments = Object.keys(departmentMap).map((deptName) => ({
    name: deptName,
    count: departmentMap[deptName]
  }));

  // Filtered doctors list
  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept ? (doc.specialization || "General Medicine") === selectedDept : true;
    const matchesSearch = searchQuery
      ? doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesDept && matchesSearch;
  });

  // Fetch Doctor Leaves when doctor changes
  useEffect(() => {
    if (form.doctor) {
      fetchDoctorLeaves(form.doctor);
    } else {
      setDoctorLeaves([]);
    }
  }, [form.doctor]);

  const fetchDoctorLeaves = async (doctorId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/doctors/leave/${doctorId}`);
      setDoctorLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching doctor leaves", err);
    }
  };

  const isDoctorOnLeave = form.date && doctorLeaves.includes(form.date);

  // ================= GENERATE TIME SLOTS =================
  const generateSlots = () => {
    const slotList = [];
    const createSlots = (start, end) => {
      let time = new Date();
      time.setHours(start, 0, 0);

      const endTime = new Date();
      endTime.setHours(end, 0, 0);

      while (time < endTime) {
        slotList.push(
          time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          })
        );
        time = new Date(time.getTime() + 20 * 60000);
      }
    };

    createSlots(10, 13); // 10AM-1PM
    createSlots(14, 17); // 2PM-5PM
    setSlots(slotList);
  };

  // ================= LOAD BOOKED + PENDING SLOTS =================
  const loadBookedSlots = async () => {
    if (!form.doctor || !form.date || isDoctorOnLeave) return;
    try {
      setSlotsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointments/slots`,
        {
          params: {
            doctorId: form.doctor,
            date: form.date
          }
        }
      );
        console.log("VITE_URL:", import.meta.env.VITE_URL);
console.log("Slots API response:", res.data);

      setBookedSlots(res.data.bookedSlots || []);
      setPendingSlots(res.data.pendingSlots || []);

      
    } catch (err) {
      console.log("Error fetching slots:", err);
    } finally {
      setSlotsLoading(false);
    }
  };

  // ================= AUTO LOAD SLOTS =================
  useEffect(() => {
    if (form.doctor && form.date && !isDoctorOnLeave) {
      generateSlots();
      loadBookedSlots();
      setSelectedSlot("");
    }
  }, [form.doctor, form.date, isDoctorOnLeave]);

  // ================= SUBMIT BOOKING =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDoctorOnLeave) {
      toast.error("Doctor is on leave on the selected date");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please click to select an available time slot");
      return;
    }

    try {
      setLoading(true);
      const time = new Date(`1970-01-01 ${selectedSlot}`);
      const appointmentDate = new Date(form.date);

      appointmentDate.setHours(time.getHours());
      appointmentDate.setMinutes(time.getMinutes());

      await axios.post(
        `${import.meta.env.VITE_URL}/api/appointments`,
        {
          doctor: form.doctor,
          patient: user?._id || user?.id,
          appointmentDate,
          reason: form.reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Appointment request submitted successfully!");
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 1200);

    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <PatientSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-10 flex items-center bg-white/80 backdrop-blur-md px-4 py-4 border-b border-slate-200/80 shadow-xs">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
          >
            <FaBars className="text-lg" />
          </button>
        </header>
        <main className="p-8 lg:p-10 space-y-8 max-w-5xl w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <Link
                to="/patient/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition mb-2"
              >
                <FaArrowLeft /> Back to Dashboard
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Book Consultation Appointment
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Select your department, specialist doctor, date (up to 1 month ahead), and available slot.
              </p>
            </div>
          </div>

          {/* PART 2.1 & 2.2: REGISTERED DEPARTMENTS CARDS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FaClinicMedical className="text-blue-600" />
                <span>Registered Hospital Departments</span>
              </h3>
              {selectedDept && (
                <button
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
                  No registered doctors/departments available currently.
                </div>
              ) : (
                registeredDepartments.map((dept) => {
                  const isSelected = selectedDept === dept.name;
                  return (
                    <button
                      key={dept.name}
                      type="button"
                      onClick={() => setSelectedDept(isSelected ? "" : dept.name)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md"
                          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs text-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm">{dept.name}</div>
                      <div className={`text-xs mt-1 font-semibold ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                        {dept.count} {dept.count === 1 ? "Doctor" : "Doctors"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Appointment Booking Form</h3>
                <p className="text-xs text-slate-500">Bookings permitted up to 30 days in advance</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Search & Selection */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Choose Medical Specialist *
                  </label>

                  {/* Doctor Search Input */}
                  <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search doctor or specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none transition"
                    />
                  </div>
                </div>

                <div className="relative">
                  <FaUserMd className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <select
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium"
                  >
                    <option value="">-- Select Specialist Doctor --</option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.name} ({doc.specialization || "General Medicine"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Input with 1 Month Max Limit */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Consultation Date (Max 1 Month Ahead) *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="date"
                    min={todayStr}
                    max={maxDateStr}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Doctor Leave Warning */}
              {form.doctor && form.date && isDoctorOnLeave && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                  <FaExclamationTriangle className="text-lg text-rose-600 shrink-0" />
                  <div>
                    <p className="font-extrabold text-rose-900">Doctor is Unavailable / On Leave</p>
                    <p className="font-medium text-rose-700 mt-0.5">
                      The selected doctor has marked leave on {form.date}. Please select a different date or another doctor.
                    </p>
                  </div>
                </div>
              )}

              {/* Slots Section */}
              {form.doctor && form.date && !isDoctorOnLeave && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      <span>Available Time Slots *</span>
                    </label>

                    {/* Color Legend */}
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        Available (Green)
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        Pending (Orange)
                      </span>
                      <span className="flex items-center gap-1.5 text-rose-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        Booked (Red)
                      </span>
                    </div>
                  </div>

                  {/* PART 2.6 PENDING SLOT NOTIFICATION BANNER */}
                  {pendingSlots.length > 0 && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 flex items-start gap-2.5">
                      <FaExclamationTriangle className="text-amber-600 text-sm shrink-0 mt-0.5" />
                      <span>
                        <strong>Note:</strong> Yellow/orange slots are already requested by another patient and are currently pending approval.
                      </span>
                    </div>
                  )}

                  {slotsLoading ? (
                    <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking slot availability...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {slots.map((slot, i) => {
                        const normalizedSlot = slot.toUpperCase();
                        const isBooked = bookedSlots
                          .map((s) => s.toUpperCase())
                          .includes(normalizedSlot);
                        const isPending = pendingSlots
                          .map((s) => s.toUpperCase())
                          .includes(normalizedSlot);

                        const isSelected = selectedSlot === slot;

                        let buttonClass = "border-emerald-500 text-slate-800 hover:border-emerald-600 hover:bg-emerald-50/50";
                        if (isBooked) {
                          buttonClass = "bg-rose-50 border-rose-200 text-rose-500 cursor-not-allowed opacity-60";
                        } else if (isPending) {
                          buttonClass = "bg-amber-50 border-amber-300 text-amber-800 cursor-not-allowed opacity-75";
                        } else if (isSelected) {
                          buttonClass = "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold border-emerald-600 shadow-md shadow-emerald-500/20";
                        }

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isBooked || isPending}
                            onClick={() => {
                              if (isPending) {
                                toast.warning("This appointment slot is already requested by another patient and is currently pending. Your appointment is not confirmed.");
                              } else {
                                setSelectedSlot(slot);
                              }
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${buttonClass}`}
                          >
                            <span>{slot}</span>
                            {isSelected && <FaCheckCircle className="text-white text-xs" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reason for Visit / Symptoms *
                </label>
                <textarea
                  rows="3"
                  placeholder="Please describe your health symptoms or reason for booking..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                <Link
                  to="/patient/dashboard"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading || isDoctorOnLeave}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Submit Appointment Request</span>
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