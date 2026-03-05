import React, { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useLocation } from 'react-router'

import DateRangePicker from './DateRangePicker'

const Header = () => {
  const location = useLocation()
  const isDashboard = location.pathname === '/'

  return (
    <header className="h-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-tertiary)] flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 w-full mb-1 relative">
      {/* Left side - Date Range Picker */}
      <div className="flex items-center">
        {isDashboard && <DateRangePicker />}
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
