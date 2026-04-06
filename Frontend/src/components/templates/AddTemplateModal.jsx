import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { X } from 'lucide-react'
import RichTextEditor from '../RichTextEditor'
import { createTemplate } from '../../redux/slices/templatesSlice'

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
      <label className="block text-sm text-text-secondary mb-1 font-medium">
        Name
      </label>
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
        className="w-full px-3 py-2 bg-bg-primary border border-bg-tertiary rounded-lg focus:outline-none focus:border-accent text-text-primary"
      />
    </div>
    {/* Subject */}
    <div>
      <label className="block text-sm text-text-secondary mb-1 font-medium">
        Subject
      </label>
      <input
        type="text"
        required
        value={formData.subject}
        onChange={(e) =>
          setFormData((f) => ({ ...f, subject: e.target.value }))
        }
        className="w-full px-3 py-2 bg-bg-primary border border-bg-tertiary rounded-lg focus:outline-none focus:border-accent text-text-primary"
      />
    </div>
    {/* Status */}
    <div>
      <label className="block text-sm text-text-secondary mb-1 font-medium">
        Status
      </label>
      <select
        value={formData.status}
        onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
        className="w-full px-3 py-2 bg-bg-primary border border-bg-tertiary rounded-lg focus:outline-none focus:border-accent text-text-primary"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
    {/* Template Variables Help */}
    <div className="bg-bg-tertiary rounded-lg p-3 text-xs text-text-secondary space-y-2">
      {TEMPLATE_VARIABLES.map((group) => (
        <div key={group.title}>
          <p className="font-semibold text-text-primary mb-1">
            {group.title}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.vars.map((v) => (
              <span
                key={v}
                className="bg-bg-secondary border border-bg-tertiary rounded px-2 py-0.5 font-mono"
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
      <label className="block text-sm text-text-secondary mb-1 font-medium">
        Email Body
      </label>
      <div className="rounded-lg overflow-hidden border border-bg-tertiary bg-bg-primary">
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
const AddTemplateModal = ({ onClose }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createTemplate(formData)).unwrap()
      onClose()
    } catch (error) {
      console.error('Failed to create template:', error)
      alert(error || 'Failed to create template')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-bg-tertiary">
          <h2 className="text-lg font-bold">Add New Email Template</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-bg-tertiary flex-1">
          <form id="add-template-form" onSubmit={handleSubmit}>
            <TemplateFormFields formData={formData} setFormData={setFormData} />
          </form>
        </div>
        <div className="p-5 border-t border-bg-tertiary">
          <button
            type="submit"
            form="add-template-form"
            className="w-full bg-accent hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors"
          >
            ADD NEW TEMPLATE
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTemplateModal
