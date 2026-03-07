import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {

  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  // ================= LOAD APPOINTMENTS =================

  const loadAppointments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5002/api/appointments",
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
      console.error("Error loading appointments", err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // ================= CANCEL APPOINTMENT =================

  const cancelAppointment = async (id) => {

    const confirmCancel = window.confirm("Cancel this appointment?");
    if (!confirmCancel) return;

    try {

      await axios.delete(
        `http://localhost:5002/api/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAppointments(appointments.filter(app => app._id !== id));

    } catch (err) {
      console.error("Error cancelling appointment", err);
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      <PatientSidebar />

      <div className="flex-1 flex flex-col">

        {/* Topbar */}

        <div className="bg-white border-b px-8 py-4 flex justify-between items-center">

          <div className="text-gray-500 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })}
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right">
              <div className="font-semibold">
                {user?.name}
              </div>

              <div className="text-sm text-gray-500">
                Patient Account
              </div>
            </div>

            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}`}
              className="w-10 h-10 rounded-full"
            />

          </div>

        </div>

        <div className="p-8 max-w-5xl mx-auto w-full">

          {/* Welcome Banner */}

          <div className="bg-green-600 text-white p-8 rounded-xl mb-8 shadow">

            <h1 className="text-2xl font-bold mb-2">
              Hello, {user?.name?.split(" ")[0]}!
            </h1>

            <p className="opacity-90 mb-4">
              Take control of your health. View prescriptions and upcoming visits.
            </p>

            <button
              onClick={() => navigate("/patient/book-appointment")}
              className="bg-white text-green-700 px-4 py-2 rounded font-semibold"
            >
              Book New Appointment
            </button>

          </div>

          {/* Appointments */}

          <h3 className="text-xl font-semibold mb-6">
            Your Scheduled Visits
          </h3>

          {appointments.length === 0 ? (

            <div className="bg-white p-10 rounded-xl text-center text-gray-400">
              <p>You have no upcoming appointments.</p>
            </div>

          ) : (

            appointments.map((app, i) => {

              const doctor = app.doctor?.name || "Assigned Doctor";
              const specialization = app.doctor?.specialization || "General";

              const date = new Date(app.appointmentDate).toLocaleDateString();

              const time = new Date(app.appointmentDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (

                <div
                  key={i}
                  className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow mb-4"
                >

                  <div className="flex justify-between items-center">

                    <div className="flex items-center gap-4">

                      <img
                        src={`https://ui-avatars.com/api/?name=${doctor}`}
                        className="w-12 h-12 rounded-full"
                      />

                      <div>

                        <div className="font-semibold">
                          Dr. {doctor}
                        </div>

                        <div className="text-sm text-gray-500">
                          {specialization} • {app.reason}
                        </div>

                      </div>

                    </div>

                    <div className="text-right flex flex-col items-end gap-2">

                      <div className="font-semibold text-green-600">
                        {date}
                      </div>

                      <div className="text-sm text-gray-500">
                        {time}
                      </div>

                      <div
                        className={`text-sm font-semibold px-3 py-1 rounded 
                          ${app.status === "accepted" ? "bg-green-100 text-green-700" : ""}
                          ${app.status === "declined" ? "bg-red-100 text-red-700" : ""}
                          ${app.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                        `}
                      >
                        {app.status || "pending"}
                      </div>

                      {app.status === "pending" && (

                        <button
                          onClick={() => cancelAppointment(app._id)}
                          className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>

                      )}

                    </div>

                  </div>

                  {/* MEDICAL RECORD SECTION */}

                  {(app.prescription || app.history || app.nextAppointmentDate) && (

                    <div className="mt-4 border-t pt-4 text-sm">

                      {app.prescription && (
                        <div className="mb-2">
                          <span className="font-semibold">Prescription:</span> {app.prescription}
                        </div>
                      )}

                      {app.history && (
                        <div className="mb-2">
                          <span className="font-semibold">Doctor Notes:</span> {app.history}
                        </div>
                      )}

                      {app.nextAppointmentDate && (
                        <div className="font-semibold text-green-600">
                          Next Visit: {new Date(app.nextAppointmentDate).toLocaleDateString()}
                        </div>
                      )}

                    </div>

                  )}

                </div>

              );
            })

          )}

        </div>

      </div>

    </div>

  );
}