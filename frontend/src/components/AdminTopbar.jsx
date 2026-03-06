export default function AdminTopbar() {

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div className="flex justify-between items-center bg-white/70 backdrop-blur p-4 border-b">

      <div className="text-gray-500 text-sm">
        {today}
      </div>

      <div className="flex items-center gap-3 bg-white px-4 py-1 rounded-full shadow">

        <div className="text-right">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-emerald-500">Administrator</p>
        </div>

        <img
          className="w-9 h-9 rounded-full"
          src={`https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff`}
        />

      </div>

    </div>
  );
}