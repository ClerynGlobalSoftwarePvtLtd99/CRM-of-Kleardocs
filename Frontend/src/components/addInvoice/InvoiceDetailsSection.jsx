import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, User } from 'lucide-react'
const InvoiceDetailsSection = ({
  selectedCustomer,
  setSelectedCustomer,
  invoiceDate,
  setInvoiceDate,
  isRecurring,
  setIsRecurring,
  interval,
  setInterval,
  intervalType,
  setIntervalType,
  endDate,
  setEndDate,
  description,
  setDescription,
  showDescription,
  setShowDescription,
  customers = [],
}) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const filtered = (customers || []).filter(
    (c) =>
      c?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c?.companyName?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (customer) => {
    setSelectedCustomer(customer)
    setSearch('')
    setOpen(false)
  }

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-sm mb-6 p-6">
      <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Invoice Details</h2>

      <div className="flex flex-col gap-5">
        {/* Select Customer */}
        <div className="flex flex-col md:flex-row md:items-start gap-3">
          <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm pt-2">
            Select Customer
          </label>
          <div className="flex-1 relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm transition-colors hover:border-[var(--color-accent)] focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <User size={16} className="text-[var(--color-text-secondary)] shrink-0" />
                {selectedCustomer ? (
                  <span className="truncate font-medium text-[var(--color-text-primary)]">
                    {selectedCustomer.name} – {selectedCustomer.companyName}
                  </span>
                ) : (
                  <span className="text-[var(--color-text-secondary)]">Select a customer...</span>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`text-[var(--color-text-secondary)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-2xl overflow-hidden">
                {/* Search */}
                <div className="p-2 border-b border-[var(--color-bg-tertiary)]">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search customers..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </div>
                {/* Options */}
                 <ul className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
                   {filtered.length === 0 ? (
                     <li className="px-4 py-3 text-sm text-[var(--color-text-secondary)] text-center">No customers found</li>
                   ) : (
                     filtered.map((c) => (
                       <li
                         key={c._id}
                         onClick={() => handleSelect(c)}
                         className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--color-bg-tertiary)] transition-colors flex flex-col gap-0.5 ${
                           selectedCustomer?._id === c._id ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'
                         }`}
                       >
                         <span className="font-medium">{c.name}</span>
                         <span className="text-xs text-[var(--color-text-secondary)]">{c.companyName}</span>
                       </li>
                     ))
                   )}
                 </ul>
              </div>
            )}
          </div>
        </div>

        {isRecurring ? (
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm">
              Invoice Start Date
            </label>
            <div className="flex-1">
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full md:max-w-xs px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer text-[var(--color-text-primary)]"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm">
              Invoice Date
            </label>
            <div className="flex-1">
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full md:max-w-xs px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer text-[var(--color-text-primary)]"
              />
            </div>
          </div>
        )}

        {/* Recurring Invoice Toggle */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm">
            Recurring Invoice?
          </label>
          <div className="flex-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRecurring((p) => !p)}
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none ${
                isRecurring ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg-tertiary)]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                  isRecurring ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {isRecurring ? 'Yes – Recurring' : 'No – One time'}
            </span>
          </div>
        </div>

        {/* Description Toggle */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="md:w-48 shrink-0 font-semibold text-text-secondary text-sm">
            Add Description?
          </label>
          <div className="flex-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDescription((p) => !p)}
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none ${
                showDescription ? 'bg-accent' : 'bg-bg-tertiary'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                  showDescription ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-text-secondary">
              {showDescription ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Description Textarea */}
        {showDescription && (
          <div className="flex flex-col md:flex-row md:items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="md:w-48 shrink-0 font-semibold text-text-secondary text-sm pt-2">
              Description
            </label>
            <div className="flex-1">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter invoice description..."
                rows={3}
                className="w-full px-4 py-2.5 bg-bg-primary border border-bg-tertiary rounded-lg text-sm focus:outline-none focus:border-accent transition-colors text-text-primary resize-none shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Recurring Fields */}
        {isRecurring && (
          <>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm">
                Interval
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  className="w-full md:max-w-xs px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm">
                Interval Type
              </label>
              <div className="flex-1 relative md:max-w-xs">
                <select
                  value={intervalType}
                  onChange={(e) => setIntervalType(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer text-[var(--color-text-primary)]"
                >
                  <option value="Day">Day</option>
                  <option value="Month">Month</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="md:w-48 shrink-0 font-semibold text-[var(--color-text-secondary)] text-sm">
                Invoice End Date
              </label>
              <div className="flex-1">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full md:max-w-xs px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer text-[var(--color-text-primary)]"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default InvoiceDetailsSection
