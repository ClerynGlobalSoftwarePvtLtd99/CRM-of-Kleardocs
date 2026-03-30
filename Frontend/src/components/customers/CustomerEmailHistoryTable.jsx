import React from "react";

const CustomerEmailHistoryTable = ({ emailHistory = [], onAction }) => {
  return (
    <div className="bg-bg-secondary rounded-sm shadow-sm border border-bg-tertiary overflow-hidden">
      <div className="p-4 border-b border-bg-tertiary bg-bg-secondary">
        <h3 className="text-[17px] font-bold text-text-primary">Email Template History</h3>
      </div>

      <div className="bg-bg-primary p-4">
        <div className="hidden lg:grid grid-cols-[1.5fr_3fr_80px] gap-4 px-4 py-2 mb-1 text-[13px] font-bold text-text-primary">
          <div>Date</div>
          <div>Name</div>
          <div className="text-center">View</div>
        </div>

        <div className="space-y-2 pb-2">
          {emailHistory.length > 0 ? (
            emailHistory.map((email, i) => (
              <div 
                key={i} 
                className="bg-bg-secondary p-3 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-bg-tertiary lg:grid lg:grid-cols-[1.5fr_3fr_80px] lg:items-center gap-4 flex flex-col"
              >
                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Date:</span>
                  {email.date ? new Date(email.date).toLocaleString('en-GB') : '-'}
                </div>

                <div className="text-[13px] text-text-primary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Name:</span>
                  {email.name || email.templateName}
                </div>

                <div className="flex justify-end lg:justify-center">
                  <button 
                    onClick={() => onAction && onAction('viewEmail', email)}
                    className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-3 py-1 font-bold text-[11px] uppercase rounded-[3px] transition-colors shadow-sm"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-bg-secondary p-4 rounded-sm border border-bg-tertiary text-center text-sm text-text-secondary italic">
              No email history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerEmailHistoryTable;
