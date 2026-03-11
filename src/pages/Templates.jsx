import React, { useState, useMemo } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { X, Trash2, Paperclip, Plus } from 'lucide-react'
import TemplatesHeader from '../components/templates/TemplatesHeader'
import TemplatesFilters from '../components/templates/TemplatesFilters'
import TemplatesTable from '../components/templates/TemplatesTable'

const STATUSES = ['Active', 'Inactive']

const TEMPLATE_VARIABLES = [
  { title: 'General:', vars: ['{{name}}', '{{companyName}}', '{{address}}'] },
  { title: 'Annual Compliance Service Only:', vars: ['{{username}}', '{{password}}'] },
  { title: 'Invoice Only:', vars: ['{{invoiceNo}}', '{{invoiceDate}}', '{{invoiceAmount}}'] },
  { title: 'Annual Compliance Only:', vars: ['{{complianceName}}', '{{complianceDoneDate}}', '{{complianceExpiryDate}}'] },
]

const INITIAL_TEMPLATES = [
  {
    id: 1,
    created: '20th June 2025 2:13 pm',
    name: 'Director Resignation',
    subject: 'Startup Station - Director Resignation Services',
    status: 'Active',
    attachments: [],
    body: `<table style="background: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center; margin: 0 auto; width: 100%; max-width: 600px;" width="100%" align="center" class="mce-item-table">
  <tbody>
    <tr>
      <td style="background-color: #004AAD; color: white; font-size: 20px; font-weight: bold; padding: 15px; text-align: center;">Startup India Registration</td>
    </tr>
    <tr>
      <td style="padding: 15px; text-align: center;">
        <img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" style="display: block; margin: 0 auto;" />
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; font-size: 16px; text-align: center; color: #004AAD;">
        Thank you for choosing <strong>Startup Station</strong> for <br /><strong>Director Resignation Services</strong>.<br />We appreciate your trust in our services.
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; text-align: center;">
        <table style="border-collapse: collapse; margin: 0 auto; width: 100%;" width="100%" class="mce-item-table">
          <tbody>
            <tr>
              <th style="padding: 12px; background-color: #004AAD; color: white; border: 1px solid #cce5ff; text-align: center; width: 33%;">Invoice Number</th>
              <th style="padding: 12px; background-color: #004AAD; color: white; border: 1px solid #cce5ff; text-align: center; width: 33%;">Invoice Amount</th>
              <th style="padding: 12px; background-color: #004AAD; color: white; border: 1px solid #cce5ff; text-align: center; width: 33%;">Invoice Date</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #cce5ff; text-align: center; color: #004AAD;">{{invoiceNo}}</td>
              <td style="padding: 12px; border: 1px solid #cce5ff; text-align: center; color: #004AAD;">{{invoiceAmount}}</td>
              <td style="padding: 12px; border: 1px solid #cce5ff; text-align: center; color: #004AAD;">{{invoiceDate}}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; font-size: 16px; font-weight: bold; background: #e6f2ff; color: #004AAD; text-align: center;">
        To proceed, please provide the following documents to your Relationship Manager:
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; background: #f0f8ff; text-align: center;">
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #004AAD;">Contact Details</h3>
        <p style="margin: 0 0 5px 0; color: #004AAD;">Relationship Manager: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="tel:+919674962601">+91 96749 62601</a></p>
        <p style="margin: 0 0 5px 0; color: #004AAD;">Accountant 1: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="tel:+917605868584">+91 7605 868 584</a></p>
        <p style="margin: 0 0 0 0; color: #004AAD;">Accountant 2: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="tel:+919583723661">+91 95837 23661</a></p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center;">
        <a style="display: inline-block; background-color: #004AAD; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;" href="https://g.page/r/CcT54IQgtRJaEAE/review">Leave a Review</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; background: #e6f2ff; font-size: 14px; color: #004AAD; text-align: center;">
        📧 Contact us: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="mailto:contact@startupstation.in">contact@startupstation.in</a>
      </td>
    </tr>
  </tbody>
</table>`,
  },
  { id: 2, created: '1st March 2025 6:21 pm', name: 'Annual Compliance plus Bookkeeping', subject: 'Annual Compliance Package by Startup Station plus Bookkeeping Services', status: 'Active', attachments: [] },
  { id: 3, created: '26th February 2025 3:19 pm', name: 'Package plus payment details', subject: 'Annual Compliance Package by Startup Station', status: 'Active', attachments: [] },
  { id: 4, created: '26th February 2025 11:59 am', name: 'ROC plus GST plus ESI plus TDS', subject: 'Annual Compliance Package by Startup Station', status: 'Active', attachments: [] },
  { id: 5, created: '22nd February 2025 8:05 am', name: 'INC 20A Reminder', subject: 'Urgent: INC-20A Filing Pending – Avoid Late Penalties!', status: 'Active', attachments: [] },
  { id: 6, created: '18th February 2025 9:45 am', name: 'Next Quarter Payment', subject: "Reminder: Upcoming Quarter's Payment – Complete Within 5 Days", status: 'Active', attachments: [] },
  { id: 7, created: '18th February 2025 9:31 am', name: 'Service List', subject: 'Discover Our Key Services to Boost Your Business – Startup Station', status: 'Active', attachments: [] },
  { id: 8, created: '17th February 2025 2:24 pm', name: 'GST Filing', subject: 'Urgent: Submit Your GST Invoices by 6th for Timely Filing!', status: 'Active', attachments: [] },
  { id: 9, created: '17th February 2025 2:17 pm', name: 'Professional Tax', subject: 'Get Professional Tax Registration immediately!', status: 'Active', attachments: [] },
  { id: 10, created: '17th February 2025 2:07 pm', name: 'Website', subject: 'Your Website at just Rs 5000!', status: 'Active', attachments: [] },
  { id: 11, created: '17th February 2025 1:56 pm', name: 'Startup India Promotion', subject: 'Get Your Startup India Registration (DPIIT Certificate) at Just ₹2,999 with Startup Station! 🚀', status: 'Active', attachments: [] },
  { id: 12, created: '12th February 2025 10:20 pm', name: 'Startup India Registration', subject: 'Startup India Registration - Next Steps & Document Submission', status: 'Active', attachments: [{ id: 1, name: 'Startup India Guide.pdf' }] },
  { id: 13, created: '12th February 2025 8:49 pm', name: 'Annual Compliance - Onboarding', subject: 'Welcome to Startup Station – Your Annual Compliance Access', status: 'Active', attachments: [] },
  { id: 14, created: '24th January 2025 12:00 pm', name: 'Annual Compliance Service plus GST plus ESI - Ritu Kaur', subject: 'Annual Compliance Package for {{companyName}}', status: 'Active', attachments: [] },
  { id: 15, created: '22nd January 2025 9:50 am', name: 'Annual Compliance Service - Ritu Kaur', subject: 'Annual Compliance Package for {{companyName}}', status: 'Active', attachments: [] },
  { id: 16, created: '21st January 2025 11:30 pm', name: 'Compliance Update', subject: 'Compliance Update - {{complianceName}} for {{companyName}}', status: 'Active', attachments: [] },
  { id: 17, created: '8th January 2025 8:41 am', name: 'Annual Compliance Service - Jagjyot Singh', subject: 'Annual Compliance Service by Startup Station', status: 'Active', attachments: [] },
]

