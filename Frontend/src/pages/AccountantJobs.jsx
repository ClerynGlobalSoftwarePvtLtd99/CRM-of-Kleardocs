import React, { useState } from 'react'
import { X, Trash2, ChevronDown } from 'lucide-react'
import AccountantJobsHeader from '../components/accountantJobs/AccountantJobsHeader'
import AccountantJobsFilters from '../components/accountantJobs/AccountantJobsFilters'
import AccountantJobsTable from '../components/accountantJobs/AccountantJobsTable'

const CUSTOMERS = [
  '7DAYS TRAVENTURE (OPC) PRIVATE LIMITED - 7DAYS TRAVENTURE (OPC) PRIVATE LIMITED',
  'A & A FAUCETS PRIVATE LIMITED-A & A FAUCETS PRIVATE LIMITED',
  'o Be',
  'AAJ CODERS HUB PRIVATE LIMITED - AAJ CODERS HUB PRIVATE LIMITED',
  'o Be Do',
  'AARND SERVICES PRIVATE LIMITED - AARND SERVICES PRIVATE LIMITED',
  'AARVION SERVICES INDIA PRIVATE LIMITED -AARVION SERVICES INDIA PRIVATE LIMITED',
  'AATIKSH INTERACTIVE SOLUTIONS (OPC) PRIVATE LIMITED'
]

const STATUSES = ['To be done', 'Ongoing', 'Done']
const ACCOUNTANTS = ['Samrat', 'Tapas', 'Jagjyot']

const INITIAL_JOBS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  created: `6th Feb 2026 11:${String(10 + i).padStart(2, '0')} am`,
  jobName: `Accountant Task ${i + 1}`,
  customer: CUSTOMERS[i % CUSTOMERS.length].split('-')[0].trim(),
  customerLink: `https://crm.startupstation.in/customer/6982ebaf65b9911c9c0b0d1${i}`,
  companyName: CUSTOMERS[i % CUSTOMERS.length],
  phone: `+91 ${9800000000 + i}`,
  expiry: i % 4 === 0 ? `1st Mar 2026` : '-',
  status: STATUSES[i % STATUSES.length],
  completedDate: i % 3 === 2 ? `10th Feb 2026` : '-',
  accountant: ACCOUNTANTS[i % ACCOUNTANTS.length]
}))

