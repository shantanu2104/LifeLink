import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
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

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5002/api/auth/register",
        form
      );

      const data = res.data;

      if (data.success) {

        toast.success("Account created successfully!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {

          if (form.role === "admin")
            navigate("/admin/dashboard");

          else if (form.role === "doctor")
            navigate("/doctor/dashboard");

          else
            navigate("/patient/dashboard");

        }, 1500);

      } else {
        toast.error(data.message || "Registration failed");
      }

    } catch (err) {

      console.error(err);
      toast.error("Server connection failed");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800">

      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl w-105 shadow-2xl border border-yellow-500/30">

        <div className="text-center mb-8">

          <div className="text-4xl text-yellow-500 mb-4">
            ❤
          </div>

          <h2 className="text-2xl font-bold mb-1">
            Create Account
          </h2>

          <p className="text-gray-500 text-sm">
            Join LifeLink and manage your health journey
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              minLength="6"
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              I am a...
            </label>

            <select
              name="role"
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 rounded-lg border"
            >
              <option value="">Select Role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Creating Account..." : "Get Started"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-600 font-semibold cursor-pointer"
          >
            Sign In
          </span>
        </p>

      </div>

    </div>
  );
}