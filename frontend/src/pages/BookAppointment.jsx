import { useEffect, useState } from "react";
import axios from "axios";
import PatientSidebar from "../components/PatientSidebar";
import { toast } from "react-toastify";

export default function BookAppointment(){

const [doctors,setDoctors] = useState([]);

const [form,setForm] = useState({
doctor:"",
date:"",
reason:""
});

const [slots,setSlots] = useState([]);
const [bookedSlots,setBookedSlots] = useState([]);
const [pendingSlots,setPendingSlots] = useState([]);
const [selectedSlot,setSelectedSlot] = useState("");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));


// ================= LOAD DOCTORS =================
useEffect(()=>{
loadDoctors();
},[]);

const loadDoctors = async()=>{

try{

const res = await axios.get("http://localhost:5002/api/doctors");

setDoctors(res.data.data || []);

}catch(err){

toast.error("Failed to load doctors",err);

}

};


// ================= GENERATE TIME SLOTS =================

const generateSlots = ()=>{

const slotList = [];

const createSlots=(start,end)=>{

let time = new Date();
time.setHours(start,0,0);

const endTime = new Date();
endTime.setHours(end,0,0);

while(time < endTime){

slotList.push(

time.toLocaleTimeString("en-US",{
hour:"2-digit",
minute:"2-digit",
hour12:true
})

);

time = new Date(time.getTime()+20*60000);

}

};

createSlots(10,13); // 10AM-1PM
createSlots(14,17); // 2PM-5PM

setSlots(slotList);

};


// ================= LOAD BOOKED + PENDING SLOTS =================

const loadBookedSlots = async()=>{

if(!form.doctor || !form.date) return;

try{

const res = await axios.get(
"http://localhost:5002/api/appointments/slots",
{
params:{
doctorId:form.doctor,
date:form.date
}
}
);

setBookedSlots(res.data.bookedSlots || []);
setPendingSlots(res.data.pendingSlots || []);

}catch(err){

console.log(err);

}

};


// ================= AUTO LOAD SLOTS =================

useEffect(()=>{

if(form.doctor && form.date){

generateSlots();
loadBookedSlots();

}

},[form.doctor,form.date]);


// ================= SUBMIT BOOKING =================

const handleSubmit = async (e)=>{

e.preventDefault();

if(!selectedSlot){

toast.error("Please select a slot");
return;

}

try{

const time = new Date(`1970-01-01 ${selectedSlot}`);

const appointmentDate = new Date(form.date);

appointmentDate.setHours(time.getHours());
appointmentDate.setMinutes(time.getMinutes());

await axios.post(
"http://localhost:5002/api/appointments",
{
doctor:form.doctor,
patient:user?._id || user?.id,
appointmentDate,
reason:form.reason
},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

toast.success("Appointment request sent");

setTimeout(()=>{
window.location.href="/patient/dashboard";
},1500);

}catch(err){

console.log(err.response?.data);

toast.error(err.response?.data?.message || "Booking failed");

}

};


// ================= DEBUG =================

console.log("Slots:",slots);
console.log("Booked:",bookedSlots);
console.log("Pending:",pendingSlots);


// ================= UI =================

return(

<div className="flex bg-gray-100 min-h-screen">

<PatientSidebar/>

<div className="flex-1 p-10">

<div className="flex justify-between mb-8">

<div>

<h2 className="text-2xl font-bold">
Book Your Appointment
</h2>

<p className="text-gray-500">
Choose doctor and time slot
</p>

</div>

<a
href="/patient/dashboard"
className="text-blue-600 font-medium"
>
← Back
</a>

</div>


<div className="bg-white max-w-3xl mx-auto p-8 rounded-xl shadow">

<form onSubmit={handleSubmit} className="space-y-6">


{/* DOCTOR */}

<div>

<label className="block mb-2 font-medium">
Choose Doctor
</label>

<select
value={form.doctor}
onChange={(e)=>setForm({...form,doctor:e.target.value})}
required
className="w-full p-3 border rounded-lg"
>

<option value="">Select Doctor</option>

{doctors.map(doc=>(

<option key={doc._id} value={doc._id}>
Dr. {doc.name} ({doc.specialization})
</option>

))}

</select>

</div>


{/* DATE */}

<div>

<label className="block mb-2 font-medium">
Select Date
</label>

<input
type="date"
value={form.date}
onChange={(e)=>setForm({...form,date:e.target.value})}
required
className="w-full p-3 border rounded-lg"
/>

</div>


{/* SLOT LEGEND */}

<div className="flex gap-6 text-sm">

<span className="flex items-center gap-2">
<div className="w-4 h-4 bg-green-500 rounded"></div>
Available
</span>

<span className="flex items-center gap-2">
<div className="w-4 h-4 bg-yellow-400 rounded"></div>
Pending
</span>

<span className="flex items-center gap-2">
<div className="w-4 h-4 bg-red-500 rounded"></div>
Booked
</span>

</div>


{/* SLOTS */}

{slots.length > 0 && (

<div>

<label className="block mb-3 font-medium">
Available Slots
</label>

<div className="grid grid-cols-4 gap-3">

{slots.map((slot,i)=>{

const normalizedSlot = slot.toUpperCase();

const isBooked = bookedSlots
.map(s => s.toUpperCase())
.includes(normalizedSlot);

const isPending = pendingSlots
.map(s => s.toUpperCase())
.includes(normalizedSlot);
return(

<button
key={i}
type="button"
disabled={isBooked || isPending}
onClick={()=>setSelectedSlot(slot)}
className={`p-3 rounded-lg border text-sm font-semibold

${isBooked
? "bg-red-500 text-white cursor-not-allowed"
: isPending
? "bg-yellow-400 text-black cursor-not-allowed"
: selectedSlot===slot
? "bg-green-600 text-white"
: "border-green-500 text-green-600 hover:bg-green-50"}

`}
>

{slot}

</button>

);

})}

</div>

</div>

)}


{/* REASON */}

<div>

<label className="block mb-2 font-medium">
Reason
</label>

<textarea
rows="4"
value={form.reason}
onChange={(e)=>setForm({...form,reason:e.target.value})}
required
className="w-full p-3 border rounded-lg"
/>

</div>


<button
type="submit"
className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
>

Request Appointment

</button>

</form>

</div>

</div>

</div>

);

}