import React, { useState } from "react";
import { X, Save } from "lucide-react";

const EditContactModal = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: lead.customerName || "",
    phone: lead.customerPhone || "",
    email: lead.email || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-5 py-4">
          <h2 className="text-lg font-bold">Edit Contact Info</h2>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
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
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-all"
            >
              <Save size={16} />
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
