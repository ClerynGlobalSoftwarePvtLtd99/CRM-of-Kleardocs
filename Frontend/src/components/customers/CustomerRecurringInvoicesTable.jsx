import React from "react";

const CustomerRecurringInvoicesTable = ({ recurringInvoices = [], onAction }) => {
  return (
    <div className="bg-bg-secondary rounded-sm shadow-sm border border-bg-tertiary overflow-hidden">
      <div className="p-4 border-b border-bg-tertiary bg-bg-secondary">
        <h3 className="text-[17px] font-bold text-text-primary">Recurring Invoices</h3>
      </div>

      <div className="bg-bg-primary p-4">
        <div className="hidden lg:grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_80px] gap-4 px-4 py-2 mb-1 text-[13px] font-bold text-text-primary">
          <div>Start Date</div>
          <div>End Date</div>
          <div>Linked Service</div>
          <div>Interval</div>
          <div>Next Date</div>
          <div>Status</div>
          <div className="text-center">View</div>
        </div>

        <div className="space-y-2">
          {recurringInvoices.length > 0 ? (
            recurringInvoices.map((inv, i) => {
              const isActive = inv.status === true || inv.status === 'Active';
              return (
              <div 
                key={i} 
                className="bg-bg-secondary p-3 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-bg-tertiary lg:grid lg:grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_80px] lg:items-center gap-4 flex flex-col"
              >
                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Start Date:</span>
                  {inv.startDate ? new Date(inv.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">End Date:</span>
                  {inv.endDate ? new Date(inv.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                <div className="text-[13px] text-text-primary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Linked Service:</span>
                  {inv.linkedService || '-'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Interval:</span>
                  {inv.interval || '-'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Next Date:</span>
                  {inv.nextDate ? new Date(inv.nextDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                <div className="text-[13px]">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Status:</span>
                  <span className={isActive ? "text-[#298835]" : "text-text-secondary"}>
                    {inv.status || 'Active'}
                  </span>
                </div>

                <div className="flex justify-end lg:justify-center">
                  <button 
                    onClick={() => onAction && onAction('viewRecurring', inv)}
                    className="bg-[#f08c3e] hover:bg-[#e67e22] text-white px-3 py-1 font-bold text-[11px] uppercase rounded-[3px] transition-colors shadow-sm"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            )})
          ) : (
            <div className="bg-bg-secondary p-4 rounded-sm border border-bg-tertiary text-center text-sm text-text-secondary italic">
              No recurring schedules active.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRecurringInvoicesTable;
