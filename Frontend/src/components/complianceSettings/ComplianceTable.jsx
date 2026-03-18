import React from 'react'

const ComplianceTable = ({ compliances, onEdit }) => {
  return (
    <div className="overflow-x-auto border border-[var(--color-bg-tertiary)] rounded-lg">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-[var(--color-bg-primary)] border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)]">
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)] min-w-[250px]">
              Compliance Name
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
              Expiry Date
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
              New
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
              Expiry after
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
              Expiry Template
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
              Complete Template
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)] text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {compliances.length === 0 ? (
            <tr className="hover:bg-[var(--color-bg-primary)] transition-colors">
              <td
                colSpan="7"
                className="py-8 text-center text-sm text-[var(--color-text-secondary)] italic"
              >
                No compliances loaded. Please select a financial year and click
                Load.
              </td>
            </tr>
          ) : (
            compliances.map((comp) => (
              <tr
                key={comp.id}
                className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] transition-colors last:border-0"
              >
                <td className="py-3 px-4 text-sm font-medium text-[var(--color-text-primary)]">
                  {comp.complianceName}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  {comp.expiryDate
                    ? new Date(comp.expiryDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                  {comp.new || ''}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  {comp.expiryAfter || ''}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                  {comp.expiryTemplate !== 'None' ? comp.expiryTemplate : ''}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                  {comp.completeTemplate !== 'None'
                    ? comp.completeTemplate
                    : ''}
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  <button
                    onClick={() => onEdit(comp)}
                    className="text-[var(--color-accent)] hover:text-yellow-600 font-semibold cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-yellow-50/10 active:opacity-70"
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ComplianceTable
