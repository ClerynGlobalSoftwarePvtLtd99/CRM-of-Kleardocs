import React from 'react'
import { FileCheck } from 'lucide-react'

const CreateInvoiceButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-4 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-colors shadow-lg cursor-pointer"
    >
      <FileCheck size={20} />
      CREATE INVOICE
    </button>
  )
}

export default CreateInvoiceButton
