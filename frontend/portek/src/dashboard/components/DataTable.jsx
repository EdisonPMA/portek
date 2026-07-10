import { FaEdit, FaTrash } from "react-icons/fa";

function formatCell(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && value.length > 50) {
    return value.slice(0, 50) + "…";
  }
  return String(value);
}

export default function DataTable({ columns, rows, onEdit, onDelete, extraActions }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-portek-border bg-portek-card p-12 text-center">
        <p className="text-portek-muted">No records found. Create your first entry.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-portek-border bg-portek-card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-portek-border bg-portek-bg/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-portek-muted">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-portek-muted whitespace-nowrap"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-portek-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portek-border">
            {rows.map((row, idx) => (
              <tr key={row.id} className="hover:bg-portek-bg/30 transition-colors">
                <td className="px-4 py-3 text-portek-muted">{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-white/90 whitespace-nowrap max-w-[200px] truncate">
                    {formatCell(row[col])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {extraActions?.(row)}
                    <button
                      onClick={() => onEdit(row)}
                      className="p-2 rounded-lg text-portek-green hover:bg-portek-green/10 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-portek-border">
        {rows.map((row, idx) => (
          <div key={row.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-portek-muted text-xs">#{idx + 1}</span>
              <div className="flex items-center gap-2">
                {extraActions?.(row)}
                <button
                  onClick={() => onEdit(row)}
                  className="p-2 rounded-lg text-portek-green hover:bg-portek-green/10 transition-colors"
                  title="Edit"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {columns.slice(0, 3).map((col) => (
              <div key={col} className="flex items-start gap-2">
                <span className="text-portek-muted text-[10px] uppercase tracking-wide shrink-0 w-20 pt-0.5">
                  {col.replace(/_/g, " ")}
                </span>
                <span className="text-white/90 text-sm truncate flex-1">
                  {formatCell(row[col])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
