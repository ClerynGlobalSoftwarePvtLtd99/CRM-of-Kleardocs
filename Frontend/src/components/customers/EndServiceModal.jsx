import React from "react";
import { X, Check, AlertTriangle } from "lucide-react";

const EndServiceModal = ({ service, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-sm bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">End Service?</h3>
            <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <div className="py-4 text-left">
             <p className="text-sm text-text-secondary font-bold mb-2">Service: {service?.name}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-bg-tertiary font-bold flex items-center justify-center gap-2 hover:bg-bg-tertiary/20"
            >
              <X size={18} className="text-blue-500" /> CANCEL
            </button>
            <button 
              onClick={() => {
                onConfirm(service.id);
                onClose();
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-red-500/50 font-bold flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10"
            >
              <Check size={18} /> CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndServiceModal;
