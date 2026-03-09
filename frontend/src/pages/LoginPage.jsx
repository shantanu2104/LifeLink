import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){

  const navigate = useNavigate();

  const [form,setForm] = useState({
    email:"",
    password:""
  });

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
       console.log(`${import.meta.env.VITE_VITE_URL}`);
      const res = await axios.post(
        `${import.meta.env.VITE_VITE_URL}/api/auth/login`,
        form
      );

      const {user,token} = res.data;

      localStorage.setItem("user",JSON.stringify(user));
      localStorage.setItem("token",token);

      toast.success("Login Successful");

      if(user.role === "admin") navigate("/admin/dashboard");
      if(user.role === "doctor") navigate("/doctor/dashboard");
      if(user.role === "patient") navigate("/patient/dashboard");

    }catch (err) {

  console.log("LOGIN ERROR:", err);

  if (err.response) {
    toast.error(err.response.data.message);
  } 
  else if (err.request) {
    toast.error("Server not responding");
  } 
  else {
    toast.error("Login failed");
  }

}
  };

  return(

    <div className="flex items-center justify-center h-screen bg-slate-900">

      <div className="bg-white p-10 rounded-xl w-100">

        <h2 className="text-2xl font-bold mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <button className="w-full bg-yellow-500 py-3 rounded font-semibold">
            Sign In
          </button>

        </form>
       <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-yellow-600 font-semibold cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>

    </div>
  );
}