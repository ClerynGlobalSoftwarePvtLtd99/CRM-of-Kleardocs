import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import DateRangePicker from '../DateRangePicker'

const PaymentsFilters = ({
  searchTerm,
  setSearchTerm,
  paymentType,
  setPaymentType,
  PAYMENT_TYPES,
  onFilter,
  onClear,
}) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-4 rounded-xl mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
        {/* Search */}
        <div className="relative min-w-[250px] flex-1 w-full md:w-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Name/Phone/Company/Invoice No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm"
          />
        </div>

        {/* Date Range Picker */}
        <div className="w-full md:w-auto shrink-0">
          <DateRangePicker />
        </div>

        {/* Payment Type Dropdown */}
        <div className="relative w-full md:w-auto shrink-0">
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full md:w-auto appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[150px] text-sm"
          >
            <option value="">All Types</option>
            {PAYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
            size={16}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={onFilter}
            className="px-4 py-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium"
            title="Apply Filter"
          >
            <Filter size={18} />
            <span className="md:hidden">Filter</span>
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-red-500 hover:text-white text-[var(--color-text-secondary)] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium"
            title="Clear Filters"
          >
            <X size={18} />
            <span className="md:hidden">Clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentsFilters
