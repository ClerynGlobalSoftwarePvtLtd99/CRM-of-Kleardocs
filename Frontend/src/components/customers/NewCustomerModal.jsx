import React, { useState, useEffect } from "react";
import { X, UserPlus, Building2, Phone, MapPin, Calendar, Globe, FileText, Briefcase, Plus } from "lucide-react";
import { STATES_AND_UTS, COMPANY_TYPES } from "../../utils/constants";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

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
    saleBy: "",
  });

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const users = response.data.data || [];
        const filteredAgents = users.filter(u => u.role === 'agent' || u.role === 'admin');
        setAgents(filteredAgents);
        if (filteredAgents.length > 0) {
          setFormData(prev => ({ ...prev, saleBy: filteredAgents[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      const onlyDigits = value.replace(/\D/g, "").substring(0, 10);
      setFormData(prev => ({ ...prev, [name]: onlyDigits }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.companyName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Format data for backend API
    const customerData = {
      ...formData,
      username: formData.companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12) + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    };

    onAdd(customerData);
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
                placeholder="10-digit number"
                maxLength={10}
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
              <select 
                name="saleBy" 
                value={formData.saleBy} 
                onChange={handleChange}
                disabled={loadingAgents}
              >
                <option value="">Select Sales Person</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                ))}
              </select>
              {loadingAgents && <p className="text-[10px] text-text-secondary mt-1">Loading agents...</p>}
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
