import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, CheckCircle, Briefcase, Calendar, DollarSign, Percent, ChevronDown, ChevronUp } from "lucide-react";
import { fetchServices } from "../../redux/slices/servicesSlice";
import { addServiceToCustomer, fetchCustomerById } from "../../redux/slices/customersSlice";
import { toast } from "react-hot-toast";

const AddServiceModal = ({ customerId, onClose, selectedYear }) => {
  const dispatch = useDispatch();
  const { services, loading: servicesLoading } = useSelector((state) => state.services);
  
  const [formData, setFormData] = useState({
    serviceId: "",
    startDate: new Date().toISOString().split('T')[0],
    professionalFees: 0,
    govtFees: 0,
    gst: 18,
    recurring: false
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (services.length > 0) {
      // Find "Annual Compliance" or default to first
      const annualComp = services.find(s => s.name === "Annual Compliance");
      const defaultService = annualComp || services[0];
      if (defaultService) {
        setFormData(prev => ({ 
          ...prev, 
          serviceId: defaultService._id,
          professionalFees: defaultService.professionalFees || 0,
          govtFees: defaultService.govtFees || 0
        }));
      }
    }
  }, [services]);

  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const service = services.find(s => s._id === selectedId);
    setFormData(prev => ({ 
      ...prev, 
      serviceId: selectedId,
      professionalFees: service?.professionalFees || 0,
      govtFees: service?.govtFees || 0
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.serviceId) newErrors.serviceId = "Service selection is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(addServiceToCustomer({ customerId, serviceData: formData })).unwrap();
      toast.success("Service added successfully!");
      // Refresh customer data to sync all history sections
      dispatch(fetchCustomerById({ customerId, year: selectedYear }));
      onClose();
    } catch (err) {
      toast.error(err || "Failed to add service");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-secondary w-full max-w-md rounded-sm shadow-2xl border border-bg-tertiary overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-bg-tertiary flex justify-between items-center bg-bg-secondary">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-crm-orange/10 rounded-sm">
              <Briefcase className="w-5 h-5 text-crm-orange" />
            </div>
            <h2 className="text-lg font-bold text-text-primary tracking-tight">Add New Service</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-bg-tertiary rounded-sm transition-colors text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* SELECT SERVICE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              Select Service <span className="text-crm-orange">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.serviceId}
                onChange={handleServiceChange}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setIsDropdownOpen(false)}
                className={`w-full bg-bg-primary border ${errors.serviceId ? 'border-red-500' : 'border-bg-tertiary'} rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange transition-all appearance-none cursor-pointer`}
                disabled={servicesLoading}
              >
                <option value="" disabled>-- Choose Service --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-text-secondary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                )}
              </div>
            </div>
            {errors.serviceId && <p className="text-[10px] text-red-500 font-medium">{errors.serviceId}</p>}
          </div>

          {/* START DATE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Service Start Date <span className="text-crm-orange">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full bg-bg-primary border ${errors.startDate ? 'border-red-500' : 'border-bg-tertiary'} rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange transition-all`}
            />
            {errors.startDate && <p className="text-[10px] text-red-500 font-medium">{errors.startDate}</p>}
          </div>

          {/* FEES GROUP */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Professional Fees
              </label>
              <input
                type="number"
                value={formData.professionalFees}
                onChange={(e) => setFormData({ ...formData, professionalFees: Number(e.target.value) })}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange transition-all"
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Govt Fees
              </label>
              <input
                type="number"
                value={formData.govtFees}
                onChange={(e) => setFormData({ ...formData, govtFees: Number(e.target.value) })}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {/* GST */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" /> GST (%)
            </label>
            <input
              type="number"
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
              className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange transition-all"
              placeholder="18"
            />
          </div>

          {/* RECURRING TOGGLE */}
          <div className="flex items-center justify-between p-3 bg-bg-primary/50 rounded-sm border border-bg-tertiary/50">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-text-primary">Recurring Invoice?</span>
              <span className="text-[10px] text-text-secondary">Enable for automatic monthly billing</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary border border-bg-tertiary hover:bg-bg-tertiary rounded-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-crm-orange hover:bg-crm-orange/90 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-lg shadow-crm-orange/20 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
