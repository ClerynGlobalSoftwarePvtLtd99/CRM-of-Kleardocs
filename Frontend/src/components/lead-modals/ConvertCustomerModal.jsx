import React, { useState } from "react";
import { X, UserCheck } from "lucide-react";
import { COMPANY_TYPES, STATES } from "../../utils/constants";

const ConvertCustomerModal = ({ lead, onClose, onConvert }) => {
  const [formData, setFormData] = useState({
    companyName: lead?.companyName || "",
    state: lead?.state || "",
    address: lead?.address || "",
    gst: "",
    type: COMPANY_TYPES[0],
    incorporationDate: "",
    newlyIncorporated: false,
    username: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConvert(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 text-text-primary">
      <div className="w-full max-w-2xl bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-tertiary">
          <h3 className="text-xl font-bold">Convert to Customer</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-bg-tertiary">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Company Name *</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm"
              placeholder="Full legal name"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">State *</label>
            <select
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm"
            >
              <option value="">Select State</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">GST Number</label>
            <input
              type="text"
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm"
              placeholder="Optional"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm resize-none"
              placeholder="Full correspondence address"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Entity Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm"
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
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm font-bold"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-bg-tertiary/10 rounded-xl border border-bg-tertiary">
            <span className="text-sm font-bold">Newly Incorporated?</span>
            <button
              type="button"
              onClick={() => setFormData(p => ({ ...p, newlyIncorporated: !p.newlyIncorporated }))}
              className={`w-12 h-6 rounded-full relative transition-colors ${formData.newlyIncorporated ? "bg-yellow-500" : "bg-gray-400"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.newlyIncorporated ? "left-7" : "left-1"}`} />
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Username *</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary/10 border border-bg-tertiary rounded-xl outline-none focus:border-yellow-500 text-sm"
              placeholder="Portal username"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-bg-tertiary mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-all uppercase"
            >
              <UserCheck size={18} />
              Confirm Conversion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertCustomerModal;