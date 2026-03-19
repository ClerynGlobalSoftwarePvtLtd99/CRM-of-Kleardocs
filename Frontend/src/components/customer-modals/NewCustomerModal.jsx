import React, { useState } from "react";
import { X, UserPlus, Building2, Phone, MapPin, Calendar, Globe, FileText, Briefcase, Plus } from "lucide-react";
import { STATES_AND_UTS, COMPANY_TYPES, AGENTS } from "../../utils/constants";
import toast from "react-hot-toast";

const NewCustomerModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    address: "",
    state: "WEST BENGAL",
    gst: "",
    type: "Private Limited Company",
    incorporationDate: new Date().toISOString().split('T')[0],
    onboardingDate: new Date().toISOString().split('T')[0],
    newlyIncorporated: false,
    salesBy: AGENTS[0],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCustomer = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      customerName: formData.name, // Mapping 'name' to 'customerName' as used in Customers.jsx
      onboardingDate: new Date(formData.onboardingDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-'),
      incorporationDate: new Date(formData.incorporationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-'),
      logo: null,
    };

    onAdd(newCustomer);
    toast.success("New Customer added successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-8 py-5">
          <h2 className="text-2xl font-normal">Add New Customer</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* NAME & PHONE */}
            <div className="fieldset-input">
              <span className="fieldset-label">Name *</span>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Full Name"
                required 
              />
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Phone *</span>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Phone Number"
                required 
              />
            </div>

            {/* COMPANY INFO */}
            <div className="md:col-span-2 fieldset-input">
              <span className="fieldset-label">Company Name *</span>
              <input 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
                placeholder="Business Name"
                required 
              />
            </div>

            <div className="md:col-span-2 fieldset-input">
              <span className="fieldset-label">Address *</span>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                rows="3" 
                placeholder="Complete Address"
                required 
              />
            </div>

            {/* STATE & GST */}
            <div className="fieldset-input">
              <span className="fieldset-label">State & UT *</span>
              <select name="state" value={formData.state} onChange={handleChange} required>
                {STATES_AND_UTS.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">GST</span>
              <input 
                name="gst" 
                value={formData.gst} 
                onChange={handleChange} 
                placeholder="GST Number (Optional)"
              />
            </div>

            {/* TYPE & SALES */}
            <div className="fieldset-input">
              <span className="fieldset-label">Type *</span>
              <select name="type" value={formData.type} onChange={handleChange} required>
                {COMPANY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Sale By</span>
              <select name="salesBy" value={formData.salesBy} onChange={handleChange}>
                {AGENTS.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
              </select>
            </div>

            {/* DATES */}
            <div className="fieldset-input">
              <span className="fieldset-label">Incorporation Date</span>
              <input 
                type="date" 
                name="incorporationDate" 
                value={formData.incorporationDate} 
                onChange={handleChange} 
              />
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Onboarding Date</span>
              <input 
                type="date" 
                name="onboardingDate" 
                value={formData.onboardingDate} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* TOGGLE */}
          <div className="flex items-center gap-2 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="newlyIncorporated"
                checked={formData.newlyIncorporated}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
              <span className="ml-3 text-sm font-normal text-text-primary uppercase tracking-widest">Newly Incorporated?</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-blue text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 mt-4"
          >
            <UserPlus size={20} /> Add New Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCustomerModal;
