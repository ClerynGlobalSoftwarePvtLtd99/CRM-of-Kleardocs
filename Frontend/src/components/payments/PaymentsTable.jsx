import React from 'react'
import { Link } from 'react-router' // Ensure valid import for App.jsx

const PaymentsTable = ({ payments }) => {
  const formatPayDate = (dateString) => {
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
        <span className="text-[10px] text-text-secondary">({timePart})</span>
      </div>
    )
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table
          className="w-full text-left relative"
          style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}
        >
          <thead>
            <tr className="text-text-secondary text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-bg-secondary px-4 py-4 font-medium whitespace-nowrap min-w-[150px] shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Pay Date
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Customer Name
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-4 py-4 font-medium min-w-[200px] shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Customer Company
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Invoice No
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Payment Mode
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-4 py-4 font-medium whitespace-nowrap text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {(payments || []).map((payment) => (
              <tr
                key={payment._id || payment.id}
                className="bg-bg-primary hover:bg-bg-tertiary transition-colors group rounded-md shadow-sm"
              >
                <td className="px-4 py-6 text-sm rounded-l-lg whitespace-nowrap text-text-secondary">
                  {formatPayDate(payment.paymentDate)}
                </td>
                <td className="px-4 py-6 text-sm">
                  <Link
                    to={`/customer/${payment.customer?._id}`}
                    className="font-medium text-text-primary hover:text-accent transition-colors underline decoration hover:text-text-primary underline-offset-4 hover:decorationbg-accent"
                  >
                    {payment.customer?.name || '-'}
                  </Link>
                </td>
                <td className="px-4 py-6 text-sm text-text-secondary">
                  {payment.customer?.companyName || '-'}
                </td>
                <td className="px-4 py-6 text-sm">
                  <Link
                    to={`/invoice/${payment.invoice?._id}`}
                    className="font-medium text-text-primary hover:text-accent transition-colors underline decoration hover:text-text-primary underline-offset-4 hover:decorationbg-accent"
                  >
                    {payment.invoice?.invoiceNo || '-'}
                  </Link>
                </td>
                <td className="px-4 py-6 text-sm text-text-secondary">
                  <span className="px-3 py-1 bg-bg-tertiary rounded-full text-xs font-medium">
                    {payment.mode}
                  </span>
                </td>
                <td className="px-4 py-6 rounded-r-lg font-semibold text-text-primary text-right">
                  {formatAmount(payment.amount)}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-text-secondary"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaymentsTable
