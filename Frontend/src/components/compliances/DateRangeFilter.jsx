import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangeFilter = ({ setFilters }) => {

  const [open, setOpen] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const ref = useRef(null);

  // close when clicking outside
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

  const handleChange = (item) => {

    setRange([item.selection]);

    // send selected dates to parent
    setFilters((prev) => ({
      ...prev,
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    }));
  };

  return (
    <div className="relative" ref={ref}>

      {/* Input */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg px-4 py-2 w-72 flex items-center justify-between cursor-pointer bg-bg-primary text-bg-tertiary"
      >
        <span>
          {format(range[0].startDate, "dd/MM/yyyy")} -{" "}
          {format(range[0].endDate, "dd/MM/yyyy")}
        </span>

        <Calendar size={18} />
      </div>

      {/* Calendar */}
      {open && (
        <div className="absolute z-50 mt-2 shadow-lg bg-white rounded-lg">
          <DateRange
            editableDateInputs={true}
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
          />
        </div>
      )}

    </div>
  );
};

export default DateRangeFilter;