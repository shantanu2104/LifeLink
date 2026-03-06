import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import { toast } from "react-toastify";

export default function BookAppointment() {

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor: "",
    appointmentDate: "",
    reason: ""
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/doctors");
      setDoctors(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load doctors");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const bookingData = {
        doctor: form.doctor,
        patient: user?._id || user?.id,
        appointmentDate: form.appointmentDate,
        reason: form.reason
      };

      const res = await axios.post(
        "http://localhost:5002/api/appointments",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Appointment Booked Successfully");

      setTimeout(() => {
        window.location.href = "/patient/dashboard";
      }, 1500);

    } catch (err) {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <PatientSidebar />

      <div className="flex-1 p-10">

        <div className="flex justify-between mb-8">

          <div>
            <h2 className="text-2xl font-bold">
              Book Your Appointment
            </h2>
            <p className="text-gray-500">
              Schedule a visit with our specialists
            </p>
          </div>

          <a
            href="/patient/dashboard"
            className="text-blue-600 font-medium"
          >
            ← Back to Dashboard
          </a>

        </div>

        <div className="bg-white max-w-xl mx-auto p-8 rounded-xl shadow">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Doctor Select */}

            <div>
              <label className="block mb-2 font-medium">
                Choose Your Specialist
              </label>

              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Doctor</option>

                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} ({doc.specialization || "General"})
                  </option>
                ))}

              </select>
            </div>

            {/* Date */}

            <div>
              <label className="block mb-2 font-medium">
                Preferred Date
              </label>

              <input
                type="datetime-local"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Reason */}

            <div>
              <label className="block mb-2 font-medium">
                Reason for Visit
              </label>

              <textarea
                rows="4"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms briefly..."
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Confirm Appointment
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}