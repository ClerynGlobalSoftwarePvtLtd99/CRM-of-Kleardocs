import { Search, X } from "lucide-react";
import DateRangeFilter from "./DateRangeFilter";

const CompliancesFilter = ({ filters, setFilters, onView }) => {

  const update = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      compliance: "",
      status: "",
      accountant: "",
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-bg-primary rounded-xl shadow-sm p-4">

      <input
        type="text"
        placeholder="Name/Phone/Company"
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
        className="border rounded-lg px-4 py-2 w-60 text-bg-tertiary"
      />

      <DateRangeFilter setFilters={setFilters} />

      <select
        onChange={(e) => update("compliance", e.target.value)}
        className="border rounded-lg px-4 py-2 w-56 text-bg-tertiary"
      >
        <option value="">Compliance Name</option>
        <option>MGT-07</option>
        <option>AOC-04</option>
      </select>

      <select
        onChange={(e) => update("status", e.target.value)}
        className="border rounded-lg px-4 py-2 w-40 text-bg-tertiary"
      >
        <option value="">Status</option>
        <option>To Be Done</option>
        <option>Completed</option>
      </select>

      <select
        onChange={(e) => update("accountant", e.target.value)}
        className="border rounded-lg px-4 py-2 w-44 text-bg-tertiary"
      >
        <option value="">Accountant</option>
        <option>Rahul</option>
        <option>Priya</option>
      </select>

      <button
        onClick={onView}
        className="text-orange-500 cursor-pointer"
      >
        <Search size={26} />
      </button>

      <button
        onClick={clearFilters}
        className="text-orange-500 cursor-pointer"
      >
        <X size={26} />
      </button>

    </div>
  );
};

export default CompliancesFilter;