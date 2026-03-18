import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { COMPANY_TYPES } from "../../utils/constants";

const EditLeadModal = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: lead.companyName || "",
    gstNumber: lead.gstNumber || "",
    type: lead.type || COMPANY_TYPES[0],
    incorporationDate: lead.incorporationDate || "",
    newlyIncorporated: lead.newlyIncorporated || false,
    username: lead.username || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-5 py-4">
          <h2 className="text-lg font-bold">Edit Lead Information</h2>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">GST Number</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              >
                {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Incorporation Date</label>
              <input
                type="date"
                value={formData.incorporationDate}
                onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-3 bg-bg-tertiary/10 rounded-xl border border-bg-tertiary">
              <span className="text-sm font-bold text-text-primary">Newly Incorporated?</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, newlyIncorporated: !prev.newlyIncorporated }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.newlyIncorporated ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.newlyIncorporated ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
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

export default EditLeadModal;
