import React from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[var(--color-bg-primary)]">
          {children}
        </main>
      </div>

      {/* Global Toaster for bottom-right notifications */}
      <Toaster position="bottom-right" />
    </div>
  )
}

export default AdminLayout
