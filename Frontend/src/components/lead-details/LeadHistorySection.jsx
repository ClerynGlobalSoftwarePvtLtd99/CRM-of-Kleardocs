import { Plus, Phone, MessageSquare, Mail, UserPlus, Eye } from "lucide-react";
import HistoryItem from "./HistoryItem";

const LeadHistorySection = ({ 
  history, 
  onViewEmail, 
  interactionForm, 
  setInteractionForm, 
  handleAddInteraction 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT: LEAD HISTORY LIST */}
      <div className="lg:col-span-2 bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-bg-tertiary bg-bg-tertiary/20">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
             Lead History
          </h2>
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

      {/* RIGHT: ADD INTERACTION FORM */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-sm overflow-hidden h-fit sticky top-6">
        <div className="px-6 py-4 border-b border-bg-tertiary bg-bg-tertiary/20">
          <h2 className="text-lg font-bold text-text-primary">Add Interaction</h2>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">Interaction Details</label>
            <textarea
              value={interactionForm.details}
              onChange={(e) => setInteractionForm(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Enter details of the conversation..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-bg-tertiary bg-bg-tertiary/10 text-sm text-text-primary focus:border-yellow-500 outline-none resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-bg-tertiary/20 rounded-xl border border-bg-tertiary">
            <div className="flex items-center gap-2">
              <Phone size={16} className={interactionForm.called ? "text-green-500" : "text-text-secondary"} />
              <span className="text-sm font-bold text-text-primary">Phone call made?</span>
            </div>
            <button
              onClick={() => setInteractionForm(prev => ({ ...prev, called: !prev.called }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                interactionForm.called ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  interactionForm.called ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleAddInteraction}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            <Plus size={18} />
            Add Interaction
          </button>
        </div>
      </div>

    </div>
  );
};


export default LeadHistorySection;