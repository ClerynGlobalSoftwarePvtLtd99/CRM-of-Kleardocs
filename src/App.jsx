import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ComplianceSettings from './pages/ComplianceSettings'
import Loader from './components/Loader'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading for 1 second to show the loader as requested
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/compliance-settings" element={<ComplianceSettings />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  )
}

export default App
