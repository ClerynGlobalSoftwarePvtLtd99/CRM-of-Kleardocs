import React from 'react';

const CompliancesTable = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Customer Name
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Customer Company
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Compliance Name
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm text-center">
                Expiry
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm text-center">
                Status
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm text-center">
                Completed
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Accountant
              </th>
            </tr>
          </thead>
          <tbody>
            {(data && data.length > 0) ? (
              data.map((row) => (
                <tr key={row._id} className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group rounded-md shadow-sm">
                  {/* Customer Name + Phone */}
                  <td className="px-1.5 py-3 text-sm rounded-l-lg">
                    <div className="font-medium text-[var(--color-text-primary)]">
                      {row.customer?.name || "N/A"}
                    </div>
                    <div className="text-[var(--color-text-secondary)] text-xs">{row.customer?.phone || ""}</div>
                  </td>

                  {/* Company */}
                  <td className="px-1.5 py-3 text-sm text-[var(--color-text-secondary)]">
                    {row.customer?.companyName || "-"}
                  </td>

                  {/* Compliance */}
                  <td className="px-1.5 py-3 text-sm text-[var(--color-text-secondary)] truncate max-w-[200px]" title={row.name}>
                    {row.name}
                  </td>

                  {/* Expiry */}
                  <td className="px-1.5 py-3 text-sm text-center text-red-400 font-medium">
                    {formatDate(row.expiryDate)}
                  </td>

                  {/* Status */}
                  <td className="px-1.5 py-3 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${row.status === 'Done' ? 'bg-green-500/10 text-green-500' : 
                        row.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-orange-500/10 text-orange-500'}
                    `}>
                      {row.status}
                    </span>
                  </td>

                  {/* Completed */}
                  <td className="px-1.5 py-3 text-sm text-center text-[var(--color-text-secondary)]">
                    {formatDate(row.completedOn)}
                  </td>

                  {/* Accountant */}
                  <td className="px-1.5 py-3 text-sm rounded-r-lg text-[var(--color-text-secondary)]">
                    {row.accountant || "Unassigned"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-10 text-center text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] rounded-lg">
                  No compliances found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompliancesTable;