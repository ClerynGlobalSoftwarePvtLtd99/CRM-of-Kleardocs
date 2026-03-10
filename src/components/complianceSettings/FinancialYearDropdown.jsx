import React from 'react'

const FinancialYearDropdown = ({
  financialYears,
  selectedYear,
  setSelectedYear,
  onLoad,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
      <div className="relative w-full sm:w-48">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Select Year</option>
          {financialYears.map((fy) => (
            <option key={fy.id} value={fy.year}>
              {fy.year}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onLoad}
        disabled={!selectedYear}
        className="w-full sm:w-auto bg-[var(--color-accent)] hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f2937]"
      >
        Load
      </button>
    </div>
  )
}

export default FinancialYearDropdown
