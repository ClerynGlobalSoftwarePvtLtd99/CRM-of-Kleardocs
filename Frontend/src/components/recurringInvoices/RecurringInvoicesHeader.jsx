import React from 'react'
import { Download } from 'lucide-react'

const RecurringInvoicesHeader = ({ counts }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Recurring Invoices ({counts})</h1>
      <button className="px-4 py-2 bg-yellow-500 hover:bg-[var(--color-accent)] text-[var(--color-text-primary)] hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium">
        <Download size={18} />
        Export
      </button>
    </div>
  )
}

export default RecurringInvoicesHeader
