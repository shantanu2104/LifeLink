import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import StatCard from "../components/StatCard";

import { FaUserMd, FaProcedures, FaCalendarCheck } from "react-icons/fa";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0
  });

  const [doctors, setDoctors] = useState([]);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {

      const docRes = await axios.get(`${import.meta.env.VITE_VITE_URL}/api/doctors`);
      const patRes = await axios.get(`${import.meta.env.VITE_VITE_URL}/api/patients`);
      const appRes = await axios.get(`${import.meta.env.VITE_VITE_URL}/api/appointments`);

      setStats({
        doctors: docRes.data.count || docRes.data.length,
        patients: patRes.data.count || patRes.data.length,
        appointments: appRes.data.count || appRes.data.length
      });

    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctors = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_VITE_URL}/api/doctors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDoctors(res.data.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {

      await axios.delete(
        `${import.meta.env.VITE_VITE_URL}/api/doctors/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Doctor deleted successfully");

      fetchDoctors();
      fetchStats();

    } catch (err) {
      console.log(err);
      alert("Failed to delete doctor");
    }
  };

  useEffect(() => {
  const loadData = async () => {
    await fetchStats();
    await fetchDoctors();
  };

  loadData();
}, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <AdminSidebar />

      <div className="flex-1 flex flex-col">

        <AdminTopbar />

        <div className="p-10">

          <div className="flex justify-between items-end mb-8">

            <div>
              <h1 className="text-2xl font-bold">System Overview</h1>
              <p className="text-gray-500">
                Welcome back! Here's what's happening today.
              </p>
            </div>

            <a
              href="/admin/add-doctor"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add New Doctor
            </a>

          </div>

          {/* Stats */}

          <div className="grid md:grid-cols-3 gap-6 mb-10">

            <StatCard
              title="Total Doctors"
              value={stats.doctors}
              icon={<FaUserMd />}
              color="bg-indigo-100 text-indigo-600"
            />

            <StatCard
              title="Active Patients"
              value={stats.patients}
              icon={<FaProcedures />}
              color="bg-green-100 text-green-600"
            />

            <StatCard
              title="Appointments"
              value={stats.appointments}
              icon={<FaCalendarCheck />}
              color="bg-orange-100 text-orange-600"
            />

          </div>

          {/* Doctors Table */}

          <div className="bg-white p-6 rounded-xl shadow">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">Doctor Directory</h3>

              <button
                onClick={fetchDoctors}
                className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="text-gray-500 text-sm border-b">

                  <tr>
                    <th className="text-left py-3">Doctor</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">
                        No doctors found
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doc) => (
                      <tr key={doc._id} className="border-b hover:bg-gray-50">

                        <td className="py-4 flex items-center gap-3">

                          <img
                            className="w-9 h-9 rounded-lg"
                            src={`https://ui-avatars.com/api/?name=${doc.name}`}
                            alt={doc.name}
                          />

                          {doc.name}

                        </td>

                        <td>{doc.specialization || "General"}</td>

                        <td>{doc.email}</td>

                        <td>
                          {doc.experience
                            ? doc.experience + " Years"
                            : "New"}
                        </td>

                        <td>
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                            Active
                          </span>
                        </td>

                        <td>
                          <button
                            onClick={() => deleteDoctor(doc._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}