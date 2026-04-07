import React, { useState, useRef } from "react";
import { X, FileText, Printer, Download, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { downloadCustomerReport } from "../../redux/slices/customersSlice";
import { toast } from "react-hot-toast";
import ConsentLetterPreview from "./ConsentLetterPreview";

const ConsentLetterModal = ({ customer, onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();

  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.settings);

  // Fallback firm details if settings aren't populated
  const firmDetails = {
    firmName: settings?.firmName || "M/s. JAGJYOT SINGH AND ASSOCIATES.",
    firmRegistrationNumber: settings?.firmRegistrationNumber || "333567E",
    firmAddress: settings?.firmAddress || "PLOT 51, BLOCK BB – 102, SHANTIPALLY, SARAT PARK, KOLKATA – 700107",
    proprietorName: settings?.proprietorName || "CA Jagjyot Singh",
    membershipNumber: settings?.membershipNumber || "319799"
  };

  const handleDownloadPDF = async () => {
    try {
      await dispatch(downloadCustomerReport({
        customerId: customer._id,
        type: 'consentLetter',
        params: { date }
      })).unwrap();
      
      toast.success("Consent Letter PDF downloaded");
    } catch (err) {
      toast.error(err || "Failed to generate PDF");
    }
  };

  const handlePrint = () => {
    const printContent = previewRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Simple custom print implementation to ensure exact layout
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Consent Letter - ${customer.companyName || customer.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 0; }
            body { background: white; margin: 0; padding: 0.5in; }
          </style>
        </head>
        <body>
          <div class="print-section">${printContent}</div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto pt-20">
      <div className={`relative w-full ${showPreview ? 'max-w-5xl' : 'max-w-md'} rounded-2xl border border-white/10 bg-[#0f172a] text-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Consent Letter</h2>
              <p className="text-xs text-slate-400">Generate professional auditor appointment letter</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 transition-all hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {!showPreview ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Consent Letter Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-lg font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-500 ml-1">This date will appear on the letter as the date of issuance.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)] flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Eye size={18} /> Preview Letter
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Download size={18} /> Fast Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Content */}
              <div className="max-h-[65vh] overflow-y-auto bg-slate-100 rounded-xl p-6 border border-white/5 shadow-inner">
                <div ref={previewRef} className="print-section">
                   <ConsentLetterPreview 
                      customer={customer} 
                      firmDetails={firmDetails} 
                      date={date} 
                    />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 items-center pt-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full md:w-1/3 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border border-white/5 order-3 md:order-1"
                >
                  Back to Settings
                </button>
                
                <div className="flex gap-4 w-full md:w-2/3 order-1 md:order-2">
                  {/* <button
                    onClick={handlePrint}
                    className="flex-1 bg-white hover:bg-slate-200 text-black py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
                  >
                    <Printer size={18} /> Print Now
                  </button> */}
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsentLetterModal;
