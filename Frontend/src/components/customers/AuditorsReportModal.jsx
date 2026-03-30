import React, { useState } from "react";
import { X, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AuditorsReportModal = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    cin: customer?.cin || "",
    udin: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!formData.udin) {
      toast.error("UDIN is required");
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading("Generating Auditor's Report...");
    
    try {
      const response = await axiosInstance.get(`/customers/${customer._id}/auditors-report`, {
        params: formData,
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(url, '_blank');
      
      toast.success("Auditor's Report generated", { id: toastId });
      onClose();
    } catch (err) {
      toast.error("Failed to generate report", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] text-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Independent Auditor's Report</h2>
              <p className="text-xs text-slate-400">Generate 5-page legal compliance report</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 transition-all hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-5">
            {/* CIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">CIN (Corporate Identity Number) *</label>
              <input 
                value={formData.cin} 
                onChange={(e) => setFormData({...formData, cin: e.target.value})}
                placeholder="Enter CIN"
                className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>

            {/* UDIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">UDIN (Unique Document Identification Number) *</label>
              <input 
                value={formData.udin} 
                onChange={(e) => setFormData({...formData, udin: e.target.value})}
                placeholder="e.g. 543ERG"
                className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Auditor's Report Date *</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            <ExternalLink size={18} /> {isGenerating ? "GENERATING..." : "GENERATE PDF & VIEW"}
          </button>
          
          <p className="text-[10px] text-center text-slate-500 uppercase tracking-wider font-semibold">
            This will generate a 5-page legal document in a new tab
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditorsReportModal;
