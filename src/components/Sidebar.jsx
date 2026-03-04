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
  LayoutTemplate,
  BookOpen,
  Users2,
  Settings,
  Sliders,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'Leads', icon: <Users size={20} /> },
    { name: 'Customers', icon: <UserCheck size={20} /> },
    { name: 'Services', icon: <Briefcase size={20} /> },
    { name: 'Compliances', icon: <FileCheck size={20} /> },
    { name: 'Add Invoice', icon: <FilePlus size={20} /> },
    { name: 'Invoice', icon: <FileText size={20} /> },
    { name: 'Recurring Invoice', icon: <Repeat size={20} /> },
    { name: 'Payments', icon: <CreditCard size={20} /> },
    { name: 'Template', icon: <LayoutTemplate size={20} /> },
    { name: 'Accountant Jobs', icon: <BookOpen size={20} /> },
    { name: 'Users', icon: <Users2 size={20} /> },
    { name: 'Compliance Settings', icon: <Sliders size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
    { name: 'Logout', icon: <LogOut size={20} /> },
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
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[var(--color-bg-secondary)] transform transition-transform duration-300 ease-in-out border-r border-[var(--color-bg-tertiary)] flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-center h-20 border-b border-[var(--color-bg-tertiary)]">
          <h1 className="text-2xl font-bold text-[var(--color-accent)]">
            Kleardocs
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                    ${
                      item.active
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                    }`}
                >
                  <span
                    className={`${item.active ? 'text-white' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'} transition-colors`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.name}</span>
                </a>
              </li>
            ))}
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
    </>
  )
}

export default Sidebar
