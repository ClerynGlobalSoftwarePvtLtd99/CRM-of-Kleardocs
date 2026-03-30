import React, { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FileCheck,
  FilePlus,
  FileText,
  Repeat,
  CreditCard,
  BookOpen,
  LayoutTemplate,
  Users2,
  Settings,
  Sliders,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { logoutUser } from '../redux/slices/authSlice'

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Leads', icon: <Users size={20} />, path: '/leads' },
    { name: 'Customers', icon: <UserCheck size={20} />, path: '/customers' },
    { name: 'Services', icon: <Briefcase size={20} />, path: '/services' },
    {
      name: 'Compliances',
      icon: <FileCheck size={20} />,
      path: '/compliances',
    },
    { name: 'Add Invoice', icon: <FilePlus size={20} />, path: '/addinvoice' },
    { name: 'Invoice', icon: <FileText size={20} />, path: '/invoices' },
    {
      name: 'Recurring Invoices',
      icon: <Repeat size={20} />,
      path: '/recurringinvoices',
    },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/payments' },
    { name: 'Template', icon: <LayoutTemplate size={20} />, path: '/templates' },
    {
      name: 'Accountant Jobs',
      icon: <BookOpen size={20} />,
      path: '/accountantjobs',
    },
    ...(user?.role === 'admin' ? [{ name: 'Users', icon: <Users2 size={20} />, path: '/users' }] : []),
    {
      name: 'Compliance Settings',
      icon: <Sliders size={20} />,
      path: '/compliance-settings',
    },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Logout', icon: <LogOut size={20} />, action: 'logout' },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-[var(--color-bg-tertiary)] rounded-md text-[var(--color-text-primary)]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 bg-[var(--color-bg-secondary)] transform transition-all duration-300 ease-in-out border-r border-[var(--color-bg-tertiary)] flex flex-col h-full
        ${isOpen ? 'translate-x-0' : 'translate-x-0 md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        {/* Logo Area */}
        <div
          className={`flex items-center h-20 border-b border-[var(--color-bg-tertiary)] ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}
        >
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-[var(--color-accent)] truncate">
              Kleardocs
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg cursor-pointer text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path

              if (item.action === 'logout') {
                return (
                  <li key={item.name}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setShowLogoutPopup(true)
                      }}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors group text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer hover:text-[var(--color-text-primary)] ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                      title={isCollapsed ? item.name : ''}
                    >
                      <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0">
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="font-medium text-sm truncate">
                          {item.name}
                        </span>
                      )}
                    </button>
                  </li>
                )
              }

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path || '#'}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors group
                      ${
                        isActive
                          ? 'bg-[var(--color-accent)] text-white cursor-pointer hover:bg-yellow-500 hover:text-white'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer hover:text-[var(--color-text-primary)]'
                      } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <span
                      className={`${isActive ? 'text-white' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'} transition-colors shrink-0`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-medium text-sm truncate">
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100/10 text-red-500 rounded-full flex items-center justify-center mb-5 ring-4 ring-red-500/20">
              <LogOut size={28} className="translate-x-[2px]" />
            </div>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Logout?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
              Are you sure you want to Logout?
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
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-800 text-white cursor-pointer rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
