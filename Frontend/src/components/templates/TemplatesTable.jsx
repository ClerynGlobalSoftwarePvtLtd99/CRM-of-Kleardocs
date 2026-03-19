import React from 'react'

const TemplatesTable = ({ templates, onEditClick, onManageClick }) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl overflow-hidden shadow-sm flex flex-col h-[50vh] min-h-[350px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Created</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Name</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)]">Subject</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Status</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">Attachments</th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium whitespace-nowrap text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Modify</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tmpl) => (
              <tr key={tmpl.id} className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors rounded-md shadow-sm">
                <td className="px-1.5 py-3 text-sm rounded-l-lg whitespace-nowrap">{tmpl.created.replace(/(\d+)(st|nd|rd|th)/, '$1')}</td>
                <td className="px-1.5 py-3 font-medium text-sm truncate max-w-[200px]">{tmpl.name}</td>
                <td className="px-1.5 py-3 text-sm text-[var(--color-text-secondary)] truncate max-w-[200px]">{tmpl.subject}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${tmpl.status === 'Active'
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : 'bg-red-500/10 text-red-500 border-red-500/20'}
                  `}>
                    {tmpl.status}
                  </span>
                </td>
                <td className="px-1.5 py-3">
                  <button
                    onClick={() => onManageClick(tmpl)}
                    className="px-3 py-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white text-[var(--color-text-primary)] rounded-md text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    Send
                  </button>
                </td>
                <td className="px-1.5 py-3 rounded-r-lg">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditClick(tmpl)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No templates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TemplatesTable
