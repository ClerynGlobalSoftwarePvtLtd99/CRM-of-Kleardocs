import React from 'react'

const AccountantJobsTable = ({ jobs, onEditClick, onDeleteClick }) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap min-w-[180px] shadow-[0_1px_0_var(--color-bg-tertiary)]">Created</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Job Name</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium min-w-[200px] shadow-[0_1px_0_var(--color-bg-tertiary)]">Customer</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Expiry</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Status</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Completed</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Accountant</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Modify</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group rounded-md shadow-sm">
                <td className="px-4 py-3 text-sm rounded-l-lg">{job.created}</td>
                <td className="px-4 py-3 font-medium">{job.jobName}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <a href={job.customerLink} className="text-blue-500 hover:underline">{job.customer}</a>
                    <span className="text-xs text-[var(--color-text-secondary)]">{job.phone}</span>
                    <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[200px]">{job.companyName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{job.expiry}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${job.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      job.status === 'Ongoing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'}
                  `}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{job.completedDate || '-'}</td>
                <td className="px-4 py-3 font-medium">{job.accountant}</td>
                <td className="px-4 py-3 rounded-r-lg">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEditClick(job)}
                      className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteClick(job)}
                      className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
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
