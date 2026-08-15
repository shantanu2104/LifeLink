import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { TableSkeleton } from "../components/Skeleton";
import { FaUserInjured, FaSearch, FaSyncAlt, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatients(res.data.data || []);
    } catch (err) {
      console.error("Failed to load patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Registered Patients
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                View and review active hospital patient accounts and records.
              </p>
            </div>

            <button
              onClick={loadPatients}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin text-indigo-600" : ""} />
              <span>Refresh List</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FaUserInjured className="text-lg" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Patient Records Directory</h3>
                  <p className="text-xs text-slate-500">Total Patients: {patients.length}</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search patient name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-4 px-6">Patient Profile</th>
                    <th className="py-4 px-6">Contact Email</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <TableSkeleton rows={5} cols={5} />
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400">
                        No registered patients found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient, i) => {
                      const joinedDate = patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })
                        : "N/A";

                      return (
                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/10"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=ecfdf5&color=047857&bold=true`}
                                alt={patient.name}
                              />
                              <div>
                                <div className="font-bold text-slate-900">{patient.name}</div>
                                <div className="text-xs text-slate-400">ID: #{patient._id?.slice(-6) || i + 1001}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-slate-600 font-medium text-xs">
                            <span className="flex items-center gap-1.5">
                              <FaEnvelope className="text-slate-400 text-xs" />
                              {patient.email}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-slate-600 text-xs font-semibold">
                            <span className="flex items-center gap-1.5">
                              <FaCalendarAlt className="text-slate-400 text-xs" />
                              {joinedDate}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {patient.role ? patient.role.toUpperCase() : "PATIENT"}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                              Registered
                            </span>
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