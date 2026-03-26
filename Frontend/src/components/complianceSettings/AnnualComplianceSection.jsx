import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchComplianceSettings, addComplianceSetting, updateComplianceSetting, deleteComplianceSetting } from '../../redux/slices/complianceSlice'
import toast from 'react-hot-toast'
import FinancialYearDropdown from './FinancialYearDropdown'
import ComplianceTable from './ComplianceTable'
import AddComplianceModal from './AddComplianceModal'
import EditComplianceModal from './EditComplianceModal'
import ContentLoader from '../common/ContentLoader'

const AnnualComplianceSection = () => {
  const dispatch = useAppDispatch()
  const { financialYears, compliances, loading } = useAppSelector((state) => state.compliance)

  const [selectedYear, setSelectedYear] = useState('')
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCompliance, setEditingCompliance] = useState(null)

  const handleLoad = async () => {
    if (!selectedYear) {
      toast.error('Please select a financial year')
      return
    }
    
    try {
      await dispatch(fetchComplianceSettings(selectedYear)).unwrap()
      setIsDataLoaded(true)
      toast.success('Data loaded successfully!')
    } catch (err) {
      toast.error(err || 'Failed to load data')
    }
  }

  const handleAddCompliance = async (newCompliance) => {
    try {
      await dispatch(addComplianceSetting({ ...newCompliance, financialYear: selectedYear })).unwrap()
      setIsAddModalOpen(false)
      toast.success('Compliance added successfully')
    } catch (err) {
      toast.error(err || 'Failed to add compliance')
    }
  }

  const handleEditCompliance = async (updatedCompliance) => {
    try {
      await dispatch(updateComplianceSetting({ 
        complianceId: updatedCompliance._id, 
        data: updatedCompliance 
      })).unwrap()
      setIsEditModalOpen(false)
      setEditingCompliance(null)
      toast.success('Compliance updated successfully')
    } catch (err) {
      toast.error(err || 'Failed to update compliance')
    }
  }

  const handleDeleteCompliance = async (id) => {
    if (!window.confirm('Are you sure you want to delete this compliance setting?')) return
    try {
      await dispatch(deleteComplianceSetting(id)).unwrap()
      toast.success('Compliance deleted successfully')
    } catch (err) {
      toast.error(err || 'Failed to delete compliance')
    }
  }

  const openEditModal = (compliance) => {
    setEditingCompliance(compliance)
    setIsEditModalOpen(true)
  }

  return (
    <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Annual Compliances Settings
        </h2>
        <div className="flex items-center gap-4">
          <FinancialYearDropdown
            financialYears={financialYears}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            onLoad={handleLoad}
          />
          {selectedYear && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[var(--color-accent)] hover:bg-yellow-500 cursor-pointer text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 text-sm whitespace-nowrap"
            >
              + Add Compliance
            </button>
          )}
        </div>
      </div>

      <hr className="border-[var(--color-bg-tertiary)] mb-6" />

      {loading ? (
        <div className="py-6">
          <ContentLoader message="Fetching compliance settings..." />
        </div>
      ) : (
        <ComplianceTable compliances={compliances} onEdit={openEditModal} onDelete={handleDeleteCompliance} />
      )}

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
