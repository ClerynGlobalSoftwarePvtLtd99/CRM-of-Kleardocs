import React, { useState, useRef, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// Simple mock calendar component
const MockCalendar = ({ month, year }) => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const dates = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className="p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <ChevronLeft size={20} />
        </button>
        <div className="font-semibold text-sm">
          {month} {year}
        </div>
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[var(--color-text-secondary)]"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date) => (
          <button
            key={date}
            className="h-8 w-8 rounded-full text-sm hover:bg-[var(--color-bg-tertiary)] focus:bg-[var(--color-accent)] focus:text-white transition-colors flex items-center justify-center"
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  )
}

const DateRangePicker = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState(label)
  const popupRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors w-full md:w-auto"
      >
        <CalendarIcon size={18} className="text-[var(--color-accent)]" />
        <span className="font-medium">{selectedRange}</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 mt-2 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-2xl z-50 w-[300px] md:w-[600px] overflow-hidden">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--color-bg-tertiary)]">
            <MockCalendar month="March" year="2026" />
            <MockCalendar month="April" year="2026" />
          </div>

          <div className="border-t border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRange('Today')}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setSelectedRange('Yesterday')}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
              >
                Yesterday
              </button>
              <button
                onClick={() => setSelectedRange('Last 7 Days')}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
              >
                Last 7 Days
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[var(--color-accent)] text-white px-6 py-1.5 rounded-md text-sm font-semibold hover:bg-[#c29e46] transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
