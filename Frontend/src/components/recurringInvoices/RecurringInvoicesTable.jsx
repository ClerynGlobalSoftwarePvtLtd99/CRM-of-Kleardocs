import React from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import CompanyLogo from '../common/CompanyLogo'

const RecurringInvoicesTable = ({ invoices }) => {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 flex-1 px-4">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-gray-500 text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                Created
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                Customer & Company
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                Services
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                Start
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                End
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                Interval
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium shadow-sm text-sm">
                Next Inv.
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium text-center shadow-sm text-sm">
                Status
              </th>
              <th className="sticky top-0 z-20 bg-gray-100 px-1.5 py-3 font-medium text-center shadow-sm text-sm">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoices || []).map((inv) => (
              <tr key={inv._id} className="bg-white hover:bg-gray-100 transition-colors group rounded-md shadow-sm">
                <td className="px-1.5 py-6 text-sm rounded-l-lg">
                  <CompanyLogo name={inv.customer?.companyName || inv.customer?.name} size="w-10 h-10" />
                </td>
                <td className="px-1.5 py-6 text-sm text-gray-500 whitespace-nowrap">
                  {inv.createdAt ? new Date(inv.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '') : '-'}
                </td>
                <td className="px-1.5 py-6 text-sm">
                  <div className="flex flex-col gap-0.5 w-full">
                    <Link to={`/customer/${inv.customer?._id}`} className="font-medium text-blue-600 hover:text-blue-700 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-blue-600 break-words" title={inv.customer?.name}>
                      {inv.customer?.name || 'Unknown'}
                    </Link>
                    <span className="text-xs text-gray-500 break-words" title={inv.customer?.companyName}>{inv.customer?.companyName || '-'}</span>
                  </div>
                </td>
                <td className="px-1.5 py-6 text-sm text-gray-500">
                  {inv.items?.map(it => it.service?.name || it.description).join(', ') || 'No services'}
                </td>
                <td className="px-1.5 py-6 text-sm text-text-secondary whitespace-nowrap">
                  {inv.startDate ? new Date(inv.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="px-1.5 py-6 text-sm text-text-secondary whitespace-nowrap">
                  {inv.endDate ? new Date(inv.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="px-1.5 py-6 text-sm text-text-secondary">
                  {inv.interval} {inv.intervalType}{inv.interval > 1 ? 's' : ''}
                </td>
                <td className="px-1.5 py-6 text-sm text-text-secondary whitespace-nowrap">
                  {inv.nextDate ? new Date(inv.nextDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="px-4 py-6 text-sm text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${inv.status?.toLowerCase() === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-1.5 py-6 rounded-r-lg font-semibold text-center">
                  <Link to={`/recurring-invoice-details/${inv._id}`} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-semibold shadow-sm transition-colors cursor-pointer text-white">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {(invoices || []).length === 0 && (
              <tr>
                <td colSpan="10" className="px-4 py-8 text-center text-text-secondary bg-bg-primary rounded-lg">
                   No recurring invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecurringInvoicesTable
