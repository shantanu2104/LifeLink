import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { FaUser, FaStethoscope, FaEnvelope, FaLock, FaPhone, FaBriefcase, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
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
        toast.success("Doctor account onboarded successfully!");
        setForm({
          name: "",
          specialization: "",
          email: "",
          password: "",
          phone: "",
          experience: 0,
        });
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-8 lg:p-10 space-y-8 max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition mb-2"
              >
                <FaArrowLeft /> Back to Dashboard
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Onboard New Doctor
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Create medical staff credentials and professional profile.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <FaUserPlus className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Staff Details</h3>
                <p className="text-xs text-slate-500">Provide personal & medical credentials</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                icon={<FaUser />}
                label="Full Doctor Name *"
                name="name"
                placeholder="Dr. Alexander Wright"
                value={form.name}
                onChange={handleChange}
                required
              />

              <InputField
                icon={<FaStethoscope />}
                label="Specialization"
                name="specialization"
                placeholder="e.g. Cardiology, Neurology"
                value={form.specialization}
                onChange={handleChange}
                
              />

              <InputField
                icon={<FaEnvelope />}
                label="Email Address *"
                name="email"
                type="email"
                placeholder="doctor@lifelink.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <InputField
                icon={<FaLock />}
                label="Password *"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />

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
                min="0"
                placeholder="8"
                value={form.experience}
                onChange={handleChange}
              />

              <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-end gap-4">
                <Link
                  to="/admin/dashboard"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Create Doctor Profile</span>
                    </>
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
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          {icon}
        </div>
        <input
          {...props}
          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition"
        />
      </div>
    </div>
  );
}