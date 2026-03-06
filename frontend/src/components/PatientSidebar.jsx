import { NavLink } from "react-router-dom";
import { FaHeartbeat, FaColumns, FaCalendarPlus, FaHistory, FaSignOutAlt } from "react-icons/fa";

export default function PatientSidebar() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-700"
    }`;

  return (
    <aside className="w-60 bg-slate-800 text-white flex flex-col p-6 min-h-screen">

      <div className="flex items-center gap-2 text-xl font-bold mb-10">
        <FaHeartbeat className="text-green-400" />
        LifeLink
      </div>

      <ul className="flex flex-col gap-2">

        <li>
          <NavLink to="/patient/dashboard" className={linkClass}>
            <FaColumns /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/patient/book-appointment" className={linkClass}>
            <FaCalendarPlus /> Book Appointment
          </NavLink>
        </li>

       

      </ul>

      <button
        onClick={logout}
        className="flex items-center gap-3 text-red-400 mt-auto"
      >
        <FaSignOutAlt /> Logout
      </button>

    </aside>
  );
}