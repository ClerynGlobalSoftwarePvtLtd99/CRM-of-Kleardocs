import React, { useState } from 'react'
import { X } from 'lucide-react'
import RichTextEditor from '../RichTextEditor'

const STATUSES = ['Active', 'Inactive']

export const TEMPLATE_VARIABLES = [
  { title: 'General:', vars: ['{{name}}', '{{companyName}}', '{{address}}'] },
  {
    title: 'Annual Compliance Service Only:',
    vars: ['{{username}}', '{{password}}'],
  },
  {
    title: 'Invoice Only:',
    vars: ['{{invoiceNo}}', '{{invoiceDate}}', '{{invoiceAmount}}'],
  },
  {
    title: 'Annual Compliance Only:',
    vars: ['{{complianceName}}', '{{complianceDoneDate}}', '{{complianceExpiryDate}}'],
  },
]

export const DEFAULT_FORM = {
  name: '',
  subject: '',
  status: 'Active',
  body: '',
}

export const TemplateFormFields = ({ formData, setFormData }) => (
  <div className="space-y-4">
    {/* Name */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Name
      </label>
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      />
    </div>
    {/* Subject */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Subject
      </label>
      <input
        type="text"
        required
        value={formData.subject}
        onChange={(e) =>
          setFormData((f) => ({ ...f, subject: e.target.value }))
        }
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      />
    </div>
    {/* Status */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Status
      </label>
      <select
        value={formData.status}
        onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
    {/* Template Variables Help */}
    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-3 text-xs text-[var(--color-text-secondary)] space-y-2">
      {TEMPLATE_VARIABLES.map((group) => (
        <div key={group.title}>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">
            {group.title}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.vars.map((v) => (
              <span
                key={v}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded px-2 py-0.5 font-mono"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
    {/* Rich Text Editor */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Email Body
      </label>
      <div className="rounded-lg overflow-hidden border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)]">
        <RichTextEditor
          value={formData.body}
          onChange={(val) => setFormData((f) => ({ ...f, body: val }))}
        />
      </div>
    </div>
  </div>
)

/**
 * AddTemplateModal
 * Props:
 *   onClose  — called to close the modal
 *   onAdd    — called with the new template object on submit (optional)
 */
const AddTemplateModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const handleSubmit = (e) => {
    e.preventDefault()
    const now = new Date()
    const d = now.getDate()
    const suffix = d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'
    const months = [
      'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December',
    ]
    const created = `${d}${suffix} ${months[now.getMonth()]} ${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}`
    if (onAdd) {
      onAdd({ id: Date.now(), created, ...formData, attachments: [] })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
          <h2 className="text-lg font-bold">Add New Email Template</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1">
          <form id="add-template-form" onSubmit={handleSubmit}>
            <TemplateFormFields formData={formData} setFormData={setFormData} />
          </form>
        </div>
        <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
          <button
            type="submit"
            form="add-template-form"
            className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors"
          >
            ADD NEW TEMPLATE
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTemplateModal
