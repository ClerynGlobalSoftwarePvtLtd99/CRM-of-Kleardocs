import React from 'react'

const InvoicesHeader = ({ counts }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-bg-tertiary pb-4">
      <h1 className="text-2xl font-black italic tracking-tight uppercase">
        Invoices <span className="text-yellow-500 ml-1 text-3xl tabular-nums">({counts || 0})</span>
      </h1>
    </div>
  )
}

export default InvoicesHeader
