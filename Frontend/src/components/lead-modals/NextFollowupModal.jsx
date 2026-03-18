import React, { useState } from "react";
import { X, Calendar, Save } from "lucide-react";

const NextFollowupModal = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    details: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      nextFollowup: `${formData.date} ${formData.time}`,
      details: formData.details
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-5 py-4">
          <h2 className="text-lg font-bold">Set Next Followup</h2>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Time</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Interaction Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Context for next followup..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-bg-tertiary bg-bg-tertiary/10 text-sm text-text-primary focus:border-yellow-500 outline-none resize-none transition-all"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-bg-tertiary">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-all uppercase"
            >
              <Calendar size={16} />
              Set Followup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NextFollowupModal;
