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
import { X } from 'lucide-react'

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
  const [description, setDescription] = useState('')
  const [showDescription, setShowDescription] = useState(false)

  // Invoice Items state
  const [items, setItems] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCustomerList())
    dispatch(fetchServices())
  }, [dispatch])

  const handleOpenConfirm = () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer.')
      return
    }
    if (items.length === 0) {
      toast.error('Please add at least one invoice item.')
      return
    }
    setShowConfirmModal(true)
  }

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
      professionalFees: (item.price || 0) / (item.quantity || 1),
      govtFees: (item.govFee || 0) / (item.quantity || 1),
      quantity: item.quantity || 1,
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
      description: showDescription ? description : undefined,
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
          customer: selectedCustomer,
          // Ensure GST split fields are passed for correct PDF rendering
          gstType: invoice.gstType,
          totalCgst: invoice.totalCgst,
          totalSgst: invoice.totalSgst,
          totalIgst: invoice.totalIgst,
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
        description={description}
        setDescription={setDescription}
        showDescription={showDescription}
        setShowDescription={setShowDescription}
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
        onClick={handleOpenConfirm} 
        disabled={creating}
      />

      {/* Description Confirmation Modal Popup */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[var(--color-text-primary)]">
          <div className="w-full max-w-md bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-bg-tertiary)]">
              <h3 className="text-xl font-bold">Add Invoice Description</h3>
              <button 
                type="button"
                onClick={() => setShowConfirmModal(false)} 
                className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[var(--color-text-secondary)]" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 py-2 px-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={showDescription}
                      onChange={(e) => setShowDescription(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-[var(--color-bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                  </label>
                  <span className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Add Description?</span>
                </div>

                {showDescription && (
                  <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Description</span>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter invoice description..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]/75 rounded-lg text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleCreateInvoice();
                  }}
                  className="flex-1 px-4 py-3 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddInvoice
