import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Search, Eye, X, Paperclip, Trash2, Download, ExternalLink } from 'lucide-react'
import TemplatesHeader from '../components/templates/TemplatesHeader'
import TemplatesFilters from '../components/templates/TemplatesFilters'
import TemplatesTable from '../components/templates/TemplatesTable'
import AddTemplateModal from '../components/templates/AddTemplateModal'
import { TemplateFormFields, DEFAULT_FORM } from '../components/templates/AddTemplateModal'
import { fetchTemplates, updateTemplate, deleteTemplate } from '../redux/slices/templatesSlice'
import { injectTemplateData } from '../utils/templateEngine'
import ContentLoader from '../components/common/ContentLoader'

const PREVIEW_CONTEXT = {
  companyName: 'CLERYN GLOBAL SOFTWARE PVT LTD',
  customerName: 'Raju Bandar',
  address: 'Salt Lake, Sector V, Kolkata',
  username: 'raju_cleryn',
  password: 'hashedpassword123',
  invoiceNo: 'KLD-2024-001',
  invoiceDate: '24 Mar 2026',
  invoiceAmount: '₹15,000',
  complianceName: 'ROC Filing',
  complianceDoneDate: '25 Mar 2026',
  complianceExpiryDate: '31 Mar 2026'
};



const INITIAL_TEMPLATES = []



const Templates = () => {
  const dispatch = useDispatch()
  const { list: templates = [], loading, error } = useSelector((state) => state.templates) || {}
  const [searchFilter, setSearchFilter] = useState('')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  useEffect(() => {
    dispatch(fetchTemplates())
  }, [dispatch])

  const filteredTemplates = useMemo(() => {
    if (!searchFilter.trim()) return templates
    const q = searchFilter.toLowerCase()
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    )
  }, [templates, searchFilter])

  const openAddModal = () => {
    setFormData(DEFAULT_FORM)
    setIsAddModalOpen(true)
  }

  const openEditModal = (tmpl) => {
    setSelectedTemplate(tmpl)
    setFormData({
      name: tmpl.name,
      subject: tmpl.subject,
      status: tmpl.status,
      body: tmpl.body || '',
    })
    setIsEditModalOpen(true)
  }

  const openManageModal = (tmpl) => {
    setSelectedTemplate(tmpl)
    setIsManageModalOpen(true)
  }

  const handlePreviewClick = (template) => {
    setSelectedTemplate(template)
    setIsPreviewModalOpen(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    dispatch(updateTemplate({ id: selectedTemplate._id, data: formData }))
    setIsEditModalOpen(false)
  }

  const addAttachment = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const newAttachments = [...(selectedTemplate.attachments || []), file.name]
        dispatch(updateTemplate({ 
          id: selectedTemplate._id, 
          data: { attachments: newAttachments } 
        }))
        // Note: In real app, you'd upload the file first and store URL
        setSelectedTemplate(prev => ({ ...prev, attachments: newAttachments }))
      }
    }
    input.click()
  }

  const removeAttachment = (fileName) => {
    const newAttachments = (selectedTemplate.attachments || []).filter(a => a !== fileName)
    dispatch(updateTemplate({ 
      id: selectedTemplate._id, 
      data: { attachments: newAttachments } 
    }))
    setSelectedTemplate(prev => ({ ...prev, attachments: newAttachments }))
  }

  return (
    <div className="flex-1 p-4 md:p-8 w-full text-[var(--color-text-primary)]">
      <TemplatesHeader count={templates.length} onAddClick={openAddModal} />
      <TemplatesFilters
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      {loading ? (
        <div className="py-8">
          <ContentLoader message="Fetching templates..." />
        </div>
      ) : (
        <TemplatesTable
          templates={filteredTemplates}
          onEditClick={openEditModal}
          onManageClick={openManageModal}
          onPreviewClick={handlePreviewClick}
        />
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold">Template Preview: {selectedTemplate.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Subject: {selectedTemplate.subject}</p>
              </div>
              <button onClick={() => setIsPreviewModalOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50 flex-1">
              <div 
                className="bg-white shadow-lg p-10 mx-auto max-w-[800px] min-h-[600px] prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: injectTemplateData(selectedTemplate.body, PREVIEW_CONTEXT) }}
              />
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)] flex justify-between items-center bg-[var(--color-bg-primary)] rounded-b-2xl">
              <p className="text-xs text-[var(--color-text-secondary)] italic">
                * This preview uses sample data for placeholders like {"{{companyName}}"}
              </p>
              <button 
                onClick={() => setIsPreviewModalOpen(false)} 
                className="px-6 py-2 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] rounded-lg font-medium transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Add Template Modal ── */}
      {isAddModalOpen && (
        <AddTemplateModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* ── Edit Template Modal ── */}
      {isEditModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Edit Email Template</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1">
              <form id="edit-template-form" onSubmit={handleEditSubmit}>
                <TemplateFormFields
                  formData={formData}
                  setFormData={setFormData}
                />
              </form>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button
                type="submit"
                form="edit-template-form"
                className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors"
              >
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
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="bg-[var(--color-bg-tertiary)] rounded-lg px-4 py-3">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Template Name
                </p>
                <p className="font-semibold">{selectedTemplate.name}</p>
              </div>
              {/* Attachments List */}
              <div className="space-y-2">
                {(selectedTemplate.attachments || []).length === 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)] italic text-center py-4">
                    No attachments yet.
                  </p>
                ) : (
                  selectedTemplate.attachments.map((att) => (
                    <div
                      key={att}
                      className="flex items-center justify-between bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip
                          size={14}
                          className="text-[var(--color-text-secondary)]"
                        />
                        <span className="text-sm">{att}</span>
                      </div>
                      <Trash2
                        size={14}
                        className="text-red-400 hover:text-red-500 cursor-pointer transition-colors"
                        onClick={() => removeAttachment(att)}
                      />
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
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="w-full bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white text-[var(--color-text-primary)] py-2.5 rounded-lg font-bold transition-colors"
              >
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
