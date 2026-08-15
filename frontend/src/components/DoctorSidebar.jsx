import { NavLink } from "react-router-dom";
import { FaHeartbeat, FaColumns, FaUserEdit, FaSignOutAlt } from "react-icons/fa";

export default function DoctorSidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 h-screen sticky top-0 border-r border-slate-800 shadow-xl z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-1 mb-8">
        <div className="p-2.5 bg-gradient-to-tr from-teal-500 to-blue-600 rounded-xl text-white shadow-md shadow-teal-500/30">
          <FaHeartbeat className="text-xl" />
        </div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
            LifeLink
          </span>
          <span className="block text-[10px] font-semibold tracking-wider text-teal-400 uppercase">
            Doctor Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-1.5">
          <li>
            <NavLink to="/doctor/dashboard" className={linkClass}>
              <FaColumns className="text-lg" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctor/edit-profile" className={linkClass}>
              <FaUserEdit className="text-lg" />
              <span>Edit Profile</span>
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
