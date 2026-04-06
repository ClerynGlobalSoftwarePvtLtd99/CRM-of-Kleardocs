import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Download, Eye, Send, CreditCard, Trash2, X, ArrowLeft } from 'lucide-react'
import {
  fetchInvoiceById,
  deleteInvoice,
  addPayment,
  deletePayment,
  clearSelectedInvoice,
  downloadInvoicePdf
} from '../redux/slices/invoicesSlice'
import { generateInvoicePdf } from '../utils/invoicePdfGenerator'
import RichTextEditor from '../components/RichTextEditor'
import ContentLoader from '../components/common/ContentLoader'
import ConfirmationModal from '../components/common/ConfirmationModal'
import { toast } from 'react-hot-toast'

const InvoiceDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedInvoice: inv, loading, error } = useSelector((state) => state.invoices)

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState('UPI')
  const [paymentNote, setPaymentNote] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    dispatch(fetchInvoiceById(id))
    return () => {
      dispatch(clearSelectedInvoice())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (inv) {
      setEmailSubject(`Compliance Update - ${inv.items?.[0]?.service?.name || 'Service'} for ${inv.customer?.companyName || inv.customer?.name}`)
      setEmailBody(`
        <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: #fff3f3ff; padding: 30px; text-align: center;">
              <img src="https://crm.kleardocs.com/logo.svg" alt="Kleardocs" style="height: 80px; width: auto;" />
            </div>
            <div style="padding: 40px; color: #1f2937;">
              <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #111827;">Hello ${inv.customer?.companyName || inv.customer?.name},</h1>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                We are pleased to inform you that <strong>${inv.items?.[0]?.service?.name || 'Annual Compliance'}</strong> for your company has been successfully filed on <strong>${formatDate(inv.invoiceDate)}</strong>.
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                You can track the status of your Annual Compliance by clicking the button below:
              </p>
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="#" style="display: inline-block; background-color: #facc15; color: #000000; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 16px; box-shadow: 0 4px 6px rgba(250, 204, 21, 0.2);">📌 Track Compliance</a>
              </div>
              <div style="text-align: center; margin-bottom: 40px;">
                <a href="#" style="display: inline-block; color: #4b5563; font-weight: 600; text-decoration: none; font-size: 14px;">⭐ Rate Us on Google</a>
              </div>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
                <p style="font-size: 14px; color: #6b7280; margin: 0;">Best regards,</p>
                <p style="font-size: 16px; font-weight: 700; color: #111827; margin: 4px 0 0 0;">Kleardocs Solution Team</p>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Kleardocs Solutions. All rights reserved.
          </div>
        </div>
      `)
      setPaymentAmount(inv.due?.toString())
    }
  }, [inv])

  const handleGeneratePdf = async (action) => {
    if (!inv) return;
    // Use frontend PDF generator with existing invoice data from invoices section
    await generateInvoicePdf(inv, inv.customer, action);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteInvoice(id)).unwrap()
      toast.success('Invoice deleted successfully')
      navigate('/invoices')
    } catch (err) {
      toast.error(err || 'Failed to delete invoice')
    }
    setShowDeleteModal(false)
  };

  const handleAddPaymentClick = async () => {
    try {
      await dispatch(addPayment({
        invoiceId: id,
        paymentData: {
          amount: parseFloat(paymentAmount),
          mode: paymentMode,
          note: paymentNote,
          paymentDate
        }
      })).unwrap()
      toast.success('Payment added successfully')
      setShowPaymentModal(false)
      setPaymentNote('')
    } catch (err) {
      toast.error(err || 'Failed to add payment')
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-text-primary">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2.5 hover:bg-bg-secondary rounded-xl transition-all border border-bg-tertiary shadow-sm"
          >
            <ArrowLeft size={20} className="text-yellow-500" />
          </button>
          <h1 className="text-2xl font-bold italic">INVOICE DETAILS</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setShowEmailModal(true)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer disabled:opacity-50" disabled={!inv || loading}>
            <Send size={16} /> Email Invoice
          </button>
          <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer disabled:opacity-50" disabled={!inv || loading}>
            <CreditCard size={16} /> Add Payment
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer disabled:opacity-50" disabled={!inv || loading}>
            <Trash2 size={16} /> Delete Invoice
          </button>
          <button onClick={() => handleGeneratePdf('view')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer disabled:opacity-50" disabled={!inv || loading}>
            <Eye size={16} /> View
          </button>
          <button onClick={() => handleGeneratePdf('download')} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm text-sm cursor-pointer disabled:opacity-50" disabled={!inv || loading}>
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      {loading ? (
        <ContentLoader message="Loading invoice details..." />
      ) : !inv ? (
        <div className="p-8 text-text-secondary bg-bg-secondary rounded-2xl border border-bg-tertiary text-center font-bold">
          Invoice not found.
        </div>
      ) : (
        <>
          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow-sm mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Invoice No</span>
                  <span className="font-semibold">{inv.invoiceNo}</span>
                </div>
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Invoice Date</span>
                  <span className="font-semibold">{formatDate(inv.invoiceDate)}</span>
                </div>
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary hover:bg-bg-tertiary/50 rounded-md transition-colors">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Company Name</span>
                  <span className="font-semibold">{inv.customer?.companyName || '-'}</span>
                </div>
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Place of Supply</span>
                  <span className="font-semibold">{inv.placeOfSupply || '-'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Customer Name</span>
                  <span className="font-semibold">
                    <Link to={`/customer/${inv.customer?._id}`} className="text-accent hover:text-yellow-600 underline underline-offset-4 decoration-bg-tertiary hover:decoration-yellow-600 transition-colors">
                      {inv.customer?.name}
                    </Link>
                  </span>
                </div>
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Customer Phone</span>
                  <span className="font-semibold">{inv.customer?.phone}</span>
                </div>
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Emails</span>
                  <span className="font-semibold truncate">{inv.customer?.emails?.join(', ') || '-'}</span>
                </div>
                <div className="flex flex-col gap-1 py-2 border-b border-bg-tertiary">
                  <span className="text-text-secondary font-medium text-sm text-[11px] uppercase tracking-widest">Customer Address</span>
                  <span className="font-medium text-sm leading-relaxed">{inv.customer?.address || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="p-4 border-b border-bg-tertiary bg-bg-tertiary/30">
              <h2 className="text-lg font-bold">Invoice Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-bg-tertiary text-xs text-text-secondary uppercase tracking-widest">
                    <th className="px-6 py-4 font-bold">No</th>
                    <th className="px-6 py-4 font-bold">HSN/ SAC</th>
                    <th className="px-6 py-4 font-bold w-full">Product</th>
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-right">Price</th>
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-tertiary">
                  {inv.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-bg-tertiary/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm">{item.hsn}</td>
                      <td className="px-6 py-4 text-accent font-bold">{item.service?.name || item.description}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-sm">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-text-primary">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-bg-tertiary/10">
                  <tr className="font-bold">
                    <td colSpan={4} className="px-6 py-4 text-right text-text-secondary text-[11px] uppercase tracking-widest">Total</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-lg text-text-primary">{formatCurrency(inv.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow-sm mb-6 w-full">
            <div className="p-4 border-b border-bg-tertiary bg-bg-tertiary/30 text-accent uppercase tracking-widest font-black text-xs">
              Summary
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-bg-tertiary">
                <span className="font-semibold text-text-secondary text-sm">Sub Total</span>
                <span className="font-bold">{formatCurrency(inv.subTotal)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-bg-tertiary">
                <span className="font-semibold text-text-secondary text-sm">GST Amount</span>
                <span className="font-bold">{formatCurrency(inv.totalGst)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-bg-tertiary bg-bg-tertiary/30 -mx-6 px-6 rounded-md">
                <span className="font-black text-lg uppercase tracking-tight italic">TOTAL</span>
                <span className="font-black text-lg text-accent">{formatCurrency(inv.total)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-bg-tertiary">
                <span className="font-bold text-green-500 text-sm uppercase">Amount Paid</span>
                <span className="font-bold text-green-600">{formatCurrency(inv.paid)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-bg-tertiary/30 -mx-6 px-6 rounded-md">
                <span className="font-black text-lg text-red-500 uppercase tracking-tight italic">BALANCE DUE</span>
                <span className="font-black text-xl text-red-600">{formatCurrency(inv.due)}</span>
              </div>
            </div>
          </div>

          {/* Payments History */}
          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="p-4 border-b border-bg-tertiary bg-bg-tertiary/30 uppercase tracking-widest font-black text-xs">
              Payment History
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-bg-tertiary text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Mode</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-tertiary">
                  {inv.payments?.length > 0 ? inv.payments.map((p, i) => (
                    <tr key={p._id || i} className="hover:bg-bg-tertiary/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{formatDate(p.paymentDate)}</td>
                      <td className="px-6 py-4 font-bold text-accent">{p.mode}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{p.note || '-'}</td>
                      <td className="px-6 py-4 text-right font-black text-green-600">{formatCurrency(p.amount)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-text-secondary italic font-medium opacity-60">
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals */}

      {showEmailModal && inv && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] scale-in-center overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-bg-tertiary bg-bg-tertiary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                  <Send size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black italic tracking-tight">SEND EMAIL</h2>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">To: {inv.customer?.emails?.[0] || inv.customer?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-text-secondary px-1">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject || `Compliance Update - ${inv.items?.[0]?.service?.name || 'Service'} for ${inv.customer?.companyName || inv.customer?.name}`}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-text-primary font-bold text-lg"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Variable Chips */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-text-secondary px-1 flex items-center gap-2">
                  Quick Tags <span className="text-[9px] font-bold text-yellow-600 bg-yellow-600/10 px-1.5 py-0.5 rounded">CLICK TO COPY</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Name', value: '{{name}}' },
                    { label: 'Company', value: '{{companyName}}' },
                    { label: 'Address', value: '{{address}}' },
                    { label: 'Invoice No', value: '{{invoiceNo}}' },
                    { label: 'Date', value: '{{invoiceDate}}' },
                    { label: 'Amount', value: '{{invoiceAmount}}' },
                    { label: 'Compliance Name', value: '{{complianceName}}' },
                  ].map((chip) => (
                    <button
                      key={chip.value}
                      onClick={() => {
                        navigator.clipboard.writeText(chip.value);
                        toast.success(`Copied ${chip.value}`);
                      }}
                      className="px-3 py-1.5 bg-bg-primary border border-bg-tertiary rounded-lg text-xs font-bold text-text-secondary hover:border-yellow-500 hover:text-yellow-600 transition-all flex items-center gap-1 group cursor-pointer"
                    >
                      <span className="text-yellow-500/50 group-hover:text-yellow-500 transition-colors">#</span> {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-text-secondary px-1">Email Content</label>
                <div className="rounded-2xl overflow-hidden border border-bg-tertiary bg-bg-primary shadow-inner">
                  <RichTextEditor
                    value={emailBody || `
                      <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                          <div style="background-color: #000000; padding: 30px; text-align: center;">
                            <img src="https://crm.kleardocs.com/logo.svg" alt="Kleardocs" style="height: 60px; width: auto;" />
                          </div>
                          <div style="padding: 40px; color: #1f2937;">
                            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #111827;">Hello ${inv.customer?.companyName || inv.customer?.name},</h1>
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                              We are pleased to inform you that <strong>${inv.items?.[0]?.service?.name || 'Annual Compliance'}</strong> for your company has been successfully filed on <strong>${formatDate(inv.invoiceDate)}</strong>.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                              You can track the status of your Annual Compliance by clicking the button below:
                            </p>
                            <div style="text-align: center; margin-bottom: 30px;">
                              <a href="#" style="display: inline-block; background-color: #facc15; color: #000000; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 16px; box-shadow: 0 4px 6px rgba(250, 204, 21, 0.2);">📌 Track Compliance</a>
                            </div>
                            <div style="text-align: center; margin-bottom: 40px;">
                              <a href="#" style="display: inline-block; color: #4b5563; font-weight: 600; text-decoration: none; font-size: 14px;">⭐ Rate Us on Google</a>
                            </div>
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
                              <p style="font-size: 14px; color: #6b7280; margin: 0;">Best regards,</p>
                              <p style="font-size: 16px; font-weight: 700; color: #111827; margin: 4px 0 0 0;">Kleardocs Solution Team</p>
                            </div>
                          </div>
                        </div>
                        <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px;">
                          &copy; ${new Date().getFullYear()} Kleardocs Solutions. All rights reserved.
                        </div>
                      </div>
                    `}
                    onChange={setEmailBody}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-bg-tertiary bg-bg-tertiary/10 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm text-sm"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  toast.success("Sending email functionality will be implemented in the future!");
                  setShowEmailModal(false);
                }}
                className="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-black flex items-center gap-2 transition-all cursor-pointer shadow-md text-sm"
              >
                <Send size={18} /> Send to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && inv && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl p-7 w-full max-w-md flex flex-col scale-in-center">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black italic text-accent flex items-center gap-2"><CreditCard size={20} /> RECORD PAYMENT</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-bg-tertiary rounded-xl transition-all cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-text-secondary">Professional Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-secondary">₹</span>
                  <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full pl-8 pr-4 py-3 bg-bg-primary border border-bg-tertiary rounded-xl focus:outline-none focus:border-accent transition-all text-xl font-black text-accent" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-text-secondary">Internal Note</label>
                <textarea value={paymentNote} placeholder="Reference number, cheque details etc." onChange={(e) => setPaymentNote(e.target.value)} rows={2} className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-xl focus:outline-none focus:border-accent transition-all resize-none font-medium"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-text-secondary">Payment Mode</label>
                  <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2 bg-bg-primary border border-bg-tertiary rounded-xl focus:outline-none focus:border-accent transition-all cursor-pointer font-bold">
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-text-secondary">Payment Date</label>
                  <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 bg-bg-primary border border-bg-tertiary rounded-xl focus:outline-none focus:border-accent transition-all font-bold" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-3 btn-raised-gray rounded-xl font-bold transition-all cursor-pointer">Cancel</button>
                <button onClick={handleAddPaymentClick} className="flex-1 px-6 py-3 btn-raised-green rounded-xl font-black text-white transition-all cursor-pointer disabled:opacity-50" disabled={loading}>
                  Save Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message="Are you sure you want to permanently delete this invoice? This will also remove all associated payment records. This action cannot be undone."
        confirmText="Yes, Delete Permanently"
        type="danger"
      />

    </div>
  )
}

export default InvoiceDetails
