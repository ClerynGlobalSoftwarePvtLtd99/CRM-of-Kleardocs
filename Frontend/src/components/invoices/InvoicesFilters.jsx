import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import DateRangePicker from '../DateRangePicker'

const InvoicesFilters = ({
  searchTerm,
  setSearchTerm,
  type,
  setType,
  func,
  setFunc,
  value,
  setValue,
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
            placeholder="Name, phone, company name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm"
          />
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

        {/* Type Dropdown */}
        <div className="relative w-full xl:w-auto shrink-0">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full xl:w-auto appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[120px] text-sm"
          >
            <option value="">Type</option>
            <option value="subTotal">Price</option>
            <option value="totalGst">GST</option>
            <option value="total">Total</option>
            <option value="due">Due</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>

        {/* Function Dropdown */}
        <div className="relative w-full xl:w-auto shrink-0">
          <select
            value={func}
            onChange={(e) => setFunc(e.target.value)}
            className="w-full xl:w-auto appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[100px] text-sm"
          >
            <option value="">Function</option>
            <option value=">=">≥</option>
            <option value="=">=</option>
            <option value="<=">≤</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>
        
        {/* Value Search */}
        <div className="relative w-full xl:w-[120px] shrink-0">
          <input
            type="number"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm"
          />
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

export default InvoicesFilters
