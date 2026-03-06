export default function StatCard({ icon, title, value, color }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition">

      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>

      <div className={`text-2xl p-4 rounded-lg ${color}`}>
        {icon}
      </div>

    </div>
  );
}