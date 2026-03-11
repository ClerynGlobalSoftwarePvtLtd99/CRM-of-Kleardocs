import React from 'react'
import { Plus } from 'lucide-react'

const AccountantJobsHeader = ({ jobsCount, onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Accountant Jobs ({jobsCount})</h1>
      <button
        onClick={onAddClick}
        className="bg-[var(--color-accent)] hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
      >
        <Plus size={20} />
        new job
      </button>
    </div>
  )
}

export default AccountantJobsHeader
