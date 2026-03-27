import React, { useState } from 'react'
import { useLocation } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
import { isSidebarRoute } from '../utils/routeUtils'

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const isSidebarPage = isSidebarRoute(location.pathname)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Scrollable Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[var(--color-bg-primary)] ${isSidebarPage ? 'sidebar-content-wrapper small-top-gap' : ''}`}>
          {children}
        </main>
      </div>

    </div>
  )
}

export default AdminLayout
