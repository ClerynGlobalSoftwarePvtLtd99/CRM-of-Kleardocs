import React from "react";

const LeadsHeader = ({ onAdd, count }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-semibold">
        Leads <span className="text-text-secondary">({count})</span>
      </h1>

      <button
        onClick={onAdd}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
      >
        + New Lead
      </button>
    </div>
  );
};

export default LeadsHeader;