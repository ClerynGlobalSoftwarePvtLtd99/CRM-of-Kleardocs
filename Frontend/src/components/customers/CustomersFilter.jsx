import React, { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { COMPANY_TYPES } from "../../utils/constants";
import DateRangePicker from "../DateRangePicker";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../redux/slices/servicesSlice";

const CustomersFilter = ({ filters, setFilters, onClear }) => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.services);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    toast.success("Filters applied");
  };

  const handleClear = () => {
    const clearedFilters = {
      search: "",
      dataType: "onboarding",
      startDate: null,
      endDate: null,
      companyType: "",
      status: "",
      activeService: ""
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    if (onClear) onClear();
    toast.success("Filters cleared");
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-4 rounded-xl mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center gap-3 w-full">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[120px] max-w-[220px] shrink-0 w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={localFilters.search}
            onChange={handleChange}
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm h-[38px]"
          />
        </div>

        {/* Date Type Selector */}
        <div className="relative shrink-0 w-full lg:w-auto">
          <select
            name="dataType"
            value={localFilters.dataType}
            onChange={handleChange}
            className="w-full lg:w-auto appearance-none pl-3 pr-7 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[90px] text-sm h-[38px]"
          >
            <option value="onboarding">Onboarding Date</option>
            <option value="incorporation">Incorporation Date</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>

        {/* Date Range Picker */}
        <div className="shrink-0 z-50 w-full lg:w-auto">
          <DateRangePicker
            startDate={localFilters.startDate}
            endDate={localFilters.endDate}
            onRangeChange={(startDate, endDate) =>
              setLocalFilters((prev) => ({ ...prev, startDate, endDate }))
            }
          />
        </div>

        {/* Company Type */}
        <div className="relative shrink-0 w-full lg:w-auto">
          <select
            name="companyType"
            value={localFilters.companyType}
            onChange={handleChange}
            className="w-full lg:w-auto appearance-none pl-3 pr-8 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[90px] text-sm h-[38px]"
          >
            <option value="">Type</option>
            {COMPANY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>

        {/* Active Services */}
        <div className="relative shrink-0 w-full lg:w-auto">
          <select
            name="activeService"
            value={localFilters.activeService || ""}
            onChange={handleChange}
            className="w-full lg:w-auto appearance-none pl-3 pr-7 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[80px] max-w-[110px] truncate text-sm h-[38px]"
          >
            <option value="">Services</option>
            {services.map(service => (
              <option key={service._id} value={service.name}>{service.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 shrink-0 lg:ml-auto justify-end">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="lg:flex-none px-3 py-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 font-bold text-[11px] uppercase tracking-tighter h-[38px]"
            title="Search filtering"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="lg:flex-none px-3 py-2 bg-[var(--color-bg-tertiary)] hover:bg-red-500 hover:text-white text-[var(--color-text-secondary)] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 font-bold text-[11px] uppercase tracking-tighter h-[38px]"
            title="Clear Filters"
          >
            <X size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomersFilter;
