import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PaymentsHeader from '../components/payments/PaymentsHeader'
import PaymentsFilters from '../components/payments/PaymentsFilters'
import PaymentsTable from '../components/payments/PaymentsTable'
import { fetchPayments } from '../redux/slices/paymentsSlice'

const PAYMENT_TYPES = ['Cash', 'Card', 'UPI', 'Net Banking']

const INITIAL_PAYMENTS = []

const Payments = () => {
  const dispatch = useDispatch()
  const { list: payments, loading, count } = useSelector((state) => state.payments)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  const handleFilter = () => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (paymentType) params.type = paymentType
    if (dateRange.start) params.startDate = dateRange.start.toISOString()
    if (dateRange.end) params.endDate = dateRange.end.toISOString()
    
    dispatch(fetchPayments(params))
  }

  const handleClear = () => {
    setSearchTerm('')
    setPaymentType('')
    setDateRange({ start: null, end: null })
    dispatch(fetchPayments())
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      <PaymentsHeader paymentsCount={payments.length} />

      <PaymentsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        startDate={dateRange.start}
        endDate={dateRange.end}
        onRangeChange={(start, end) => setDateRange({ start, end })}
        PAYMENT_TYPES={PAYMENT_TYPES}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <PaymentsTable payments={payments} />
    </div>
  )
}

export default Payments
