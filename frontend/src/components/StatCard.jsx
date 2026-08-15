export default function StatCard({ icon, title, value, color }) {
  return (
    <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight block">
          {value !== undefined && value !== null ? value : 0}
        </span>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}