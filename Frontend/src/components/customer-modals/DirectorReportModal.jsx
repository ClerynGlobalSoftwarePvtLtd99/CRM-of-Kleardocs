import React, { useState } from "react";
import { X, Plus, Trash2, Download } from "lucide-react";

const DirectorReportModal = ({ customer, onClose }) => {
  const [reportData, setReportData] = useState({
    place: "Kolkata",
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    cin: "",
    noOfBoardMeetings: 1,
    agmDate: "",
    reportDate: new Date().toISOString().split('T')[0],
  });

  const [profitTable, setProfitTable] = useState({
    header1: "Current Year",
    header2: "Previous Year",
    profit1: "",
    profit2: "",
    depreciation1: "",
    depreciation2: "",
    profitTax1: "",
    profitTax2: "",
    provision1: "",
    provision2: "",
    deferred1: "",
    deferred2: "",
    profitAfterTax1: "",
    profitAfterTax2: "",
    balance1: "",
    balance2: "",
    grossProfit1: "",
    grossProfit2: "",
  });

  const [directors, setDirectors] = useState([
    { id: Date.now(), name: "", designation: "", appointment: "", resignation: "" }
  ]);

  const [signingDirectors, setSigningDirectors] = useState([
    { id: Date.now(), name: "", din: "" }
  ]);

  const addDirector = () => {
    setDirectors([...directors, { id: Date.now(), name: "", designation: "", appointment: "", resignation: "" }]);
  };

  const removeDirector = (id) => {
    setDirectors(directors.filter(d => d.id !== id));
  };

  const addSigningDirector = () => {
    setSigningDirectors([...signingDirectors, { id: Date.now(), name: "", din: "" }]);
  };

  const removeSigningDirector = (id) => {
    setSigningDirectors(signingDirectors.filter(d => d.id !== id));
  };

  const handleGeneratePDF = () => {
    const baseUrl = `https://crm.startupstation.in/api/v1/customers/director-report/${customer.id}`;
    
    const params = new URLSearchParams({
      place: reportData.place,
      date: reportData.date,
      cin: reportData.cin,
      noOfBoardMeetings: reportData.noOfBoardMeetings,
      agmDate: reportData.agmDate,
      profitTable: JSON.stringify(profitTable),
      directors: JSON.stringify(directors),
      signingDirectors: JSON.stringify(signingDirectors)
    });

    window.open(`${baseUrl}?${params.toString()}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-8 py-5">
          <h2 className="text-2xl font-normal text-text-primary">Director Report</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* PROFIT TABLE */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Particulars</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <tbody className="divide-y divide-bg-tertiary">
                   <tr>
                     <td className="py-4 font-bold text-text-primary w-1/2"></td>
                     <td className="px-6 py-4">
                        <div className="fieldset-input">
                            <input 
                                className="text-center"
                                value={profitTable.header1}
                                onChange={(e) => setProfitTable({...profitTable, header1: e.target.value})}
                            />
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="fieldset-input">
                            <input 
                                className="text-center"
                                value={profitTable.header2}
                                onChange={(e) => setProfitTable({...profitTable, header2: e.target.value})}
                            />
                        </div>
                     </td>
                   </tr>
                   {[
                     { label: "Profit Before interest, Depreciation & Tax", key1: "profit1", key2: "profit2" },
                     { label: "Less: Depreciation & Amortization Expense", key1: "depreciation1", key2: "depreciation2" },
                     { label: "Profit before Tax", key1: "profitTax1", key2: "profitTax2" },
                     { label: "Provision for Tax", key1: "provision1", key2: "provision2" },
                     { label: "Deferred Tax", key1: "deferred1", key2: "deferred2" },
                     { label: "Profit after Tax", key1: "profitAfterTax1", key2: "profitAfterTax2" },
                     { label: "Balance carried to Balance Sheet", key1: "balance1", key2: "balance2" },
                     { label: "Gross Revenue", key1: "grossProfit1", key2: "grossProfit2" },
                   ].map((row, i) => (
                     <tr key={i}>
                       <td className="py-4 font-normal text-text-primary">{row.label}</td>
                       <td className="px-6 py-4">
                         <div className="fieldset-input">
                            <input 
                                type="text" 
                                value={profitTable[row.key1]}
                                onChange={(e) => setProfitTable({...profitTable, [row.key1]: e.target.value})}
                            />
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="fieldset-input">
                            <input 
                                type="text" 
                                value={profitTable[row.key2]}
                                onChange={(e) => setProfitTable({...profitTable, [row.key2]: e.target.value})}
                            />
                         </div>
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-bg-tertiary" />

          {/* OTHER DETAILS */}
          <div className="space-y-6">
            <div className="fieldset-input">
                <span className="fieldset-label">AGM Date *</span>
                <input value={reportData.agmDate} onChange={(e) => setReportData({...reportData, agmDate: e.target.value})} />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">CIN *</span>
                <input value={reportData.cin} onChange={(e) => setReportData({...reportData, cin: e.target.value})} />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">No of Board Meetings *</span>
                <input type="number" value={reportData.noOfBoardMeetings} onChange={(e) => setReportData({...reportData, noOfBoardMeetings: e.target.value})} />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">Report Place *</span>
                <input value={reportData.place} onChange={(e) => setReportData({...reportData, place: e.target.value})} />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">Report Date</span>
                <input type="date" value={reportData.reportDate} onChange={(e) => setReportData({...reportData, reportDate: e.target.value})} />
            </div>
          </div>

          {/* SIGNING DIRECTORS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-normal">Signing Directors</h3>
              <button 
                onClick={addSigningDirector}
                className="text-crm-green border border-crm-green hover:bg-crm-green/10 px-4 py-2 rounded-md text-[13px] font-bold uppercase transition-all"
              >
                Add Signing Director
              </button>
            </div>
            <div className="space-y-4">
              {signingDirectors.map((sd, i) => (
                <div key={sd.id} className="flex items-center gap-4">
                    <div className="flex-1 fieldset-input">
                        <span className="fieldset-label">Name</span>
                        <input value={sd.name} onChange={(e) => {
                            const newS = [...signingDirectors];
                            newS[i].name = e.target.value;
                            setSigningDirectors(newS);
                        }} />
                    </div>
                    <div className="flex-1 fieldset-input">
                        <span className="fieldset-label">DIN</span>
                        <input value={sd.din} onChange={(e) => {
                            const newS = [...signingDirectors];
                            newS[i].din = e.target.value;
                            setSigningDirectors(newS);
                        }} />
                    </div>
                    <button onClick={() => removeSigningDirector(sd.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg shrink-0">
                        <Trash2 size={20} />
                    </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="p-8 border-t border-bg-tertiary">
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

export default DirectorReportModal;
