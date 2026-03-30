import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DateRangePicker from '../DateRangePicker'
import { BarChart2, Loader2 } from 'lucide-react'
import { fetchComparisonData } from '../../redux/slices/dashboardSlice'
import ComparisonChart from './ComparisonChart'

const CompareGraphs = () => {
  const dispatch = useDispatch()
  const { comparison } = useSelector((state) => state.dashboard)
  
  const [range1, setRange1] = useState({ start: null, end: null })
  const [range2, setRange2] = useState({ start: null, end: null })
  const [duration, setDuration] = useState(null)

  const handleRange1Change = (start, end) => {
    setRange1({ start, end })
    if (start && end) {
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setDuration(diffDays)
      // Reset range 2 since duration changed
      setRange2({ start: null, end: null })
    } else {
      setDuration(null)
    }
  }

  const handleRange2Change = (start, end) => {
    setRange2({ start, end })
  }

  const handleLoadGraphs = () => {
    if (!range1.start || !range1.end || !range2.start || !range2.end) return

    const formatDate = (d) => d.toISOString().split('T')[0]
    
    dispatch(fetchComparisonData({
      start1: formatDate(range1.start),
      end1: formatDate(range1.end),
      start2: formatDate(range2.start),
      end2: formatDate(range2.end)
    }))
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Compare Performance
      </h2>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1.5 ml-1 font-bold uppercase tracking-wider">Select Range 1</p>
            <DateRangePicker 
              startDate={range1.start} 
              endDate={range1.end} 
              onRangeChange={handleRange1Change}
              disableFuture={true}
              placeholder="First Month/Period"
            />
          </div>

          <div className="flex-1 w-full relative">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1.5 ml-1 font-bold uppercase tracking-wider">Select Range 2 {duration && `(${duration} days)`}</p>
            <div className={!duration ? 'opacity-50 pointer-events-none' : ''}>
              <DateRangePicker 
                startDate={range2.start} 
                endDate={range2.end} 
                onRangeChange={handleRange2Change}
                disableFuture={true}
                fixedDuration={duration}
                placeholder={duration ? `Pick start date (${duration} days)` : 'Select Range 1 first'}
              />
            </div>
          </div>

          <div className="w-full md:w-auto md:ml-auto md:self-end">
            <button 
              onClick={handleLoadGraphs}
              disabled={!range1.start || !range2.start || comparison.loading}
              className="w-full h-[46px] flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white px-8 rounded-lg font-bold hover:bg-[#c29e46] transition-all shadow-lg disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {comparison.loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <BarChart2 size={18} />
                  Load Graphs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Charts Section */}
        {comparison.leads.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <ComparisonChart 
                data={comparison.leads} 
                title="Daily New Leads (Comparison)"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default CompareGraphs
