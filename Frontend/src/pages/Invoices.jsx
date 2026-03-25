import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InvoicesHeader from '../components/invoices/InvoicesHeader'
import InvoicesFilters from '../components/invoices/InvoicesFilters'
import InvoicesTable from '../components/invoices/InvoicesTable'
import { fetchInvoices } from '../redux/slices/invoicesSlice'
import ContentLoader from '../components/common/ContentLoader'

const Invoices = () => {
  const dispatch = useDispatch()
  const { list: invoices, totalCount, loading, error } = useSelector((state) => state.invoices)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [type, setType] = useState('')
  const [func, setFunc] = useState('')
  const [value, setValue] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    handleFilter()
  }, [dispatch, page])

  const handleFilter = () => {
    const params = {
      page,
      limit: 20,
      search: searchTerm,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    }

    if (type && func && value !== '') {
      params.filterType = type // subTotal, totalGst, total, due (case sensitive)
      params.filterFn = func === '>=' ? 'gte' : func === '<=' ? 'lte' : 'eq'
      params.filterValue = value
    }

    dispatch(fetchInvoices(params))
  }

  const handleClear = () => {
    setSearchTerm('')
    setType('')
    setFunc('')
    setValue('')
    setStartDate(null)
    setEndDate(null)
    setPage(1)
    dispatch(fetchInvoices({ page: 1, limit: 20 }))
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="flex-1 p-4 md:p-8 w-full text-[var(--color-text-primary)]">
      <InvoicesHeader counts={totalCount} />

      <InvoicesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        type={type}
        setType={setType}
        func={func}
        setFunc={setFunc}
        value={value}
        setValue={setValue}
        onFilter={() => { setPage(1); handleFilter(); }}
        onClear={handleClear}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {loading ? (
        <ContentLoader message="Fetching invoices..." />
      ) : (
        <InvoicesTable invoices={invoices} />
      )}
    </div>
  )
}

export default Invoices
