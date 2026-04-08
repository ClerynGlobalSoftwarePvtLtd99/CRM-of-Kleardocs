
import { Download } from 'lucide-react'

const RecurringInvoicesHeader = ({ counts, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-text-primary">Recurring Invoices ({counts})</h1>
      <button 
        onClick={onExport}
        className="px-4 py-2 bg-accent hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium"
      >
        <Download size={18} />
        Export
      </button>
    </div>
  )
}

export default RecurringInvoicesHeader
