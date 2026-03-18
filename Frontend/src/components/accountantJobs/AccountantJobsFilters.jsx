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
}) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-4 rounded-xl mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Name/phone/company name"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
          />
        </div>

        <div className="relative">
          <select
            value={dateTypeFilter}
            onChange={(e) => setDateTypeFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer"
          >
            <option value="Created">Created</option>
            <option value="Expiry Date">Expiry Date</option>
            <option value="Completed On">Completed On</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>

        <DateRangePicker />

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[130px]"
          >
            <option value="">Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <select
            value={accountantFilter}
            onChange={(e) => setAccountantFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[130px]"
          >
            <option value="">Accountants</option>
            {ACCOUNTANTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
        </div>

        <button className="p-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer" title="Apply Filter">
          <Filter size={20} />
        </button>
        <button 
          className="p-2 bg-[var(--color-bg-tertiary)] hover:bg-red-500 hover:text-white text-[var(--color-text-secondary)] rounded-lg transition-colors cursor-pointer" title="Clear Filters"
          onClick={() => {
            setSearchFilter('')
            setDateTypeFilter('Created')
            setStatusFilter('')
            setAccountantFilter('')
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default AccountantJobsFilters
