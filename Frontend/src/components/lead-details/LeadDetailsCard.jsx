import React from "react";
import LeadTopActions from "./LeadTopActions";

const Badge = ({ children, className }) => (
  <span
    className={`px-4 h-10 inline-flex items-center justify-center rounded-full text-sm font-semibold ${className}`}
  >
    {children}
  </span>
);

const LeadDetailsCard = ({
  lead,
  onChangeAssignClick,
  onSendTemplateClick,
  onSendWhatsappTemplateClick,
}) => {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE: INFORMATION */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Customer Name</label>
                <p className="text-sm font-semibold text-text-primary">{lead.customerName}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Phone</label>
                <p className="text-sm font-semibold text-text-primary">{lead.customerPhone}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Company</label>
                <p className="text-sm font-semibold text-text-primary">{lead.companyName}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Service</label>
                <p className="text-sm font-semibold text-text-primary italic text-blue-500">{lead.service}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Source</label>
                <p className="text-sm font-semibold text-text-primary">{lead.source}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Created At</label>
                <p className="text-sm font-medium text-text-primary">{lead.createdAt}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Last Followup</label>
                <p className="text-sm font-medium text-text-primary">{lead.lastFollowup}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Email</label>
                <p className="text-sm font-medium text-text-primary break-all">{lead.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Address</label>
                <p className="text-sm font-medium text-text-primary leading-tight">{lead.address}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase">State</label>
                <p className="text-sm font-medium text-text-primary">{lead.state}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: ACTIONS & TABLETS */}
          <div className="w-full lg:w-[320px] bg-bg-tertiary/10 p-5 rounded-xl border border-bg-tertiary flex flex-col gap-6">
            <div className="space-y-3">
              <button
                onClick={onChangeAssignClick}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all uppercase tracking-wider"
              >
                Change Agent
              </button>
              <button
                onClick={onSendTemplateClick}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all uppercase tracking-wider"
              >
                Send Template
              </button>
              <button
                onClick={onSendWhatsappTemplateClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all uppercase tracking-wider"
              >
                Send Whatsapp Template
              </button>
            </div>

            <div className="pt-4 border-t border-bg-tertiary space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary uppercase">Response</span>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold border ${
                  lead.response === 'Interested' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-text-secondary border-bg-tertiary'
                }`}>
                  {lead.response?.toUpperCase() || "NONE"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary uppercase">Current Agent</span>
                <span className="text-sm font-bold text-text-primary">{lead.agent}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


export default LeadDetailsCard;