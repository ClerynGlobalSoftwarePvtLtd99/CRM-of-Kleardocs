import React, { useState } from 'react'
import FinancialYearDropdown from './FinancialYearDropdown'
import ComplianceTable from './ComplianceTable'
import AddComplianceModal from './AddComplianceModal'
import EditComplianceModal from './EditComplianceModal'
import { DUMMY_COMPLIANCES } from './constants'
import toast from 'react-hot-toast'

const AnnualComplianceSection = ({ financialYears }) => {
  const [selectedYear, setSelectedYear] = useState('')
  const [compliances, setCompliances] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCompliance, setEditingCompliance] = useState(null)

  const handleLoad = () => {
    if (!selectedYear) {
      toast.error('Please select a financial year')
      return
    }
    // Simulate API fetch with mock data
    setCompliances(DUMMY_COMPLIANCES)
    setIsDataLoaded(true)
    toast.success('Data loaded successfully!', {
      style: {
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-bg-tertiary)',
      },
      iconTheme: { primary: '#10b981', secondary: '#fff' },
    })
  }

  const handleAddCompliance = (newCompliance) => {
    const newEntry = {
      ...newCompliance,
      id: Date.now().toString(),
      expiryAfter: newCompliance.hasExpiry ? '30 days' : null, // Mock derived state
    }
    setCompliances([...compliances, newEntry])
    setIsAddModalOpen(false)
    toast.success('Compliance added successfully', {
      style: {
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-bg-tertiary)',
      },
      iconTheme: { primary: '#10b981', secondary: '#fff' },
    })
  }

  const handleEditCompliance = (updatedCompliance) => {
    setCompliances(
      compliances.map((c) =>
        c.id === updatedCompliance.id ? updatedCompliance : c
      )
    )
    setIsEditModalOpen(false)
    setEditingCompliance(null)
    toast.success('Compliance updated successfully', {
      style: {
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-bg-tertiary)',
      },
      iconTheme: { primary: '#10b981', secondary: '#fff' },
    })
  }

  const openEditModal = (compliance) => {
    setEditingCompliance(compliance)
    setIsEditModalOpen(true)
  }

  return (
    <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-bg-tertiary)] pb-4 mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Annual Compliances Settings
        </h2>
        {isDataLoaded && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[var(--color-accent)] hover:bg-yellow-500 cursor-pointer text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 text-sm whitespace-nowrap ml-auto"
          >
            Add Compliance
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <FinancialYearDropdown
          financialYears={financialYears}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onLoad={handleLoad}
        />
      </div>

      <ComplianceTable compliances={compliances} onEdit={openEditModal} />

      <AddComplianceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCompliance}
      />

      <EditComplianceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingCompliance(null)
        }}
        data={editingCompliance}
        onSubmit={handleEditCompliance}
      />
    </section>
  )
}

export default AnnualComplianceSection
