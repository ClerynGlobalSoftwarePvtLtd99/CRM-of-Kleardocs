import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { loginUser, clearAuth, setAuthenticated, fetchCurrentUser } from './redux/slices/authSlice'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ComplianceSettings from './pages/ComplianceSettings'
import Users from './pages/Users'
import AccountantJobs from './pages/AccountantJobs'
import Templates from './pages/Templates'
import Loader from './components/Loader'
import Payments from './pages/Payments'
import RecurringInvoices from './pages/RecurringInvoices'
import Invoices from './pages/Invoices'
import InvoiceDetails from './pages/InvoiceDetails'
import AddInvoice from './pages/AddInvoice'
import RecurringInvoiceDetails from './pages/RecurringInvoiceDetails'
import Compliances from './pages/Compliances'
import Services from './pages/Services'
import Leads from './pages/Leads'
import LeadDetailsPage from './pages/LeadDetailsPage'
import CustomerDetailsPage from './pages/CustomerDetailsPage'
import Customers from './pages/Customers'
import Login from './pages/Login'
import AdminRoute from './components/AdminRoute'

const App = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, token, user } = useAppSelector((state) => state.auth)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Check if we have a stored authentication state
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    // If we have a token or stored auth state, try to verify the session
    if (token || storedAuth === 'true') {
      dispatch(fetchCurrentUser()).catch(() => {
        // If fetch fails, clear the invalid auth state
        dispatch(clearAuth());
      });
    }

    // Simulate initial loading for 1 second to show the loader as requested
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [dispatch, token])

  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials))
      .unwrap()
      .then(() => {
        toast.success('Successfully logged in!', {
          duration: 3000,
          icon: '🚀',
        })
      })
      .catch((error) => {
        toast.error(error || 'Login failed')
      })
  }

  if (loading || initialLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Login onLogin={handleLogin} />
      </>
    )
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-bg-tertiary)",
          },
        }}
      />
      
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/compliance-settings" element={<ComplianceSettings />} />
            <Route path="/accountantjobs" element={<AccountantJobs />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/users" element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            } />
            <Route path="/payments" element={<Payments />} />
            <Route path="/recurringinvoices" element={<RecurringInvoices />} />
            <Route path="/recurring-invoice-details/:id" element={<RecurringInvoiceDetails />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/addinvoice" element={<AddInvoice />} />
            <Route path='/compliances' element={<Compliances/>}/>
            <Route path='/services' element={<Services/>}/>
            <Route path='/leads' element={<Leads/>}/>
            <Route path='/customers' element={<Customers/>}/>
            <Route path="/lead/:id" element={<LeadDetailsPage />} />
            <Route path="/customer/:id" element={<CustomerDetailsPage />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </>
  )
}

export default App
