import React, { forwardRef } from 'react';

const ConsentLetterPreview = forwardRef(({ customer, firmDetails, date }, ref) => {
  const getOrdinalDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      const day = d.getDate();
      const month = d.toLocaleString('en-IN', { month: 'Long' });
      const year = d.getFullYear();
      const s = ["th", "st", "nd", "rd"];
      const v = day % 100;
      const ord = (s[(v - 20) % 10] || s[v] || s[0]);
      return `${day}${ord} ${month}, ${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  const formattedIncDate = customer.incorporationDate ? getOrdinalDate(customer.incorporationDate) : "N/A";
  const formattedToday = getOrdinalDate(date || new Date());

  return (
    <div 
      ref={ref} 
      className="bg-white !text-black p-[1in] shadow-xl w-full max-w-[8.27in] min-h-[11.69in] mx-auto text-[11pt] leading-[1.6] font-serif print:shadow-none print:p-0 print:m-0"
      style={{ 
        fontFamily: "'Times New Roman', Times, serif",
        color: '#1a1a1b'
      }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[14pt] font-bold uppercase mb-1">{firmDetails.firmName}</h1>
        <p className="text-[11pt] font-medium italic">Firm Registration No. - {firmDetails.firmRegistrationNumber}</p>
      </div>

      {/* Recipient */}
      <div className="mb-8">
        <p className="font-bold mb-0">TO,</p>
        <p className="font-bold mb-0 uppercase tracking-tight text-[10pt]">THE BOARD OF DIRECTORS</p>
        <p className="font-bold mb-0 uppercase text-[11pt]">{customer.companyName || customer.name}</p>
        <div className="max-w-[4.5in] text-[10.5pt] leading-tight">
          {customer.address?.split(',').map((line, idx) => (
             <p key={idx}>{line.trim()}{idx < customer.address?.split(',').length - 1 ? ',' : ''}</p>
          ))}
        </div>
      </div>

      {/* Date & Subject */}
      <div className="mb-6">
        <p className="mb-4">Date: {formattedToday}</p>
        <p className="leading-tight">
          <span className="font-bold italic underline">Subject:</span>{' '}
          <span className="font-medium italic underline">Consent to act as First Auditor and Certificate under Section 139(6) of the Companies Act, 2013.</span>
        </p>
      </div>

      {/* Salutation */}
      <p className="mb-4 font-medium">Dear Sir/Madam,</p>

      {/* Body 1 */}
      <p className="mb-6 text-justify">
        We, <span className="font-bold text-[10.5pt]">{firmDetails.firmName}, Chartered Accountants</span>, hereby give our consent to be appointed as the First Auditor <span className="font-bold uppercase">{customer.companyName || customer.name}</span> under Section 139(6) of the Companies Act, 2013, for the financial year commencing from <span className="font-bold">{formattedIncDate} (Date of Incorporation)</span> to <span className="font-bold underline underline-offset-2">31st March 2026.</span>
      </p>

      {/* Body 2 */}
      <p className="mb-3 text-justify">
        Further, pursuant to the provisions of <span className="font-bold italic">Section 139(6) and Rule 4 of the Companies (Audit and Auditors) Rules, 2014</span>, we hereby certify that:
      </p>

      {/* Declarations */}
      <div className="pl-2 mb-8 space-y-2 text-justify">
        <div className="flex gap-4">
            <span className="w-4 shrink-0">1.</span>
            <span>We satisfy the eligibility criteria as specified under Section 141 of the Companies Act, 2013;</span>
        </div>
        <div className="flex gap-4">
            <span className="w-4 shrink-0">2.</span>
            <span>We are not disqualified from being appointed as Auditor under the provisions of the Companies Act, 2013, the Chartered Accountants Act, 1949, and the rules or regulations made thereunder;</span>
        </div>
        <div className="flex gap-4">
            <span className="w-4 shrink-0">3.</span>
            <span>The proposed appointment is in accordance with the provisions of the Companies Act, 2013;</span>
        </div>
        <div className="flex gap-4">
            <span className="w-4 shrink-0">4.</span>
            <span>The proposed appointment is within the limits laid down under the Act;</span>
        </div>
        <div className="flex gap-4">
            <span className="w-4 shrink-0">5.</span>
            <span>There are no pending proceedings relating to professional misconduct against the firm or any of its partners under the Chartered Accountants Act, 1949.</span>
        </div>
      </div>

      {/* Closing */}
      <p className="mb-6">We request you to kindly take the above on record and do the needful.</p>

      <div className="mb-8">
        <p className="mb-0">Thanking You,</p>
        <p className="mb-4">Yours faithfully,</p>
        <p className="font-bold mb-8 tracking-tight underline">For {firmDetails.firmName}</p>
        
        <div className="space-y-0 text-[10.5pt]">
          <p className="font-bold underline mb-1">Chartered Accountants</p>
          <p>FRN: {firmDetails.firmRegistrationNumber}</p>
          <p>{firmDetails.proprietorName}</p>
          <p>Proprietor</p>
          <p>Membership No: {firmDetails.membershipNumber}</p>
          <p>Place: Kolkata</p>
        </div>
      </div>

      {/* Footer Address */}
      <div className="mt-auto pt-4 border-t border-gray-300 text-center text-slate-600 italic text-[10pt] leading-tight">
        <p className="font-bold not-italic mb-1">{firmDetails.firmName}</p>
        <p className="mb-1 uppercase text-[9pt]">Firm Registration No. - {firmDetails.firmRegistrationNumber}</p>
        <p>{firmDetails.firmAddress}</p>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
        }
      `}} />
    </div>
  );
});

ConsentLetterPreview.displayName = 'ConsentLetterPreview';

export default ConsentLetterPreview;
