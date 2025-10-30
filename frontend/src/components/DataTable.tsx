type Col<T> = { header: string; render: (row: T) => React.ReactNode; width?: string };

export default function DataTable<T>({ rows, columns }: { rows: T[]; columns: Col<T>[] }) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c,i)=><th key={i} className="text-left px-3 py-2" style={{width:c.width}}>{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,ri)=>(
            <tr key={ri} className="border-t">
              {columns.map((c,ci)=><td key={ci} className="px-3 py-2">{c.render(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
