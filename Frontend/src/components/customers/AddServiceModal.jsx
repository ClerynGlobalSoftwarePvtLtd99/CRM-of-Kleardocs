import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { SERVICES } from "../../utils/constants";

const AddServiceModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-tertiary">
          <h3 className="text-xl font-bold">Add New Service</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label">Select Service *</span>
            <select 
              required 
              value={formData.serviceName}
              onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
            >
              <option value="">-- Choose Service --</option>
              <option>Annual Compliance</option>
              <option>GST Monthly Filing</option>
              <option>Income Tax Return</option>
              <option>TDS Return</option>
              <option>Trademark Registration</option>
            </select>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label">Start Date *</span>
            <input 
              type="date" 
              required 
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-green text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> Add Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
