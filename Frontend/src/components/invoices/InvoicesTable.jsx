import React from 'react'
import { Link } from 'react-router'
import { Eye, Download } from 'lucide-react'
import CompanyLogo from '../common/CompanyLogo'

const InvoicesTable = ({ invoices }) => {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-100">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-text-secondary text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-bg-secondary px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Logo
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Inv. No
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Date
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Customer & Company
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Service
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Price
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                GST
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Total
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Due
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-center shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Details
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-center shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                PDF
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group rounded-md shadow-sm">
                <td className="px-1.5 py-3 text-sm rounded-l-lg">
                  <CompanyLogo name={inv.customerCompany || inv.customerName} size="w-8 h-8" />
                </td>
                <td className="px-1.5 py-3 text-sm text-[var(--color-text-primary)] font-medium">
                  <Link to={`/invoice/${inv.invoiceId}`} className="hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-bg-tertiary)] underline-offset-4 hover:decoration-[var(--color-accent)] break-words">
                    {inv.invoiceNo}
                  </Link>
                </td>
                <td className="px-1.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  {inv.invoiceDate.replace(/(\d+)(st|nd|rd|th)/, '$1')}
                </td>
                <td className="px-1.5 py-3 text-sm">
                  <div className="flex flex-col gap-0.5 w-full">
                    <Link to={`/customer/${inv.customerId}`} className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-bg-tertiary)] underline-offset-4 hover:decoration-[var(--color-accent)] break-words" title={inv.customerName}>
                      {inv.customerName}
                    </Link>
                    <span className="text-xs text-[var(--color-text-secondary)] break-words" title={inv.customerCompany}>{inv.customerCompany}</span>
                  </div>
                </td>
                <td className="px-1.5 py-3 text-sm text-[var(--color-text-secondary)] truncate max-w-[150px]">
                  {inv.linkedService}
                </td>
                <td className="px-1.5 py-3 text-sm text-right font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                  {inv.price}
                </td>
                <td className="px-1.5 py-3 text-sm text-right font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                  {inv.gst}
                </td>
                <td className="px-1.5 py-3 text-sm text-right font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
                  {inv.total}
                </td>
                <td className="px-1.5 py-3 text-sm text-right font-semibold text-red-500 whitespace-nowrap">
                  {inv.due}
                </td>
                <td className="px-1.5 py-3 text-center">
                  <Link to={`/invoice/${inv.invoiceId}`} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-semibold shadow-sm transition-colors cursor-pointer inline-block">
                    Details
                  </Link>
                </td>
                <td className="px-4 py-3 rounded-r-lg text-center font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors rounded hover:bg-[var(--color-bg-tertiary)] cursor-pointer" title="View PDF">
                      <Eye size={18} />
                    </button>
                    <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors rounded hover:bg-[var(--color-bg-tertiary)] cursor-pointer" title="Download PDF">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="10" className="px-4 py-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] rounded-lg">
                   No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoicesTable
