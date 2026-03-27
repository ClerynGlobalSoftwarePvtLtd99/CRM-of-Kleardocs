import React from "react";
import { X, FileText, Download, Printer, ShieldCheck } from "lucide-react";

const GenericDocumentModal = ({ customer, title, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-bg-tertiary bg-bg-tertiary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-crm-orange/20 flex items-center justify-center text-crm-orange">
              <FileText size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight italic">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-tertiary transition-colors text-text-secondary"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center text-center space-y-8">
           <div className="w-24 h-24 rounded-3xl bg-bg-tertiary/20 flex items-center justify-center text-text-secondary opacity-30">
              <ShieldCheck size={48} />
           </div>
           <div className="space-y-3">
              <h4 className="text-2xl font-black uppercase tracking-tight">Drafting {title}</h4>
              <p className="text-sm font-bold text-text-secondary max-w-md mx-auto">
                System is generating the official {title} for <span className="text-crm-orange">{customer?.companyName}</span> using the verified compliance data.
              </p>
           </div>
           
           <div className="bg-bg-tertiary/10 p-6 rounded-2xl border border-dashed border-bg-tertiary w-full max-w-lg">
              <div className="flex items-center justify-between gap-4">
                 <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Status</span>
                    <span className="text-sm font-black text-green-500 uppercase">Ready for Generation</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-bg-primary border border-bg-tertiary hover:text-crm-orange transition-colors shadow-sm">
                       <Printer size={18} />
                    </button>
                    <button className="p-3 rounded-xl bg-bg-primary border border-bg-tertiary hover:text-crm-orange transition-colors shadow-sm">
                       <Download size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-bg-tertiary bg-bg-tertiary/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-10 py-3 rounded-xl bg-crm-orange hover:bg-orange-600 text-white text-xs font-black shadow-lg shadow-crm-orange/20 transition-all uppercase tracking-widest active:scale-95"
          >
            Close & Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericDocumentModal;
