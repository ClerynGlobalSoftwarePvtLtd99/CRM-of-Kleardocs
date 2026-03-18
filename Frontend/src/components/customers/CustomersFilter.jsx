import React from "react";
import { Search, Calendar, ChevronDown, X } from "lucide-react";
import { COMPANY_TYPES } from "../../utils/constants";
import DateRangePicker from "../DateRangePicker";

const CustomersFilter = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
              value={filters.search}
              onChange={handleChange}
              className="pr-10"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
        </div>

        {/* Data Type Dropdown */}
        <div className="fieldset-input">
          <span className="fieldset-label">Data Type</span>
          <select name="dataType" value={filters.dataType} onChange={handleChange}>
            <option value="onboarding">Onboarding Date</option>
            <option value="incorporation">Incorporation Date</option>
            <option value="expiry">Expiry Date</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="lg:col-span-2 fieldset-input">
          <span className="fieldset-label">Select Date Range</span>
          <DateRangePicker />
        </div>

        {/* Company Type */}
        <div className="fieldset-input">
          <span className="fieldset-label">Type</span>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All Types</option>
            {COMPANY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="fieldset-input">
          <span className="fieldset-label">Status</span>
          <select name="status" value={filters.status} onChange={handleChange}>
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
            <select name={service.toLowerCase().replace(/\s+/g, '')} value={filters[service.toLowerCase().replace(/\s+/g, '')] || ""} onChange={handleChange}>
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
          onClick={onClear}
          className="px-6 py-2 rounded-md bg-bg-tertiary text-text-primary text-sm font-bold uppercase hover:bg-bg-tertiary/80 transition-all flex items-center gap-2"
        >
          <X size={16} /> Clear Filters
        </button>
        <button 
          className="btn-raised btn-raised-orange text-white px-8 py-2 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg"
          onClick={() => {
            // In a real app, this would trigger an API call or expensive filter
            toast.success("Filters applied!");
          }}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default CustomersFilter;
