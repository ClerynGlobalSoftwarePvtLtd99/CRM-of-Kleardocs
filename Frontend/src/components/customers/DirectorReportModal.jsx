import React, { useState } from "react";
import { X, Plus, Trash2, Eye, Download } from "lucide-react";
import { useDispatch } from "react-redux";
import { downloadCustomerReport } from "../../redux/slices/customersSlice";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";

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
    header1: "",
    header2: "",
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

  const [directors, setDirectors] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [signingDirectors, setSigningDirectors] = useState([
    { id: Date.now(), name: "", din: "" }
  ]);

  const addLogoToPDF = async (doc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/logo.svg';
      
      img.onload = function() {
        try {
          // Convert SVG to canvas first
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 100;
          canvas.height = 75;
          
          // Draw the SVG onto canvas
          ctx.drawImage(img, 0, 0, 100, 75);
          
          // Convert to data URL and add to PDF
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 160, 10, 40, 30);
          resolve();
        } catch (error) {
          // Fallback if canvas conversion fails
          console.warn('Canvas conversion failed, using text fallback:', error);
          doc.setFontSize(12);
          doc.setTextColor(213, 179, 114); // #d5b372 color
          doc.setFont("helvetica", "bold");
          doc.text('KLEAR', 170, 25);
          doc.text('DOCS', 170, 32);
          resolve();
        }
      };
      
      img.onerror = function() {
        // Fallback: draw a simple text logo if image fails to load
        console.warn('Logo image failed to load, using text fallback');
        doc.setFontSize(12);
        doc.setTextColor(213, 179, 114); // #d5b372 color
        doc.setFont("helvetica", "bold");
        doc.text('KLEAR', 170, 25);
        doc.text('DOCS', 170, 32);
        resolve();
      };
    });
  };

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

  const generatePDFBlob = async () => {
    const doc = new jsPDF();
    
    // Set font to support better text rendering
    doc.setFont("helvetica");
    
    // Company contact details
    const companyDetails = {
      address: "465, VIP Nagar, Hastings Colony, Near VIP Bazar Metro Station, Kolkata - 700100",
      phone: "+91 98755 15290",
      phone2: "+91 98755 15290",
      email: "info@kleardocs.com",
      email2: "kleardocssolutions@gmail.com",
      cin: "CIN: U69200WB2025PTC278630",
      pan: "Company PAN: AALCK7855M"
    };

    // Add header with company details
    doc.setFontSize(8);
    doc.text(companyDetails.address, 15, 15);
    doc.text(companyDetails.phone, 15, 22);
    doc.text(companyDetails.phone2, 15, 26);
    doc.text(companyDetails.email, 15, 30);
    doc.text(companyDetails.email2, 15, 34);
    doc.text(companyDetails.cin, 15, 38);
    doc.text(companyDetails.pan, 15, 42);

    // Add logo (async operation)
    await addLogoToPDF(doc);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DIRECTOR'S REPORT", 105, 60, { align: "center" });

    // Rest of the PDF content...
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const openingText = `The Directors take pleasure in presenting the ${profitTable.header1 || 'Previous Year'} and ${profitTable.header2 || 'Current Year'} Audited Financial Statements of the Company, together with the Reports of the Statutory Auditors thereon.`;
    
    // Split long text into lines
    const splitOpening = doc.splitTextToSize(openingText, 180);
    doc.text(splitOpening, 15, 75);

    // Financial performance section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Financial Performance:", 15, 95);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const performanceText = `The Company's financial performance for the year under review was as follows:`;
    doc.text(performanceText, 15, 105);

    // Create profit table using autoTable
    const tableData = [
      ["Particulars", profitTable.header1 || "Previous Year", profitTable.header2 || "Current Year"],
      ["Profit Before interest, Depreciation & Tax", profitTable.profit1 || "", profitTable.profit2 || ""],
      ["Less: Depreciation & Amortization Expense", profitTable.depreciation1 || "", profitTable.depreciation2 || ""],
      ["Profit before Tax", profitTable.profitTax1 || "", profitTable.profitTax2 || ""],
      ["Provision for Tax", profitTable.provision1 || "", profitTable.provision2 || ""],
      ["Deferred Tax", profitTable.deferred1 || "", profitTable.deferred2 || ""],
      ["Profit after Tax", profitTable.profitAfterTax1 || "", profitTable.profitAfterTax2 || ""],
      ["Balance carried to Balance Sheet", profitTable.balance1 || "", profitTable.balance2 || ""],
      ["Gross Revenue", profitTable.grossProfit1 || "", profitTable.grossProfit2 || ""]
    ];

    autoTable(doc, {
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 115,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50, halign: "right" },
        2: { cellWidth: 50, halign: "right" }
      }
    });

    // Directors section
    let currentY = 115 + (tableData.length * 10) + 20;
    
    if (directors.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Directors:", 15, currentY);
      
      currentY += 10;
      directors.forEach((director, index) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const directorText = `${index + 1}. ${director.name}${director.designation ? ` - ${director.designation}` : ""}${director.appointment ? ` (Appointed: ${director.appointment})` : ""}${director.resignation ? ` (Resigned: ${director.resignation})` : ""}`;
        doc.text(directorText, 20, currentY);
        currentY += 7;
      });
    }

    // Board meetings section
    currentY += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const meetingsText = `During the year under review, ${reportData.noOfBoardMeetings} Board Meetings were held.`;
    doc.text(meetingsText, 15, currentY);

    // AGM section
    currentY += 10;
    if (reportData.agmDate) {
      const agmText = `The Annual General Meeting of the Company was held on ${new Date(reportData.agmDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`;
      doc.text(agmText, 15, currentY);
    }

    // Closing statement
    currentY += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const closingText = `For and on behalf of the Board`;
    doc.text(closingText, 15, currentY);

    // Signing directors
    currentY += 20;
    signingDirectors.forEach((director, index) => {
      if (director.name) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(director.name, 15 + (index * 60), currentY);
        
        if (director.din) {
          doc.setFontSize(8);
          doc.text(`(DIN: ${director.din})`, 15 + (index * 60), currentY + 5);
        }
        
        // Add signature line
        doc.line(15 + (index * 60), currentY + 10, 15 + (index * 60) + 50, currentY + 10);
      }
    });

    // Place and date
    currentY += 30;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Place: ${reportData.place}`, 15, currentY);
    doc.text(`Date: ${reportData.date}`, 15, currentY + 5);

    // Return blob instead of saving
    return doc.output('blob');
  };

  const previewPDF = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await generatePDFBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      toast.success("PDF preview opened in new tab");
    } catch (error) {
      toast.error("Failed to generate PDF preview");
      console.error("PDF generation error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await generatePDFBlob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Director_Report_${customer?.name || 'Company'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
      console.error("PDF download error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const dispatch = useDispatch();

  const handleGeneratePDF = async () => {
    try {
      // Flatten profit table for query params
      const params = {
        ...reportData,
        ...profitTable
      };
      
      await dispatch(downloadCustomerReport({
        customerId: customer._id,
        type: 'directorReport',
        params
      })).unwrap();
      
      toast.success("Director Report generated successfully");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to generate report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 md:p-12 lg:p-16">
      <div className="w-full max-w-5xl rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-8 py-5">
          <h2 className="text-2xl font-normal text-text-primary flex flex-col uppercase tracking-wider">
            <span className="text-crm-orange font-bold text-xs mb-1">Director's Report</span>
          </h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* PROFIT TABLE */}
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-bg-tertiary">
                    <th className="py-4 font-bold text-text-primary w-1/2">Particulars</th>
                    <th className="px-6 py-4">
                      <div className="fieldset-input">
                        <input 
                          className="text-center font-bold"
                          value={profitTable.header1}
                          onChange={(e) => setProfitTable({...profitTable, header1: e.target.value})}
                        />
                      </div>
                    </th>
                    <th className="px-6 py-4">
                      <div className="fieldset-input">
                        <input 
                          className="text-center font-bold"
                          value={profitTable.header2}
                          onChange={(e) => setProfitTable({...profitTable, header2: e.target.value})}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-tertiary">
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
                                className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                            />
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="fieldset-input">
                            <input 
                                type="text" 
                                value={profitTable[row.key2]}
                                onChange={(e) => setProfitTable({...profitTable, [row.key2]: e.target.value})}
                                className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                            />
                         </div>
                       </td>
                     </tr>
                   ))}
                   {/* Add Director Row */}
                   <tr>
                     <td className="py-4 font-normal text-text-primary">Director</td>
                     <td className="px-6 py-4" colSpan="2">
                       <div className="flex justify-end">
                         <button 
                           onClick={addDirector}
                           className="btn-raised btn-raised-green px-4 py-2 rounded-md text-[11px] font-bold uppercase transition-all flex items-center gap-2 shadow-lg"
                         >
                           <Plus size={16} />
                           Add Director
                         </button>
                       </div>
                     </td>
                   </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD DIRECTOR SECTION - Moved below the button */}
          {directors.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-normal text-text-primary border-b border-bg-tertiary pb-2">Directors Information</h3>
              {directors.map((director, i) => (
                <div key={director.id} className="bg-bg-primary border border-bg-tertiary p-6 rounded-lg shadow-sm space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-text-primary">Director {i + 1}</h4>
                    <button 
                      onClick={() => removeDirector(director.id)} 
                      className="text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="fieldset-input">
                      <span className="fieldset-label">Name *</span>
                      <input 
                        value={director.name} 
                        onChange={(e) => {
                          const newDirectors = [...directors];
                          newDirectors[i].name = e.target.value;
                          setDirectors(newDirectors);
                        }} 
                        placeholder="Enter director name"
                        autoComplete="off"
                        data-lp-ignore="true"
                        className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="fieldset-input">
                      <span className="fieldset-label">Designation *</span>
                      <input 
                        value={director.designation} 
                        onChange={(e) => {
                          const newDirectors = [...directors];
                          newDirectors[i].designation = e.target.value;
                          setDirectors(newDirectors);
                        }} 
                        placeholder="Enter designation"
                        autoComplete="off"
                        data-lp-ignore="true"
                        className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="fieldset-input">
                      <span className="fieldset-label">Date of Appointment</span>
                      <input 
                        type="date" 
                        value={director.appointment} 
                        onChange={(e) => {
                          const newDirectors = [...directors];
                          newDirectors[i].appointment = e.target.value;
                          setDirectors(newDirectors);
                        }} 
                        className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="fieldset-input">
                      <span className="fieldset-label">Date of Resignation</span>
                      <input 
                        type="date" 
                        value={director.resignation} 
                        onChange={(e) => {
                          const newDirectors = [...directors];
                          newDirectors[i].resignation = e.target.value;
                          setDirectors(newDirectors);
                        }} 
                        className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="border-bg-tertiary" />

          {/* OTHER DETAILS */}
          <div className="space-y-6">
            <div className="fieldset-input">
                <span className="fieldset-label">AGM Date *</span>
                <input 
                  value={reportData.agmDate} 
                  onChange={(e) => setReportData({...reportData, agmDate: e.target.value})}
                  autoComplete="off"
                  data-lp-ignore="true"
                />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">CIN *</span>
                <input 
                  value={reportData.cin} 
                  onChange={(e) => setReportData({...reportData, cin: e.target.value})}
                  autoComplete="off"
                  data-lp-ignore="true"
                />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">No of Board Meetings *</span>
                <input type="number" value={reportData.noOfBoardMeetings} onChange={(e) => setReportData({...reportData, noOfBoardMeetings: e.target.value})} autoComplete="off" data-lp-ignore="true" />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">Report Place *</span>
                <input value={reportData.place} onChange={(e) => setReportData({...reportData, place: e.target.value})} autoComplete="off" data-lp-ignore="true" />
            </div>
            <div className="fieldset-input">
                <span className="fieldset-label">Report Date</span>
                <input type="date" value={reportData.reportDate} onChange={(e) => setReportData({...reportData, reportDate: e.target.value})} autoComplete="off" data-lp-ignore="true" />
            </div>
          </div>

          {/* SIGNING DIRECTORS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-normal text-text-primary">Signing Directors</h3>
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
                    <input 
                      value={sd.name} 
                      onChange={(e) => {
                        const newS = [...signingDirectors];
                        newS[i].name = e.target.value;
                        setSigningDirectors(newS);
                      }} 
                      autoComplete="off"
                      data-lp-ignore="true"
                      className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex-1 fieldset-input">
                    <span className="fieldset-label">DIN</span>
                    <input 
                      value={sd.din} 
                      onChange={(e) => {
                        const newS = [...signingDirectors];
                        newS[i].din = e.target.value;
                        setSigningDirectors(newS);
                      }} 
                      autoComplete="off"
                      data-lp-ignore="true"
                      className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-md text-text-primary placeholder-text-secondary focus:border-t-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => removeSigningDirector(sd.id)} 
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="p-8 border-t border-bg-tertiary flex gap-4">
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
  );
};

export default DirectorReportModal;
