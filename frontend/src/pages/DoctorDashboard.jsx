import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import StatCard from "../components/StatCard";
import { CardSkeleton } from "../components/Skeleton";
import { 
  FaUserClock, FaUsers, FaCheck, FaTimes, FaExternalLinkAlt, 
  FaCalendarCheck, FaClock, FaCalendarAlt, FaCalendarMinus, FaCheckCircle 
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const API = `${import.meta.env.VITE_URL}/api`;

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Doctor Leave State
  const [leaves, setLeaves] = useState([]);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveLoading, setLeaveLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Calculate 1 month ahead limit
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDateStr = maxDateObj.toISOString().split("T")[0];

  const loadAppointments = async (user) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.data) {
        const myApps = data.data.filter(
          (a) => a.doctor && (a.doctor._id === user.id || a.doctor._id === user._id)
        );
        setAppointments(myApps);
      }
    } catch (err) {
      console.log("Error loading doctor appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaves = async (doctorId) => {
    try {
      const res = await axios.get(`${API}/doctors/leave/${doctorId}`);
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.log("Error loading leaves:", err);
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    if (!leaveDate) return;

    try {
      setLeaveLoading(true);
      const res = await axios.post(
        `${API}/doctors/leave`,
        { date: leaveDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Leave added for ${leaveDate}`);
      setLeaves(res.data.leaves || []);
      setLeaveDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add leave");
    } finally {
      setLeaveLoading(false);
    }
  };

  const handleRemoveLeave = async (date) => {
    try {
      const res = await axios.delete(`${API}/doctors/leave/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Leave removed for ${date}`);
      setLeaves(res.data.leaves || []);
    } catch (err) {
      toast.error("Failed to remove leave");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/appointments/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Appointment status updated to ${status}`);
        loadAppointments(doctor);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.log("Error updating appointment status:", err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setDoctor(user);
      if (user) {
        const docId = user._id || user.id;
        await loadAppointments(user);
        await loadLeaves(docId);
      }
    };

    initDashboard();
  }, []);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Doctor Profile...</span>
        </div>
      </div>
    );
  }

  const uniquePatients = [
    ...new Set(appointments.map((a) => a.patient?._id).filter(Boolean))
  ];

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );

  const displayTodayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex justify-between items-center bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-100/80 px-3 py-1.5 rounded-lg">
            <FaCalendarAlt className="text-teal-600 text-sm" />
            <span>{displayTodayStr}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-bold text-sm text-slate-800 leading-tight">Dr. {doctor.name}</p>
              <p className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">
                {doctor.specialization || "Medical Specialist"}
              </p>
            </div>

            <div className="relative">
              <img
                className="w-10 h-10 rounded-xl ring-2 ring-teal-500/20 object-cover shadow-sm"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0d9488&color=fff&bold=true`}
                alt={doctor.name}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
        </header>

        <main className="p-8 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Doctor Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Welcome back, Dr. {doctor.name}. Manage consultation requests, leaves, and patient charts.
              </p>
            </div>

            <Link
              to="/doctor/edit-profile"
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Edit Profile Info
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Pending Appointment Requests"
                  value={pendingAppointments.length}
                  icon={<FaUserClock />}
                  color="bg-amber-50 text-amber-600 border border-amber-100"
                />
                <StatCard
                  title="Total Unique Patients Managed"
                  value={uniquePatients.length}
                  icon={<FaUsers />}
                  color="bg-teal-50 text-teal-600 border border-teal-100"
                />
              </>
            )}
          </div>

          {/* PART 4.3: DOCTOR LEAVE FEATURE CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <FaCalendarMinus className="text-lg" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Schedule Leave / Mark Unavailable</h3>
                <p className="text-xs text-slate-500">Mark future dates (up to 1 month ahead) as unavailable for consultations</p>
              </div>
            </div>

            <form onSubmit={handleAddLeave} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="date"
                min={todayStr}
                max={maxDateStr}
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                required
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-teal-600 transition"
              />

              <button
                type="submit"
                disabled={leaveLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition disabled:opacity-70"
              >
                {leaveLoading ? "Adding..." : "Mark Leave Date"}
              </button>
            </form>

            {leaves.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Scheduled Leaves:</span>
                {leaves.map((date) => (
                  <span
                    key={date}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold"
                  >
                    <span>{date}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLeave(date)}
                      className="text-rose-500 hover:text-rose-800 ml-1 font-bold"
                      title="Remove leave"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Patient Appointment Requests List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                  <FaCalendarCheck className="text-lg" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Patient Consultation Requests</h3>
                  <p className="text-xs text-slate-500">Review pending requests, prescribe record, and chat with patients</p>
                </div>
              </div>

              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                Total: {appointments.length}
              </span>
            </div>

            {loading ? (
              <div className="p-8 space-y-4">
                <div className="h-16 bg-slate-100 animate-pulse rounded-2xl"></div>
                <div className="h-16 bg-slate-100 animate-pulse rounded-2xl"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-16 text-center text-slate-400 space-y-2">
                <FaCalendarCheck className="text-4xl text-slate-300 mx-auto" />
                <p className="font-medium text-slate-500">No appointment requests found.</p>
                <p className="text-xs text-slate-400">When patients book a consultation, their requests will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map((app) => {
                  const patientName = app.patient?.name || "Unknown Patient";
                  const dateObj = new Date(app.appointmentDate);
                  const dateStr = !isNaN(dateObj)
                    ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Scheduled";
                  const timeStr = !isNaN(dateObj)
                    ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";

                  return (
                    <div
                      key={app._id}
                      className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500/10 shrink-0"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=ccfbf1&color=0f766e&bold=true`}
                          alt={patientName}
                        />

                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-base">{patientName}</h4>
                          <p className="text-xs text-slate-600 font-medium">
                            <span className="font-semibold text-slate-400">Reason:</span> {app.reason || "General Medical Checkup"}
                          </p>

                          {app.nextAppointmentDate && (
                            <p className="text-xs text-teal-600 font-semibold flex items-center gap-1 pt-1">
                              <span>Next Scheduled Visit:</span>{" "}
                              {new Date(app.nextAppointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-3 shrink-0">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                          <FaClock className="text-teal-600" />
                          <span>{dateStr} {timeStr}</span>
                        </div>

                        {app.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateStatus(app._id, "accepted")}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                            >
                              <FaCheck /> Accept
                            </button>

                            <button
                              onClick={() => updateStatus(app._id, "declined")}
                              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                            >
                              <FaTimes /> Decline
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2 justify-end">
                            <span
                              className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                                app.status === "completed"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : app.status === "accepted"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              Status: {app.status === "completed" ? "Completed ✓" : app.status}
                            </span>

                            {app.status === "accepted" && (
                              <button
                                onClick={() => updateStatus(app._id, "completed")}
                                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition"
                              >
                                <FaCheckCircle /> Mark Completed
                              </button>
                            )}

                            {(app.status === "accepted" || app.status === "completed") && (
                              <button
                                onClick={() => navigate(`/appointment/${app._id}`)}
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition"
                              >
                                <span>Record Chart & Chat</span>
                                <FaExternalLinkAlt className="text-[10px]" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}