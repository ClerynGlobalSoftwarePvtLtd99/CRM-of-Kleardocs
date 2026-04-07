import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RecurringInvoicesHeader from '../components/recurringInvoices/RecurringInvoicesHeader'
import RecurringInvoicesFilters from '../components/recurringInvoices/RecurringInvoicesFilters'
import RecurringInvoicesTable from '../components/recurringInvoices/RecurringInvoicesTable'
import { fetchRecurringInvoices } from '../redux/slices/recurringInvoicesSlice'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-hot-toast'
import ContentLoader from '../components/common/ContentLoader'

const RecurringInvoices = () => {
  const dispatch = useDispatch()
  const { list: invoices, loading, count } = useSelector((state) => state.recurringInvoices)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [dateType, setDateType] = useState('')
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    loadInvoices()
  }, [dispatch])

  const loadInvoices = (extraParams = {}) => {
    const params = {
      search: searchTerm,
      status,
      dateType: dateType.toLowerCase().replace(' ', ''), // 'Start Date' -> 'start'
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      ...extraParams
    }
    dispatch(fetchRecurringInvoices(params))
  }

  const handleFilter = () => {
    loadInvoices()
  }

  const handleClear = () => {
    setSearchTerm('')
    setDateType('')
    setStatus('')
    setStartDate(null)
    setEndDate(null)
    dispatch(fetchRecurringInvoices({}))
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status,
        dateType: dateType.toLowerCase().replace(' ', ''),
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : ''
      }).toString()
      
      const response = await axiosInstance.get(`/recurringinvoices/export?${params}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'recurring_invoices.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Export started')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader message="Fetching recurring invoices..." />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 w-full text-text-primary">
      <RecurringInvoicesHeader counts={count} onExport={handleExport} />

      <RecurringInvoicesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateType={dateType}
        setDateType={setDateType}
        status={status}
        setStatus={setStatus}
        onFilter={handleFilter}
        onClear={handleClear}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <RecurringInvoicesTable invoices={invoices} />
    </div>
  )
}

export default RecurringInvoices
