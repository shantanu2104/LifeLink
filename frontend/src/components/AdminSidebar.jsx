import { NavLink } from "react-router-dom";
import { FaHeartbeat, FaChartPie, FaUserMd, FaUserInjured, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass =
    "flex items-center gap-3 p-3 rounded-lg";

  const activeClass =
    "bg-indigo-600 text-white";

  const inactiveClass =
    "text-gray-300 hover:bg-slate-800";

  return (
    <aside className="w-65 bg-slate-900 text-white flex flex-col p-6 h-screen sticky top-0">

      <div className="flex items-center gap-2 text-xl font-bold mb-10">
        <FaHeartbeat className="text-emerald-400"/>
        LifeLink
      </div>

      <ul className="flex flex-col gap-2">

        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaChartPie/>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/add-doctor"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaUserMd/>
            Add-Doctors
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/patients"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaUserInjured/>
            Patients
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/appointments"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaCalendarAlt/>
            Appointments
          </NavLink>
        </li>

      </ul>

      <button
        onClick={logout}
        className="flex items-center gap-3 text-red-400 mt-auto"
      >
        <FaSignOutAlt/>
        Logout
      </button>

    </aside>
  );
}