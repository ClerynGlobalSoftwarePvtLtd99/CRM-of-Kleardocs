import React, { forwardRef } from 'react';
import caTitle from '../../assets/Consent Letter/CA-title image.png';
import signature from '../../assets/Consent Letter/Signature.png';
import ddcaStamp from '../../assets/Consent Letter/DDCA.png';

const ConsentLetterPreview = forwardRef(({ customer, firmDetails, date }, ref) => {
  const getOrdinalDate = (dateStr, hasComma = true) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      const day = d.getDate();
      const month = d.toLocaleString('en-IN', { month: 'long' });
      const year = d.getFullYear();
      const s = ["th", "st", "nd", "rd"];
      const v = day % 100;
      const ord = (s[(v - 20) % 10] || s[v] || s[0]);
      
      const paddedDay = day.toString().padStart(2, '0');
      return `${paddedDay}${ord} ${month}${hasComma ? ',' : ''} ${year}`;
    } catch (e) {
      return null;
    }
  };

  const formattedIncDate = customer.incorporationDate ? getOrdinalDate(customer.incorporationDate, false) : "N/A";
  const letterDateObj = date ? new Date(date) : new Date();
  const formattedToday = getOrdinalDate(letterDateObj, true) || "14th May, 2026";
  
  const getSlashDate = (dObj) => {
    try {
      const day = dObj.getDate().toString().padStart(2, '0');
      const month = (dObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dObj.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return null;
    }
  };
  const fixedSignDate = getSlashDate(letterDateObj) || "14/05/2026";
  
  // Dynamic Year Logic: "When next year 31 march 2027 cross this time automatically show '31 March 2028'"
  // If month >= 3 (April), the next March 31 is in the next year.
  const currentDate = date ? new Date(date) : new Date();
  const financialYearEndYear = currentDate.getMonth() >= 3 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
  const financialYearEndLabel = `31st March ${financialYearEndYear}`;

  return (
    <div 
      ref={ref} 
      className="bg-white !text-black p-[0.75in] shadow-xl w-full max-w-[8.27in] min-h-[11.69in] mx-auto text-[10.5pt] leading-[1.4] font-serif print:shadow-none print:p-0 print:m-0 flex flex-col"
      style={{ 
        fontFamily: "'Times New Roman', Times, serif",
        color: '#000000'
      }}
    >
      {/* Header with Logo and Text */}
      <div className="flex items-center mb-8 gap-6 border-none">
        <div className="flex-shrink-0">
          <img src={caTitle} alt="CA Logo" className="h-20 w-auto object-contain" />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold tracking-tight mb-0" style={{ color: '#000' }}>BRAHMANADA & CO.</h1>
          <p className="text-lg font-bold uppercase" style={{ color: '#000' }}>CHARTERED ACCOUNTANTS</p>
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <p className="font-bold mb-0">TO,</p>
        <p className="font-bold mb-0 uppercase text-[10pt]">THE BOARD OF DIRECTORS</p>
        <p className="font-bold mb-0 uppercase text-[10.5pt]">{customer.companyName || customer.name}</p>
        <div className="max-w-[5.5in] text-[10pt] leading-tight">
          <p className="uppercase">{customer.address || "ADDRESS NOT PROVIDED"}</p>
        </div>
      </div>

      {/* Date & Subject */}
      <div className="mb-5">
        <p className="mb-4">Date: {formattedToday}</p>
        <p className="leading-tight">
          <span className="font-bold">Subject:</span>{' '}
          <span className="font-medium underline">Consent to act as First Auditor and Certificate under Section 139(6) of the Companies Act, 2013.</span>
        </p>
      </div>

      {/* Salutation */}
      <p className="mb-4 font-medium">Dear Sir/Madam,</p>

      {/* Body 1 */}
      <p className="mb-5 text-justify">
        We, <span className="font-bold font-serif">M/s. BRAHMANADA & CO.</span>, Chartered Accountants, hereby give our consent to be appointed as the <span className="font-bold">First Auditor</span> of <span className="font-bold uppercase">{customer.companyName || customer.name}</span> under Section 139(6) of the Companies Act, 2013, for the financial year commencing from <span className="font-bold">{formattedIncDate} (Date of Incorporation)</span> to <span className="font-bold">{financialYearEndLabel}.</span>
      </p>

      {/* Body 2 */}
      <p className="mb-3 text-justify">
        Further, pursuant to the provisions of <span className="font-bold">Section 139(6) and Rule 4 of the Companies (Audit and Auditors) Rules, 2014</span>, we hereby certify that:
      </p>

      {/* Declarations */}
      <div className="pl-4 mb-6 space-y-2 text-justify">
        <div className="flex gap-4">
            <span>We satisfy the eligibility criteria as specified under Section 141 of the Companies Act, 2013;</span>
        </div>
        <div className="flex gap-4">
            <span>We are not disqualified from being appointed as Auditor under the provisions of the Companies Act, 2013, the Chartered Accountants Act, 1949, and the rules or regulations made thereunder;</span>
        </div>
        <div className="flex gap-4">
            <span>The proposed appointment is in accordance with the provisions of the Companies Act, 2013;</span>
        </div>
        <div className="flex gap-4">
            <span>The proposed appointment is within the limits laid down under the Act;</span>
        </div>
        <div className="flex gap-4">
            <span>There are no pending proceedings relating to professional misconduct against the firm or any of its partners under the Chartered Accountants Act, 1949.</span>
        </div>
      </div>

      {/* Closing */}
      <p className="mb-5">We request you to kindly take the above on record and do the needful.</p>

      <div className="mb-4">
        <p className="mb-0">Thanking You,</p>
        <p className="mb-4">Yours faithfully,</p>
        <p className="font-bold mb-1 uppercase tracking-tight">For BRAHMANADA & CO.</p>
        <p className="font-bold mb-4 uppercase text-[9.5pt]">Chartered Accountants</p>
        
        {/* Signatures & Stamp */}
        <div className="flex items-center gap-12 relative h-24 mb-4">
          <div className="w-48">
            <img src={signature} alt="Signature" className="w-full h-auto max-h-20 object-contain" />
          </div>
          <div className="w-32">
            <img src={ddcaStamp} alt="Stamp" className="w-full h-auto max-h-24 object-contain" />
          </div>
        </div>

        <div className="space-y-0 text-[10pt] mt-4">
          <p className="font-bold uppercase mb-0.5">FRN: 315153E</p>
          <p className="font-bold uppercase mb-0.5">CA SUSANTA KUMAR SWAIN</p>
          <p className="mb-0.5">Partner</p>
          <p className="mb-0.5">Membership No: 065257</p>
          <p className="mb-0.5">Place: Bhubaneswar</p>
          <p className="mb-0.5">Date: {fixedSignDate}</p>
        </div>
      </div>

      {/* Blue Footer Address */}
      <div className="mt-auto pt-8 flex flex-col items-center">
        <p className="text-[#2F5597] font-bold text-[8.5pt] uppercase text-center tracking-tight">
          PLOT NO. 119, MADHUSUDAN NAGAR, UNIT-IV, BHUBANESWAR – 751001, ODISHA
        </p>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: none !important; 
            box-shadow: none !important; 
            padding: 0 !important;
            margin: 0 !important;
          }
          img { -webkit-print-color-adjust: exact; }
          .text-[#2F5597] { color: #2F5597 !important; -webkit-print-color-adjust: exact; }
        }
      `}} />
    </div>
  );
});

ConsentLetterPreview.displayName = 'ConsentLetterPreview';

export default ConsentLetterPreview;
