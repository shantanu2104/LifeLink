import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import StatCard from "../components/StatCard";
import ConfirmModal from "../components/ConfirmModal";
import { TableSkeleton, CardSkeleton } from "../components/Skeleton";

import { FaUserMd, FaProcedures, FaCalendarCheck, FaPlus, FaSearch, FaSyncAlt, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, doctorId: null, doctorName: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const docRes = await axios.get(`${import.meta.env.VITE_URL}/api/doctors`);
      const patRes = await axios.get(`${import.meta.env.VITE_URL}/api/patients`);
      const appRes = await axios.get(`${import.meta.env.VITE_URL}/api/appointments`);

      setStats({
        doctors: docRes.data.count || docRes.data.length || (docRes.data.data ? docRes.data.data.length : 0),
        patients: patRes.data.count || patRes.data.length || (patRes.data.data ? patRes.data.data.length : 0),
        appointments: appRes.data.count || appRes.data.length || (appRes.data.data ? appRes.data.data.length : 0)
      });
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/doctors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors(res.data.data || []);
    } catch (err) {
      console.log("Error fetching doctors:", err);
    }
  };

  const confirmDeleteDoctor = (doc) => {
    setDeleteModal({
      isOpen: true,
      doctorId: doc._id,
      doctorName: doc.name
    });
  };

  const handleDeleteDoctor = async () => {
    if (!deleteModal.doctorId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/doctors/${deleteModal.doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Doctor ${deleteModal.doctorName} removed successfully`);
      fetchDoctors();
      fetchStats();
    } catch (err) {
      console.log("Error deleting doctor:", err);
      toast.error("Failed to delete doctor");
    }
  };

  const refreshAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchDoctors()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                System Overview
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Hospital statistics and medical staff management dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={refreshAllData}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
                title="Refresh Data"
              >
                <FaSyncAlt className={loading ? "animate-spin text-indigo-600" : ""} />
              </button>

              <Link
                to="/admin/patients"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md hover:-translate-y-0.5 transition-all"
              >
                <FaPlus className="text-xs" />
                <span>Add Patient</span>
              </Link>

              <Link
                to="/admin/add-doctor"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all"
              >
                <FaPlus className="text-xs" />
                <span>Onboard Doctor</span>
              </Link>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Doctors Onboarded"
                  value={stats.doctors}
                  icon={<FaUserMd />}
                  color="bg-indigo-50 text-indigo-600 border border-indigo-100"
                />
                <StatCard
                  title="Active Registered Patients"
                  value={stats.patients}
                  icon={<FaProcedures />}
                  color="bg-emerald-50 text-emerald-600 border border-emerald-100"
                />
                <StatCard
                  title="Scheduled Appointments"
                  value={stats.appointments}
                  icon={<FaCalendarCheck />}
                  color="bg-amber-50 text-amber-600 border border-amber-100"
                />
              </>
            )}
          </div>

          {/* Doctors Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Doctor Directory</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage medical staff profiles and specializations</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
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
                    <th className="py-4 px-6">Doctor Profile</th>
                    <th className="py-4 px-6">Specialization</th>
                    <th className="py-4 px-6">Contact Email</th>
                    <th className="py-4 px-6">Experience</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <TableSkeleton rows={4} cols={6} />
                  ) : filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400">
                        No doctors found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/10"
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e0e7ff&color=3730a3&bold=true`}
                              alt={doc.name}
                            />
                            <div>
                              <div className="font-bold text-slate-900">Dr. {doc.name}</div>
                              <div className="text-xs text-slate-400">ID: #{doc._id?.slice(-6) || "N/A"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {doc.specialization || "General Medicine"}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-medium text-xs">{doc.email}</td>

                        <td className="py-4 px-6 text-slate-600 font-semibold text-xs">
                          {doc.experience ? `${doc.experience} Years` : "Recent Join"}
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => confirmDeleteDoctor(doc)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Doctor Account"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Remove Doctor Profile"
        message={`Are you sure you want to delete Dr. ${deleteModal.doctorName}? This action cannot be undone.`}
        confirmText="Delete Profile"
        isDanger={true}
        onConfirm={handleDeleteDoctor}
        onClose={() => setDeleteModal({ isOpen: false, doctorId: null, doctorName: "" })}
      />
    </div>
  );
}