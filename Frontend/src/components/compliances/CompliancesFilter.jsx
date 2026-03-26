import { Search, Filter, X, ChevronDown } from "lucide-react";
import DateRangePicker from "../DateRangePicker";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/usersSlice";

const COMPLIANCE_NAMES = [
  "Preparation of 07 Required Statutory Registers",
  "Preparation & Filing of Form DPT - 03",
  "Preparation of MPB-01 (Disclosure of Interest by Directors)",
  "Preparation of DIR-08 (Disclosure of Non-Disqualification by Directors)",
  "Preparation of Notice and Minutes of Board Meetings",
  "Preparation of Notice and Minutes of the Annual General Meeting & Extra-Ordinary General Meeting",
  "Preparation & Filing of Balance Sheet and P&L Accounts",
  "Preparation & Filing of Audit Report, Director's Report & Extract of Annual Returns",
  "DIR-3 E-KYC",
  "Preparation & Filing of Form AOC-04 (Financials Related Annual Return)",
  "Filing of Income Tax Returns",
  "Preparation & Filing of Form MGT-07 (Management Related Annual Return)",
  "Annual Compliance"
];

const CompliancesFilter = ({ filters, setFilters, onView }) => {
  const dispatch = useDispatch();
  const [localFilters, setLocalFilters] = useState(filters);
  const [isCompOpen, setIsCompOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { accountants } = useSelector((state) => state.users);

  useEffect(() => {
    if (accountants.length === 0) {
      dispatch(fetchUsers({ role: 'accountant', limit: 100 }));
    }
  }, [dispatch, accountants.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCompOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const update = (field, value) =>
    setLocalFilters((prev) => ({ ...prev, [field]: value }));

  const handleApplyFilters = () => {
    setFilters(localFilters);
    toast.success("Filters applied");
  };

  const clearFilters = () => {
    const cleared = {
      search: "",
      compliance: "",
      status: "",
      accountant: "",
      startDate: null,
      endDate: null,
    };
    setLocalFilters(cleared);
    setFilters(cleared);
    toast.success("Filters cleared");
    // Ensure parent refreshes with latest data (empty filters)
    setTimeout(() => {
      onView();
    }, 0);
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-4 rounded-xl mb-6 shadow-sm">
      <div className="flex items-center gap-4 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] pb-1">

        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-[400px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Name, phone, company name"
            value={localFilters.search}
            onChange={(e) => update("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] text-sm"
          />
        </div>

        {/* Date Range */}
        <div className="shrink-0 z-50">
          <DateRangePicker
            startDate={localFilters.startDate}
            endDate={localFilters.endDate}
            onRangeChange={(startDate, endDate) =>
              setLocalFilters((prev) => ({ ...prev, startDate, endDate }))
            }
          />
        </div>

        {/* Compliance Name - Custom Compact Dropdown */}
        {/* <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsCompOpen(!isCompOpen)}
            className="flex items-center justify-between gap-2 px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm transition-colors hover:border-[var(--color-accent)] w-[140px] cursor-pointer"
          >
            <span className="truncate font-medium text-[var(--color-text-primary)]">
              {localFilters.compliance || "Compliance Name"}
            </span>
            <ChevronDown size={14} className={`text-[var(--color-text-secondary)] shrink-0 transition-transform ${isCompOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCompOpen && (
            <div className="absolute z-[60] top-full left-0 mt-1 min-w-[320px] bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
                <li
                  onClick={() => { update("compliance", ""); setIsCompOpen(false); }}
                  className="px-4 py-2.5 text-sm hover:bg-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-secondary)] border-b border-[var(--color-bg-tertiary)]"
                >
                  All Compliances
                </li>
                {COMPLIANCE_NAMES.map(name => (
                  <li
                    key={name}
                    onClick={() => { update("compliance", name); setIsCompOpen(false); }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[var(--color-bg-tertiary)] ${
                      localFilters.compliance === name ? 'text-[var(--color-accent)] font-medium bg-[var(--color-accent)]/5' : 'text-[var(--color-text-primary)]'
                    }`}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div> */}

        {/* Status */}
        <div className="relative shrink-0">
          <select
            value={localFilters.status}
            onChange={(e) => update("status", e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[120px] text-sm"
          >
            <option value="">Status</option>
            <option value="To Be Done">To Be Done</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Done">Done</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>

        {/* Accountant */}
        <div className="relative shrink-0">
          <select
            value={localFilters.accountant}
            onChange={(e) => update("accountant", e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] cursor-pointer min-w-[120px] text-sm"
          >
            <option value="">Accountant</option>
            {accountants.map(acc => (
              <option key={acc._id} value={acc.name}>{acc.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium text-sm"
            title="Apply Filter"
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-red-500 hover:text-white text-[var(--color-text-secondary)] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium text-sm"
            title="Clear Filters"
          >
            <X size={18} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

      </div>
    </div>
  );
};


export default CompliancesFilter;