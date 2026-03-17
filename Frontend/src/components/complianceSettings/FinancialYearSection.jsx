import React, { useState } from 'react'
import toast from 'react-hot-toast'
import AddFinancialYearModal from './AddFinancialYearModal'
import EditFinancialYearModal from './EditFinancialYearModal'

const FinancialYearSection = ({ financialYears, setFinancialYears }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newYearValue, setNewYearValue] = useState('')
  const [editYearValue, setEditYearValue] = useState('')
  const [editingYearId, setEditingYearId] = useState(null)

  const handleAddYear = () => {
    if (!newYearValue.trim()) {
      toast.error('Please enter a financial year')
      return
    }

    // Check if exists
    if (financialYears.some((fy) => fy.year === newYearValue.trim())) {
      toast.error('Financial year already exists')
      return
    }

    const newYear = {
      id: Date.now().toString(),
      year: newYearValue.trim(),
    }

    setFinancialYears([...financialYears, newYear])
    setNewYearValue('')
    setIsAddModalOpen(false)
    toast.success('Financial year added successfully', {
      style: {
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-bg-tertiary)',
      },
      iconTheme: { primary: '#10b981', secondary: '#fff' },
    })
  }

  const handleEditClick = (fy) => {
    setEditingYearId(fy.id)
    setEditYearValue(fy.year)
    setIsEditModalOpen(true)
  }

  const handleUpdateYear = () => {
    if (!editYearValue.trim()) {
      toast.error('Please enter a financial year')
      return
    }

    // Check if exists (and isn't the one we're currently editing)
    if (
      financialYears.some(
        (fy) => fy.year === editYearValue.trim() && fy.id !== editingYearId
      )
    ) {
      toast.error('Financial year already exists')
      return
    }

    setFinancialYears(
      financialYears.map((fy) =>
        fy.id === editingYearId ? { ...fy, year: editYearValue.trim() } : fy
      )
    )

    setEditYearValue('')
    setEditingYearId(null)
    setIsEditModalOpen(false)

    toast.success('Financial year updated successfully', {
      style: {
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-bg-tertiary)',
      },
      iconTheme: { primary: '#10b981', secondary: '#fff' },
    })
  }

  return (
    <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-bg-tertiary)] pb-4 mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Financial Year Settings
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[var(--color-accent)] hover:bg-yellow-600 cursor-pointer text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 text-sm whitespace-nowrap"
        >
          ADD FINANCIAL YEAR
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--color-bg-tertiary)] rounded-lg">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-[var(--color-bg-primary)] border-b border-[var(--color-bg-tertiary)]">
              <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)] w-2/3">
                Financial Year
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)] text-right pr-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {financialYears.length === 0 ? (
              <tr className="hover:bg-[var(--color-bg-primary)] transition-colors">
                <td
                  colSpan="2"
                  className="py-6 text-center text-sm text-[var(--color-text-secondary)] italic"
                >
                  No financial years added yet.
                </td>
              </tr>
            ) : (
              financialYears.map((fy) => (
                <tr
                  key={fy.id}
                  className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] transition-colors last:border-0"
                >
                  <td className="py-3 px-4 text-sm font-medium text-[var(--color-text-primary)]">
                    {fy.year}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <button
                      onClick={() => handleEditClick(fy)}
                      className="text-[var(--color-accent)] hover:text-yellow-600 font-semibold cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-yellow-50/10 active:opacity-70"
                    >
                      Modify
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddFinancialYearModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setNewYearValue('')
        }}
        onSubmit={handleAddYear}
        yearValue={newYearValue}
        setYearValue={setNewYearValue}
      />

      <EditFinancialYearModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditYearValue('')
          setEditingYearId(null)
        }}
        onSubmit={handleUpdateYear}
        yearValue={editYearValue}
        setYearValue={setEditYearValue}
      />
    </section>
  )
}

export default FinancialYearSection
