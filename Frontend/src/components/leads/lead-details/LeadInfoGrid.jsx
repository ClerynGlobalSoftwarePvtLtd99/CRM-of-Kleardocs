import React from "react";
import { MessageCircle } from "lucide-react";

const LeadInfoGrid = ({ lead }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[var(--color-text-primary)]">
      <div className="space-y-3">
        <p>
          <span className="font-semibold">Customer Name:</span> {lead.customerName}
        </p>
        <p>
          <span className="font-semibold">Customer Phone:</span> {lead.customerPhone}
        </p>
        <p>
          <span className="font-semibold">Company Name:</span> {lead.companyName}
        </p>
        <p>
          <span className="font-semibold">Service:</span> {lead.service}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Source:</span>
          <MessageCircle size={18} className="text-green-600" />
          {lead.source}
        </p>
        <p>
          <span className="font-semibold">Created:</span> {lead.createdAt}
        </p>
        <p>
          <span className="font-semibold">Last Followup:</span> {lead.lastFollowup}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="font-semibold text-xl mb-2">Emails</p>
          <p>{lead.email}</p>
        </div>

        <div>
          <p className="font-semibold text-xl mb-2">Address</p>
          <p>{lead.address}</p>
        </div>

        <p>
          <span className="font-semibold">State:</span> {lead.state}
        </p>
      </div>
    </div>
  );
};

export default LeadInfoGrid;