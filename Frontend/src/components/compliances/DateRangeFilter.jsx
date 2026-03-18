import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangeFilter = ({
  setFilters,
  value,
  onChange,
  months = 2,
  className = "",
  inputClassName = "",
  dateFormat = "dd/MM/yyyy",
}) => {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: value?.startDate || new Date(),
      endDate: value?.endDate || new Date(),
      key: "selection",
    },
  ]);

  const ref = useRef(null);

  useEffect(() => {
    if (value?.startDate && value?.endDate) {
      setRange([
        {
          startDate: value.startDate,
          endDate: value.endDate,
          key: "selection",
        },
      ]);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRangeChange = (item) => {
    const selection = item.selection;

    setRange([
      {
        startDate: selection.startDate,
        endDate: selection.endDate,
        key: "selection",
      },
    ]);

    if (setFilters) {
      setFilters((prev) => ({
        ...prev,
        startDate: selection.startDate,
        endDate: selection.endDate,
      }));
    }

    if (onChange) {
      onChange({
        startDate: selection.startDate,
        endDate: selection.endDate,
      });
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full border border-text-primary rounded-md px-4 py-2 flex items-center justify-between cursor-pointer bg-bg-secondary text-text-primary text-sm ${inputClassName}`}
      >
        <span>
          {format(range[0].startDate, dateFormat)} -{" "}
          {format(range[0].endDate, dateFormat)}
        </span>
        <Calendar size={18} />
      </button>

      {open && (
        <div className={`absolute top-full z-50 mt-2 rounded-lg bg-white shadow-lg border border-bg-tertiary ${className}`}>
          <DateRange
            editableDateInputs={true}
            onChange={handleRangeChange}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={months}
            direction="horizontal"
            showDateDisplay={false}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;