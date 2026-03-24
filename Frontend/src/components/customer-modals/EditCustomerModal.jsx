import React, { useState } from "react";
import { X, Save, Eye, EyeOff } from "lucide-react";
import { STATES_AND_UTS, COMPANY_TYPES, AGENTS } from "../../utils/constants";
import toast from "react-hot-toast";

const EditCustomerModal = ({ customer, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...customer });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    toast.success("Customer updated successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal">Edit Customer</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="fieldset-input">
              <span className="fieldset-label">Name *</span>
              <input name="customerName" value={formData.customerName} onChange={handleChange} required />
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Phone *</span>
              <input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2 fieldset-input">
              <span className="fieldset-label">Company Name *</span>
              <input name="companyName" value={formData.companyName} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2 fieldset-input">
              <span className="fieldset-label">Address *</span>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" required />
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">State & UT *</span>
              <select name="state" value={formData.state} onChange={handleChange} required>
                {STATES_AND_UTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">GST</span>
              <input name="gst" value={formData.gst} onChange={handleChange} />
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Type *</span>
              <select name="type" value={formData.type} onChange={handleChange} required>
                {COMPANY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">Sales Person</span>
                <select name="salesPerson" value={formData.salesPerson} onChange={handleChange}>
                  {AGENTS.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Incorporation Date</span>
              <input type="date" name="incorporationDate" value={formData.incorporationDate} onChange={handleChange} />
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Onboarding Date</span>
              <input type="date" name="onboardingDate" value={formData.onboardingDate} onChange={handleChange} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="newlyIncorporated"
                checked={formData.newlyIncorporated}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
              <span className="ml-3 text-sm font-normal text-text-primary">Newly Incorporated?</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-bg-tertiary">
            <div className="fieldset-input">
              <span className="fieldset-label">Username</span>
              <input name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="fieldset-input relative">
              <span className="fieldset-label">Password</span>
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 text-text-secondary hover:text-text-primary focus:outline-none transition-colors"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <Save size={16} /> UPDATE CUSTOMER
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;