const AccountantJobs = () => {
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [selectedJob, setSelectedJob] = useState(null)
  
  // Filter states
  const [searchFilter, setSearchFilter] = useState('')
  const [dateTypeFilter, setDateTypeFilter] = useState('Created')
  const [statusFilter, setStatusFilter] = useState('')
  const [accountantFilter, setAccountantFilter] = useState('')

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    jobTitle: '',
    customer: CUSTOMERS[0],
    status: STATUSES[0],
    accountant: ACCOUNTANTS[0],
    hasExpiryDate: false,
    expiryDate: new Date().toISOString().split('T')[0]
  })

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      customer: CUSTOMERS[0],
      status: STATUSES[0],
      accountant: ACCOUNTANTS[0],
      hasExpiryDate: false,
      expiryDate: new Date().toISOString().split('T')[0]
    })
  }

  const openAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const openEditModal = (job) => {
    setSelectedJob(job)
    setFormData({
      jobTitle: job.jobName,
      customer: job.companyName || CUSTOMERS[0], // using first customer as fallback or matching if possible
      status: job.status,
      accountant: job.accountant,
      hasExpiryDate: job.expiry !== '' && job.expiry !== '-',
      expiryDate: new Date().toISOString().split('T')[0] // simplified for demo
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (job) => {
    setSelectedJob(job)
    setIsDeleteModalOpen(true)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    const now = new Date()
    const formattedDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}`
    
    const newJob = {
      id: Date.now(),
      created: formattedDate,
      jobName: formData.jobTitle,
      customer: formData.customer.split('-')[0].trim(),
      customerLink: '#',
      companyName: formData.customer,
      phone: '-',
      expiry: formData.hasExpiryDate ? formData.expiryDate : '-',
      status: formData.status,
      completedDate: formData.status === 'Done' ? formattedDate : '-',
      accountant: formData.accountant
    }
    setJobs([newJob, ...jobs])
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const updatedJobs = jobs.map(j => {
      if (j.id === selectedJob.id) {
        return {
          ...j,
          jobName: formData.jobTitle,
          customer: formData.customer.split('-')[0].trim(),
          companyName: formData.customer,
          expiry: formData.hasExpiryDate ? formData.expiryDate : '-',
          status: formData.status,
          accountant: formData.accountant
        }
      }
      return j
    })
    setJobs(updatedJobs)
    setIsEditModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    setJobs(jobs.filter(j => j.id !== selectedJob.id))
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      
      <AccountantJobsHeader 
        jobsCount={jobs.length} 
        onAddClick={openAddModal} 
      />

      <AccountantJobsFilters 
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        dateTypeFilter={dateTypeFilter}
        setDateTypeFilter={setDateTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        accountantFilter={accountantFilter}
        setAccountantFilter={setAccountantFilter}
        STATUSES={STATUSES}
        ACCOUNTANTS={ACCOUNTANTS}
      />

      <AccountantJobsTable 
        jobs={jobs}
        onEditClick={openEditModal}
        onDeleteClick={openDeleteModal}
      />

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Add New Job</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
              <form id="add-job-form" onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Job Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Select Customer</label>
                  <div className="relative">
                    <select 
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      className="w-full appearance-none px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] max-h-40 overflow-y-auto"
                    >
                      {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full appearance-none px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Accountant</label>
                  <div className="relative">
                    <select 
                      value={formData.accountant}
                      onChange={(e) => setFormData({...formData, accountant: e.target.value})}
                      className="w-full appearance-none px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {ACCOUNTANTS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-[var(--color-bg-tertiary)] pt-4 mt-4">
                  <span className="text-sm font-medium">Has Expiry Date?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.hasExpiryDate}
                      onChange={(e) => setFormData({...formData, hasExpiryDate: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-[var(--color-bg-tertiary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                  </label>
                </div>

                {formData.hasExpiryDate && (
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Expiry Date</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="p-4 border-t border-[var(--color-bg-tertiary)]">
              <button 
                type="submit" 
                form="add-job-form"
                className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2 rounded-lg font-bold transition-colors"
              >
                ADD NEW JOB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Edit Job</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
              <form id="edit-job-form" onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Job Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Select Customer</label>
                  <div className="relative">
                    <select 
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      className="w-full appearance-none px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] max-h-40 overflow-y-auto"
                    >
                      {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full appearance-none px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Accountant</label>
                  <div className="relative">
                    <select 
                      value={formData.accountant}
                      onChange={(e) => setFormData({...formData, accountant: e.target.value})}
                      className="w-full appearance-none px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {ACCOUNTANTS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-[var(--color-bg-tertiary)] pt-4 mt-4">
                  <span className="text-sm font-medium">Has Expiry Date?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.hasExpiryDate}
                      onChange={(e) => setFormData({...formData, hasExpiryDate: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-[var(--color-bg-tertiary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                  </label>
                </div>

                {formData.hasExpiryDate && (
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Expiry Date</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="p-4 border-t border-[var(--color-bg-tertiary)]">
              <button 
                type="submit" 
                form="edit-job-form"
                className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2 rounded-lg font-bold transition-colors"
              >
                Update Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Modal */}
      {isDeleteModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100/10 text-red-500 rounded-full flex items-center justify-center mb-5 ring-4 ring-red-500/20">
              <Trash2 size={28} />
            </div>

            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Delete this Job Permanently?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
              Job: <span className="font-semibold text-[var(--color-text-primary)]">{selectedJob.jobName}</span> for <span className="font-semibold text-[var(--color-text-primary)]">{selectedJob.accountant}</span>
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-white rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-[var(--color-bg-tertiary)] focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-800 text-white cursor-pointer rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AccountantJobs
