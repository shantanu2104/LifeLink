import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5002/api";

export default function EditDoctorProfile() {
   const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    experience: ""
  });

  const [loading, setLoading] = useState(false);

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

      const res = await axios.put(
        `${API}/doctors/${user.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {

        alert("Profile updated successfully");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            ...res.data.data
          })
        );
        navigate("/doctor/dashboard")
      }
     
    } catch (error) {

      console.log(error);
      alert(error.response?.data?.message || "Update failed");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-slate-900 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-96 space-y-4 shadow-lg"
      >

        <h2 className="text-2xl font-bold text-center">
          Edit Doctor Profile
        </h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Doctor Name"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Email"
          required
        />

        <input
          type="text"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Specialization"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
        />

        <input
          type="number"
          name="experience"
          value={form.experience}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Years of Experience"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 w-full py-2 rounded font-semibold"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </form>

    </div>
  );
}