import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Trash2, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import AccountantJobsHeader from '../components/accountantJobs/AccountantJobsHeader'
import AccountantJobsFilters from '../components/accountantJobs/AccountantJobsFilters'
import AccountantJobsTable from '../components/accountantJobs/AccountantJobsTable'
import { fetchJobs, createJob, updateJob, deleteJob } from '../redux/slices/jobsSlice'
import { fetchCustomers } from '../redux/slices/customersSlice'
import { fetchUsers } from '../redux/slices/usersSlice'
import ContentLoader from '../components/common/ContentLoader'

const STATUSES = ['To be done', 'Ongoing', 'Done']

const AccountantJobs = () => {
  const dispatch = useDispatch()
  const { list: jobs, loading: jobsLoading } = useSelector(state => state.jobs)
  const { list: customers } = useSelector(state => state.customers)
  const { accountants } = useSelector(state => state.users)
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [selectedJob, setSelectedJob] = useState(null)
  
  // Filter states
  const [searchFilter, setSearchFilter] = useState('')
  const [dateTypeFilter, setDateTypeFilter] = useState('Created')
  const [statusFilter, setStatusFilter] = useState('')
  const [accountantFilter, setAccountantFilter] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    jobTitle: '',
    customer: '',
    status: 'To be done',
    accountant: '',
    hasExpiryDate: false,
    expiryDate: formatForDateTimeLocal(new Date().toISOString()),
    completedOn: ''
  })

  const handleApplyFilters = () => {
    dispatch(fetchJobs({ 
      search: searchFilter, 
      dateType: dateTypeFilter, 
      status: statusFilter, 
      accountant: accountantFilter,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null
    }))
  }

  useEffect(() => {
    handleApplyFilters()
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchUsers())
  }, [dispatch])

  const handleClearFilters = () => {
    setSearchFilter('')
    setDateTypeFilter('Created')
    setStatusFilter('')
    setAccountantFilter('')
    setStartDate(null)
    setEndDate(null)
    dispatch(fetchJobs({})) // Fetch all without filters
  }

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      customer: customers[0]?._id || '',
      status: 'To be done',
      accountant: accountants[0]?.name || '',
      hasExpiryDate: false,
      expiryDate: formatForDateTimeLocal(new Date().toISOString()),
      completedOn: ''
    })
  }

  function formatForDateTimeLocal(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const tzOffset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
    return localISOTime
  }

  const openAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const openEditModal = (job) => {
    setSelectedJob(job)
    setFormData({
      jobTitle: job.jobTitle,
      customer: typeof job.customer === 'object' ? job.customer._id : (job.customer || ''),
      status: job.status,
      accountant: job.accountant,
      hasExpiryDate: !!job.expiryDate,
      expiryDate: formatForDateTimeLocal(job.expiryDate || new Date().toISOString()),
      completedOn: formatForDateTimeLocal(job.completedOn)
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (job) => {
    setSelectedJob(job)
    setIsDeleteModalOpen(true)
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createJob({
        jobTitle: formData.jobTitle,
        customer: formData.customer,
        status: formData.status,
        accountant: formData.accountant,
        hasExpiry: formData.hasExpiryDate,
        expiryDate: formData.hasExpiryDate ? formData.expiryDate : undefined,
        completedOn: formData.status === 'Done' ? (formData.completedOn || undefined) : undefined
      })).unwrap()
      setIsAddModalOpen(false)
      toast.success('Job created successfully')
    } catch (err) {
      toast.error(err || 'Failed to create job')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateJob({
        id: selectedJob._id,
        data: {
          jobTitle: formData.jobTitle,
          customer: formData.customer,
          status: formData.status,
          accountant: formData.accountant,
          hasExpiry: formData.hasExpiryDate,
          expiryDate: formData.hasExpiryDate ? formData.expiryDate : null,
          completedOn: formData.status === 'Done' ? (formData.completedOn || null) : null
        }
      })).unwrap()
      setIsEditModalOpen(false)
      toast.success('Job updated successfully')
    } catch (err) {
      toast.error(err || 'Failed to update job')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteJob(selectedJob._id)).unwrap()
      setIsDeleteModalOpen(false)
      toast.success('Job deleted successfully')
    } catch (err) {
      toast.error(err || 'Failed to delete job')
    }
  }

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader message="Fetching accountant jobs..." />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 w-full text-[var(--color-text-primary)]">
      
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
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        STATUSES={STATUSES}
        ACCOUNTANTS={accountants.map(a => a.name)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
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
                      <option value="">Select Customer</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name} - {c.companyName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={(e) => {
                        const newStatus = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          status: newStatus,
                          completedOn: newStatus === 'Done' ? formatForDateTimeLocal(new Date().toISOString()) : ''
                        }))
                      }}
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
                      <option value="">Select Accountant</option>
                      {accountants.map(a => <option key={a._id} value={a.name}>{a.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                
                {formData.status === 'Done' && (
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Completed Date & Time</label>
                    <div className="relative">
                      <input 
                        type="datetime-local"
                        value={formData.completedOn}
                        onChange={(e) => setFormData({...formData, completedOn: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] color-scheme-dark"
                      />
                    </div>
                  </div>
                )}
                
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
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Expiry Date & Time</label>
                    <div className="relative">
                      <input 
                        type="datetime-local"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] color-scheme-dark"
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
                disabled={jobsLoading}
              >
                {jobsLoading ? 'ADDING...' : 'ADD NEW JOB'}
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
                      <option value="">Select Customer</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name} - {c.companyName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={(e) => {
                        const newStatus = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          status: newStatus,
                          completedOn: newStatus === 'Done' ? (prev.completedOn || formatForDateTimeLocal(new Date().toISOString())) : ''
                        }))
                      }}
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
                      <option value="">Select Accountant</option>
                      {accountants.map(a => <option key={a._id} value={a.name}>{a.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
                
                {formData.status === 'Done' && (
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Completed Date & Time</label>
                    <div className="relative">
                      <input 
                        type="datetime-local"
                        value={formData.completedOn}
                        onChange={(e) => setFormData({...formData, completedOn: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] color-scheme-dark"
                      />
                    </div>
                  </div>
                )}
                
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
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Expiry Date & Time</label>
                    <div className="relative">
                      <input 
                        type="datetime-local"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] color-scheme-dark"
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
                disabled={jobsLoading}
              >
                {jobsLoading ? 'UPDATING...' : 'Update Job'}
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
              Job: <span className="font-semibold text-[var(--color-text-primary)]">{selectedJob.jobTitle}</span> for <span className="font-semibold text-[var(--color-text-primary)]">{selectedJob.accountant}</span>
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-white rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-[var(--color-bg-tertiary)] focus:outline-none"
                disabled={jobsLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-800 text-white cursor-pointer rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-red-600 focus:outline-none"
                disabled={jobsLoading}
              >
                {jobsLoading ? 'DELETING...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AccountantJobs
