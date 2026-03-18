import React, { useState } from "react";
import { X, FileText } from "lucide-react";

const AuditorsReportModal = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    financialYear: "2025-2026",
    cin: "",
    date: new Date().toISOString().split('T')[0],
    auditorName: "",
    udin: "",
  });

  const handleGeneratePDF = () => {
    const baseUrl = `https://crm.startupstation.in/api/v1/customers/auditors-report/${customer.id}`;
    const params = new URLSearchParams(formData);
    window.open(`${baseUrl}?${params.toString()}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal">Auditor's Report</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="fieldset-input">
            <span className="fieldset-label">Financial Year</span>
            <input value={formData.financialYear} onChange={(e) => setFormData({...formData, financialYear: e.target.value})} />
          </div>
          <div className="fieldset-input">
            <span className="fieldset-label">CIN</span>
            <input value={formData.cin} onChange={(e) => setFormData({...formData, cin: e.target.value})} />
          </div>
          <div className="fieldset-input">
            <span className="fieldset-label">Date</span>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="fieldset-input">
            <span className="fieldset-label">Auditor Name</span>
            <input value={formData.auditorName} onChange={(e) => setFormData({...formData, auditorName: e.target.value})} />
          </div>
          <div className="fieldset-input">
            <span className="fieldset-label">UDIN</span>
            <input value={formData.udin} onChange={(e) => setFormData({...formData, udin: e.target.value})} />
          </div>

          <button
            onClick={handleGeneratePDF}
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <FileText size={16} /> GENERATE PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditorsReportModal;
