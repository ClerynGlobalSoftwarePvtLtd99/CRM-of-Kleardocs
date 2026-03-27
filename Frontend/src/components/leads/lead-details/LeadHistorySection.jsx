import { Plus, Phone, MessageSquare, Mail, UserPlus, Eye } from "lucide-react";
import HistoryItem from "./HistoryItem";

const LeadHistorySection = ({ 
  history, 
  onViewEmail, 
  interactionForm, 
  setInteractionForm, 
  onAddInteraction 
}) => {
  return (
    <div className="w-full">
      {/* TOP BAR WITH ADD INTERACTION BUTTON */}
      <div className="flex items-center justify-between mb-6 bg-bg-secondary border border-bg-tertiary rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          Lead History
        </h2>
        <button
          onClick={onAddInteraction}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2 uppercase tracking-wider"
        >
          <Plus size={16} />
          Add Interaction
        </button>
      </div>
      
      {/* LEAD HISTORY LIST */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-bg-tertiary bg-bg-tertiary/20">
          <h3 className="text-base font-semibold text-text-primary">History Entries</h3>
        </div>
        
        <div 
          className="p-6 space-y-4 max-h-[350px] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#eab308 #f3f4f6'
          }}
        >
          {history.length === 0 ? (
            <div className="text-center py-10 text-text-secondary italic">No history available for this lead yet.</div>
          ) : (
            <>
              {history.length > 5 && (
                <div className="text-xs text-text-secondary italic mb-2 text-center">
                  Showing {history.length} history entries • Scroll to see more
                </div>
              )}
              {history.map((item) => (
                <HistoryItem key={item.id} item={item} onViewEmail={onViewEmail} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default LeadHistorySection;