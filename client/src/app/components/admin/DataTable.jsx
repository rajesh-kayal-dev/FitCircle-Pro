import { Search, Filter, MoreHorizontal } from "lucide-react";
import React from "react";

export function DataTable({
  columns,
  data,
  title,
  description,
  actions,
  onSearch,
  onFilter
}) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-brand-text tracking-tight">{title}</h2>
          {description && <p className="text-sm font-medium text-brand-muted mt-1">{description}</p>}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full sm:w-[240px] shadow-sm"
            />
          </div>
          <button
            onClick={onFilter}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-brand-text hover:bg-gray-50 hover:border-brand-orange/30 transition-all shadow-sm"
          >
            <Filter size={16} className="text-brand-muted" />
            <span>Filter</span>
          </button>
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 min-w-max">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 md:px-8 py-5 text-xs font-black text-brand-muted uppercase tracking-widest whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 md:px-8 py-5 text-right text-xs font-black text-brand-muted uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-brand-orange/5 transition-colors group">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-6 md:px-8 py-4 text-sm font-medium text-brand-text whitespace-nowrap ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                <td className="px-6 md:px-8 py-4 text-right">
                  <div className="flex justify-end">
                    <button className="p-2 text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-xl transition-colors shrink-0">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-16 bg-gray-50/50">
          <p className="text-brand-text font-black text-lg">No Results Found</p>
          <p className="text-brand-muted font-medium text-sm mt-1">Try adjusting your filters or search query.</p>
        </div>
      )}

      <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <p className="text-sm font-bold text-brand-muted">
          Showing <span className="font-black text-brand-text">{data.length}</span> results
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-brand-text hover:border-brand-orange/30 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-brand-text hover:border-brand-orange/30 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
