import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { addCustomerFinancialYear } from '../../redux/slices/customersSlice'

const AddFinancialYearModal = ({ customer, onClose, onSuccess }) => {
  const dispatch = useDispatch()
  const [financialYear, setFinancialYear] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!financialYear.trim()) {
      toast.error('Please enter a financial year')
      return
    }

    setLoading(true)
    try {
      await dispatch(addCustomerFinancialYear({ 
        customerId: customer._id, 
        financialYear: financialYear.trim() 
      })).unwrap()
      
      toast.success('Financial year added successfully')
      onSuccess && onSuccess(financialYear.trim())
      onClose()
    } catch (error) {
      toast.error(error || 'Failed to add financial year')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-bg-tertiary">
          <h3 className="text-lg font-bold text-text-primary">
            Add Financial Year
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="financialYearInput"
                className="text-sm font-semibold text-text-primary"
              >
                Financial Year *
              </label>
              <input
                type="text"
                id="financialYearInput"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                placeholder="e.g. 2026-2027"
                className="w-full bg-bg-primary border border-bg-tertiary px-4 py-2.5 rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

          <div className="p-4 border-t border-bg-tertiary bg-bg-primary rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-bg-tertiary cursor-pointer text-text-primary hover:bg-bg-tertiary hover:text-text-primary rounded-lg font-semibold transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent hover:bg-yellow-500 text-white cursor-pointer rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'ADD FINANCIAL YEAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFinancialYearModal