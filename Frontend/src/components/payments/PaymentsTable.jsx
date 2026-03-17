import React from 'react'
import { Link } from 'react-router' // Ensure valid import for App.jsx

const PaymentsTable = ({ payments }) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table
          className="w-full text-left relative"
          style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}
        >
          <thead>
            <tr className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap min-w-[150px] shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Pay Date
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Customer Name
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium min-w-[200px] shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Customer Company
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Invoice No
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Payment Type
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-4 py-4 font-medium whitespace-nowrap text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group rounded-md shadow-sm"
              >
                <td className="px-4 py-3 text-sm rounded-l-lg whitespace-nowrap text-[var(--color-text-secondary)]">
                  {payment.payDate}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    to={`/customer/${payment.customerId}`}
                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-bg-tertiary)] underline-offset-4 hover:decoration-[var(--color-accent)]"
                  >
                    {payment.customerName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  {payment.customerCompany}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    to={`/invoice/${payment.invoiceId}`}
                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-bg-tertiary)] underline-offset-4 hover:decoration-[var(--color-accent)]"
                  >
                    {payment.invoiceNo}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  <span className="px-3 py-1 bg-[var(--color-bg-tertiary)] rounded-full text-xs font-medium">
                    {payment.paymentType}
                  </span>
                </td>
                <td className="px-4 py-3 rounded-r-lg font-semibold text-[var(--color-text-primary)] text-right">
                  {payment.amount}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-[var(--color-text-secondary)]"
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
