import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, Calendar, Eye } from "lucide-react";
import { fetchFinancialYears } from "../../redux/slices/complianceSlice";

const CompliancesHeader = ({ financialYear, setFinancialYear, onView, totalCount }) => {
  const dispatch = useDispatch();
  const { financialYears } = useSelector((state) => state.compliance);

  useEffect(() => {
    if (financialYears.length === 0) {
      dispatch(fetchFinancialYears());
    }
  }, [dispatch, financialYears.length]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Compliances <span className="text-text-secondary">({totalCount || 0})</span>
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Financial Year Dropdown */}
        <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-lg px-3 py-2 min-w-[190px]">
          <Calendar size={16} className="text-[var(--color-text-secondary)] shrink-0" />
          <div className="relative flex-1">
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="w-full appearance-none bg-transparent outline-none text-sm text-[var(--color-text-primary)] cursor-pointer pr-6"
            >
              <option value="">Select Financial Year</option>
              {financialYears.length > 0 ? (
                financialYears.map((fy) => (
                  <option key={fy._id} value={fy.financialYear} className="text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]">
                    {fy.financialYear}
                  </option>
                ))
              ) : (
                <option disabled>No years available</option>
              )}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
            />
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={onView}
          disabled={!financialYear}
          className="flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <Eye size={16} />
          View
        </button>
      </div>
    </div>
  );
};

export default CompliancesHeader;