import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import DateRangePicker from '../DateRangePicker'

const AccountantJobsFilters = ({
  searchFilter,
  setSearchFilter,
  dateTypeFilter,
  setDateTypeFilter,
  statusFilter,
  setStatusFilter,
  accountantFilter,
  setAccountantFilter,
  STATUSES,
  ACCOUNTANTS,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApply,
  onClear,
}) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-3 rounded-xl mb-6">
      <div className="flex flex-nowrap items-center gap-2 w-full">
        <div className="relative flex-1 min-w-[200px] max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
          <input
            type="text"
            placeholder="Search by name, phone, or company name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm"
          />
        </div>

        <div className="relative">
          <select
            value={dateTypeFilter}
            onChange={(e) => setDateTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer text-sm"
          >
            <option value="Created">Created</option>
            <option value="Expiry Date">Expiry Date</option>
            <option value="Completed On">Completed On</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={14} />
        </div>

        <div className="min-w-[280px] max-w-[320px]">
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start)
              setEndDate(end)
            }}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[100px] text-sm"
          >
            <option value="">Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={14} />
        </div>

        <div className="relative">
          <select
            value={accountantFilter}
            onChange={(e) => setAccountantFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[100px] text-sm"
          >
            <option value="">Accountants</option>
            {ACCOUNTANTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={14} />
        </div>

        <button 
          onClick={onApply}
          className="p-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer" 
          title="Apply Filter"
        >
          <Filter size={20} />
        </button>
        <button 
          className="p-2 bg-[var(--color-bg-tertiary)] hover:bg-red-500 hover:text-white text-[var(--color-text-secondary)] rounded-lg transition-colors cursor-pointer" title="Clear Filters"
          onClick={onClear}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default AccountantJobsFilters
