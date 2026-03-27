import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useSelector } from "react-redux";
import { 
  SOURCES, 
  CLIENT_TYPES, 
  PRIORITIES, 
  RESPONSES,
  STATES_AND_UTS
} from "../../../utils/constants";

const EditContactModal = ({ lead, onClose, onUpdate }) => {
  const { services } = useSelector((state) => state.services);
  
  // Resolve the current service name for the dropdown display
  const currentServiceName = lead.service?.name || "";

  const [formData, setFormData] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    companyName: lead.companyName || "",
    serviceName: currentServiceName,  // display name for the dropdown
    source: lead.source || "",
    type: lead.type || "",            // Hot/Cold/Warm — the actual lead type
    priority: lead.priority || "",
    response: lead.response || "",
    address: lead.address || "",
    state: lead.state || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Look up serviceId by selected service name
    const selectedService = services.find(s => s.name === formData.serviceName);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      companyName: formData.companyName,
      source: formData.source,
      type: formData.type,
      priority: formData.priority,
      response: formData.response,
      address: formData.address,
      state: formData.state,
      ...(selectedService && { serviceId: selectedService._id }),
    };

    onUpdate(payload);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4 flex-shrink-0">
          <h2 className="text-xl font-normal">Update Lead</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Service</label>
            <select
              value={formData.serviceName}
              onChange={(e) => handleChange('serviceName', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            >
              <option value="">Select Service</option>
              {services.filter(s => s.status).map((service) => (
                <option key={service._id} value={service.name}>{service.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Source</label>
            <select
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            >
              <option value="">Select Source</option>
              {SOURCES.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Type (Hot / Cold / Warm)</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            >
              <option value="">Select Type</option>
              {CLIENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            >
              <option value="">Select Priority</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Response</label>
            <select
              value={formData.response}
              onChange={(e) => handleChange('response', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            >
              <option value="">Select Response</option>
              {RESPONSES.map((response) => (
                <option key={response} value={response}>{response}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors resize-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">State</label>
            <select
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
            >
              <option value="">Select State</option>
              {STATES_AND_UTS.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full btn-raised btn-raised-orange text-white px-4 py-3 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 min-h-[44px] flex-shrink-0"
          >
            <Save size={16} />
            UPDATE LEAD
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
