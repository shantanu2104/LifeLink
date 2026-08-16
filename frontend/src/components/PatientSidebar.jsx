import { NavLink } from "react-router-dom";
import { FaHeartbeat, FaHome, FaColumns, FaUserMd, FaCalendarPlus, FaCalendarAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function PatientSidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 h-screen sticky top-0 border-r border-slate-800 shadow-xl z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-1 mb-8">
        <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-xl text-white shadow-md shadow-blue-500/30">
          <FaHeartbeat className="text-xl" />
        </div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            LifeLink
          </span>
          <span className="block text-[10px] font-semibold tracking-wider text-teal-400 uppercase">
            Patient Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1.5">
          <li>
            <NavLink to="/" className={linkClass}>
              <FaHome className="text-lg" />
              <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/patient/dashboard" className={linkClass}>
              <FaColumns className="text-lg" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/patient/book-appointment" className={linkClass}>
              <FaUserMd className="text-lg" />
              <span>Doctors & Departments</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/patient/book-appointment" className={linkClass}>
              <FaCalendarPlus className="text-lg" />
              <span>Book Appointment</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/patient/dashboard" className={linkClass}>
              <FaCalendarAlt className="text-lg" />
              <span>My Appointments</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}