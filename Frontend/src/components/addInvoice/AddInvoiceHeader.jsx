import React from 'react'
import { FilePlus } from 'lucide-react'

const AddInvoiceHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg flex items-center justify-center">
          <FilePlus size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create Invoice</h1>
      </div>
    </div>
  )
}

export default AddInvoiceHeader