const DEFAULT_FORM = {
  name: '',
  subject: '',
  status: 'Active',
  body: '',
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
}

const TemplateFormFields = ({ formData, setFormData }) => (
  <div className="space-y-4">
    {/* Name */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">Name</label>
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      />
    </div>
    {/* Subject */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">Subject</label>
      <input
        type="text"
        required
        value={formData.subject}
        onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      />
    </div>
    {/* Status */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">Status</label>
      <select
        value={formData.status}
        onChange={(e) => setFormData(f => ({ ...f, status: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      >
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    {/* Template Variables Help */}
    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-3 text-xs text-[var(--color-text-secondary)] space-y-2">
      {TEMPLATE_VARIABLES.map(group => (
        <div key={group.title}>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">{group.title}</p>
          <div className="flex flex-wrap gap-1.5">
            {group.vars.map(v => (
              <span key={v} className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded px-2 py-0.5 font-mono">{v}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    {/* Rich Text Editor */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">Email Body</label>
      <div className="rounded-lg overflow-hidden border border-[var(--color-bg-tertiary)]">
        <ReactQuill
          theme="snow"
          value={formData.body}
          onChange={(val) => setFormData(f => ({ ...f, body: val }))}
          modules={quillModules}
          style={{ height: '400px', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
        />
      </div>
    </div>
    {/* spacer for quill toolbar overlap */}
    <div className="pt-10" />
  </div>
)

const Templates = () => {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [searchFilter, setSearchFilter] = useState('')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const filteredTemplates = useMemo(() => {
    if (!searchFilter.trim()) return templates
    const q = searchFilter.toLowerCase()
    return templates.filter(t =>
      t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    )
  }, [templates, searchFilter])

  const openAddModal = () => {
    setFormData(DEFAULT_FORM)
    setIsAddModalOpen(true)
  }

  const openEditModal = (tmpl) => {
    setSelectedTemplate(tmpl)
    setFormData({ name: tmpl.name, subject: tmpl.subject, status: tmpl.status, body: tmpl.body || '' })
    setIsEditModalOpen(true)
  }

  const openManageModal = (tmpl) => {
    setSelectedTemplate(tmpl)
    setIsManageModalOpen(true)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    const now = new Date()
    const d = now.getDate()
    const suffix = d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const created = `${d}${suffix} ${months[now.getMonth()]} ${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}`
    setTemplates(prev => [{ id: Date.now(), created, ...formData, attachments: [] }, ...prev])
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? { ...t, ...formData } : t))
    setIsEditModalOpen(false)
  }

  const addAttachment = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setTemplates(prev => prev.map(t =>
        t.id === selectedTemplate.id
          ? { ...t, attachments: [...(t.attachments || []), { id: Date.now(), name: file.name }] }
          : t
      ))
      setSelectedTemplate(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), { id: Date.now(), name: file.name }]
      }))
    }
    input.click()
  }

  const removeAttachment = (attachId) => {
    setTemplates(prev => prev.map(t =>
      t.id === selectedTemplate.id
        ? { ...t, attachments: t.attachments.filter(a => a.id !== attachId) }
        : t
    ))
    setSelectedTemplate(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachId)
    }))
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      <TemplatesHeader count={templates.length} onAddClick={openAddModal} />
      <TemplatesFilters searchFilter={searchFilter} setSearchFilter={setSearchFilter} />
      <TemplatesTable
        templates={filteredTemplates}
        onEditClick={openEditModal}
        onManageClick={openManageModal}
      />

      {/* ── Add Template Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Add New Email Template</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1">
              <form id="add-template-form" onSubmit={handleAddSubmit}>
                <TemplateFormFields formData={formData} setFormData={setFormData} />
              </form>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button type="submit" form="add-template-form" className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors">
                ADD NEW TEMPLATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Template Modal ── */}
      {isEditModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Edit Job</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1">
              <form id="edit-template-form" onSubmit={handleEditSubmit}>
                <TemplateFormFields formData={formData} setFormData={setFormData} />
              </form>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button type="submit" form="edit-template-form" className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors">
                Update Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Manage Attachments Modal ── */}
      {isManageModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Email Attachments</h2>
              <button onClick={() => setIsManageModalOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><X size={20} /></button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="bg-[var(--color-bg-tertiary)] rounded-lg px-4 py-3">
                <p className="text-sm text-[var(--color-text-secondary)]">Template Name</p>
                <p className="font-semibold">{selectedTemplate.name}</p>
              </div>
              {/* Attachments List */}
              <div className="space-y-2">
                {(selectedTemplate.attachments || []).length === 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)] italic text-center py-4">No attachments yet.</p>
                ) : (
                  selectedTemplate.attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Paperclip size={14} className="text-[var(--color-text-secondary)]" />
                        <span className="text-sm">{att.name}</span>
                      </div>
                      <button onClick={() => removeAttachment(att.id)} className="text-red-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={addAttachment}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[var(--color-bg-tertiary)] hover:border-[var(--color-accent)] rounded-lg py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Plus size={16} />
                Add new file
              </button>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button onClick={() => setIsManageModalOpen(false)} className="w-full bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white text-[var(--color-text-primary)] py-2.5 rounded-lg font-bold transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates
