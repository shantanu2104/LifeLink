import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import { FaUser, FaEnvelope, FaStethoscope, FaPhone, FaBriefcase, FaUserEdit, FaArrowLeft, FaBars } from "react-icons/fa";
import { toast } from "react-toastify";

const API = `${import.meta.env.VITE_URL}/api`;

export default function EditDoctorProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    experience: ""
  });

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        specialization: user.specialization || "",
        phone: user.phone || "",
        experience: user.experience || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const doctorId = user.id || user._id;

      const res = await axios.put(
        `${API}/doctors/${doctorId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            ...res.data.data
          })
        );
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-10 flex items-center bg-white/80 backdrop-blur-md px-4 py-4 border-b border-slate-200/80 shadow-xs">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
          >
            <FaBars className="text-lg" />
          </button>
        </header>

        <main className="p-8 lg:p-10 space-y-8 max-w-3xl w-full mx-auto my-auto">
          <div>
            <Link
              to="/doctor/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-800 transition mb-2"
            >
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Professional Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Update your medical specialization, contact details, and credentials.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                <FaUserEdit className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Doctor Information</h3>
                <p className="text-xs text-slate-500">Changes will be updated across patient booking profiles</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                icon={<FaUser />}
                label="Doctor Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <InputField
                icon={<FaEnvelope />}
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <InputField
                icon={<FaStethoscope />}
                label="Specialization"
                name="specialization"
                placeholder="e.g. Cardiology, Pediatrics"
                value={form.specialization}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  icon={<FaPhone />}
                  label="Phone Number"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                />

                <InputField
                  icon={<FaBriefcase />}
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  placeholder="5"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                <Link
                  to="/doctor/dashboard"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

function InputField({ icon, label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          {icon}
        </div>
        <input
          {...props}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition"
        />
      </div>
    </div>
  );
}