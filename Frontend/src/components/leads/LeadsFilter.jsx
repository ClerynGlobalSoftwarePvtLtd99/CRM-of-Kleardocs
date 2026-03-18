import { Search, X } from "lucide-react";
import { 
  SERVICES, 
  SOURCES, 
  AGENTS, 
  CLIENT_TYPES, 
  PRIORITIES, 
  RESPONSES,
  STATES
} from "../../utils/constants";
import DateRangeFilter from "../compliances/DateRangeFilter";
import { useState } from "react";

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
    state: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleClear = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-4 mb-4 space-y-4 shadow-sm">
      {/* First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Search</label>
          <input
            placeholder="Name / Phone / Company"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Date Type</label>
          <select
            value={filters.dateType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateType: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option>Created</option>
            <option>Last Followup</option>
            <option>Next Followup</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Date Range</label>
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
            className="left-0"
            inputClassName="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Service</label>
          <select
            value={filters.service}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, service: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All Services</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[150px] flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Agent</label>
          <select
            value={filters.agent}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, agent: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All Agents</option>
            {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[150px] flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Source</label>
          <select
            value={filters.source}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, source: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[120px] flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All Types</option>
            {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[120px] flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[150px] flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">Response</label>
          <select
            value={filters.response}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, response: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All Responses</option>
            {RESPONSES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[150px] flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary ml-1">State</label>
          <select
            value={filters.state}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, state: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-md border border-text-primary bg-bg-secondary text-text-primary text-sm focus:border-yellow-500 outline-none"
          >
            <option value="">All States</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <button
            type="button"
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Search size={16} />
            Filter
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 bg-gray-400 hover:bg-red-500 text-white rounded-md transition-all shadow-sm"
            title="Clear Filters"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsFilter;