import React from 'react'
import DateRangePicker from '../DateRangePicker'

const EmailCount = () => {
  return (
    <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">
        Email Count
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Email Count
          </span>
          <div className="flex-1 w-full sm:w-auto">
            <DateRangePicker />
          </div>
          <button className="bg-[var(--color-accent)] hover:bg-yellow-600 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)]">
            Go
          </button>
        </div>
        <div className="text-sm font-semibold pr-2">
          Total Emails:{' '}
          <span className="text-[var(--color-accent)] text-lg ml-1">0</span>
        </div>
      </div>

      <div className="overflow-x-auto border border-[var(--color-bg-tertiary)] rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg-primary)] border-b border-[var(--color-bg-tertiary)]">
              <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
                Date
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
                Count
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)] w-[50%]">
                Template
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] transition-colors">
              <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                2026-03-05
              </td>
              <td className="py-3 px-4 text-sm font-medium text-[var(--color-text-primary)]">
                0
              </td>
              <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                Next Quarter Payment
              </td>
            </tr>
            <tr className="hover:bg-[var(--color-bg-primary)] transition-colors">
              <td
                colSpan="3"
                className="py-8 text-center text-sm text-[var(--color-text-secondary)] italic"
              >
                No email data for selected range.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default EmailCount
