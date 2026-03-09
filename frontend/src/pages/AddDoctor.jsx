import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { FaUser, FaStethoscope, FaEnvelope, FaLock, FaPhone, FaBriefcase } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function AddDoctor() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    password: "",
    phone: "",
    experience: 0
  });
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `${import.meta.env.VITE_URL}/api/doctors`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success("Doctor successfully onboarded!");
       
      setForm({
        name: "",
        specialization: "",
        email: "",
        password: "",
        phone: "",
        experience: 0,
      });
    } else {
      toast.error(data.message || "Failed to add doctor");
    }
   navigate("/admin/dashboard")
  } catch (error) {
    toast.error("Server connection failed",error);
  }
};

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <AdminSidebar />

      <div className="flex-1 p-10">

        <div className="flex justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold">Onboard New Doctor</h2>
            <p className="text-gray-500 text-sm">
              Create a new profile for medical staff
            </p>
          </div>
        </div>

        <div className="max-w-3xl bg-white p-10 rounded-2xl shadow-lg">

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

            <Input
              icon={<FaUser />}
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              icon={<FaStethoscope />}
              label="Specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />

            <Input
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              icon={<FaLock />}
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <Input
              icon={<FaPhone />}
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              icon={<FaBriefcase />}
              label="Experience (Years)"
              name="experience"
              type="number"
              value={form.experience}
              onChange={handleChange}
            />

            <button className="col-span-2 bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 font-semibold">
              Create Doctor Account
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

function Input({ icon, label, ...props }) {
  return (
    <div className="flex flex-col relative">

      <label className="text-sm text-gray-500 mb-1">{label}</label>

      <input
        {...props}
        className="bg-slate-100 p-4 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <div className="absolute right-4 top-10 text-gray-400">
        {icon}
      </div>

    </div>
  );
}