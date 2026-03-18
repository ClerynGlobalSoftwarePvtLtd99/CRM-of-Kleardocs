import React, { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// Helper to get days in month
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
// Helper to get day of week of 1st day (0 = Sun, 6 = Sat)
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatDate = (date) => {
  if (!date) return ''
  const m = MONTH_NAMES[date.getMonth()].substring(0, 3)
  const d = String(date.getDate()).padStart(2, '0')
  const y = date.getFullYear()
  return `${m} ${d}, ${y}`
}

const DatePickerMonth = ({
  year,
  month,
  onPrev,
  onNext,
  startDate,
  endDate,
  onDateClick,
}) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const isSelected = (d) => {
    if (!d) return false
    const ts = d.getTime()
    return (
      (startDate && ts === startDate.getTime()) ||
      (endDate && ts === endDate.getTime())
    )
  }

  const isInRange = (d) => {
    if (!d || !startDate || !endDate) return false
    const ts = d.getTime()
    return ts >= startDate.getTime() && ts <= endDate.getTime()
  }

  return (
    <div className="w-56 p-2">
      <div className="flex justify-between items-center mb-4">
        {onPrev ? (
          <button
            onClick={onPrev}
            className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded"
          >
            <ChevronLeft size={16} />
          </button>
        ) : (
          <div className="w-6" />
        )}
        <div className="font-semibold text-sm">
          {MONTH_NAMES[month]} {year}
        </div>
        {onNext ? (
          <button
            onClick={onNext}
            className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded"
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-[var(--color-text-secondary)]">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {days.map((d, i) => {
          if (!d) return <div key={i} className="w-6 h-6" />
          const selected = isSelected(d)
          const inRange = isInRange(d)
          const isStartOrEnd = selected

          return (
            <button
              key={i}
              onClick={() => onDateClick(d)}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors text-xs
                ${isStartOrEnd
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-medium'
                  : inRange
                    ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-none'
                    : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] text-sm'
                }
              `}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const DateRangePicker = () => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  const defaultStart = new Date(2026, 2, 1)
  const defaultEnd = new Date(2026, 2, 31)

  const [dateRange, setDateRange] = useState({
    start: defaultStart,
    end: defaultEnd,
  })
  const [tempRange, setTempRange] = useState({
    start: defaultStart,
    end: defaultEnd,
  })

  const [leftMonth, setLeftMonth] = useState({ year: 2026, month: 2 })
  const [rightMonth, setRightMonth] = useState({ year: 2026, month: 3 })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTempRange(dateRange)
    }
  }, [isOpen, dateRange])

  const handleDateClick = (d) => {
    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: d, end: null })
    } else {
      if (d < tempRange.start) {
        setTempRange({ start: d, end: tempRange.start })
      } else {
        setTempRange({ start: tempRange.start, end: d })
      }
    }
  }

  const handlePreset = (preset) => {
    const actualToday = new Date()
    actualToday.setHours(0, 0, 0, 0)

    if (preset === 'Today') {
      setTempRange({ start: actualToday, end: actualToday })
      setLeftMonth({
        year: actualToday.getFullYear(),
        month: actualToday.getMonth(),
      })
      let nextM = actualToday.getMonth() + 1
      let nextY = actualToday.getFullYear()
      if (nextM > 11) {
        nextM = 0
        nextY++
      }
      setRightMonth({ year: nextY, month: nextM })
    } else if (preset === 'Yesterday') {
      const y = new Date(actualToday)
      y.setDate(y.getDate() - 1)
      setTempRange({ start: y, end: y })
      setLeftMonth({ year: y.getFullYear(), month: y.getMonth() })
      let nextM = y.getMonth() + 1
      let nextY = y.getFullYear()
      if (nextM > 11) {
        nextM = 0
        nextY++
      }
      setRightMonth({ year: nextY, month: nextM })
    } else if (preset === 'Last 7 Days') {
      const start = new Date(actualToday)
      start.setDate(start.getDate() - 6)
      setTempRange({ start, end: actualToday })
      setLeftMonth({ year: start.getFullYear(), month: start.getMonth() })
      let nextM = start.getMonth() + 1
      let nextY = start.getFullYear()
      if (nextM > 11) {
        nextM = 0
        nextY++
      }
      setRightMonth({ year: nextY, month: nextM })
    }
  }

  const handleConfirm = () => {
    if (tempRange.start && tempRange.end) {
      setDateRange(tempRange)
      setIsOpen(false)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setTempRange({ start: null, end: null })
    if (!isOpen) {
      setDateRange({ start: null, end: null })
    }
  }

  const displayString =
    dateRange.start && dateRange.end
      ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
      : 'Select Date Range'

  const tempDisplayString =
    tempRange.start && tempRange.end
      ? `${formatDate(tempRange.start)} - ${formatDate(tempRange.end)}`
      : tempRange.start
        ? `${formatDate(tempRange.start)} - Select Date`
        : 'Select Date Range'

  const nextMonth = (current) => {
    if (current.month === 11) return { year: current.year + 1, month: 0 }
    return { year: current.year, month: current.month + 1 }
  }

  const prevMonth = (current) => {
    if (current.month === 0) return { year: current.year - 1, month: 11 }
    return { year: current.year, month: current.month - 1 }
  }

  return (
    <div className="relative w-full" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-[12px] rounded-lg text-sm text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors min-h-[46px]"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Calendar size={18} className="text-[var(--color-accent)] shrink-0" />
          <span className="font-medium truncate">
            {displayString}
          </span>
        </div>

        {dateRange.start && dateRange.end ? (
          <X
            size={16}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors ml-1 shrink-0"
            onClick={handleClear}
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-[var(--color-text-secondary)] ml-1 shrink-0"
          />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl p-6 max-w-4xl w-full flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border border-[var(--color-bg-tertiary)] px-4 bg-[var(--color-bg-secondary)] rounded-xl py-3">
              <span className="text-base font-bold text-[var(--color-text-primary)]">
                {tempDisplayString}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 border-b border-[var(--color-bg-tertiary)] pb-6 justify-center items-center lg:items-start">
              <DatePickerMonth
                year={leftMonth.year}
                month={leftMonth.month}
                onPrev={() => setLeftMonth(prevMonth(leftMonth))}
                onNext={null}
                startDate={tempRange.start}
                endDate={tempRange.end}
                onDateClick={handleDateClick}
              />
              <div className="hidden lg:block w-px bg-[var(--color-bg-tertiary)] self-stretch"></div>
              <DatePickerMonth
                year={rightMonth.year}
                month={rightMonth.month}
                onPrev={null}
                onNext={() => setRightMonth(nextMonth(rightMonth))}
                startDate={tempRange.start}
                endDate={tempRange.end}
                onDateClick={handleDateClick}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {['Today', 'Yesterday', 'Last 7 Days'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] border border-[var(--color-bg-tertiary)] transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!tempRange.start || !tempRange.end}
                  className="flex-1 sm:flex-none bg-[var(--color-accent)] text-[var(--color-bg-primary)] px-10 py-2.5 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
                >
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
