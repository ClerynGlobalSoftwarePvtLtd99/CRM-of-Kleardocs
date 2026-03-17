import React from 'react'

const InvoicesHeader = ({ counts }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Invoices ({counts})</h1>
    </div>
  )
}

export default InvoicesHeader
