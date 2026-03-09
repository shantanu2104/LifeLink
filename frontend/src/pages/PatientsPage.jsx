import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function PatientsPage() {

  const [patients, setPatients] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPatients(res.data.data || []);

    } catch (err) {
      console.error("Failed to load patients", err);
    }
  };

  return (

    <div className="flex bg-slate-100 min-h-screen">

      <AdminSidebar />

      <div className="flex-1 flex flex-col">

        <AdminTopbar />

        <div className="p-10">

          {/* Page Header */}

          <div className="flex justify-between items-end mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                Registered Patients
              </h2>

              <p className="text-gray-500">
                View and manage all patient records
              </p>
            </div>

            <button
              onClick={loadPatients}
              className="border px-4 py-2 rounded-lg text-indigo-600 hover:bg-gray-50"
            >
              Refresh List
            </button>

          </div>

          {/* Table */}

          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

            <table className="w-full">

              <thead className="text-gray-500 text-sm border-b">

                <tr>
                  <th className="text-left py-3">Patient Profile</th>
                  <th>Contact Email</th>
                  <th>Date Joined</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {patients.length === 0 ? (

                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400">
                      No patients registered yet
                    </td>
                  </tr>

                ) : (

                  patients.map((patient, i) => {

                    const joinedDate = patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString()
                      : "N/A";

                    return (

                      <tr key={i} className="border-b hover:bg-gray-50">

                        {/* Profile */}

                        <td className="py-4">

                          <div className="flex items-center gap-3">

                            <img
                              className="w-10 h-10 rounded-lg"
                              src={`https://ui-avatars.com/api/?name=${patient.name}`}
                            />

                            <div>
                              <div className="font-semibold">
                                {patient.name}
                              </div>

                              <div className="text-sm text-gray-500">
                                #ID-{Math.floor(Math.random()*10000)}
                              </div>
                            </div>

                          </div>

                        </td>

                        {/* Email */}

                        <td>{patient.email}</td>

                        {/* Joined */}

                        <td>{joinedDate}</td>

                        {/* Role */}

                        <td>

                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {patient.role || "Patient"}
                          </span>

                        </td>

                        {/* Actions */}

                        <td>

                          <button className="text-gray-400 hover:text-gray-700">
                            ⋮
                          </button>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );
}