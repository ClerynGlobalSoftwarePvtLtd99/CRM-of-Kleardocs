import React from 'react'

const AccountantJobsTable = ({ jobs, onEditClick, onDeleteClick }) => {
  const formatJobDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    
    const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const timePart = date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase().replace(':', '.') // To match 03.34 P.M. style

    return (
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium">{datePart}</span>
        <span className="text-[10px] text-[var(--color-text-secondary)]">({timePart})</span>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4 text-[var(--color-text-primary)]">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Created</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)] uppercase">Job Name</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] uppercase whitespace-nowrap">Customer Info</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Expiry</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Status</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Completed</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Accountant</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Modify</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group relative z-10 transition-colors">
                <td className="px-1.5 py-3 rounded-l-lg">
                  {formatJobDate(job.createdAt)}
                </td>
                <td className="px-1.5 py-3 font-medium text-sm">{job.jobTitle}</td>
                <td className="px-1.5 py-3">
                  <div className="flex flex-col">
                    <a href={`/customers/${job.customer?._id}`} className="text-blue-500 hover:underline text-sm font-medium">
                      {job.customer?.name}
                    </a>
                    <span className="text-xs text-[var(--color-text-secondary)]">{job.customer?.phone}</span>
                    <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[200px]">{job.customer?.companyName}</span>
                  </div>
                </td>
                <td className="px-1.5 py-3 whitespace-nowrap">
                  {formatJobDate(job.expiryDate)}
                </td>
                <td className="px-1.5 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${job.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      job.status === 'Ongoing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'}
                  `}>
                    {job.status}
                  </span>
                </td>
                <td className="px-1.5 py-3 whitespace-nowrap">
                  {formatJobDate(job.completedOn)}
                </td>
                <td className="px-1.5 py-3 font-medium text-sm">{job.accountant}</td>
                <td className="px-1.5 py-3 rounded-r-lg">
                  <div className="flex items-center justify-end gap-2 relative z-20">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onEditClick(job); }}
                      className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer relative z-30"
                    >
                      Edit
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteClick(job); }}
                      className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer relative z-30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AccountantJobsTable
