import React, { useState } from "react";
import { X, Eye, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { downloadCustomerReport } from "../../redux/slices/customersSlice";
import axiosInstance from "../../api/axiosInstance";

const BoardResolutionModal = ({ customer, onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dispatch = useDispatch();


  const previewPDF = async () => {
    if (isGeneratingPDF) return;
    
    if (!customer.directors || customer.directors.length === 0) {
      toast.error("No directors added for this customer");
      return;
    }
    
    setIsGeneratingPDF(true);
    try {
      const response = await axiosInstance.get(`/customers/${customer._id}/board-resolution`, {
        params: { date },
        responseType: 'blob'
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      toast.success("Board Resolution preview opened in new tab");
    } catch (error) {
      let errorMessage = "Failed to generate PDF preview";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch (e) {}
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      console.error("PDF generation error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = async () => {
    if (isGeneratingPDF) return;
    
    if (!customer.directors || customer.directors.length === 0) {
      toast.error("No directors added for this customer");
      return;
    }
    
    const fileName = `Board Resolution - Auditor Appointment - ${customer.companyName || customer.name}.pdf`;
    
    setIsGeneratingPDF(true);
    try {
      await dispatch(downloadCustomerReport({
        customerId: customer._id,
        type: 'boardResolution',
        params: { date },
        fileName
      })).unwrap();
      
      toast.success("Board Resolution downloaded successfully");
    } catch (error) {
      toast.error(error || "Failed to download PDF");
      console.error("PDF download error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal flex flex-col">
            <span>Select Board</span>
            <span>Resolution Date</span>
          </h2>
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

          <div className="flex gap-4">
            <button
              onClick={previewPDF}
              disabled={isGeneratingPDF}
              className="flex-1 btn-raised btn-raised-blue text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Eye size={18} />
                  Preview PDF
                </>
              )}
            </button>
            
            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 btn-raised btn-raised-green text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardResolutionModal;
