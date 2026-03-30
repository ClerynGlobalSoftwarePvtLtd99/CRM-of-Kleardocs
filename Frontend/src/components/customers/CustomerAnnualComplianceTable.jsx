import React, { useState } from "react";

const CustomerAnnualComplianceTable = ({ compliances = [], onAction }) => {
  const [financialYear, setFinancialYear] = useState("2025-2026");

  return (
    <div className="bg-bg-secondary rounded-sm shadow-sm border border-bg-tertiary overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="p-4 border-b border-bg-tertiary flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg-secondary">
        <h3 className="text-[17px] font-bold text-text-primary">Annual Compliance</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute -top-2 left-2 bg-bg-secondary px-1 text-[10px] text-text-secondary">Select Financial Year</span>
              <select 
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="bg-bg-secondary border border-bg-tertiary rounded-sm px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-crm-orange min-w-[160px]"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
              </select>
            </div>
            <button 
              onClick={() => onAction && onAction('viewComplianceYear', financialYear)}
              className="bg-[#298835] hover:bg-[#216d2b] text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded-sm transition-colors custom-shadow-sm h-[34px]"
            >
              VIEW
            </button>
          </div>
          <button 
            onClick={() => onAction && onAction('addFinancialYear')}
            className="bg-[#f08c3e] hover:bg-[#e67e22] text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded-sm transition-colors custom-shadow-sm h-[34px]"
          >
            ADD FINANCIAL YEAR
          </button>
        </div>
      </div>

      {/* LIST WRAPPER */}
      <div className="bg-bg-primary p-4">
        
        {/* LIST HEADER */}
        <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_80px] gap-4 px-4 py-2 mb-1 text-[13px] font-bold text-text-primary">
          <div>Compliance Name</div>
          <div>Expiry Date</div>
          <div>Status</div>
          <div>Completed On</div>
          <div>Accountant</div>
          <div className="text-center">Modify</div>
        </div>

        {/* CARD LIST */}
        <div className="space-y-2">
          {compliances.length > 0 ? (
            compliances.map((c, i) => {
              const showRedDate = c.name?.includes('ADT-01') || c.name?.includes('INC') || c.name?.includes('Share') || c.name?.includes('MPB-01');
              return (
              <div 
                key={i} 
                className="bg-bg-secondary p-3 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-bg-tertiary lg:grid lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_80px] lg:items-center gap-4 flex flex-col"
              >
                <div className="text-[13px] text-text-primary">
                  <span className="lg:hidden font-bold block mb-1">Compliance Name:</span>
                  {c.name || c.complianceName}
                </div>

                <div className={`text-[13px] ${showRedDate ? 'text-red-600' : 'text-text-secondary'}`}>
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Expiry Date:</span>
                  {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Status:</span>
                  {c.status || 'To Be Done'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Completed On:</span>
                  {c.completedOn ? new Date(c.completedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Accountant:</span>
                  {c.accountant || ''}
                </div>

                <div className="flex justify-end lg:block lg:text-center">
                  <button 
                    onClick={() => onAction && onAction('modifyCompliance', c)}
                    className="bg-[#298835] hover:bg-[#216d2b] text-white px-3 py-1 font-bold text-[11px] uppercase rounded-[3px] transition-colors shadow-sm"
                  >
                    MODIFY
                  </button>
                </div>
              </div>
            )})
          ) : (
            <div className="bg-bg-secondary p-4 rounded-sm border border-bg-tertiary text-center text-sm text-text-secondary italic">
              No compliances found for the selected year.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CustomerAnnualComplianceTable;
