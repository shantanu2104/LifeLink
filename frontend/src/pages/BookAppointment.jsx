import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaHeartbeat } from "react-icons/fa";

export default function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    reason: ""
  });

  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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
    if (!form.doctor || !form.date) return;
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
    if (form.doctor && form.date) {
      generateSlots();
      loadBookedSlots();
      setSelectedSlot("");
    }
  }, [form.doctor, form.date]);

  // ================= SUBMIT BOOKING =================
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-8 lg:p-10 space-y-8 max-w-4xl w-full mx-auto">
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
                Select your preferred doctor, date, and available time slot.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Appointment Details</h3>
                <p className="text-xs text-slate-500">All consultations are verified by staff</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Choose Medical Specialist *
                </label>
                <div className="relative">
                  <FaUserMd className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <select
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium"
                  >
                    <option value="">-- Select Specialist Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.name} ({doc.specialization || "General Medicine"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Consultation Date *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Slots Section */}
              {form.doctor && form.date && (
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
                        Available
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        Pending
                      </span>
                      <span className="flex items-center gap-1.5 text-rose-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        Booked
                      </span>
                    </div>
                  </div>

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

                        let buttonClass = "border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50";
                        if (isBooked) {
                          buttonClass = "bg-rose-50 border-rose-200 text-rose-400 cursor-not-allowed opacity-60";
                        } else if (isPending) {
                          buttonClass = "bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed opacity-75";
                        } else if (isSelected) {
                          buttonClass = "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold border-emerald-600 shadow-md shadow-emerald-500/20";
                        }

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isBooked || isPending}
                            onClick={() => setSelectedSlot(slot)}
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
                  disabled={loading}
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