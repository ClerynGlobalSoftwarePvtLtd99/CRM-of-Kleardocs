import React, { useState } from 'react'
import AddInvoiceHeader from '../components/addInvoice/AddInvoiceHeader'
import InvoiceDetailsSection from '../components/addInvoice/InvoiceDetailsSection'
import InvoiceItemsSection from '../components/addInvoice/InvoiceItemsSection'
import CreateInvoiceButton from '../components/addInvoice/CreateInvoiceButton'

const today = new Date().toISOString().split('T')[0]

const AddInvoice = () => {
  // Invoice Details state
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [invoiceDate, setInvoiceDate] = useState(today)
  const [isRecurring, setIsRecurring] = useState(false)
  const [interval, setInterval] = useState(0)
  const [intervalType, setIntervalType] = useState('Month')
  const [endDate, setEndDate] = useState(today)

  // Invoice Items state
  const [items, setItems] = useState([])

  const handleCreateInvoice = () => {
    if (!selectedCustomer) {
      alert('Please select a customer.')
      return
    }
    if (items.length === 0) {
      alert('Please add at least one invoice item.')
      return
    }

    const invoicePayload = {
      customer: selectedCustomer,
      invoiceDate: isRecurring ? null : invoiceDate,
      isRecurring,
      interval: isRecurring ? interval : null,
      intervalType: isRecurring ? intervalType : null,
      endDate: isRecurring ? endDate : null,
      items,
      totals: {
        price: items.reduce((acc, i) => acc + i.price, 0),
        gst: items.reduce((acc, i) => acc + i.gst, 0),
        amount: items.reduce((acc, i) => acc + i.amount, 0),
      },
    }

    console.log('Invoice Payload:', invoicePayload)
    // TODO: POST to API
    alert(`Invoice created for ${selectedCustomer.name} with ${items.length} item(s)!`)
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      {/* Section 1: Header */}
      <AddInvoiceHeader />

      {/* Section 2: Invoice Details */}
      <InvoiceDetailsSection
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        interval={interval}
        setInterval={setInterval}
        intervalType={intervalType}
        setIntervalType={setIntervalType}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {/* Section 3: Invoice Items */}
      <InvoiceItemsSection items={items} setItems={setItems} />

      {/* Section 4: Create Invoice Button */}
      <CreateInvoiceButton onClick={handleCreateInvoice} />
    </div>
  )
}

export default AddInvoice
