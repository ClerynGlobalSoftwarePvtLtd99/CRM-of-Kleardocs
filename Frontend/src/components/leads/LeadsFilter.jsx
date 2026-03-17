import { useState } from "react";
import { Search, X } from "lucide-react";
import DateRangeFilter from "../compliances/DateRangeFilter";

const LeadsFilter = () => {
  const initialFilters = {
    search: "",
    dateType: "Created",
    startDate: new Date(),
    endDate: new Date(),
    service: "",
    agent: "",
    source: "",
    type: "",
    priority: "",
    response: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleClear = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <input
          placeholder="Name / Phone / Company"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="input border border-text-primary rounded-md bg-bg-secondary text-text-primary"
        />

        <select
          value={filters.dateType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, dateType: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option>Created</option>
          <option>Last Followup</option>
          <option>Next Followup</option>
        </select>

       <DateRangeFilter
          value={{
            startDate: filters.startDate,
            endDate: filters.endDate,
          }}
          onChange={({ startDate, endDate }) =>
            setFilters((prev) => ({
              ...prev,
              startDate,
              endDate,
            }))
          }
          months={2}
          className="left-1/2 -translate-x-1/2"
          inputClassName="w-full border border-text-primary rounded-md bg-bg-secondary text-text-primary"
        />

        <select
          value={filters.service}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, service: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option value="">Services</option>
          <option>Annual Compliance</option>
          <option>GST Filing</option>
          <option>Section 8 Company</option>
          <option>Startup India Registration</option>
          <option>Import Export Code</option>
          <option>FSSAI Central</option>
          <option>GST Registration</option>
          <option>FSSAI State Registration</option>
          <option>CA Certification</option>
          <option>Director Resignation</option>
          <option>MSME</option>
          <option>Trademark</option>
          <option>MOA Change</option>
          <option>Auditor Resignation</option>
          <option>TDS Return</option>
          <option>Board Meeting & Statutory Documentation Services</option>
          <option>Professional Tax Registration Services</option>
          <option>Private Limited Company</option>
        </select>

        <select
          value={filters.agent}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, agent: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option value="">Agent</option>
          <option>Ritu Kaur</option>
          <option>John Doe</option>
        </select>

        <select
          value={filters.source}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, source: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option value="">Source</option>
          <option>Instagram</option>
          <option>Facebook</option>
          <option>WhatsApp</option>
          <option>Others</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option value="">Type</option>
          <option>Hot</option>
          <option>Cold</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option value="">Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          value={filters.response}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, response: e.target.value }))
          }
          className="input text-text-primary bg-bg-secondary border border-text-primary rounded-md"
        >
          <option value="">Response</option>
          <option>Interested</option>
          <option>Medium</option>
          <option>Not Interested</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsFilter;