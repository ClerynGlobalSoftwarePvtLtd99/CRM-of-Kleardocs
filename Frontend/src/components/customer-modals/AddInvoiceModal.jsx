import React, { useState } from "react";
import { X, FilePlus, Calendar as CalendarIcon } from "lucide-react";

const AddInvoiceModal = ({ service, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    price: 2000,
    gst: 18,
    governmentFees: 0,
    isRecurring: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col p-6 border-b border-bg-tertiary space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Add Invoice</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm font-bold text-text-secondary">{service?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Invoice Date</span>
            <div className="relative">
              <input 
                type="text" 
                value={formData.date}
                readOnly
                className="pr-10"
              />
              <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            </div>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Professional Fees *</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₹</span>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="pl-8"
              />
            </div>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Government Fees *</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₹</span>
              <input 
                type="number" 
                value={formData.governmentFees}
                onChange={(e) => setFormData({...formData, governmentFees: e.target.value})}
                className="pl-8"
              />
            </div>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">GST *</span>
            <div className="relative">
              <input 
                type="number" 
                value={formData.gst}
                onChange={(e) => setFormData({...formData, gst: e.target.value})}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 px-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
            </label>
            <span className="text-sm font-bold text-text-primary">Recurring Invoice?</span>
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <FileText size={18} /> Add Invoice
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
