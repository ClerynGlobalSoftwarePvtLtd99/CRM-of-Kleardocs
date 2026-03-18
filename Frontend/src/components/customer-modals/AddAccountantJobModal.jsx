import React, { useState } from "react";
import { X, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const AddAccountantJobModal = ({ customer, onClose }) => {
  const [jobData, setJobData] = useState({
    title: "",
    status: "To Be Done",
    accountant: "None",
    hasExpiryDate: false,
    expiryDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobData.title) {
        toast.error("Job Title is required");
        return;
    }
    toast.success("Job assigned to accountant successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal">Add New Job</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label">Job Title *</span>
            <input 
              type="text" 
              required
              value={jobData.title}
              onChange={(e) => setJobData({...jobData, title: e.target.value})}
              placeholder="Enter Job Title"
            />
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label">Status *</span>
            <select 
              value={jobData.status}
              onChange={(e) => setJobData({...jobData, status: e.target.value})}
            >
              <option>To Be Done</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label">Accountant *</span>
            <select 
              value={jobData.accountant}
              onChange={(e) => setJobData({...jobData, accountant: e.target.value})}
            >
              <option>None</option>
              <option>Milan Chetri</option>
              <option>Ritu Kaur</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={jobData.hasExpiryDate}
                onChange={(e) => setJobData({...jobData, hasExpiryDate: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
              <span className="ml-3 text-sm font-normal text-text-primary">Has Expiry Date?</span>
            </label>
          </div>

          {jobData.hasExpiryDate && (
            <div className="fieldset-input animate-in slide-in-from-top-2 duration-200">
              <span className="fieldset-label">Expiry Date</span>
              <input 
                type="date" 
                value={jobData.expiryDate}
                onChange={(e) => setJobData({...jobData, expiryDate: e.target.value})}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <Briefcase size={16} /> ADD NEW JOB
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAccountantJobModal;
