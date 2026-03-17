import React from 'react'
import { X } from 'lucide-react'

const EditFinancialYearModal = ({
  isOpen,
  onClose,
  onSubmit,
  yearValue,
  setYearValue,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-bg-tertiary)]">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            Edit Financial Year
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="editFinancialYearInput"
              className="text-sm font-semibold text-[var(--color-text-primary)]"
            >
              Financial Year *
            </label>
            <input
              type="text"
              id="editFinancialYearInput"
              value={yearValue}
              onChange={(e) => setYearValue(e.target.value)}
              placeholder="e.g. 2026-2027"
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
        </div>

        <div className="p-4 border-t border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] rounded-lg font-semibold transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white cursor-pointer rounded-lg font-semibold transition-colors text-sm"
          >
            Update Financial Year
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditFinancialYearModal
