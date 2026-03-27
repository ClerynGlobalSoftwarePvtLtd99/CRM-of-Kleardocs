import React from "react";
import { User, Phone, Briefcase, Globe, Calendar, Clock, MapPin, CheckCircle, Flame, AlertCircle, MessageSquare, ShieldCheck, Mail, Tag } from "lucide-react";

const formatDateLong = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const d = date.getDate();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const suffix = d === 1 || d === 21 || d === 31 ? "st" : d === 2 || d === 22 ? "nd" : d === 3 || d === 23 ? "rd" : "th";

  return `${d}${suffix} ${months[date.getMonth()]} ${date.getFullYear()} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

const InfoRow = ({ icon: Icon, label, value, isEmail = false }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-bg-tertiary/10 transition-all border border-transparent hover:border-bg-tertiary/20 group">
    <div className="w-10 h-10 rounded-xl bg-bg-tertiary/20 flex items-center justify-center shrink-0 group-hover:bg-crm-orange/10 group-hover:text-crm-orange transition-colors">
      <Icon size={18} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60 mb-0.5">{label}</span>
      {isEmail && Array.isArray(value) ? (
        <div className="flex flex-col gap-1">
          {value.map((email, idx) => (
            <a key={idx} href={`mailto:${email}`} className="text-sm font-bold text-crm-orange hover:underline truncate">{email}</a>
          ))}
          {value.length === 0 && <span className="text-sm font-bold text-text-primary">No emails</span>}
        </div>
      ) : (
        <span className="text-sm font-bold text-text-primary truncate">{value || '—'}</span>
      )}
    </div>
  </div>
);

const LeadDetailsCard = ({
  lead,
  onChangeAssignClick,
  onSendTemplateClick,
  onSendWhatsappTemplateClick,
}) => {
  return (
    <div className="space-y-4">
      




      {/* SECTION 2 - MAIN INFO GRID & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 pb-20 w-full">
        
        {/*  CUSTOMER DETAILS */}
        <div className="bg-bg-secondary rounded-2xl border border-bg-tertiary p-8 shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary mb-8 border-b border-bg-tertiary pb-2">Customer details :-</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/*  */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Customer Name:</span>
                  <span className="text-sm font-black text-text-primary">{lead.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Customer Phone:</span>
                  <span className="text-sm font-black text-text-primary">{lead.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Company Name:</span>
                  <span className="text-sm font-black text-text-primary">{lead.companyName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Service:</span>
                  <span className="text-sm font-black text-text-primary">{lead.service?.name || "Startup India Registration"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Source:</span>
                  <span className="text-sm font-black text-text-primary">{lead.source}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Created:</span>
                  <span className="text-sm font-black text-text-primary">{formatDateLong(lead.createdAt)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Last Followup:</span>
                  <span className="text-sm font-black text-text-primary">{formatDateLong(lead.lastFollowup)}</span>
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1">Emails</span>
                  <div className="flex flex-col gap-1">
                    {lead.emails?.map((email, idx) => (
                      <span key={idx} className="text-sm font-black text-crm-orange underline cursor-pointer">{email}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-text-secondary opacity-60 mb-1 font-black">Address</span>
                  <span className="text-sm font-black text-text-primary">{lead.address}</span>
                </div>
              </div>
            </div>
        </div>
        {/* LAST ROW: FOLLOWUP STORE */}
        <div className="lg:col-span-2 bg-yellow-500/5 border-2 border-dashed border-yellow-500/20 rounded-2xl p-6 mt-4">
           <div className="flex items-center gap-3">
              <Clock size={20} className="text-yellow-600" />
              <span className="text-lg font-black text-text-primary">
                Next Followup: <span className="text-yellow-600">{formatDateLong(lead.nextFollowup)}</span>
              </span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LeadDetailsCard;