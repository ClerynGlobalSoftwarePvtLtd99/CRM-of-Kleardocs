import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";

const AddDirectorModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    designation: "Director",
    din: "",
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
          <h3 className="text-xl font-bold">Add New Director</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Director Name *</span>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter Name"
            />
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Phone Number *</span>
            <input 
              type="text" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Enter Phone"
            />
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">DIN (Optional)</span>
            <input 
              type="text" 
              value={formData.din}
              onChange={(e) => setFormData({...formData, din: e.target.value})}
              placeholder="Enter DIN"
            />
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Designation</span>
            <select 
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
            >
              <option>Director</option>
              <option>Managing Director</option>
              <option>Partner</option>
              <option>Promoter</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <UserPlus size={18} /> Add Director
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDirectorModal;
