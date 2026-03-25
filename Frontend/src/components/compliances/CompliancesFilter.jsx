import { Search, X } from "lucide-react";
import DateRangePicker from "../DateRangePicker";
import toast from "react-hot-toast";
import { useState } from "react";

const CompliancesFilter = ({ filters, setFilters, onView }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const update = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    toast.success("Filters applied");
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      compliance: "",
      status: "",
      accountant: "",
      startDate: null,
      endDate: null,
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    toast.success("Filters cleared");
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-bg-primary rounded-xl shadow-sm p-4">

      <input
        type="text"
        placeholder="Name/Phone/Company"
        value={localFilters.search}
        onChange={(e) => update("search", e.target.value)}
        className="border rounded-lg px-4 py-2 w-60 text-bg-tertiary"
      />

      <DateRangePicker 
        startDate={localFilters.startDate}
        endDate={localFilters.endDate}
        onRangeChange={(startDate, endDate) => 
          setLocalFilters(prev => ({ ...prev, startDate, endDate }))
        }
      />

      <select
        value={localFilters.compliance}
        onChange={(e) => update("compliance", e.target.value)}
        className="border rounded-lg px-4 py-2 w-56 text-bg-tertiary"
      >
        <option value="">Compliance Name</option>
        <option>MGT-07</option>
        <option>AOC-04</option>
      </select>

      <select
        value={localFilters.status}
        onChange={(e) => update("status", e.target.value)}
        className="border rounded-lg px-4 py-2 w-40 text-bg-tertiary"
      >
        <option value="">Status</option>
        <option>To Be Done</option>
        <option>Completed</option>
      </select>

      <select
        value={localFilters.accountant}
        onChange={(e) => update("accountant", e.target.value)}
        className="border rounded-lg px-4 py-2 w-44 text-bg-tertiary"
      >
        <option value="">Accountant</option>
        <option>Rahul</option>
        <option>Priya</option>
      </select>

      <button
        onClick={handleApplyFilters}
        className="btn-raised btn-raised-orange text-white px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center gap-2"
      >
        <Search size={16} />
        Filter
      </button>

      <button
        onClick={clearFilters}
        className="p-2.5 bg-bg-tertiary hover:bg-red-500/20 text-red-500 border border-bg-tertiary rounded-md transition-all shadow-sm group"
        title="Clear Filters"
      >
        <X size={18} className="group-hover:rotate-90 transition-transform" />
      </button>

    </div>
  );
};

export default CompliancesFilter;