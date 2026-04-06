import React, { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createJob } from "../../redux/slices/jobsSlice";
import axiosInstance from "../../api/axiosInstance";

const JOB_STATUSES = ["To be done", "Ongoing", "Done"];

const AddAccountantJobModal = ({ onClose, customer, onSuccess }) => {
  const [accountants, setAccountants] = useState([]);
  const [loadingAccountants, setLoadingAccountants] = useState(true);

  const [formData, setFormData] = useState({
    jobTitle: "",
    status: "To be done",
    accountant: "",
    hasExpiryDate: false,
    expiryDate: new Date().toISOString().split('T')[0]
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const res = await axiosInstance.get('/users?role=accountant');
        const fetchedAccountants = res.data.data || [];
        setAccountants(fetchedAccountants);
        if (fetchedAccountants.length > 0) {
          setFormData(prev => ({ ...prev, accountant: fetchedAccountants[0].name }));
        }
      } catch (err) {
        console.error("Failed to fetch accountants:", err);
        // Fallback or silent error, don't crash the modal
      } finally {
        setLoadingAccountants(false);
      }
    };
    
    fetchAccountants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle) {
      toast.error("Please enter a job title");
      return;
    }
    if (!formData.accountant) {
      toast.error("Please select an accountant");
      return;
    }

    try {
      await dispatch(createJob({
        customer: customer._id,
        jobTitle: formData.jobTitle,
        status: formData.status,
        accountant: formData.accountant,
        expiryDate: formData.hasExpiryDate ? formData.expiryDate : null
      })).unwrap();
      
      toast.success("New job added successfully!", {
        position: "bottom-right",
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err || "Failed to add job");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase size={20} className="text-crm-blue" />
            <div className="flex flex-col">
              <span>Add</span>
              <span>New Job</span>
            </div>
          </h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white rounded-lg hover:bg-bg-tertiary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label">Job Title *</span>
            <input 
              name="jobTitle" 
              value={formData.jobTitle} 
              onChange={handleChange} 
              placeholder="e.g. Audit Filing"
              required 
              autoFocus
            />
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label">Status *</span>
            <select name="status" value={formData.status} onChange={handleChange} required>
              {JOB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label">Accountant *</span>
            <select 
              name="accountant" 
              value={formData.accountant} 
              onChange={handleChange} 
              required 
              disabled={loadingAccountants || accountants.length === 0}
            >
              {loadingAccountants ? (
                <option value="">Loading accountants...</option>
              ) : accountants.length === 0 ? (
                <option value="">No accountants found</option>
              ) : (
                accountants.map(a => <option key={a._id || a.name} value={a.name}>{a.name}</option>)
              )}
            </select>
          </div>

          {/* TOGGLE */}
          <div className="flex items-center gap-2 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="hasExpiryDate"
                checked={formData.hasExpiryDate}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-blue"></div>
              <span className="ml-3 text-sm font-bold text-text-primary uppercase tracking-widest">Has Expiry Date</span>
            </label>
          </div>

          {formData.hasExpiryDate && (
             <div className="fieldset-input animate-in fade-in slide-in-from-top-2">
              <span className="fieldset-label">Expiry Date *</span>
              <input 
                type="date" 
                name="expiryDate" 
                value={formData.expiryDate} 
                onChange={handleChange}
                required={formData.hasExpiryDate}
              />
            </div>
          )}

          <div className="pt-4 border-t border-bg-tertiary">
            <button
              type="submit"
              className="w-full btn-raised btn-raised-blue text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
            >
              Add new job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountantJobModal;
