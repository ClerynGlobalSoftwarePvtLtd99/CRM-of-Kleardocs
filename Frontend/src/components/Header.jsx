import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import { LogOut } from 'lucide-react'
import DateRangePicker from './DateRangePicker'
import { useAppSelector } from '../redux/hooks'
import { setDateRange } from '../redux/slices/dashboardSlice'
import { toggleTheme } from '../redux/slices/uiSlice'
import { logoutUser } from '../redux/slices/authSlice'
import { isSidebarRoute } from '../utils/routeUtils'

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  
  const isSidebarPage = isSidebarRoute(location.pathname)
  const isDashboard = location.pathname === '/'
  const { user } = useAppSelector((state) => state.auth)
  const { dateRange } = useAppSelector((state) => state.dashboard)
  const { theme } = useAppSelector((state) => state.ui)
  const isDark = theme === 'dark'

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
    <header className={`h-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-tertiary)] flex items-center justify-between px-4 md:px-6 lg:px-8 z-50 w-full relative ${isSidebarPage ? 'mb-0 pb-0' : 'mb-1'}`}>
      {/* Centered Brand Text only for Client Dashboard */}
      {location.pathname === '/clients/dashboard' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden sm:block max-w-[calc(100%-200px)] overflow-hidden">
          <span className="text-sm md:text-lg lg:text-xl font-extrabold text-[var(--color-text-primary)] tracking-wide whitespace-nowrap block text-center">
            Kleardocs Solutions Private Limited
          </span>
        </div>
      )}

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

      {/* Right side - Theme Toggle + User Identity */}
      <div className="flex items-center gap-4 pr-8 md:pr-0 mr-5">

        {/* ── Theme Toggle Button ── */}
        <button
          id="theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '999px',
            border: isDark
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(0,0,0,0.12)',
            background: isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.06)',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: isDark
              ? '0 1px 4px rgba(0,0,0,0.3)'
              : '0 1px 4px rgba(0,0,0,0.08)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--color-text-primary)'
            e.currentTarget.style.background = isDark
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(0,0,0,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--color-text-secondary)'
            e.currentTarget.style.background = isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.06)'
          }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span className="hidden sm:inline">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* ── User Identity ── */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Welcome,
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {user?.name || '...'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-primary)] font-bold shadow-lg ring-2 ring-[var(--color-bg-tertiary)] ring-offset-2 ring-offset-[var(--color-bg-secondary)] relative group">
            {getInitials(user?.name)}
          </div>

          {/* Conditional Logout for Customers (positioned to the right) */}
          {user?.role?.toLowerCase() === 'customer' && (
            <button 
              onClick={() => setShowLogoutPopup(true)} 
              className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm border border-red-500/20"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-300">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-5 ring-4 ring-red-500/20">
              <LogOut size={28} className="translate-x-[2px]" />
            </div>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Logout?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 px-4 py-2.5 border border-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-white rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-[var(--color-bg-tertiary)] focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(logoutUser())
                  setShowLogoutPopup(false)
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
