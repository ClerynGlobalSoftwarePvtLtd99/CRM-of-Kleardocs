import React from 'react'
import { useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import DateRangePicker from './DateRangePicker'
import { useAppSelector } from '../redux/hooks'
import { setDateRange } from '../redux/slices/dashboardSlice'
import { isSidebarRoute } from '../utils/routeUtils'

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  
  const isSidebarPage = isSidebarRoute(location.pathname)
  const isDashboard = location.pathname === '/'
  const { user } = useAppSelector((state) => state.auth)
  const { dateRange } = useAppSelector((state) => state.dashboard)

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleRangeChange = (start, end) => {
    const formatDateLocal = (date) => {
      if (!date) return null;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    dispatch(setDateRange({
      startDate: formatDateLocal(start),
      endDate: formatDateLocal(end)
    }))
  }

  return (
    <header className={`h-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-tertiary)] flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 w-full relative ${isSidebarPage ? 'mb-0 pb-0' : 'mb-1'}`}>
      {/* Left side - Date Range Picker */}
      <div className="flex items-center sm:pr-10 pr-5">
        {isDashboard && (
          <DateRangePicker 
            startDate={dateRange.startDate ? new Date(dateRange.startDate) : null}
            endDate={dateRange.endDate ? new Date(dateRange.endDate) : null}
            onRangeChange={handleRangeChange}
          />
        )}
      </div>

      {/* Right side - User Identity */}
      <div className="flex items-center gap-3 pr-8 md:pr-0 mr-5">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs text-[var(--color-text-secondary)]">
            Welcome,
          </span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {user?.name || '...'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-primary)] font-bold shadow-lg ring-2 ring-[var(--color-bg-tertiary)] ring-offset-2 ring-offset-[var(--color-bg-secondary)]">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  )
}

export default Header
