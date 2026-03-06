import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function Appointments() {

  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5002/api/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(res.data.data || []);

    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  const getStatusColor = (status) => {

    if (status === "Completed")
      return "bg-green-100 text-green-600";

    if (status === "Cancelled")
      return "bg-red-100 text-red-600";

    return "bg-indigo-100 text-indigo-600";
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
              <h2 className="text-2xl font-bold">All Appointments</h2>
              <p className="text-gray-500">
                View and manage scheduled patient visits
              </p>
            </div>

            <button
              onClick={loadAppointments}
              className="border px-4 py-2 rounded-lg text-indigo-600 hover:bg-gray-50"
            >
              Refresh Data
            </button>

          </div>

          {/* Table */}

          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

            <table className="w-full">

              <thead className="text-gray-500 text-sm border-b">

                <tr>
                  <th className="text-left py-3">Date & Time</th>
                  <th>Doctor</th>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((app, i) => {

                    const docName = app.doctor?.name || "Unknown";
                    const docSpec = app.doctor?.specialization || "General";

                    const patName = app.patient?.name || "Unknown";
                    const patEmail = app.patient?.email || "No Email";

                    const dateObj = new Date(app.appointmentDate);
                    const date = dateObj.toLocaleDateString();
                    const time = dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    const status = app.status || "Scheduled";

                    return (
                      <tr key={i} className="border-b hover:bg-gray-50">

                        {/* Date */}

                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{date}</span>
                            <span className="text-sm text-gray-500">
                              {time}
                            </span>
                          </div>
                        </td>

                        {/* Doctor */}

                        <td>

                          <div className="flex items-center gap-3">

                            <img
                              className="w-9 h-9 rounded-lg"
                              src={`https://ui-avatars.com/api/?name=${docName}`}
                            />

                            <div>
                              <div className="font-semibold">
                                Dr. {docName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {docSpec}
                              </div>
                            </div>

                          </div>

                        </td>

                        {/* Patient */}

                        <td>

                          <div className="flex items-center gap-3">

                            <img
                              className="w-9 h-9 rounded-lg"
                              src={`https://ui-avatars.com/api/?name=${patName}`}
                            />

                            <div>
                              <div className="font-semibold">{patName}</div>
                              <div className="text-sm text-gray-500">
                                {patEmail}
                              </div>
                            </div>

                          </div>

                        </td>

                        {/* Status */}

                        <td>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </td>

                        {/* Action */}

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