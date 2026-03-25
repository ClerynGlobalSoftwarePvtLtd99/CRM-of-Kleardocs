import React, { useState } from "react";
import { Search, Calendar, ChevronDown, X } from "lucide-react";
import { COMPANY_TYPES } from "../../utils/constants";
import DateRangePicker from "../DateRangePicker";
import toast from "react-hot-toast";

const CustomersFilter = ({ filters, setFilters, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters);

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
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    toast.success("Filters cleared");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Name/Phone/Company Search */}
        <div className="fieldset-input">
          <span className="fieldset-label">Name/Phone/Company</span>
          <div className="relative">
            <input 
              type="text" 
              name="search"
              placeholder="Search..." 
              value={localFilters.search}
              onChange={handleChange}
              className="pr-10"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
        </div>

        {/* Data Type Dropdown */}
        <div className="fieldset-input">
          <span className="fieldset-label">Data Type</span>
          <select name="dataType" value={localFilters.dataType} onChange={handleChange}>
            <option value="onboarding">Onboarding Date</option>
            <option value="incorporation">Incorporation Date</option>
            <option value="expiry">Expiry Date</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="lg:col-span-2 fieldset-input">
          <span className="fieldset-label">Select Date Range</span>
          <DateRangePicker 
            startDate={localFilters.startDate}
            endDate={localFilters.endDate}
            onRangeChange={(startDate, endDate) =>
              setLocalFilters(prev => ({ ...prev, startDate, endDate }))
            }
          />
        </div>

        {/* Company Type */}
        <div className="fieldset-input">
          <span className="fieldset-label">Type</span>
          <select name="companyType" value={localFilters.companyType} onChange={handleChange}>
            <option value="">All Types</option>
            {COMPANY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="fieldset-input">
          <span className="fieldset-label">Status</span>
          <select name="status" value={localFilters.status} onChange={handleChange}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Services Dropdowns (Mocked for UI) */}
        {[
          "Annual Compliance",
          "GST Services",
          "Taxation",
          "Bookkeeping"
        ].map((service, idx) => (
          <div key={idx} className="fieldset-input">
            <span className="fieldset-label">{service}</span>
            <select name={service.toLowerCase().replace(/\s+/g, '')} value={localFilters[service.toLowerCase().replace(/\s+/g, '')] || ""} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        ))}

      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-bg-tertiary">
        <button 
          onClick={handleClear}
          className="px-6 py-2 rounded-md bg-bg-tertiary text-text-primary text-sm font-bold uppercase hover:bg-bg-tertiary/80 transition-all flex items-center gap-2"
        >
          <X size={16} /> Clear Filters
        </button>
        <button 
          className="btn-raised btn-raised-orange text-white px-8 py-2 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg"
          onClick={handleApplyFilters}
        >
          <Search size={16} className="inline mr-2" />
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default CustomersFilter;
