import React, { useState } from "react";
import { X, Eye, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { downloadCustomerReport } from "../../redux/slices/customersSlice";
import jsPDF from "jspdf";

const BoardResolutionModal = ({ customer, onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dispatch = useDispatch();

  const generateBoardResolutionPDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setFont("times");
    
    // Company Name - Centered at top
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    const companyName = customer.companyName || customer.name || "COMPANY NAME";
    const companyWidth = doc.getTextWidth(companyName);
    const pageWidth = doc.internal.pageSize.width;
    const companyX = (pageWidth - companyWidth) / 2;
    doc.text(companyName, companyX, 25);
    
    // "BOARD RESOLUTION" - Centered below company name
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    const resolutionText = "BOARD RESOLUTION";
    const resolutionWidth = doc.getTextWidth(resolutionText);
    const resolutionX = (pageWidth - resolutionWidth) / 2;
    doc.text(resolutionText, resolutionX, 35);
    
    // Company Address - Centered
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    const fullAddress = `${customer.address || ''}, ${customer.state || ''}`;
    const addressLines = doc.splitTextToSize(fullAddress, 180);
    let addressY = 45;
    addressLines.forEach(line => {
      const lineWidth = doc.getTextWidth(line);
      const lineX = (pageWidth - lineWidth) / 2;
      doc.text(line, lineX, addressY);
      addressY += 5;
    });
    
    // State - Centered
    if (customer.state) {
      const stateText = customer.state.toUpperCase();
      const stateWidth = doc.getTextWidth(stateText);
      const stateX = (pageWidth - stateWidth) / 2;
      doc.text(stateText, stateX, addressY);
      addressY += 5;
    }
    
    // Professional A4 margins (20mm)
    const margin = 20;
    const textWidth = pageWidth - (margin * 2); // 170mm content width
    
    // Date - Left aligned
    let contentY = addressY + 15;
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    const dateText = `Date: ${formattedDate}`;
    doc.setFont("times", "bold");
    doc.text(dateText, margin, contentY);
    
    // Resolution content - Logical paragraphs for proper justify wrapping
    const resolutionParagraphs = [
      "CERTIFIED THAT this is a TRUE COPY of the Resolution passed at the meeting of the Board of Directors of the Company held on the date mentioned above.",
      "RESOLVED THAT pursuant to the provisions of Sections 139 and 142 of the Companies Act, 2013 read with the Companies (Audit and Auditors) Rules, 2014 and other applicable provisions of the Companies Act, 2013 and the rules made thereunder, if any, Mr. Jagjyot Singh, Firm M/s. JAGJYOT SINGH AND ASSOCIATES (Firm Registration No. 333567E) is hereby appointed as the First Auditor of the Company to hold office from the date of appointment till the conclusion of the First Annual General Meeting of the Company and that he shall carry out the duties of the Auditor of the Company including examination and audit of the books of accounts and other records of the Company and that his remuneration shall be as may be approved by the Board and the Auditors.",
      "FURTHER RESOLVED THAT the Directors namely Shobana Ravi are hereby authorised to do all necessary acts, deeds, matters and things and execute such other documents as may be necessary for giving effect to this resolution."
    ];
    
    contentY += 15;
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    
    resolutionParagraphs.forEach(paragraph => {
      // Split paragraph visually based on available width
      const textLines = doc.splitTextToSize(paragraph, textWidth);
      
      textLines.forEach((textLine, index) => {
        // Justify all lines except the last one of the paragraph
        if (textLines.length > 1 && index < textLines.length - 1) {
          const words = textLine.split(' ');
          if (words.length > 1) {
            const totalWordWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0);
            const spacesNeeded = textWidth - totalWordWidth;
            const spaceBetweenWords = spacesNeeded / (words.length - 1);
            
            let currentX = margin;
            words.forEach((word, wordIndex) => {
              doc.text(word, currentX, contentY);
              if (wordIndex < words.length - 1) {
                currentX += doc.getTextWidth(word) + spaceBetweenWords;
              }
            });
          } else {
            doc.text(textLine, margin, contentY);
          }
        } else {
          // Last line of paragraph - left align
          doc.text(textLine, margin, contentY);
        }
        
        // Professional line height (1.5 spacing ~ 7mm)
        contentY += 7;
      });
      
      // Spacing between paragraphs
      contentY += 6;
    });
    
    // Signature section - Visually balanced distance from last paragraph
    contentY += 20;
    doc.setFont("times", "bold");
    doc.text("SHOBANA RAVI", margin, contentY);
    
    contentY += 6;
    doc.setFont("times", "normal");
    doc.text("Director", margin, contentY);
    
    return doc;
  };

  const previewPDF = () => {
    if (isGeneratingPDF) return;
    
    // Check if customer has directors
    if (!customer.directors || customer.directors.length === 0) {
      toast.error("Please add a director first");
      return;
    }
    
    setIsGeneratingPDF(true);
    try {
      const doc = generateBoardResolutionPDF();
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      toast.success("Board Resolution preview opened in new tab");
    } catch (error) {
      toast.error("Failed to generate PDF preview");
      console.error("PDF generation error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = () => {
    if (isGeneratingPDF) return;
    
    // Check if customer has directors
    if (!customer.directors || customer.directors.length === 0) {
      toast.error("Please add a director first");
      return;
    }
    
    setIsGeneratingPDF(true);
    try {
      const doc = generateBoardResolutionPDF();
      doc.save(`Board_Resolution_${customer.companyName || 'Company'}_${new Date(date).toISOString().split('T')[0]}.pdf`);
      toast.success("Board Resolution downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
      console.error("PDF download error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGeneratePDF = async () => {
    // Check if customer has directors
    if (!customer.directors || customer.directors.length === 0) {
      toast.error("Please add a director first");
      return;
    }

    try {
      await dispatch(downloadCustomerReport({
        customerId: customer._id,
        type: 'boardResolution',
        params: { date }
      })).unwrap();
      
      toast.success("Board Resolution generated successfully");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to generate report");
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
