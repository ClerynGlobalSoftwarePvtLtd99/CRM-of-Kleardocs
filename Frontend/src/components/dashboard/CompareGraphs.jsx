import React from 'react'
import DateRangePicker from '../DateRangePicker'
import { BarChart2 } from 'lucide-react'

const CompareGraphs = () => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Compare Graphs
      </h2>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <DateRangePicker label="Select Date Range 1" />
          <DateRangePicker label="Select Date Range 2" />

          <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white hover:bg-yellow-500 cursor-pointer px-6 py-2.5 rounded-lg font-semibold hover:bg-[#c29e46] transition-colors shadow-md">
              <BarChart2 size={18} />
              Load Graph
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompareGraphs
