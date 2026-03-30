import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import { downloadCustomerReport } from "../../redux/slices/customersSlice";
import { toast } from "react-hot-toast";

const ConsentLetterModal = ({ customer, onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const dispatch = useDispatch();

  const handleGeneratePDF = async () => {
    try {
      await dispatch(downloadCustomerReport({
        customerId: customer._id,
        type: 'consentLetter',
        params: { date }
      })).unwrap();
      
      toast.success("Consent Letter generated successfully");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to generate consent letter");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal flex flex-col">
            <span>Select Consent</span>
            <span>Letter Date</span>
          </h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="fieldset-input mb-8">
            <span className="fieldset-label">Consent Letter Date</span>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <button
            onClick={handleGeneratePDF}
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            <FileText size={16} /> GENERATE PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentLetterModal;
