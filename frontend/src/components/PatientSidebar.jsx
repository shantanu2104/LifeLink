import { Link } from "react-router-dom";
import { FaHeartbeat, FaColumns, FaCalendarPlus, FaHistory, FaSignOutAlt } from "react-icons/fa";

export default function PatientSidebar() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="w-60 bg-slate-800 text-white flex flex-col p-6 min-h-screen">

      <div className="flex items-center gap-2 text-xl font-bold mb-10">
        <FaHeartbeat className="text-green-400" />
        LifeLink
      </div>

      <ul className="flex flex-col gap-2">

        <li>
          <Link
            to="/patient/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700"
          >
            <FaColumns /> Dashboard
          </Link>
        </li>

        <li className="bg-blue-600 rounded-lg">
          <Link
            to="/patient/book-appointment"
            className="flex items-center gap-3 p-3"
          >
            <FaCalendarPlus /> Book Appointment
          </Link>
        </li>

        <li>
          <Link
            to="/patient/history"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700"
          >
            <FaHistory /> History
          </Link>
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