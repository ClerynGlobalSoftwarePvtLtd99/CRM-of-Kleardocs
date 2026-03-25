import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { generateBoardResolutionPdf } from "../../utils/boardResolutionPdfGenerator";

const BoardResolutionModal = ({ customer, onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGeneratePDF = () => {
    // Check if customer has directors
    if (!customer.directors || customer.directors.length === 0) {
      toast.error("Please add a director first");
      return;
    }

    generateBoardResolutionPdf(customer, date, 'view');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal">Select Board Resolution Date</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="fieldset-input mb-8">
            <span className="fieldset-label">Board Resolution Date</span>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <button
            onClick={handleGeneratePDF}
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardResolutionModal;
