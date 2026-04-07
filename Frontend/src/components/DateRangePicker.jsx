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

const nextMonth = (current) => {
  if (current.month === 11) return { year: current.year + 1, month: 0 }
  return { year: current.year, month: current.month + 1 }
}

const prevMonth = (current) => {
  if (current.month === 0) return { year: current.year - 1, month: 11 }
  return { year: current.year, month: current.month - 1 }
}

const DatePickerMonth = ({
  year,
  month,
  onPrev,
  onNext,
  startDate,
  endDate,
  onDateClick,
  disableFuture,
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
          
          const today = new Date();
          today.setHours(0,0,0,0);
          const isFuture = disableFuture && d > today;

          return (
            <button
              key={i}
              onClick={() => !isFuture && onDateClick(d)}
              disabled={isFuture}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors text-xs
                ${isFuture ? 'date-disabled-cross' : ''}
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

const DateRangePicker = ({
  startDate,
  endDate,
  onRangeChange,
  placeholder = 'Select Date Range',
  disableFuture = false,
  fixedDuration = null, // in days
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  const [tempRange, setTempRange] = useState({
    start: startDate || null,
    end: endDate || null,
  })

  const initialLeft = { 
    year: (startDate || new Date()).getFullYear(), 
    month: (startDate || new Date()).getMonth() 
  }
  const [leftMonth, setLeftMonth] = useState(initialLeft)
  const getInitialRight = () => {
    const d = endDate || new Date()
    const endM = d.getMonth()
    const endY = d.getFullYear()
    if (endY > initialLeft.year || (endY === initialLeft.year && endM > initialLeft.month)) {
      return { year: endY, month: endM }
    }
    return nextMonth(initialLeft)
  }

  const [rightMonth, setRightMonth] = useState(getInitialRight())

  const handlePrevMonths = () => {
    const newLeft = prevMonth(leftMonth)
    setLeftMonth(newLeft)
    setRightMonth(leftMonth) // right becomes the old left
  }

  const handleNextMonths = () => {
    const newRight = nextMonth(rightMonth)
    setRightMonth(newRight)
    setLeftMonth(rightMonth) // left becomes the old right
  }

  // Ensure months are different if dates are available - keep them in sync
  useEffect(() => {
    if (startDate && endDate) {
      const startM = startDate.getMonth()
      const startY = startDate.getFullYear()
      const endM = endDate.getMonth()
      const endY = endDate.getFullYear()
      
      const left = { year: startY, month: startM }
      setLeftMonth(left)
      
      const next = nextMonth(left)
      if (endY > startY || (endY === startY && endM > startM)) {
         setRightMonth({ year: endY, month: endM })
         if (startY === endY && startM === endM) {
           setRightMonth(next)
         }
      } else {
        setRightMonth(next)
      }
    }
  }, [startDate, endDate])

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
      setTempRange({ start: startDate, end: endDate })
    }
  }, [isOpen, startDate, endDate])

  const handleDateClick = (d) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (disableFuture && d > today) return;

    if (fixedDuration) {
      // One click sets both. 
      // Calculate end date based on duration.
      const end = new Date(d);
      end.setDate(d.getDate() + fixedDuration - 1);
      
      // If end date is in future and disableFuture is true, we might block this start date
      if (disableFuture && end > today) {
        // Technically we should only allow dates where the WHOLE range fits in past
        return; 
      }

      setTempRange({ start: d, end: end });
      if (onRangeChange) {
        onRangeChange(d, end);
      }
      setIsOpen(false);
      return;
    }

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

    let start, end;
    if (preset === 'Today') {
      start = end = actualToday
    } else if (preset === 'Yesterday') {
      start = end = new Date(actualToday)
      start.setDate(start.getDate() - 1)
    } else if (preset === 'Last 7 Days') {
      end = actualToday
      start = new Date(actualToday)
      start.setDate(start.getDate() - 6)
    }
    
    if (start && end) {
      setTempRange({ start, end })
      const sY = start.getFullYear()
      const sM = start.getMonth()
      setLeftMonth({ year: sY, month: sM })
      setRightMonth(nextMonth({ year: sY, month: sM }))
    }
  }

  const handleConfirm = () => {
    if (tempRange.start && tempRange.end) {
      if (onRangeChange) {
        onRangeChange(tempRange.start, tempRange.end)
      }
      setIsOpen(false)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    if (onRangeChange) {
      onRangeChange(null, null)
    }
    if (!isOpen) {
      setTempRange({ start: null, end: null })
    }
  }

  const displayString =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : placeholder

  const tempDisplayString =
    tempRange.start && tempRange.end
      ? `${formatDate(tempRange.start)} - ${formatDate(tempRange.end)}`
      : tempRange.start
        ? `${formatDate(tempRange.start)} - Select Date`
        : placeholder

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

        {startDate && endDate ? (
          <X
            size={16}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors ml-1 shrink-0 cursor-pointer"
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
                onPrev={handlePrevMonths}
                onNext={null}
                startDate={tempRange.start}
                endDate={tempRange.end}
                onDateClick={handleDateClick}
                disableFuture={disableFuture}
              />
              <div className="hidden lg:block w-px bg-[var(--color-bg-tertiary)] self-stretch"></div>
              <DatePickerMonth
                year={rightMonth.year}
                month={rightMonth.month}
                onPrev={null}
                onNext={handleNextMonths}
                startDate={tempRange.start}
                endDate={tempRange.end}
                onDateClick={handleDateClick}
                disableFuture={disableFuture}
              />
            </div>

            <div className="flex flex-row justify-between items-center gap-4 px-2">
              <div className="flex flex-wrap justify-start gap-2 text-sm">
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
              <div className="flex gap-3 w-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-lg font-bold text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!tempRange.start || !tempRange.end}
                  className="bg-[var(--color-accent)] text-[var(--color-bg-primary)] px-10 py-2.5 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
                >
                  OK
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
