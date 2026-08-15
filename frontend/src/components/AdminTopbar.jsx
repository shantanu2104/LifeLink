import { FaCalendarAlt } from "react-icons/fa";

export default function AdminTopbar() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Administrator" };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-100/80 px-3 py-1.5 rounded-lg">
        <FaCalendarAlt className="text-indigo-500 text-sm" />
        <span>{today}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-bold text-sm text-slate-800 leading-tight">{user.name}</p>
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
            {user.role ? user.role : "Administrator"}
          </p>
        </div>

        <div className="relative">
          <img
            className="w-10 h-10 rounded-xl ring-2 ring-indigo-500/20 object-cover shadow-sm"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&bold=true`}
            alt={user.name}
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
      </div>
    </header>
  );
}