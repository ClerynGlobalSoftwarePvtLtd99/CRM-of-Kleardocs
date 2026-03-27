import { useNavigate } from "react-router";

const formatDateLong = (dateString, includeTime = true) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const d = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (!includeTime) return `${d} ${month} ${year}`;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${d} ${month} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const getSourceColor = (source) => {
  const s = source?.toLowerCase() || "";
  if (s.includes("instagram")) return "bg-pink-500/10 text-pink-500 border-pink-500/20";
  if (s.includes("facebook")) return "bg-blue-600/10 text-blue-600 border-blue-600/20";
  if (s.includes("youtube")) return "bg-red-600/10 text-red-600 border-red-600/20";
  if (s.includes("whatsapp")) return "bg-green-600/10 text-green-600 border-green-600/20";
  if (s.includes("referral")) return "bg-teal-600/10 text-teal-600 border-teal-600/20";
  if (s.includes("website")) return "bg-indigo-600/10 text-indigo-600 border-indigo-600/20";
  if (s.includes("cold call")) return "bg-orange-600/10 text-orange-600 border-orange-600/20";
  return "bg-slate-500/10 text-slate-500 border-slate-500/20";
};

const LeadsTable = ({ leads, loading, onLeadClick }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bg-tertiary">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead className="sticky top-0 z-10 bg-bg-primary">
            <tr className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-black">
              <th className="px-4 py-3 first:rounded-l-xl">Identity</th>
              <th className="px-4 py-3">Engagement</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3">Operation</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 last:rounded-r-xl text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id || lead.id}
                className="bg-bg-secondary hover:bg-bg-tertiary/20 transition-all cursor-pointer group shadow-sm border border-bg-tertiary/10"
                onClick={() => onLeadClick && onLeadClick(lead._id || lead.id)}
              >
                {/* 1. IDENTITY: Logo + Name + Phone */}
                <td className="px-4 py-4 rounded-l-2xl border-y border-l border-bg-tertiary/20 group-hover:border-crm-orange/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crm-orange to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-bg-tertiary group-hover:ring-crm-orange transition-all shrink-0">
                      {getInitials(lead.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-sm text-text-primary tracking-tight truncate uppercase italic">{lead.name}</span>
                      <span className="text-[10px] text-text-secondary font-bold mt-0.5 tracking-wider">{lead.phone}</span>
                    </div>
                  </div>
                </td>

                {/* 2. ENGAGEMENT: Company + Service + Status */}
                <td className="px-4 py-4 border-y border-bg-tertiary/20 group-hover:border-crm-orange/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-[11px] text-text-primary truncate max-w-[150px] uppercase tracking-tighter">
                      {lead.companyName || "No Company"}
                    </span>
                    <span className="text-[10px] text-crm-orange font-black italic uppercase leading-none">
                      {lead.service?.name || "No Service"}
                    </span>
                    <div className="mt-1">
                      {lead.isCustomer ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-green-500 text-white text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                          CUSTOMER
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                          LEAD
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* 3. TIMELINE: Created + Next + Last */}
                <td className="px-4 py-4 border-y border-bg-tertiary/20 group-hover:border-crm-orange/30 transition-colors">
                  <div className="flex flex-col gap-1 font-bold">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-text-secondary uppercase">Created:</span>
                      <span className="text-[9px] text-text-primary">{formatDateLong(lead.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-crm-orange uppercase">Next:</span>
                      <span className="text-[9px] text-text-primary">{formatDateLong(lead.nextFollowup, false)}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-60">
                      <span className="text-[9px] uppercase">Last:</span>
                      <span className="text-[9px]">{formatDateLong(lead.lastFollowup)}</span>
                    </div>
                  </div>
                </td>

                {/* 4. OPERATION: Agent + Source + Response */}
                <td className="px-4 py-4 border-y border-bg-tertiary/20 group-hover:border-crm-orange/30 transition-colors">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-black text-text-primary tracking-tight uppercase italic">{lead.agent?.name || "Unassigned"}</span>
                    <span className={`px-1.5 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm transition-all ${getSourceColor(lead.source)}`}>
                      {lead.source || "Other Source"}
                    </span>
                    <div className="flex">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                        lead.response === 'Interested' ? 'bg-green-500 text-white' :
                        lead.response === 'Not Interested' ? 'bg-red-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {lead.response || "No Resp."}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 5. RATING: Type + Priority */}
                <td className="px-4 py-4 border-y border-bg-tertiary/20 group-hover:border-crm-orange/30 transition-colors">
                  <div className="flex flex-col gap-2">
                    <div className="flex">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                        lead.type === 'Hot' ? 'bg-red-600 text-white' :
                        'bg-blue-600 text-white shadow-blue-500/20'
                      }`}>
                        {lead.type || "Cold"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                        lead.priority === 'High' ? 'bg-red-500 text-white shadow-red-500/20' :
                        lead.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                        'bg-green-500 text-white shadow-green-500/20'
                      }`}>
                        {lead.priority || "Low"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 6. ACTION: Details Button */}
                <td className="px-4 py-4 rounded-r-2xl border-y border-r border-bg-tertiary/20 group-hover:border-crm-orange/30 transition-colors text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeadClick && onLeadClick(lead._id || lead.id);
                    }}
                    className="bg-bg-primary hover:bg-crm-orange group-hover:bg-crm-orange text-text-primary group-hover:text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-sm transition-all uppercase tracking-widest border border-bg-tertiary hover:border-crm-orange group-hover:shadow-crm-orange/30"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-bg-tertiary"></div>
                <div className="absolute inset-0 rounded-full border-4 border-crm-orange border-t-transparent animate-spin"></div>
             </div>
             <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] animate-pulse">Syncing Database...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
            <div className="w-12 h-12 rounded-full bg-bg-tertiary/20 flex items-center justify-center mb-4 opacity-30">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">No opportunities found</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LeadsTable;