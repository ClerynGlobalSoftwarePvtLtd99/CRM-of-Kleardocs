import React from 'react'

const ComplianceTable = ({ compliances, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-bg-secondary rounded-lg">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-bg-primary border-b border-bg-tertiary hover:bg-bg-primary">
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary min-w-[250px]">
              Compliance Name
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">
              Expiry Date
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">
              New
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">
              Expiry after
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">
              Expiry Template
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">
              Complete Template
            </th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {compliances.length === 0 ? (
            <tr className="hover:bg-bg-primary transition-colors">
              <td
                colSpan="7"
                className="py-8 text-center text-sm text-text-secondary italic"
              >
                No compliances loaded. Please select a financial year and click
                Load.
              </td>
            </tr>
          ) : (
            compliances.map((comp) => (
              <tr
                key={comp._id}
                className="border-b border-bg-tertiary hover:bg-bg-primary transition-colors last:border-0"
              >
                <td className="py-4 px-4 text-sm font-medium hover:text-text-primary max-w-[300px]">
                  {comp.name}
                </td>
                <td className="py-4 px-4 text-sm text-text-secondary whitespace-nowrap">
                  {comp.expiryDate
                    ? new Date(comp.expiryDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </td>
                <td className="py-4 px-4 text-sm text-text-secondary">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${comp.forNewCompany ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {comp.forNewCompany ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-text-secondary whitespace-nowrap">
                  {comp.daysOfExpiry ? (
                    <span className="font-medium hover:text-text-primary">
                      {comp.daysOfExpiry} days
                    </span>
                  ) : '-'}
                </td>
                <td className="py-4 px-4 text-sm text-text-secondary">
                  <div className="max-w-[150px] truncate" title={comp.expiryTemplate?.name || 'None'}>
                    {comp.expiryTemplate?.name || 'None'}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-text-secondary">
                  <div className="max-w-[150px] truncate" title={comp.completeTemplate?.name || 'None'}>
                    {comp.completeTemplate?.name || 'None'}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-right">
                  <button
                    onClick={() => onEdit(comp)}
                    className="bg-transparent text-accent hover:text-yellow-600 font-bold cursor-pointer transition-all px-3 py-1.5 rounded-lg border border-transparent hover:border-accent hover:bg-yellow-50/10 active:scale-95 text-xs uppercase tracking-wider focus:ring-accent"
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
