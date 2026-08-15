import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { TableSkeleton } from "../components/Skeleton";
import { FaCalendarAlt, FaSearch, FaSyncAlt, FaUserMd, FaUserInjured, FaClock } from "react-icons/fa";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "Scheduled").toLowerCase();
    if (s === "completed" || s === "accepted") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {status || "Accepted"}
        </span>
      );
    }
    if (s === "cancelled" || s === "declined") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          {status || "Declined"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        {status || "Pending"}
      </span>
    );
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctor?.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (app.status || "pending").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-8 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                All Patient Appointments
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Monitor and review scheduled doctor visits across the hospital.
              </p>
            </div>

            <button
              onClick={loadAppointments}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin text-indigo-600" : ""} />
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FaCalendarAlt className="text-lg" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Scheduled Visits</h3>
                  <p className="text-xs text-slate-500">Total Records: {appointments.length}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto text-xs font-semibold text-slate-600">
                  {["ALL", "Pending", "Accepted", "Declined"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        statusFilter === st ? "bg-white text-indigo-600 shadow-xs font-bold" : "hover:text-slate-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search doctor or patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-6">Assigned Doctor</th>
                    <th className="py-4 px-6">Patient Info</th>
                    <th className="py-4 px-6">Reason / Notes</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <TableSkeleton rows={5} cols={5} />
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400">
                        No appointments found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app, i) => {
                      const docName = app.doctor?.name || "Unassigned";
                      const docSpec = app.doctor?.specialization || "General";
                      const patName = app.patient?.name || "Unknown Patient";
                      const patEmail = app.patient?.email || "No Email";

                      const dateObj = new Date(app.appointmentDate);
                      const dateStr = !isNaN(dateObj)
                        ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Invalid Date";
                      const timeStr = !isNaN(dateObj)
                        ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "";

                      return (
                        <tr key={app._id || i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{dateStr}</span>
                              <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-0.5">
                                <FaClock className="text-[10px]" />
                                {timeStr}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/10"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=e0e7ff&color=3730a3&bold=true`}
                                alt={docName}
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <FaUserMd className="text-indigo-500 text-xs" />
                                  Dr. {docName}
                                </div>
                                <div className="text-xs text-slate-400">{docSpec}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/10"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patName)}&background=ecfdf5&color=047857&bold=true`}
                                alt={patName}
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <FaUserInjured className="text-emerald-500 text-xs" />
                                  {patName}
                                </div>
                                <div className="text-xs text-slate-400">{patEmail}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <p className="text-xs text-slate-600 font-medium max-w-xs truncate">
                              {app.reason || "General Consultation"}
                            </p>
                          </td>

                          <td className="py-4 px-6 text-right">
                            {getStatusBadge(app.status)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}