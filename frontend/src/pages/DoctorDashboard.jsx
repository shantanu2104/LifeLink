import { useEffect, useState } from "react";

const API = "http://localhost:5002/api";

export default function DoctorDashboard() {

  const [appointments,setAppointments] = useState([]);
  const [doctor,setDoctor] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    setDoctor(user);

    loadAppointments(user);
  },[]);


  const loadAppointments = async(user)=>{

    try{

      const res = await fetch(`${API}/appointments`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      const data = await res.json();

      if(data.data){

        const myApps = data.data.filter(
          a => a.doctor && (a.doctor._id === user.id || a.doctor._id === user._id)
        );

        setAppointments(myApps);
      }

    }catch(err){
      console.log(err);
    }
  };


  if(!doctor) return <div className="p-10 text-white">Loading...</div>;

  return (

    <div className="flex min-h-screen bg-slate-900 text-white">

      {/* SIDEBAR */}

      <div className="w-64 bg-slate-950 p-6 flex flex-col">

        <h1 className="text-2xl font-bold text-yellow-400 mb-10">
          LifeLink
        </h1>

        <div className="space-y-3">

          <div className="bg-yellow-400 text-black p-3 rounded font-semibold">
            Dashboard
          </div>

          <div className="text-gray-400 p-3 rounded hover:bg-slate-800 cursor-pointer">
            Edit Profile
          </div>

        </div>

        <button
        className="mt-auto text-red-400"
        onClick={()=>{
          localStorage.clear();
          window.location.href="/login";
        }}
        >
        Logout
        </button>

      </div>


      {/* MAIN */}

      <div className="flex-1 p-10">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <h2 className="text-3xl font-bold text-yellow-400">
              Doctor Dashboard
            </h2>

            <p className="text-gray-400">
              Overview & Statistics
            </p>

          </div>

          <div>
            {new Date().toDateString()}
          </div>

        </div>


        {/* DOCTOR PROFILE */}

        <div className="bg-linear-to-r from-slate-800 to-slate-900 border border-yellow-400 p-6 rounded-xl flex items-center gap-6 mb-10">

          <img
          className="w-20 h-20 rounded-full border-2 border-yellow-400"
          src={`https://ui-avatars.com/api/?name=${doctor.name}&background=D4AF37&color=fff`}
          />

          <div>

            <h1 className="text-xl font-bold">
              {doctor.name}
            </h1>

            <div className="text-yellow-400 text-sm">
              {doctor.specialization || "General Physician"}
            </div>

            <div className="text-gray-400 text-sm">
              {doctor.email}
            </div>

          </div>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-2 gap-6 mb-10">

          <div className="bg-white text-black p-6 rounded">

            <h1 className="text-3xl font-bold">
              {appointments.length}
            </h1>

            <p>Pending Requests</p>

          </div>

          <div className="bg-white text-black p-6 rounded">

            <h1 className="text-3xl font-bold">
              {appointments.length}
            </h1>

            <p>Total Patients</p>

          </div>

        </div>


        {/* REQUEST LIST */}

        <h3 className="text-yellow-400 text-xl mb-4">
          Patient Appointment Requests
        </h3>

        <div className="bg-white text-black rounded">

          {appointments.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No requests found
            </div>
          )}

          {appointments.map(app=>{

            const patient = app.patient?.name || "Unknown";

            const date = new Date(app.appointmentDate)
            .toLocaleString();

            return(

              <div
              key={app._id}
              className="flex justify-between items-center p-4 border-b"
              >

                <div className="flex items-center gap-4">

                  <img
                  className="w-10 h-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${patient}`}
                  />

                  <div>

                    <div className="font-semibold">
                      {patient}
                    </div>

                    <div className="text-sm text-gray-500">
                      Reason: {app.reason}
                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-yellow-600 font-semibold">
                    {date}
                  </div>

                  <div className="flex gap-2 mt-1">

                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                      Accept
                    </button>

                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                      Decline
                    </button>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}