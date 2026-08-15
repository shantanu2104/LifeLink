import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import ConfirmModal from "../components/ConfirmModal";
import { TableSkeleton } from "../components/Skeleton";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaCalendarPlus, FaUserMd, FaClock, FaCalendarAlt, 
  FaPrescription, FaNotesMedical, FaTimes, FaHeartbeat, 
  FaCheckCircle, FaExclamationCircle 
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, apptId: null });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const allAppointments = res.data.data || [];
      const myApps = allAppointments
        .filter(
          (app) =>
            app.patient &&
            (app.patient._id === user._id || app.patient._id === user.id)
        )
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

      setAppointments(myApps);
    } catch (err) {
      console.error("Error loading patient appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const confirmCancel = (id) => {
    setCancelModal({ isOpen: true, apptId: id });
  };

  const handleCancelAppointment = async () => {
    if (!cancelModal.apptId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/appointments/${cancelModal.apptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Appointment cancelled successfully");
      setAppointments(appointments.filter((app) => app._id !== cancelModal.apptId));
    } catch (err) {
      console.error("Error cancelling appointment", err);
      toast.error("Failed to cancel appointment");
    }
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex justify-between items-center bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-100/80 px-3 py-1.5 rounded-lg">
            <FaCalendarAlt className="text-blue-600 text-sm" />
            <span>{todayStr}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-bold text-sm text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                Patient Account
              </p>
            </div>

            <div className="relative">
              <img
                className="w-10 h-10 rounded-xl ring-2 ring-blue-500/20 object-cover shadow-sm"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patient")}&background=2563eb&color=fff&bold=true`}
                alt={user?.name}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
        </header>

        <main className="p-8 lg:p-10 space-y-8 max-w-5xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-blue-500/15">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
                <FaHeartbeat className="text-teal-300" /> Personal Health Portal
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Hello, {user?.name?.split(" ")[0]}!
              </h1>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Take control of your health journey. Schedule new doctor consultations and view your digital prescriptions and clinical history.
              </p>

              <div className="pt-2">
                <Link
                  to="/patient/book-appointment"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-slate-100 font-extrabold px-6 py-3.5 rounded-2xl shadow-md text-sm transition hover:-translate-y-0.5"
                >
                  <FaCalendarPlus />
                  <span>Book New Appointment</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Your Scheduled Visits</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upcoming consultations and medical prescriptions</p>
              </div>

              <span className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600">
                Total: {appointments.length}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-32 bg-white rounded-3xl border border-slate-200 animate-pulse"></div>
                <div className="h-32 bg-white rounded-3xl border border-slate-200 animate-pulse"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-slate-400 space-y-3 shadow-xs">
                <FaCalendarPlus className="text-4xl text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-base">No upcoming appointments scheduled</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Need to see a doctor? Click below to select a doctor and book an available time slot.
                </p>
                <Link
                  to="/patient/book-appointment"
                  className="inline-block mt-2 bg-blue-50 text-blue-600 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-blue-100 transition"
                >
                  Schedule Consultation →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((app, i) => {
                  const doctorName = app.doctor?.name || "Assigned Doctor";
                  const spec = app.doctor?.specialization || "General Medicine";

                  const dateObj = new Date(app.appointmentDate);
                  const dateStr = !isNaN(dateObj)
                    ? dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                    : "Date Pending";
                  const timeStr = !isNaN(dateObj)
                    ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";

                  const status = (app.status || "pending").toLowerCase();

                  return (
                    <div
                      key={app._id || i}
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition space-y-6"
                    >
                      {/* Top Header Card */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=e0e7ff&color=3730a3&bold=true`}
                            alt={doctorName}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/10 shrink-0"
                          />

                          <div className="space-y-1">
                            <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                              <span>Dr. {doctorName}</span>
                              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                                {spec}
                              </span>
                            </h4>
                            <p className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-700">Reason:</span> {app.reason || "General Checkup"}
                            </p>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 md:justify-end">
                              <FaClock className="text-blue-600 text-xs" />
                              <span>{dateStr}</span>
                            </div>
                            <span className="text-xs font-semibold text-blue-600 block">{timeStr}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                                status === "accepted"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : status === "declined"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {status === "accepted" ? "Accepted ✓" : status === "declined" ? "Declined ✕" : "Pending Approval"}
                            </span>

                            {status === "pending" && (
                              <button
                                onClick={() => confirmCancel(app._id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-semibold transition"
                                title="Cancel Request"
                              >
                                <FaTimes className="text-base" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Medical Record Details (if available) */}
                      {(app.prescription || app.history || app.nextAppointmentDate) && (
                        <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <FaNotesMedical className="text-teal-600" />
                            <span>Medical Prescription & Notes</span>
                          </div>

                          {app.prescription && (
                            <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200/60">
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                <FaPrescription /> Rx Prescription:
                              </span>
                              <p className="text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
                                {app.prescription}
                              </p>
                            </div>
                          )}

                          {app.history && (
                            <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200/60">
                              <span className="text-xs font-bold text-slate-700">Doctor Notes & History:</span>
                              <p className="text-xs text-slate-600">{app.history}</p>
                            </div>
                          )}

                          {app.nextAppointmentDate && (
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                              <FaCheckCircle className="text-emerald-500" />
                              <span>Next Scheduled Follow-Up: {new Date(app.nextAppointmentDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        title="Cancel Appointment Request"
        message="Are you sure you want to cancel this appointment request? This action cannot be undone."
        confirmText="Cancel Appointment"
        isDanger={true}
        onConfirm={handleCancelAppointment}
        onClose={() => setCancelModal({ isOpen: false, apptId: null })}
      />
    </div>
  );
}