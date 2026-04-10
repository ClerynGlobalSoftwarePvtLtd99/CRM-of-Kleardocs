import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router'
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
import ClientLogin from './pages/ClientLogin'
import ClientDashboard from './pages/ClientDashboard'
import { ping } from './utils/ping'

const RequireAuth = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth)
  const location = useLocation()
  
  if (loading) return <Loader />
  if (!isAuthenticated) {
    const isClientPath = location.pathname.startsWith('/clients')
    return <Navigate to={isClientPath ? "/clients/login" : "/login"} replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role?.toLowerCase())) {
    return <Navigate to={user?.role?.toLowerCase() === 'customer' ? '/clients/dashboard' : '/'} replace />
  }
  
  return children
}

const App = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, token, user } = useAppSelector((state) => state.auth)
  const { theme } = useAppSelector((state) => state.ui)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (token || storedAuth === 'true') {
      dispatch(fetchCurrentUser()).catch(() => {
        dispatch(clearAuth());
      });
    }

    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [dispatch, token])

  //ping to keep the session alive
  useEffect(() => {
    ping()
  }, [])

  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials))
      .unwrap()
      .then(() => {
        toast.success('Successfully logged in!', { duration: 3000, icon: '🚀' })
      })
      .catch((error) => {
        toast.error(error || 'Login failed')
      })
  }

  if (loading || initialLoading) {
    return <Loader />
  }

  return (
    <div data-theme={theme}>
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
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            !isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />
          } />
          <Route path="/clients/login" element={
            !isAuthenticated ? <ClientLogin /> : <Navigate to="/clients/dashboard" replace />
          } />

          {/* Admin/Agent Routes */}
          <Route path="/" element={
            <RequireAuth allowedRoles={['admin', 'agent', 'accountant']}>
              <AdminLayout><Dashboard /></AdminLayout>
            </RequireAuth>
          } />
          <Route path="/settings" element={<RequireAuth allowedRoles={['admin']}><AdminLayout><Settings /></AdminLayout></RequireAuth>} />
          <Route path="/compliance-settings" element={<RequireAuth allowedRoles={['admin']}><AdminLayout><ComplianceSettings /></AdminLayout></RequireAuth>} />
          <Route path="/accountantjobs" element={<RequireAuth><AdminLayout><AccountantJobs /></AdminLayout></RequireAuth>} />
          <Route path="/templates" element={<RequireAuth allowedRoles={['admin', 'agent']}><AdminLayout><Templates /></AdminLayout></RequireAuth>} />
          <Route path="/users" element={<RequireAuth allowedRoles={['admin']}><AdminLayout><Users /></AdminLayout></RequireAuth>} />
          <Route path="/payments" element={<RequireAuth><AdminLayout><Payments /></AdminLayout></RequireAuth>} />
          <Route path="/recurringinvoices" element={<RequireAuth><AdminLayout><RecurringInvoices /></AdminLayout></RequireAuth>} />
          <Route path="/recurring-invoice-details/:id" element={<RequireAuth><AdminLayout><RecurringInvoiceDetails /></AdminLayout></RequireAuth>} />
          <Route path="/invoices" element={<RequireAuth><AdminLayout><Invoices /></AdminLayout></RequireAuth>} />
          <Route path="/invoice/:id" element={<RequireAuth><AdminLayout><InvoiceDetails /></AdminLayout></RequireAuth>} />
          <Route path="/addinvoice" element={<RequireAuth allowedRoles={['admin', 'agent']}><AdminLayout><AddInvoice /></AdminLayout></RequireAuth>} />
          <Route path='/compliances' element={<RequireAuth><AdminLayout><Compliances/></AdminLayout></RequireAuth>}/>
          <Route path='/services' element={<RequireAuth><AdminLayout><Services/></AdminLayout></RequireAuth>}/>
          <Route path='/leads' element={<RequireAuth><AdminLayout><Leads/></AdminLayout></RequireAuth>}/>
          <Route path='/customers' element={<RequireAuth><AdminLayout><Customers/></AdminLayout></RequireAuth>}/>
          <Route path="/lead/:id" element={<RequireAuth><AdminLayout><LeadDetailsPage /></AdminLayout></RequireAuth>} />
          <Route path="/customer/:id" element={<RequireAuth><AdminLayout><CustomerDetailsPage /></AdminLayout></RequireAuth>} />

          {/* Client Portal Routes */}
          <Route path="/clients/dashboard" element={
            <RequireAuth allowedRoles={['customer']}>
              <AdminLayout><ClientDashboard /></AdminLayout>
            </RequireAuth>
          } />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? (user?.role?.toLowerCase() === 'customer' ? '/clients/dashboard' : '/') : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
