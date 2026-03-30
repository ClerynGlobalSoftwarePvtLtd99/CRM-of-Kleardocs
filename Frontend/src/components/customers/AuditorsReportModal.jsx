import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import { downloadCustomerReport } from "../../redux/slices/customersSlice";
import { toast } from "react-hot-toast";

const AuditorsReportModal = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    financialYear: "2025-2026",
    cin: "",
    date: new Date().toISOString().split('T')[0],
    auditorName: "",
    udin: "",
  });

  const dispatch = useDispatch();

  const handleGeneratePDF = async () => {
    try {
      await dispatch(downloadCustomerReport({
        customerId: customer._id,
        type: 'auditorsReport',
        params: formData
      })).unwrap();
      
      toast.success("Auditor's Report generated successfully");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to generate report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal flex flex-col">
            <span>Auditor’s</span>
            <span>Report</span>
          </h2>
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
