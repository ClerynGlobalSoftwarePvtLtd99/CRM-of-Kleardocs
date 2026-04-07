import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import AddInvoiceHeader from '../components/addInvoice/AddInvoiceHeader'
import InvoiceDetailsSection from '../components/addInvoice/InvoiceDetailsSection'
import InvoiceItemsSection from '../components/addInvoice/InvoiceItemsSection'
import CreateInvoiceButton from '../components/addInvoice/CreateInvoiceButton'
import { generateInvoicePdf } from '../utils/invoicePdfGenerator'
import { fetchCustomerList } from '../redux/slices/customersSlice'
import { fetchServices } from '../redux/slices/servicesSlice'
import { createInvoice } from '../redux/slices/invoicesSlice'
import { toast } from 'react-hot-toast'

const today = new Date().toISOString().split('T')[0]

const AddInvoice = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Redux state
  const { dropdownList: customers } = useSelector((state) => state.customers)
  const { services } = useSelector((state) => state.services)
  const { loading: creating } = useSelector((state) => state.invoices)

  // Invoice Details state
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [invoiceDate, setInvoiceDate] = useState(today)
  const [isRecurring, setIsRecurring] = useState(false)
  const [interval, setInterval] = useState(1)
  const [intervalType, setIntervalType] = useState('Month')
  const [endDate, setEndDate] = useState('')

  // Invoice Items state
  const [items, setItems] = useState([])

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCustomerList())
    dispatch(fetchServices())
  }, [dispatch])

  const handleCreateInvoice = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer.')
      return
    }
    if (items.length === 0) {
      toast.error('Please add at least one invoice item.')
      return
    }

    // Map items to backend payload structure
    const mappedItems = items.map((item, idx) => ({
      serviceId: item.product?._id,
      hsn: item.product?.hsn || '998399',
      description: item.product?.name,
      professionalFees: item.price,
      govtFees: item.govFee || 0,
      gstPercent: parseFloat(item.gstPercentage) || 0,
    }))

    const payload = {
      customerId: selectedCustomer._id,
      invoiceDate,
      isRecurring,
      items: mappedItems,
      // Recurring fields
      recurring: isRecurring,
      interval: isRecurring ? parseInt(interval) : undefined,
      intervalType: isRecurring ? intervalType : undefined,
      endDate: isRecurring && endDate ? endDate : undefined,
    }

    try {
      const resultAction = await dispatch(createInvoice(payload))
      if (createInvoice.fulfilled.match(resultAction)) {
        const { invoice } = resultAction.payload
        toast.success(isRecurring ? 'Recurring invoice setup successfully!' : 'Invoice created successfully!')
        
        // Generate PDF using the created invoice data
        // Populate the customer data as it was selected in UI
        const pdfData = {
          ...invoice,
          customer: selectedCustomer
        }
        generateInvoicePdf(pdfData, selectedCustomer)

        // Reset Form
        setSelectedCustomer(null)
        setItems([])
        setIsRecurring(false)
        setInvoiceDate(today)
      } else {
        toast.error(resultAction.payload || 'Failed to create invoice')
      }
    } catch (err) {
      toast.error('An unexpected error occurred.')
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-text-primary">
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
        customers={customers}
      />

      {/* Section 3: Invoice Items */}
      <InvoiceItemsSection 
        items={items} 
        setItems={setItems} 
        services={services}
      />

      {/* Section 4: Create Invoice Button */}
      <CreateInvoiceButton 
        onClick={handleCreateInvoice} 
        disabled={creating}
      />
    </div>
  )
}

export default AddInvoice
