import React, { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

const Header = () => {
  const [dateRange, setDateRange] = useState('This Month (1 to 30)')

  return (
    <header className="h-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-tertiary)] flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 w-full mb-1">
      {/* Left side - Date Range Picker */}
      <div className="flex items-center">
        <div className="relative group">
          <button className="flex items-center gap-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2 rounded-lg text-sm text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors">
            <Calendar size={18} className="text-[var(--color-accent)]" />
            <span className="hidden sm:inline-block font-medium">
              {dateRange}
            </span>
            <span className="sm:hidden font-medium">This Month</span>
            <ChevronDown
              size={16}
              className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors"
            />
          </button>

          {/* Dropdown (Mockup) */}
          <div className="absolute top-12 left-0 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
            <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-accent)] transition-colors">
              This Month (1 to 30)
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              Last Month
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              Last 3 Months
            </button>
          </div>
        </div>
      </div>

      {/* Right side - User Identity */}
      <div className="flex items-center gap-3 pr-8 md:pr-0">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs text-[var(--color-text-secondary)]">
            Welcome,
          </span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            John Doe
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-primary)] font-bold shadow-lg ring-2 ring-[var(--color-bg-tertiary)] ring-offset-2 ring-offset-[var(--color-bg-secondary)]">
          JD
        </div>
      </div>
    </header>
  )
}

export default Header
