import React from 'react'
import { templateOptions, completeTemplateOptions } from './constants'
import { X } from 'lucide-react'

const FormFieldWrapper = ({ label, id, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-sm font-semibold text-[var(--color-text-primary)]"
    >
      {label}
    </label>
    {children}
  </div>
)

const AddComplianceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    complianceName: '',
    hasExpiry: false,
    expiryDate: '',
    inc20: 'No',
    expiryTemplate: 'GST Filing', // Default as per requirements
    completeTemplate: 'None', // Default as per requirements
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === 'checkbox' ? (id === 'hasExpiry' ? checked : checked) : value,
    }))
  }

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, hasExpiry: !prev.hasExpiry }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 font-sans max-h-screen overflow-y-auto">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-2xl w-full max-w-lg flex flex-col my-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-bg-tertiary)] sticky top-0 bg-[var(--color-bg-secondary)] rounded-t-xl z-10">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
            Add Compliance
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form
            id="addComplianceForm"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <FormFieldWrapper label="Compliance Name *" id="complianceName">
              <input
                type="text"
                id="complianceName"
                value={formData.complianceName}
                onChange={handleChange}
                required
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </FormFieldWrapper>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-[var(--color-text-primary)] mb-0">
                Has Expiry?
              </label>
              <button
                type="button"
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.hasExpiry
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasExpiry ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <FormFieldWrapper label="Expiry date" id="expiryDate">
              <input
                type="date"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Inc 20?" id="inc20">
              <select
                id="inc20"
                value={formData.inc20}
                onChange={handleChange}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Expiry Template" id="expiryTemplate">
              <select
                id="expiryTemplate"
                value={formData.expiryTemplate}
                onChange={handleChange}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                {templateOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Complete Template" id="completeTemplate">
              <select
                id="completeTemplate"
                value={formData.completeTemplate}
                onChange={handleChange}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                {completeTemplateOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormFieldWrapper>
          </form>
        </div>

        <div className="p-5 border-t border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-b-xl flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] rounded-lg font-bold transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="addComplianceForm"
            className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-yellow-500 text-white cursor-pointer rounded-lg font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 text-sm"
          >
            Add Compliances
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddComplianceModal
