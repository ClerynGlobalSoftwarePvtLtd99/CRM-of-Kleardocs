import React from "react";

const CustomerServicesTable = ({ services = [], onAction }) => {
  return (
    <div className="bg-bg-secondary rounded-sm shadow-sm border border-bg-tertiary overflow-hidden">
      <div className="p-4 border-b border-bg-tertiary bg-bg-secondary flex justify-between items-center">
        <h3 className="text-[17px] font-bold text-text-primary">Services</h3>
      </div>

      <div className="bg-bg-primary p-4">
        {/* LIST HEADER (GRID) */}
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_110px_110px] gap-4 px-4 py-2 mb-1 text-[13px] font-bold text-text-primary">
          <div>Service Name</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Status</div>
          <div className="text-center">Add Invoice</div>
          <div className="text-center">End Service</div>
        </div>

        {/* CARD LIST */}
        <div className="space-y-2">
          {services.length > 0 ? (
            services.map((s, i) => {
              const isActive = s.status === true || s.status === 'Active';
              return (
              <div 
                key={i} 
                className="bg-bg-secondary p-3 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-bg-tertiary lg:grid lg:grid-cols-[2fr_1.5fr_1.5fr_1fr_110px_110px] lg:items-center gap-4 flex flex-col"
              >
                <div className="text-[13px] text-text-primary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Service Name:</span>
                  {s.name || s.serviceName}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Start Date:</span>
                  {s.startDate ? new Date(s.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">End Date:</span>
                  {s.endDate ? new Date(s.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </div>

                <div className="text-[13px]">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Status:</span>
                  <span className={isActive ? "text-[#298835]" : "text-text-secondary"}>
                    {isActive ? 'Active' : s.status === false ? 'Inactive' : s.status || 'Active'}
                  </span>
                </div>

                <div className="flex justify-end lg:justify-center">
                  {isActive ? (
                    <button 
                      onClick={() => onAction && onAction('addInvoice', s)}
                      className="bg-[#f08c3e] hover:bg-[#e67e22] text-white px-3 py-1 font-bold text-[11px] uppercase rounded-[3px] transition-colors shadow-sm"
                    >
                      ADD INVOICE
                    </button>
                  ) : null}
                </div>

                <div className="flex justify-end lg:justify-center">
                  {isActive ? (
                    <button 
                      onClick={() => onAction && onAction('endService', s)}
                      className="bg-[#dc3545] hover:bg-[#c82333] text-white px-3 py-1 font-bold text-[11px] uppercase rounded-[3px] transition-colors shadow-sm"
                    >
                      END SERVICE
                    </button>
                  ) : null}
                </div>
              </div>
            )})
          ) : (
            <div className="bg-bg-secondary p-4 rounded-sm border border-bg-tertiary text-center text-sm text-text-secondary italic">
              No services found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerServicesTable;
