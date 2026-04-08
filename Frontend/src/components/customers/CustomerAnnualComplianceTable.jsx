import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, Calendar, User, AlertCircle } from "lucide-react";

const CustomerAnnualComplianceTable = ({ compliances = [], financialYears = [], selectedYear, onAction, readOnly = false }) => {
  const defaultYear = selectedYear || financialYears?.[0] || "";

  const [financialYear, setFinancialYear] = useState(defaultYear);
  
  useEffect(() => {
    if (selectedYear !== undefined) setFinancialYear(selectedYear || financialYears?.[0] || "");
  }, [selectedYear]);
  
  useEffect(() => {
    if (!selectedYear && financialYears?.length > 0) {
      setFinancialYear(financialYears[0]);
    }
  }, [financialYears, selectedYear]);

  return (
    <div className="bg-bg-secondary rounded-sm shadow-sm border border-bg-tertiary overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="p-4 border-b border-bg-tertiary flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg-secondary">
        <h3 className="text-[17px] font-bold text-text-primary px-1">Annual Compliance</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {financialYears?.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute -top-2 left-2 bg-bg-secondary px-1 text-[10px] text-text-secondary">Select Financial Year</span>
                <select 
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="bg-bg-secondary border border-bg-tertiary rounded-sm px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-crm-orange min-w-[160px]"
                >
                  {financialYears.map((fy) => (
                    <option key={fy} value={fy}>{fy}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => onAction && financialYear && onAction('viewComplianceYear', financialYear)}
                className="bg-[#298835] hover:bg-[#216d2b] text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded-sm transition-colors custom-shadow-sm h-[34px]"
              >
                View
              </button>
            </div>
          )}
          {!readOnly && (
            <button 
              onClick={() => onAction && onAction('addFinancialYear')}
              className="bg-[#f08c3e] hover:bg-[#e67e22] text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded-sm transition-colors custom-shadow-sm h-[34px]"
            >
              ADD FINANCIAL YEAR
            </button>
          )}
        </div>
      </div>

      {/* LIST WRAPPER */}
      <div className="bg-bg-primary p-4">
        
        {/* LIST HEADER */}
        <div className={`hidden lg:grid ${readOnly ? 'lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr]' : 'lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_80px]'} gap-4 px-4 py-2 mb-1 text-[13px] font-bold text-text-primary`}>
          <div>Compliance Name</div>
          <div>Expiry Date</div>
          <div>Status</div>
          <div>Completed On</div>
          <div>Accountant</div>
          {!readOnly && <div className="text-center">Modify</div>}
        </div>

        {/* CARD LIST */}
        <div className="space-y-2">
          {compliances.length > 0 ? (
            compliances.map((c, i) => {
              const showRedDate = c.name?.includes('ADT-01') || c.name?.includes('INC') || c.name?.includes('Share') || c.name?.includes('MPB-01');
              const isDone = c.status === 'Completed' || c.status === 'Done';
              const isPending = c.status === 'To Be Done' || !c.status;
              
              return (
              <div 
                key={i} 
                className={`bg-bg-secondary p-4 rounded-xl shadow-md border-l-4 ${isDone ? 'border-l-emerald-500' : isPending ? 'border-l-amber-500' : 'border-l-blue-500'} border-y border-r border-bg-tertiary lg:grid ${readOnly ? 'lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr]' : 'lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_80px]'} lg:items-center gap-4 flex flex-col transition-all hover:shadow-lg`}
              >
                {/* Mobile Header: Name + Badge */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 lg:block">
                  <div className="text-[14px] font-bold text-text-primary lg:font-normal lg:text-[13px]">
                    <span className="lg:hidden text-[10px] uppercase tracking-wider text-text-secondary block mb-0.5">Compliance Name</span>
                    {c.name || c.complianceName || "Compliance Record"}
                  </div>
                  
                  <div className="lg:hidden">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${isDone ? 'bg-emerald-500/10 text-emerald-500' : isPending ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {isDone ? <CheckCircle2 size={12} /> : isPending ? <Clock size={12} /> : <AlertCircle size={12} />}
                      {c.status || 'To Be Done'}
                    </span>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className={`text-[13px] ${showRedDate ? 'text-red-600' : 'text-text-secondary'}`}>
                  <span className="lg:hidden text-[10px] uppercase font-bold tracking-wider text-text-primary block mb-1">Expiry Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="lg:hidden opacity-70" />
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </div>
                </div>

                {/* Desktop Status */}
                <div className="hidden lg:block text-[13px]">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${isDone ? 'bg-emerald-500/10 text-emerald-500' : isPending ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {isDone ? <CheckCircle2 size={12} /> : isPending ? <Clock size={12} /> : <AlertCircle size={12} />}
                    {c.status || 'To Be Done'}
                  </span>
                </div>

                {/* Completed On */}
                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden text-[10px] uppercase font-bold tracking-wider text-text-primary block mb-1">Completed On</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="lg:hidden opacity-70" />
                    {c.completedOn ? new Date(c.completedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </div>
                </div>

                {/* Accountant */}
                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden text-[10px] uppercase font-bold tracking-wider text-text-primary block mb-1 text-text-primary">Accountant</span>
                  <div className="flex items-center gap-2">
                    <User size={14} className="lg:hidden opacity-70" />
                    {typeof c.accountant === 'object' ? c.accountant?.name : (c.accountant || '-')}
                  </div>
                </div>

                {/* Modify Action (Admin Only) */}
                {!readOnly && (
                  <div className="flex justify-end lg:block lg:text-center pt-2 lg:pt-0 border-t border-bg-tertiary lg:border-none">
                    <button 
                      onClick={() => onAction && onAction('modifyCompliance', c)}
                      className="bg-[#298835] hover:bg-[#216d2b] text-white px-5 py-2 lg:px-3 lg:py-1 font-bold text-[11px] uppercase rounded-[4px] transition-colors shadow-sm w-full lg:w-fit"
                    >
                      MODIFY
                    </button>
                  </div>
                )}
              </div>
            )})
          ) : (
            <div className="bg-bg-secondary p-8 rounded-xl border border-dashed border-bg-tertiary text-center text-sm text-text-secondary italic">
              {financialYears?.length === 0
                ? "No financial year attached yet."
                : "No compliances found for the selected year."}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CustomerAnnualComplianceTable;
