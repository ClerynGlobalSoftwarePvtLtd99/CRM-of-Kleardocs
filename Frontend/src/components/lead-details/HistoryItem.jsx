import { Eye, Phone, Mail, MessageSquare, UserPlus, Clock } from "lucide-react";

const HistoryItem = ({ item, onViewEmail }) => {
  const getIcon = () => {
    switch (item.type) {
      case "whatsapp": return <MessageSquare size={16} className="text-green-500" />;
      case "email": return <Mail size={16} className="text-blue-500" />;
      case "call": return <Phone size={16} className="text-orange-500" />;
      case "text":
        if (item.text.toLowerCase().includes("assigned")) return <UserPlus size={16} className="text-purple-500" />;
        return <Clock size={16} className="text-text-secondary" />;
      default: return <Clock size={16} className="text-text-secondary" />;
    }
  };

  return (
    <div className="border border-bg-tertiary rounded-xl p-4 bg-bg-tertiary/5 hover:border-bg-tertiary/60 transition-all shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-bg-secondary border border-bg-tertiary">
            {getIcon()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-text-primary">{item.user}</span>
              <span className="text-[10px] font-medium text-text-secondary flex items-center gap-1">
                <Clock size={10} />
                {item.datetime}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-text-primary leading-relaxed">{item.text}</p>
              
              {item.called && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
                  Call Made
                </span>
              )}

              {item.type === "email" && (
                <button
                  onClick={() => onViewEmail(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all"
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