import { useParams, useNavigate, Link } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaFileMedical, FaUserInjured, FaCalendarAlt, FaPrescription, FaNotesMedical, FaSave, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({});
  const [prescription, setPrescription] = useState("");
  const [history, setHistory] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const appData = res.data.data || {};
      setAppointment(appData);
      if (appData.prescription) setPrescription(appData.prescription);
      if (appData.history) setHistory(appData.history);
      if (appData.nextAppointmentDate) {
        const d = new Date(appData.nextAppointmentDate).toISOString().split("T")[0];
        setNextDate(d);
      }
    } catch (err) {
      console.error("Error loading appointment record", err);
      toast.error("Failed to load appointment details");
    }
  };

  const saveRecord = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_URL}/api/appointments/record/${id}`,
        {
          prescription,
          history,
          nextAppointmentDate: nextDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Medical record & prescription saved successfully!");
      navigate("/doctor/dashboard");
    } catch (err) {
      console.error("Error saving medical record", err);
      toast.error("Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  const appDateStr = appointment?.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Loading Date...";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden">
        {/* EMR Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-8 space-y-3">
          <div className="flex justify-between items-center">
            <Link
              to="/doctor/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-200 hover:text-white transition"
            >
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Electronic Medical Record (EMR)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <FaFileMedical className="text-2xl text-teal-300" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Patient Medical Consultation Chart</h1>
              <p className="text-xs text-blue-100 mt-0.5">Record diagnostic notes, medicines & follow-up dates</p>
            </div>
          </div>
        </div>

        {/* EMR Form Content */}
        <div className="p-8 space-y-8">
          {/* Patient Card Header */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                <FaUserInjured />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Patient Name</span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {appointment?.patient?.name || "Loading..."}
                </h3>
                <p className="text-xs text-slate-500">{appointment?.patient?.email}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Visit Date</span>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 sm:justify-end">
                <FaCalendarAlt className="text-indigo-600" />
                <span>{appDateStr}</span>
              </div>
            </div>
          </div>

          {/* Reason for visit */}
          {appointment?.reason && (
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-teal-900">
              <span className="font-bold uppercase tracking-wider text-teal-700 block mb-0.5">Chief Complaint / Reason:</span>
              <p className="font-medium text-slate-700">{appointment.reason}</p>
            </div>
          )}

          {/* PRESCRIPTION TEXT AREA */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FaPrescription className="text-blue-600 text-base" />
              <span>Rx / Medical Prescription</span>
            </label>
            <textarea
              placeholder="e.g. Amoxicillin 500mg - 1 capsule every 8 hours after meals (5 days)"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              rows="4"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-mono"
            />
          </div>

          {/* CLINICAL HISTORY & DOCTOR NOTES */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FaNotesMedical className="text-teal-600 text-base" />
              <span>Doctor Notes / Diagnosis & Clinical History</span>
            </label>
            <textarea
              placeholder="Patient presents with mild respiratory congestion. BP normal..."
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              rows="3"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition"
            />
          </div>

          {/* NEXT APPOINTMENT DATE */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FaCalendarAlt className="text-emerald-600 text-base" />
              <span>Schedule Next Follow-Up Visit Date (Optional)</span>
            </label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
            <Link
              to="/doctor/dashboard"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </Link>

            <button
              onClick={saveRecord}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSave />
                  <span>Save Record & Prescription</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}