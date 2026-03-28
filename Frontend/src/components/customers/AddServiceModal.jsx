import React, { useState, useEffect } from "react";
import { X, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../redux/slices/servicesSlice";

const AddServiceModal = ({ onClose, onAdd }) => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.services);

  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length]);

  const [formData, setFormData] = useState({
    serviceId: "",
    serviceName: "",
    startDate: new Date().toISOString().split('T')[0],
    professionalFees: "",
    govtFees: "",
    gst: "18",
    isRecurring: false,
    interval: "1",
    intervalType: "Months",
    endDate: ""
  });

  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const srv = services.find(s => s._id === selectedId || s.id === selectedId);
    if (srv) {
      setFormData({
        ...formData,
        serviceId: selectedId,
        serviceName: srv.name,
        professionalFees: srv.professionalFees || "",
        govtFees: srv.govtFees || ""
      });
    } else {
      setFormData({
        ...formData,
        serviceId: "",
        serviceName: ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-lg bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-tertiary shrink-0">
          <h3 className="text-xl font-bold">Add New Service</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-8">
          <form id="add-service-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="fieldset-input">
              <span className="fieldset-label">Select Service *</span>
              <select 
                required 
                value={formData.serviceId}
                onChange={handleServiceChange}
              >
                <option value="">-- Choose Service --</option>
                {services.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="fieldset-input">
              <span className="fieldset-label">Service Start Date *</span>
              <input 
                type="date" 
                required 
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="fieldset-input">
                <span className="fieldset-label">Professional Fees</span>
                <input 
                  type="number"
                  name="professionalFees"
                  value={formData.professionalFees}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="fieldset-input">
                <span className="fieldset-label">Government Fees</span>
                <input 
                  type="number"
                  name="govtFees"
                  value={formData.govtFees}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="fieldset-input w-1/2">
              <span className="fieldset-label">GST (%)</span>
              <input 
                type="number"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-bg-tertiary border-dashed">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-blue"></div>
                <span className="ml-3 text-sm font-bold text-text-primary uppercase tracking-widest">Recurring Invoice?</span>
              </label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 p-4 bg-bg-primary/50 rounded-xl border border-bg-tertiary/50">
                <div className="fieldset-input">
                  <span className="fieldset-label">Interval *</span>
                  <input 
                    type="number"
                    min="1"
                    name="interval"
                    value={formData.interval}
                    onChange={handleChange}
                    required={formData.isRecurring}
                  />
                </div>
                <div className="fieldset-input">
                  <span className="fieldset-label">Interval Type *</span>
                  <select 
                    name="intervalType"
                    value={formData.intervalType}
                    onChange={handleChange}
                    required={formData.isRecurring}
                  >
                    <option value="Days">Days</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
                <div className="col-span-2 fieldset-input">
                  <span className="fieldset-label">Invoice End Date</span>
                  <input 
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-bg-tertiary shrink-0">
          <button
            type="submit"
            form="add-service-form"
            className="w-full btn-raised btn-raised-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
          >
            <PlusCircle size={18} /> Add Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
