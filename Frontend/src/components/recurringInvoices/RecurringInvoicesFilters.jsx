import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import DateRangePicker from '../DateRangePicker'

const RecurringInvoicesFilters = ({
  searchTerm,
  setSearchTerm,
  dateType,
  setDateType,
  status,
  setStatus,
  onFilter,
  onClear,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-4 rounded-xl mb-6">
      <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 w-full">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 w-full xl:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Name/Phone/Company Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm"
          />
        </div>

        {/* Date Type */}
        <div className="relative w-full xl:w-auto shrink-0">
          <select
            value={dateType}
            onChange={(e) => setDateType(e.target.value)}
            className="w-full xl:w-auto appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[130px] text-sm"
          >
            <option value="">Select Date Type</option>
            <option value="Created">Created</option>
            <option value="Start Date">Start Date</option>
            <option value="End Date">End Date</option>
            <option value="Next Date">Next Date</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>

        {/* Date Range Picker */}
        <div className="w-full xl:w-auto shrink-0 z-50">
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start)
              setEndDate(end)
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full xl:w-auto shrink-0">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full xl:w-auto appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[120px] text-sm"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full xl:w-auto shrink-0">
          <button
            onClick={onFilter}
            className="px-4 py-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium text-sm"
            title="Apply Filter"
          >
            <Filter size={18} />
            <span className="xl:hidden">Filter</span>
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-red-500 hover:text-white text-[var(--color-text-secondary)] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium text-sm"
            title="Clear Filters"
          >
            <X size={18} />
            <span className="xl:hidden">Clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecurringInvoicesFilters
