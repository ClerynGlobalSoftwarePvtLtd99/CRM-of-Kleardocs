import React, { useState } from 'react'
import { useParams, Link } from 'react-router'
import { Download, Eye, Send, CreditCard, Trash2, X } from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'
import { generateInvoicePdf } from '../utils/invoicePdfGenerator'

// Dummy Data
const INVOICE_DATA = {
  invoiceNo: 'INV-24-2510874',
  invoiceDate: '11th Mar 2026',
  placeOfSupply: '6 - HARYANA',
  companyName: 'ETOILES SOLUTION PRIVATE LIMITED',
  customerName: 'ETOILES SOLUTION PRIVATE LIMITED',
  customerId: '68c2dbf0bb58fdcfd9956e0b',
  customerPhone: '+91 8447645902',
  customerEmail: 'davidmboyo1@outlook.com',
  customerAddress: 'HNO-859 1ST FLOOR, SEC-31, Gurgaon, Sadar Bazar, Gurgaon- 122001, Haryana',
  items: [
    { no: 1, hsn: '998399', product: 'Annual Compliance', price: '₹ 2000.00', amount: '₹ 2000.00' }
  ],
  totals: {
    subTotal: '₹ 2000.00',
    gst: '₹ 0.00',
    total: '₹ 2000.00',
    paid: '₹ 0.00',
    due: '₹ 2000.00'
  }
}

const InvoiceDetails = () => {
  const { id } = useParams()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [emailSubject, setEmailSubject] = useState(`Compliance Update - ${INVOICE_DATA.items[0].product} for ${INVOICE_DATA.companyName}`)
  const [emailBody, setEmailBody] = useState(`<table style="max-width: 600px; background-color: #ffffff; margin: 40px auto; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center" data-mce-style="max-width: 600px; background-color: #ffffff; margin: 40px auto; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center;" class="mce-item-table"><tbody><tr><td><img style="width: 180px; margin-bottom: 20px;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" data-mce-style="width: 180px; margin-bottom: 20px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td><h2 style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 15px;" data-mce-style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 15px;">Hello ${INVOICE_DATA.companyName},</h2></td></tr><tr><td><p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;" data-mce-style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;">We are pleased to inform you that <strong>${INVOICE_DATA.items[0].product}</strong> for your company has been successfully filed on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p><p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;" data-mce-style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;">You can track the status of your Annual Compliance by clicking the button below:</p></td></tr><tr><td style="padding: 10px;" data-mce-style="padding: 10px;"><a style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #007bff; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" href="https://compliances.startupstation.in/" data-mce-style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #007bff; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" data-mce-href="https://compliances.startupstation.in/">📌 Track Compliance</a></td></tr><tr><td style="padding: 10px;" data-mce-style="padding: 10px;"><a style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #ff9800; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" href="https://g.page/r/CcT54IQgtRJaEAE/review" data-mce-style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #ff9800; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" data-mce-href="https://g.page/r/CcT54IQgtRJaEAE/review">⭐ Rate Us on Google</a></td></tr><tr><td><p style="margin-top: 30px; font-size: 14px; color: #888888;" data-mce-style="margin-top: 30px; font-size: 14px; color: #888888;">Best regards,<br><strong>Startup Station Team</strong></p></td></tr></tbody></table>`)

  const [paymentAmount, setPaymentAmount] = useState('2000')
  const [paymentMode, setPaymentMode] = useState('cash')
  const [paymentNote, setPaymentNote] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  const handleGeneratePdf = (action) => {
    const invoicePayload = {
      number: INVOICE_DATA.invoiceNo,
      date: INVOICE_DATA.invoiceDate,
      items: INVOICE_DATA.items.map(i => ({
         product: { name: i.product },
         price: parseFloat(i.price.replace(/[^0-9.]/g, '')),
         amount: parseFloat(i.amount.replace(/[^0-9.]/g, '')),
      })),
      totals: {
         total: parseFloat(INVOICE_DATA.totals.total.replace(/[^0-9.]/g, '')),
         gst: parseFloat(INVOICE_DATA.totals.gst.replace(/[^0-9.]/g, ''))
      }
    };
    const customerPayload = {
      companyName: INVOICE_DATA.companyName,
      customerName: INVOICE_DATA.customerName,
      phone: INVOICE_DATA.customerPhone,
      address: INVOICE_DATA.customerAddress,
      state: INVOICE_DATA.placeOfSupply
    };
    generateInvoicePdf(invoicePayload, customerPayload, action);
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)] relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Invoice Details</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setShowEmailModal(true)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer">
            <Send size={16} /> Email Invoice
          </button>
          <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer">
            <CreditCard size={16} /> Add Payment
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer">
            <Trash2 size={16} /> Delete Invoice
          </button>
          <button onClick={() => handleGeneratePdf('view')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer">
            <Eye size={16} /> View
          </button>
          <button onClick={() => handleGeneratePdf('download')} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-sm mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
              <span className="text-[var(--color-text-secondary)] font-medium text-sm">Invoice No</span>
              <span className="font-semibold">{INVOICE_DATA.invoiceNo}</span>
            </div>
            <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
              <span className="text-[var(--color-text-secondary)] font-medium text-sm">Invoice Date</span>
              <span className="font-semibold">{INVOICE_DATA.invoiceDate}</span>
            </div>
            <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
              <span className="text-[var(--color-text-secondary)] font-medium text-sm">Place of Supply</span>
              <span className="font-semibold">{INVOICE_DATA.placeOfSupply}</span>
            </div>
            <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]/50 rounded-md transition-colors">
              <span className="text-[var(--color-text-secondary)] font-medium text-sm">Company Name</span>
              <span className="font-semibold">
                {INVOICE_DATA.companyName}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
             <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
                <span className="text-[var(--color-text-secondary)] font-medium text-sm">Customer Name</span>
                <span className="font-semibold">
                  <Link to={`/customer/${INVOICE_DATA.customerId}`} className="text-[var(--color-accent)] hover:text-yellow-600 underline underline-offset-4 decoration-[var(--color-bg-tertiary)] hover:decoration-yellow-600 transition-colors">
                    {INVOICE_DATA.customerName}
                  </Link>
                </span>
             </div>
             <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
                <span className="text-[var(--color-text-secondary)] font-medium text-sm">Customer Phone</span>
                <span className="font-semibold">{INVOICE_DATA.customerPhone}</span>
             </div>
             <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
                <span className="text-[var(--color-text-secondary)] font-medium text-sm">Emails</span>
                <span className="font-semibold">{INVOICE_DATA.customerEmail}</span>
             </div>
             <div className="flex flex-col gap-1 py-2 border-b border-[var(--color-bg-tertiary)]">
                <span className="text-[var(--color-text-secondary)] font-medium text-sm">Customer Address</span>
                <span className="font-medium text-sm leading-relaxed">{INVOICE_DATA.customerAddress}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-tertiary)]/30">
          <h2 className="text-lg font-bold">Invoice Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
               <tr className="border-b border-[var(--color-bg-tertiary)] text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">
                 <th className="px-6 py-4 font-medium">No</th>
                 <th className="px-6 py-4 font-medium">HSN/ SAC</th>
                 <th className="px-6 py-4 font-medium w-full">Product</th>
                 <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Price</th>
                 <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Amount</th>
               </tr>
             </thead>
             <tbody>
               {INVOICE_DATA.items.map((item, idx) => (
                 <tr key={idx} className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
                   <td className="px-6 py-4 font-medium">{item.no}</td>
                   <td className="px-6 py-4">{item.hsn}</td>
                   <td className="px-6 py-4 text-[var(--color-accent)] font-medium underline underline-offset-4 decoration-transparent hover:decoration-[var(--color-accent)] cursor-pointer">{item.product}</td>
                   <td className="px-6 py-4 text-right whitespace-nowrap font-medium">{item.price}</td>
                   <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-[var(--color-text-primary)]">{item.amount}</td>
                 </tr>
               ))}
               <tr>
                 <td colSpan={3} className="px-6 py-4 text-right font-bold text-lg text-[var(--color-text-secondary)]">Total</td>
                 <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-lg text-[var(--color-text-primary)]">{INVOICE_DATA.items.reduce((acc) => acc, INVOICE_DATA.items[0].price)}</td>
                 <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-lg text-[var(--color-text-primary)]">{INVOICE_DATA.totals.total}</td>
               </tr>
             </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-sm mb-6 w-full">
        <div className="p-4 border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-tertiary)]/30">
          <h2 className="text-lg font-bold">Totals</h2>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-bg-tertiary)]">
            <span className="font-semibold text-[var(--color-text-secondary)]">Sub Total</span>
            <span className="font-bold">{INVOICE_DATA.totals.subTotal}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-bg-tertiary)]">
            <span className="font-semibold text-[var(--color-text-secondary)]">GST</span>
            <span className="font-bold">{INVOICE_DATA.totals.gst}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-tertiary)]/30 -mx-6 px-6 rounded-md">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-lg text-[var(--color-accent)]">{INVOICE_DATA.totals.total}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-bg-tertiary)]">
            <span className="font-semibold text-[var(--color-text-secondary)]">Paid</span>
            <span className="font-bold text-green-500">{INVOICE_DATA.totals.paid}</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-[var(--color-bg-tertiary)]/30 -mx-6 px-6 rounded-md">
            <span className="font-semibold text-lg">Due</span>
            <span className="font-bold text-lg text-red-500">{INVOICE_DATA.totals.due}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-xl font-bold flex items-center gap-2"><Send size={20}/> Send Email Invoice</h2>
              <button onClick={() => setShowEmailModal(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]">Subject</label>
                  <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text-primary)] font-medium" />
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]">Email Body</label>
                 <div className="rounded-lg overflow-hidden border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] h-[500px]">
                   <RichTextEditor
                      value={emailBody}
                      onChange={setEmailBody}
                   />
                 </div>
               </div>
            </div>

            <div className="p-5 border-t border-[var(--color-bg-tertiary)] flex justify-end gap-3 flex-shrink-0">
               <button onClick={() => setShowEmailModal(false)} className="px-6 py-2.5 border border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg font-semibold transition-colors cursor-pointer">Cancel</button>
               <button onClick={() => setShowEmailModal(false)} className="px-8 py-2.5 bg-[var(--color-accent)] hover:bg-yellow-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors cursor-pointer">
                 <Send size={18} /> Send Invoice
               </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
           <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-2xl p-6 w-full max-w-md flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[var(--color-accent)] flex items-center gap-2"><CreditCard size={20}/> Add Payment</h2>
               <button onClick={() => setShowPaymentModal(false)} className="text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer">
                 <X size={24} />
               </button>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]">Pay Amount</label>
                  <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg font-semibold" />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]">Note</label>
                  <textarea value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} rows={3} className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"></textarea>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]">Payment Mode</label>
                  <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer appearance-none">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="net_banking">Net Banking</option>
                  </select>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]">Payment Date</label>
                 <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors" />
               </div>
               <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[var(--color-bg-tertiary)]">
                 <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 border border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg font-medium transition-colors cursor-pointer">Cancel</button>
                 <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors cursor-pointer">
                   Add Payment
                 </button>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
             <div className="w-14 h-14 bg-red-100/10 text-red-500 rounded-full flex items-center justify-center mb-5 ring-4 ring-red-500/20">
               <Trash2 size={28} className="" />
             </div>

             <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
               Delete this Invoice Permanently?
             </h2>
             <p className="text-[var(--color-text-secondary)] mb-8 text-sm leading-relaxed">
               This will also delete all invoice items and invoice payments. This cannot be undone.
             </p>

             <div className="flex gap-3 w-full">
               <button
                 onClick={() => setShowDeleteModal(false)}
                 className="flex-1 px-4 py-2.5 border border-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-white rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-[var(--color-bg-tertiary)] focus:outline-none"
               >
                 Cancel
               </button>
               <button
                 onClick={() => setShowDeleteModal(false)}
                 className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-800 text-white cursor-pointer rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-red-600 focus:outline-none"
               >
                 Confirm
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default InvoiceDetails
