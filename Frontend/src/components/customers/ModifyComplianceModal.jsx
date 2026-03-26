import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { AGENTS } from "../../utils/constants";
import { format } from "date-fns";

const ModifyComplianceModal = ({ compliance, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: compliance?.status || "To Be Done",
    accountant: compliance?.accountant || "None",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedComp = { ...compliance, ...formData };
    
    // Normalize status for comparisons
    const currentStatus = formData.status;
    const previousStatus = compliance?.status;
    
    const isFinished = currentStatus === 'Completed' || currentStatus === 'Done';
    const wasFinished = previousStatus === 'Completed' || previousStatus === 'Done';

    // Automatically set completion date if status is changed to a finished state
    if (isFinished && !wasFinished) {
      updatedComp.completedOn = format(new Date(), 'do MMM yyyy');
    } 
    // If it's already finished but date is missing, fill it in
    else if (isFinished && (!updatedComp.completedOn || updatedComp.completedOn === '-')) {
      updatedComp.completedOn = format(new Date(), 'do MMM yyyy');
    }
    // If we changed status away from finished, clear the date
    else if (!isFinished && wasFinished) {
      updatedComp.completedOn = "-";
    }
    
    onUpdate(updatedComp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-tertiary">
          <h3 className="text-lg font-bold truncate pr-4">{compliance?.name}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Compliance Status</span>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option>To Be Done</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Done</option>
            </select>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Assigned Accountant</span>
            <select 
              value={formData.accountant}
              onChange={(e) => setFormData({...formData, accountant: e.target.value})}
            >
              <option>None</option>
              {AGENTS.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-green text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Check size={18} /> Update Compliance
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifyComplianceModal;
