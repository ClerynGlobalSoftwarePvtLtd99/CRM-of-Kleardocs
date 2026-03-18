import React from 'react'
import { Search, X } from 'lucide-react'

const TemplatesFilters = ({ searchFilter, setSearchFilter }) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-4 rounded-xl mb-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
        <input
          type="text"
          placeholder="Search by name or subject..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export default TemplatesFilters
