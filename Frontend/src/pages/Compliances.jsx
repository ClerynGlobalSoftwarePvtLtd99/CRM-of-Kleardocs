import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CompliancesHeader from "../components/compliances/CompliancesHeader";
import CompliancesFilter from "../components/compliances/CompliancesFilter";
import CompliancesTable from "../components/compliances/CompliancesTable";
import toast from "react-hot-toast";
import { fetchGlobalCompliances } from "../redux/slices/globalCompliancesSlice";
import ContentLoader from "../components/common/ContentLoader";

const Compliances = () => {
  const dispatch = useDispatch();
  const { list: compliances, loading, totalCount } = useSelector((state) => state.globalCompliances);

  const [filters, setFilters] = useState({
    search: "",
    compliance: "",
    status: "",
    accountant: "",
    startDate: null,
    endDate: null,
  });

  const [financialYear, setFinancialYear] = useState("");

  const handleView = () => {
    if (!financialYear) {
      toast.error("Please select a financial year");
      return;
    }

    const params = {
      financialYear,
      search: filters.search || undefined,
      status: filters.status || undefined,
      compliance: filters.compliance || undefined,
      accountant: filters.accountant || undefined,
      startDate: filters.startDate ? filters.startDate.toISOString() : undefined,
      endDate: filters.endDate ? filters.endDate.toISOString() : undefined,
    };

    dispatch(fetchGlobalCompliances(params));
  };

  // Automatically refresh when filters change, if a financial year is selected
  useEffect(() => {
    if (financialYear) {
      handleView();
    }
  }, [filters]);

  return (
    <div className="space-y-6">
      <CompliancesHeader
        financialYear={financialYear}
        setFinancialYear={setFinancialYear}
        onView={handleView}
        totalCount={totalCount > 0 ? totalCount : null}
      />

      <CompliancesFilter
        filters={filters}
        setFilters={setFilters}
        onView={handleView}
      />

      {loading ? (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-20 flex justify-center items-center shadow-sm">
          <ContentLoader message="Loading compliances..." />
        </div>
      ) : (
        <CompliancesTable data={compliances} />
      )}
    </div>
  );
};

export default Compliances;
