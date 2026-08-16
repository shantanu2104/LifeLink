import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaFileMedical,
  FaUserInjured,
  FaUserMd,
  FaCalendarAlt,
  FaPrescription,
  FaNotesMedical,
  FaSave,
  FaArrowLeft,
  FaComments,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({});
  const [prescription, setPrescription] = useState("");
  const [history, setHistory] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Ref for ONLY the chat message container
  const chatContainerRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = currentUser.role || "patient";

  useEffect(() => {
    loadAppointment();
    loadMessages();

    // Auto poll messages every 3 seconds
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  const loadAppointment = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const appData = res.data.data || {};
      setAppointment(appData);

      if (appData.prescription) {
        setPrescription(appData.prescription);
      }

      if (appData.history) {
        setHistory(appData.history);
      }

      if (appData.nextAppointmentDate) {
        const d = new Date(appData.nextAppointmentDate)
          .toISOString()
          .split("T")[0];

        setNextDate(d);
      }
    } catch (err) {
      console.error("Error loading appointment record", err);
      toast.error("Failed to load appointment details");
    }
  };

  const loadMessages = async () => {
    if (!id || !token) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/messages/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(res.data.data || []);
    } catch (err) {
      // Silently catch polling errors if unauthorized/not found
    }
  };

  // Scroll ONLY the chat message container.
  // This does NOT scroll the main Appointment Details page.
  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!chatInput.trim()) return;

    try {
      setSendingMsg(true);

      await axios.post(
        `${import.meta.env.VITE_URL}/api/messages`,
        {
          appointmentId: id,
          text: chatInput.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChatInput("");
      loadMessages();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send message"
      );
    } finally {
      setSendingMsg(false);
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
          nextAppointmentDate: nextDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        "Medical record & prescription saved successfully!"
      );

      if (userRole === "doctor") {
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      console.error("Error saving medical record", err);
      toast.error("Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_URL}/api/appointments/status/${id}`,
        { status: "completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Appointment marked as Completed!");
      loadAppointment();
    } catch (err) {
      toast.error("Failed to mark completed");
    } finally {
      setLoading(false);
    }
  };

  const appDateStr = appointment?.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Loading Date...";

  const getBackPath = () => {
    if (userRole === "admin") return "/admin/dashboard";
    if (userRole === "doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto border border-slate-200 overflow-hidden my-8">

        {/* EMR Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-8 space-y-3">
          <div className="flex justify-between items-center">
            <Link
              to={getBackPath()}
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-200 hover:text-white transition"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Electronic Medical Record (EMR) & Chat
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <FaFileMedical className="text-2xl text-teal-300" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold">
                Patient Medical Consultation Chart
              </h1>

              <p className="text-xs text-blue-100 mt-0.5">
                Record diagnostic notes, medicines, follow-up dates & direct chat
              </p>
            </div>
          </div>
        </div>

        {/* EMR Form Content */}
        <div className="p-6 sm:p-8 space-y-8">

          {/* Header Card: Patient & Doctor Info */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold shrink-0">
                <FaUserInjured />
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Patient Name
                </span>

                <h3 className="text-xl font-extrabold text-slate-900">
                  {appointment?.patient?.name || "Loading..."}
                </h3>

                <p className="text-xs text-slate-500">
                  {appointment?.patient?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-lg font-bold shrink-0">
                <FaUserMd />
              </div>

              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                  Attending Doctor
                </span>

                <h4 className="text-sm font-bold text-slate-900">
                  Dr. {appointment?.doctor?.name || "Loading..."}
                </h4>

                <p className="text-xs text-slate-500">
                  {appointment?.doctor?.specialization || "Specialist"}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right space-y-1 shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Visit Date
              </span>

              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 md:justify-end">
                <FaCalendarAlt className="text-indigo-600" />
                <span>{appDateStr}</span>
              </div>

              <span
                className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border mt-1 ${
                  appointment?.status === "completed"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : appointment?.status === "accepted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                Status:{" "}
                {appointment?.status === "completed"
                  ? "Completed ✓"
                  : appointment?.status || "Pending"}
              </span>
            </div>
          </div>

          {/* Reason for visit */}
          {appointment?.reason && (
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-teal-900">
              <span className="font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                Chief Complaint / Reason:
              </span>

              <p className="font-medium text-slate-700">
                {appointment.reason}
              </p>
            </div>
          )}

          {/* PRESCRIPTION TEXT AREA */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FaPrescription className="text-blue-600 text-base" />
              <span>Rx / Medical Prescription</span>
            </label>

            {userRole === "doctor" ? (
              <textarea
                placeholder="e.g. Amoxicillin 500mg - 1 capsule every 8 hours after meals (5 days)"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                rows="4"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition font-mono"
              />
            ) : (
              <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-mono whitespace-pre-line min-h-24">
                {prescription || "No prescription recorded yet."}
              </div>
            )}
          </div>

          {/* CLINICAL HISTORY & DOCTOR NOTES */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FaNotesMedical className="text-teal-600 text-base" />
              <span>Doctor Notes / Diagnosis & Clinical History</span>
            </label>

            {userRole === "doctor" ? (
              <textarea
                placeholder="Patient presents with mild respiratory congestion. BP normal..."
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                rows="3"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition"
              />
            ) : (
              <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm min-h-20">
                {history || "No clinical history or notes recorded yet."}
              </div>
            )}
          </div>

          {/* NEXT APPOINTMENT DATE */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FaCalendarAlt className="text-emerald-600 text-base" />
              <span>
                Schedule Next Follow-Up Visit Date (Optional)
              </span>
            </label>

            {userRole === "doctor" ? (
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            ) : (
              <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold">
                {nextDate
                  ? new Date(nextDate).toLocaleDateString()
                  : "No follow-up date scheduled."}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              to={getBackPath()}
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Back
            </Link>

            <div className="flex items-center gap-3">
              {(userRole === "doctor" || userRole === "admin") &&
                appointment?.status !== "completed" && (
                  <button
                    onClick={markCompleted}
                    disabled={loading}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow transition text-xs"
                  >
                    <FaCheckCircle />
                    <span>Mark Completed</span>
                  </button>
                )}

              {userRole === "doctor" && (
                <button
                  onClick={saveRecord}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-70 text-xs"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FaSave />
                      <span>Save Record & Prescription</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* DOCTOR ↔ PATIENT CHAT */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FaComments className="text-xl" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Doctor ↔ Patient Consultation Chat
                </h3>

                <p className="text-xs text-slate-500">
                  Real-time rest messaging for follow-ups and inquiries
                </p>
              </div>
            </div>

            {/* Chat Box */}
            <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden flex flex-col h-80">

              {/* ONLY THIS AREA SCROLLS */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs">
                    No messages yet. Send a message to start the consultation chat.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe =
                      msg.sender === currentUser._id ||
                      msg.sender === currentUser.id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                          <span className="font-bold text-slate-600">
                            {msg.senderName}
                          </span>

                          <span className="uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                            {msg.senderRole}
                          </span>

                          <span>
                            •{" "}
                            {new Date(msg.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        <div
                          className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-none shadow-xs"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-200 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Type your consultation message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />

                <button
                  type="submit"
                  disabled={sendingMsg || !chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <span>Send</span>
                  <FaPaperPlane className="text-[10px]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}