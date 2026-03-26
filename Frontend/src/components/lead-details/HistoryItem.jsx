import { Eye, Phone, Mail, MessageSquare, UserPlus, Clock, Calendar, UserCheck, Edit } from "lucide-react";

const HistoryItem = ({ item, onViewEmail }) => {
  const getIcon = () => {
    switch (item.type) {
      case "whatsapp": return <MessageSquare size={16} className="text-green-500" />;
      case "email": return <Mail size={16} className="text-blue-500" />;
      case "call": return <Phone size={16} className="text-orange-500" />;
      case "followup": return <Calendar size={16} className="text-purple-500" />;
      case "conversion": return <UserCheck size={16} className="text-green-600" />;
      case "assignment": return <UserPlus size={16} className="text-purple-500" />;
      case "email_update": return <Edit size={16} className="text-blue-600" />;
      case "text":
        if (item.text.toLowerCase().includes("assigned")) return <UserPlus size={16} className="text-purple-500" />;
        return <Clock size={16} className="text-text-secondary" />;
      default: return <Clock size={16} className="text-text-secondary" />;
    }
  };

  const getTypeBadge = () => {
    switch (item.type) {
      case "whatsapp": return { bg: "bg-green-500/10", color: "text-green-500", border: "border-green-500/20", text: "WhatsApp" };
      case "email": return { bg: "bg-blue-500/10", color: "text-blue-500", border: "border-blue-500/20", text: "Email" };
      case "call": return { bg: "bg-orange-500/10", color: "text-orange-500", border: "border-orange-500/20", text: "Call" };
      case "followup": return { bg: "bg-purple-500/10", color: "text-purple-500", border: "border-purple-500/20", text: "Followup" };
      case "conversion": return { bg: "bg-green-600/10", color: "text-green-600", border: "border-green-600/20", text: "Converted" };
      case "assignment": return { bg: "bg-purple-500/10", color: "text-purple-500", border: "border-purple-500/20", text: "Agent Update" };
      case "email_update": return { bg: "bg-blue-600/10", color: "text-blue-600", border: "border-blue-600/20", text: "Email Update" };
      case "assigned": return { bg: "bg-purple-500/10", color: "text-purple-500", border: "border-purple-500/20", text: "Assigned" };
      case "text": return { bg: "bg-gray-500/10", color: "text-gray-500", border: "border-gray-500/20", text: "Interaction" };
      default: return { bg: "bg-gray-500/10", color: "text-gray-500", border: "border-gray-500/20", text: "Other" };
    }
  };

  const badge = getTypeBadge();

  return (
    <div className="border border-bg-tertiary rounded-xl p-4 bg-gradient-to-r from-bg-secondary to-bg-tertiary/10 hover:border-yellow-500/30 transition-all shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1 p-2.5 rounded-xl bg-gradient-to-br from-bg-primary to-bg-tertiary/50 border border-bg-tertiary shadow-sm">
            {getIcon()}
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-text-primary">{item.user || 'System'}</span>
                <span className="text-[10px] font-medium text-text-secondary flex items-center gap-1">
                  <Clock size={10} />
                  {item.datetime}
                </span>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold ${badge.bg} ${badge.color} ${badge.border} border uppercase`}>
                {badge.text}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-text-primary leading-relaxed font-medium">{item.text}</p>
              
              {item.type === "followup" && item.notes && (
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-purple-600" />
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Scheduled Followup Time:</p>
                  </div>
                  <p className="text-lg font-bold text-text-primary mb-2">
                    {item.notes.includes('Next followup scheduled for') 
                      ? item.notes.replace('Next followup scheduled for', '').trim()
                      : item.notes
                    }
                  </p>
                  {item.details && (
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <p className="text-xs text-text-secondary">
                        <span className="font-medium">Notes:</span> {item.details}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {item.details && item.type !== "followup" && (
                <div className="bg-bg-tertiary/20 rounded-lg p-3 border border-bg-tertiary/50">
                  <p className="text-xs text-text-secondary leading-relaxed">{item.details}</p>
                </div>
              )}

              {item.called && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
                  <Phone size={10} />
                  Call Made
                </span>
              )}

              {item.subject && (
                <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-xs font-medium text-blue-600 mb-1">Subject:</p>
                  <p className="text-xs text-text-primary">{item.subject}</p>
                </div>
              )}
              
              {item.type === "email" && (
                <button
                  onClick={() => onViewEmail(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all"
                >
                  <Eye size={12} />
                  VIEW EMAIL
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default HistoryItem;