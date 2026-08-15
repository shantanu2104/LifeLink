export function TableSkeleton({ rows = 4, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIndex) => (
        <tr key={rIndex} className="animate-pulse border-b border-slate-100">
          {Array.from({ length: cols }).map((_, cIndex) => (
            <td key={cIndex} className="py-4 px-3">
              <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse flex justify-between items-center">
      <div className="space-y-3 flex-1 pr-4">
        <div className="h-8 bg-slate-200 rounded-md w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
      </div>
      <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
    </div>
  );
}
