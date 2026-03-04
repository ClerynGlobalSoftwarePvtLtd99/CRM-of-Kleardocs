import React, { useState, useEffect } from 'react'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
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
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  )
}

export default App
