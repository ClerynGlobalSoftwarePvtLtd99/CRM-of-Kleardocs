import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchEmailCount } from '../../redux/slices/settingsSlice'
import DateRangePicker from '../DateRangePicker'
import { Loader2 } from 'lucide-react'

const EmailCount = () => {
  const dispatch = useAppDispatch()
  const { emailCountData, emailCountTotal, emailCountLoading } = useAppSelector(
    (state) => state.settings
  )

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const handleRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleFetch = () => {
    const params = {}
    if (startDate) params.startDate = startDate.toISOString().split('T')[0]
    if (endDate) params.endDate = endDate.toISOString().split('T')[0]
    dispatch(fetchEmailCount(params))
  }

  return (
    <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">
        Email Count
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Date Range
          </span>
          <div className="flex-1 w-full sm:w-72">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onRangeChange={handleRangeChange}
              placeholder="Select Date Range"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={emailCountLoading}
            className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-yellow-600 cursor-pointer text-white font-bold py-3 px-5 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60"
          >
            {emailCountLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            Go
          </button>
        </div>
        <div className="text-sm font-semibold pr-2">
          Total Emails:{' '}
          <span className="text-[var(--color-accent)] text-lg ml-1">{emailCountTotal}</span>
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
            </tr>
          </thead>
          <tbody>
            {emailCountLoading ? (
              <tr>
                <td colSpan="2" className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
                  <Loader2 size={20} className="animate-spin inline-block mr-2" />
                  Loading...
                </td>
              </tr>
            ) : emailCountData.length > 0 ? (
              emailCountData.map((row) => (
                <tr
                  key={row.date}
                  className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">{row.date}</td>
                  <td className="py-3 px-4 text-sm font-medium text-[var(--color-text-primary)]">
                    {row.count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="py-8 text-center text-sm text-[var(--color-text-secondary)] italic"
                >
                  {emailCountTotal === 0 && emailCountData.length === 0
                    ? 'Select a date range and click Go to view email counts.'
                    : 'No email data for selected range.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default EmailCount
