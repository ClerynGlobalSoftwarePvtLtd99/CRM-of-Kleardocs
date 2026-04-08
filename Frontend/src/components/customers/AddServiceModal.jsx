import React, { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addServiceToCustomer, fetchCustomerById } from "../../redux/slices/customersSlice";
import { fetchServices } from "../../redux/slices/servicesSlice";
import toast from "react-hot-toast";

const AddServiceModal = ({ customerId, onClose, onAdd, selectedYear }) => {
  const dispatch = useDispatch();
  const { services: serviceMasters, loading: servicesLoading } = useSelector((state) => state.services);
  
  const [formData, setFormData] = useState({
    serviceId: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    professionalFees: "",
    govtFees: "",
    gst: 18,
    recurring: false,
    interval: 1,
    intervalType: "Month",
    totalInstallments: 4,
    installmentIntervalMonths: 3,
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const isAnnualCompliance = () => {
    const selectedService = serviceMasters.find(s => s._id === formData.serviceId);
    return selectedService?.name === "Annual Compliance";
  };

  const handleServiceChange = (serviceId) => {
    const selectedService = serviceMasters.find(s => s._id === serviceId);
    const isAnnual = selectedService?.name === "Annual Compliance";
    
    const startDate = new Date();
    let endDate = "";
    
    if (isAnnual) {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate = endDate.toISOString().split('T')[0];
    }

    setFormData({
      ...formData,
      serviceId,
      recurring: isAnnual,
      interval: isAnnual ? 3 : 1,
      totalInstallments: isAnnual ? 4 : 1,
      endDate,
      startDate: startDate.toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.serviceId) {
      toast.error("Please select a service");
      return;
    }

    setSubmitting(true);
    
    try {
      await dispatch(addServiceToCustomer({
        customerId,
        serviceData: {
          ...formData,
          professionalFees: Number(formData.professionalFees) || 0,
          govtFees: Number(formData.govtFees) || 0,
          gst: Number(formData.gst) || 18,
          interval: Number(formData.interval) || 1,
          totalInstallments: Number(formData.totalInstallments) || 1,
          installmentIntervalMonths: Number(formData.installmentIntervalMonths) || 3,
        }
      })).unwrap();
      
      toast.success("Service added successfully");
      if (onAdd) onAdd();
      onClose();
    } catch (err) {
      toast.error(err || "Failed to add service");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceId: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      professionalFees: "",
      govtFees: "",
      gst: 18,
      recurring: false,
      interval: 1,
      intervalType: "Month",
      totalInstallments: 4,
      installmentIntervalMonths: 3,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="bg-bg-secondary w-full max-w-md rounded-sm shadow-2xl border border-bg-tertiary overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-tertiary bg-gradient-to-r from-bg-secondary to-bg-primary">
          <h3 className="text-lg font-bold text-text-primary">Add New Service</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg-tertiary/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* SERVICE SELECTION */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Select Service <span className="text-crm-red">*</span>
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-crm-orange transition-colors"
              required
            >
              <option value="">Choose a service...</option>
              {servicesLoading ? (
                <option disabled>Loading services...</option>
              ) : (
                serviceMasters.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Start Date</label>
              <input 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">End Date</label>
              <input 
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
              />
            </div>
          </div>

          {/* FEES */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Professional Fees</label>
              <input 
                type="number"
                min="0"
                value={formData.professionalFees}
                onChange={(e) => setFormData({ ...formData, professionalFees: e.target.value })}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Govt Fees</label>
              <input 
                type="number"
                min="0"
                value={formData.govtFees}
                onChange={(e) => setFormData({ ...formData, govtFees: e.target.value })}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
                placeholder="0"
              />
            </div>
          </div>

          {/* GST */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">GST %</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
              className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
            />
          </div>

          {/* RECURRING TOGGLE - ONLY FOR ANNUAL COMPLIANCE */}
          {isAnnualCompliance() && (
            <div className="space-y-4 pt-2">
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

              {formData.recurring && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Invoice End Date</label>
                    <input 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
                    />
                  </div>

                  {/* Installment Configuration - Auto-calculated based on intervals */}
                  <div className="pt-2 border-t border-bg-tertiary/50">
                    <p className="text-[10px] text-text-secondary mb-2">Installment Configuration</p>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                        Number of Installments
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        max="12"
                        value={formData.totalInstallments}
                        onChange={(e) => setFormData({ ...formData, totalInstallments: parseInt(e.target.value) || 1 })}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-sm px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-crm-orange"
                        placeholder="e.g., 4"
                      />
                    </div>
                    {formData.totalInstallments > 1 && formData.endDate && (
                      <p className="text-[10px] text-text-secondary mt-2">
                        {(() => {
                          const start = new Date(formData.startDate);
                          const end = new Date(formData.endDate);
                          const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                          const monthsPerInstallment = Math.round(months / formData.totalInstallments);
                          return `${formData.totalInstallments} installments every ${monthsPerInstallment} months = ${months} months coverage`;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-bg-tertiary text-text-secondary rounded-sm hover:bg-bg-tertiary/80 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.serviceId}
              className="flex-1 px-4 py-2.5 bg-crm-orange text-white rounded-sm hover:bg-crm-orange/90 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
