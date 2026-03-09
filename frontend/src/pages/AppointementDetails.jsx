import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AppointmentDetails(){

const { id } = useParams();
const navigate = useNavigate();

const [appointment,setAppointment] = useState({});
const [prescription,setPrescription] = useState("");
const [history,setHistory] = useState("");
const [nextDate,setNextDate] = useState("");

const token = localStorage.getItem("token");

useEffect(()=>{
loadAppointment();
},[]);

const loadAppointment = async()=>{

const res = await axios.get(
`${import.meta.env.VITE_URL}/api/appointments/${id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
);

setAppointment(res.data.data);

}

const saveRecord = async()=>{

await axios.put(
`${import.meta.env.VITE_URL}/api/appointments/record/${id}`,
{
prescription,
history,
nextAppointmentDate:nextDate
},
{
headers:{Authorization:`Bearer ${token}`}
}
);

alert("Record Saved");

navigate("/doctor/dashboard");

}

return(

<div className="min-h-screen bg-linear-to-br from-blue-50 to-green-100 flex items-center justify-center p-8">

<div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-8">

{/* HEADER */}

<h2 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-3">
Appointment Record
</h2>

{/* PATIENT INFO */}

<div className="mb-6">

<p className="text-lg font-semibold">
👤 Patient: {appointment?.patient?.name || "Loading..."}
</p>

<p className="text-gray-600">
📅 Appointment Date: {appointment?.appointmentDate && new Date(appointment.appointmentDate).toLocaleDateString()}
</p>

{appointment?.nextAppointmentDate && (

<p className="mt-2 text-green-600 font-semibold">
🟢 Next Visit: {new Date(appointment.nextAppointmentDate).toLocaleDateString()}
</p>

)}

</div>

{/* PRESCRIPTION */}

<div className="mb-5">

<label className="block font-semibold mb-1 text-gray-700">
Prescription
</label>

<textarea
placeholder="Write prescription for patient..."
className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
rows="3"
onChange={(e)=>setPrescription(e.target.value)}
/>

</div>

{/* DOCTOR NOTES */}

<div className="mb-5">

<label className="block font-semibold mb-1 text-gray-700">
Doctor Notes / History
</label>

<textarea
placeholder="Patient condition, diagnosis, notes..."
className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
rows="3"
onChange={(e)=>setHistory(e.target.value)}
/>

</div>

{/* NEXT APPOINTMENT */}

<div className="mb-6">

<label className="block font-semibold mb-1 text-gray-700">
Next Appointment Date
</label>

<input
type="date"
className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
onChange={(e)=>setNextDate(e.target.value)}
/>

</div>

{/* SAVE BUTTON */}

<button
onClick={saveRecord}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
>
Save Record
</button>

</div>

</div>

)

}