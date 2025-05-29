// components/FilterControls.js
import React from "react";

const FilterControls = ({
  filterState,
  allPossibleStatuses,
  onDateChange,
  onStatusChange,
  onClearFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Filtro de Data */}
      <div className="flex items-center bg-zinc-800 p-3 rounded-md shadow-md">
        <label
          htmlFor="date-filter"
          className="text-white text-md font-semibold mr-3 whitespace-nowrap"
        >
          Data:
        </label>
        <input
          type="date"
          id="date-filter"
          value={filterState.date}
          onChange={onDateChange}
          className="px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filterState.date && (
          <button
            onClick={() => onClearFilter("date")}
            className="ml-4 px-3 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition whitespace-nowrap"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Filtro de Status */}
      <div className="flex items-center bg-zinc-800 p-3 rounded-md shadow-md">
        <label
          htmlFor="status-filter"
          className="text-white text-md font-semibold mr-3 whitespace-nowrap"
        >
          Status:
        </label>
        <select
          id="status-filter"
          value={filterState.status}
          onChange={onStatusChange}
          className="px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="">Todos</option>
          {allPossibleStatuses.map(
            (status) =>
              status && (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              )
          )}
        </select>
        {filterState.status && (
          <button
            onClick={() => onClearFilter("status")}
            className="ml-4 px-3 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition whitespace-nowrap"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
