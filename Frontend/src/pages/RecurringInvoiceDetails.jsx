import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, X, MapPin, Calendar, Pause, Eye, Clock, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { fetchRecurringInvoiceById, disableRecurringInvoice, clearSelectedInvoice } from '../redux/slices/recurringInvoicesSlice';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ContentLoader from '../components/common/ContentLoader';

const RecurringInvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedInvoice: ri, loading, error } = useSelector((state) => state.recurringInvoices);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRecurringInvoiceById(id));
    return () => {
      dispatch(clearSelectedInvoice());
    };
  }, [dispatch, id]);

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  // Removed early return for loading to keep header visible

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
  };

  const handleConfirmToggle = () => {
    dispatch(disableRecurringInvoice(ri._id));
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  // Calculate totals for items
  const subTotal = ri?.items?.reduce((sum, it) => sum + (it.professionalFees || 0) + (it.govtFees || 0), 0) || 0;
  const totalGst = ri?.items?.reduce((sum, it) => {
    const price = (it.professionalFees || 0) + (it.govtFees || 0);
    return sum + (price * (it.gstPercent || 0)) / 100;
  }, 0) || 0;
  const total = subTotal + totalGst;

  return (
    <div className="flex-1 p-4 md:p-8 w-full text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/recurringinvoices')}
            className="p-2.5 hover:bg-bg-secondary rounded-xl transition-all border border-bg-tertiary shadow-sm"
          >
            <ArrowLeft size={20} className="text-yellow-500" />
          </button>
          <h1 className="text-2xl font-black tracking-tight italic">
            RECURRING INVOICE DETAILS
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-secondary">Status:</span>
            <span className={`px-3 py-1 text-sm font-bold rounded-lg border ${
              ri?.status === 'Inactive' 
                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
              {ri?.status || '-'}
            </span>
          </div>
          
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={loading || !ri}
            className={`btn-raised px-4 py-2 rounded-md text-[13px] font-bold transition-all ${
              ri?.status === 'Active' 
                ? 'btn-raised-red text-white' 
                : 'btn-raised-green text-white'
            } ${(loading || !ri) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {ri?.status === 'Active' ? 'Disable Recurring' : 'Enable Recurring'}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmToggle}
        title={ri?.status === 'Active' ? "Disable Recurring Invoice" : "Enable Recurring Invoice"}
        message={`Are you sure you want to ${ri?.status === 'Active' ? 'disable' : 'enable'} this recurring invoice? This will ${ri?.status === 'Active' ? 'stop' : 'resume'} automatic invoice generation.`}
        confirmText={ri?.status === 'Active' ? "Disable Now" : "Enable Now"}
        type={ri?.status === 'Active' ? "danger" : "warning"}
      />

      {loading ? (
        <ContentLoader message="Loading recurring invoice details..." />
      ) : !ri ? (
        <div className="p-8 text-text-secondary bg-bg-secondary rounded-2xl border border-bg-tertiary">
          Recurring invoice not found.
        </div>
      ) : (
        /* Main Content */
        <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-sm overflow-hidden">
          {/* Invoice Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-bg-tertiary gap-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">Created:</span>
                <span className="text-sm font-medium text-text-primary">
                  {formatDate(ri.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">Interval:</span>
                <span className="text-sm font-medium text-text-primary">
                  Every {ri.interval} {ri.intervalType}{ri.interval > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <h2 className="text-lg font-bold">{ri.customer?.name}</h2>
              <p className="text-xs text-text-secondary">{ri.customer?.companyName}</p>
            </div>
          </div>

          {/* Dates, Customer & Location */}
          <div className="p-6 border-b border-bg-tertiary grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Dates</p>
              <div className="text-sm">
                <span className="text-text-secondary">Start:</span> {formatDate(ri.startDate)}
              </div>
              <div className="text-sm">
                <span className="text-text-secondary">End:</span> {formatDate(ri.endDate)}
              </div>
              <div className="text-sm font-semibold text-accent">
                <span className="text-text-secondary">Next Invoice:</span> {formatDate(ri.nextDate)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Customer Details</p>
              <div className="text-sm">{ri.customer?.phone}</div>
              <div className="text-sm truncate">{ri.customer?.emails?.join(', ')}</div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Location</p>
              <div className="text-sm flex gap-2">
                <MapPin size={14} className="text-text-secondary shrink-0 mt-0.5" />
                <div>
                  <div>{ri.customer?.address || '-'}</div>
                  {ri.customer?.state && (
                    <div className="text-text-secondary text-xs mt-0.5">
                      Place of Supply: {ri.customer.state}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Installments Schedule */}
          {ri.totalInstallments > 1 && ri.installments?.length > 0 && (
            <div className="p-6 border-b border-bg-tertiary">
              <h3 className="text-lg font-bold mb-4 text-text-primary flex items-center gap-2">
                <Calendar size={18} className="text-accent" />
                Payment Schedule ({ri.totalInstallments} Installments)
              </h3>
              
              {/* Pending Payments Summary Card */}
              {ri.installments.filter(i => i.status === "Pending" || i.status === "Invoiced").length > 0 && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
                  <h4 className="text-sm font-bold text-accent mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="animate-pulse" />
                    Pending Payments Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ri.installments
                      .filter(i => i.status === "Pending" || i.status === "Invoiced")
                      .map(inst => {
                        const isNext = ri.installments
                          .slice(0, ri.installments.indexOf(inst))
                          .every(prev => prev.status === "Paid");
                        const periodEnd = new Date(new Date(inst.dueDate).setMonth(
                          new Date(inst.dueDate).getMonth() + (ri.installmentIntervalMonths || 3)
                        ));
                        return (
                          <div 
                            key={inst.number}
                            className={`p-3 rounded-lg border ${
                              isNext 
                                ? 'bg-accent border-accent text-white shadow-md' 
                                : 'bg-bg-primary border-bg-tertiary'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold">#{inst.number}</span>
                              {isNext && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">NEXT</span>}
                            </div>
                            <div className={`text-sm ${isNext ? 'text-white/90' : 'text-text-secondary'}`}>
                              Due: {new Date(inst.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </div>
                            <div className={`text-sm ${isNext ? 'text-white/90' : 'text-text-secondary'}`}>
                              Expires: {periodEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            <div className={`font-bold mt-1 ${isNext ? 'text-white' : 'text-text-primary'}`}>
                              ₹ {inst.amount?.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 4px' }}>
                  <thead className="bg-bg-tertiary/20 text-xs font-semibold text-text-secondary uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Payment Period</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Invoice</th>
                      <th className="px-4 py-3 text-left">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {ri.installments.map((inst, index) => {
                      const isNextPending = inst.status === "Pending" && 
                        ri.installments.slice(0, index).every(prev => prev.status === "Paid");
                      const isPaid = inst.status === "Paid";
                      const isInvoiced = inst.status === "Invoiced";
                      
                      // Calculate period end date (3 months after due date for quarterly)
                      const periodStart = new Date(inst.dueDate);
                      const periodEnd = new Date(periodStart);
                      periodEnd.setMonth(periodEnd.getMonth() + (ri.installmentIntervalMonths || 3));
                      
                      return (
                        <tr 
                          key={inst.number} 
                          className={`transition-all duration-300 ${
                            isNextPending ? 'bg-accent/15 border-l-4 border-l-accent shadow-md' : 
                            isPaid ? 'bg-green-500/10 opacity-75' : 
                            'bg-bg-primary/40'
                          } ${isNextPending ? 'ring-2 ring-accent/50 rounded-lg scale-[1.02]' : 'rounded-lg'}`}
                        >
                          <td className={`px-4 py-3 rounded-l-lg font-semibold ${isPaid ? 'line-through text-text-secondary' : ''}`}>
                            <div className="flex items-center gap-2">
                              {isPaid ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : isNextPending ? (
                                <AlertCircle size={16} className="text-accent animate-pulse" />
                              ) : (
                                <Clock size={16} className="text-text-secondary" />
                              )}
                              <span>{inst.number}</span>
                            </div>
                            {isNextPending && (
                              <span className="ml-6 px-2 py-0.5 text-[10px] bg-accent text-white rounded-full font-bold">
                                NEXT PAYMENT
                              </span>
                            )}
                          </td>
                          <td className={`px-4 py-3 text-xs ${isPaid ? 'line-through text-text-secondary' : ''}`}>
                            <div className="flex flex-col">
                              <span className="text-text-secondary">Coverage:</span>
                              <span>{formatDate(periodStart)}</span>
                              <span className="text-text-secondary">to</span>
                              <span>{formatDate(periodEnd)}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${isPaid ? 'line-through text-text-secondary' : isNextPending ? 'font-bold text-accent' : ''}`}>
                            {formatDate(inst.dueDate)}
                          </td>
                          <td className={`px-4 py-3 text-right font-semibold ${isPaid ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                            ₹ {inst.amount?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              isPaid ? 'bg-green-500/20 text-green-500' :
                              isInvoiced ? 'bg-yellow-500/20 text-yellow-500' :
                              isNextPending ? 'bg-accent/20 text-accent animate-pulse' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {inst.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {inst.invoice ? (
                              <button
                                onClick={() => handleViewInvoice(inst.invoice)}
                                className={`${isPaid ? 'text-text-secondary' : 'text-accent hover:underline'} font-medium`}
                                disabled={isPaid}
                              >
                                {isPaid ? 'Paid' : 'View'}
                              </button>
                            ) : (
                              <span className="text-text-secondary">-</span>
                            )}
                          </td>
                          <td className={`px-4 py-3 rounded-r-lg ${isPaid ? 'text-green-500 font-medium' : 'text-text-secondary'}`}>
                            {inst.paidDate ? formatDate(inst.paidDate) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Installment Progress */}
              <div className="mt-4 p-4 bg-bg-tertiary/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-text-secondary">Payment Progress</span>
                  <span className="text-sm font-bold text-accent">
                    {ri.installments.filter(i => i.status === "Paid").length} / {ri.totalInstallments} Installments Paid
                  </span>
                </div>
                <div className="w-full bg-bg-tertiary rounded-full h-3">
                  <div 
                    className="bg-accent h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(ri.installments.filter(i => i.status === "Paid").length / ri.totalInstallments) * 100}%` 
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-text-secondary text-center">
                  {ri.installments.filter(i => i.status === "Pending" && 
                    ri.installments.slice(0, ri.installments.indexOf(i)).every(prev => prev.status === "Paid")).length > 0 ? (
                    <span className="text-accent font-semibold">
                      Next payment due: {formatDate(ri.installments.find(i => i.status === "Pending" && 
                        ri.installments.slice(0, ri.installments.indexOf(i)).every(prev => prev.status === "Paid"))?.dueDate)}
                    </span>
                  ) : ri.installments.every(i => i.status === "Paid") ? (
                    <span className="text-green-500 font-semibold">All installments paid successfully!</span>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Invoice Items */}
          <div className="p-6 border-b border-bg-tertiary">
            <h3 className="text-lg font-bold mb-4 text-text-primary">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 4px' }}>
                <thead className="bg-bg-tertiary/20 text-xs font-semibold text-text-secondary uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3 text-left shadow-[0_1px_0_var(--color-bg-tertiary)]">No</th>
                    <th className="px-4 py-3 text-left shadow-[0_1px_0_var(--color-bg-tertiary)]">HSN/SAC</th>
                    <th className="px-4 py-3 text-left shadow-[0_1px_0_var(--color-bg-tertiary)]">Product</th>
                    <th className="px-4 py-3 text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Price</th>
                    <th className="px-4 py-3 text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">GST</th>
                    <th className="px-4 py-3 text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Amount</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {ri.items?.map((item, index) => {
                    const price = (item.professionalFees || 0) + (item.govtFees || 0);
                    const gstAmount = (price * (item.gstPercent || 0)) / 100;
                    return (
                      <tr key={index} className="bg-bg-primary/40 hover:bg-bg-tertiary/20 transition-colors">
                        <td className="px-4 py-3 rounded-l-lg">{index + 1}</td>
                        <td className="px-4 py-3">{item.hsn}</td>
                        <td className="px-4 py-3 font-medium text-accent">{item.service?.name || item.description}</td>
                        <td className="px-4 py-3 text-right text-text-primary">₹ {price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-text-secondary">₹ {gstAmount.toFixed(2)} @ {item.gstPercent}%</td>
                        <td className="px-4 py-3 text-right font-semibold text-text-primary rounded-r-lg">₹ {(price + gstAmount).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-bg-tertiary/10">
                  <tr className="font-bold">
                    <td colSpan="5" className="px-4 py-3 text-right text-text-secondary">TOTAL</td>
                    <td className="px-4 py-3 text-right text-accent text-lg">₹ {total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Generated Invoices */}
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 text-text-primary">
              Generated Invoices History
              {ri.totalInstallments > 1 && (
                <span className="ml-2 text-sm font-normal text-text-secondary">
                  (Installment Invoices)
                </span>
              )}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 4px' }}>
                <thead className="bg-bg-tertiary/20 text-xs font-semibold text-text-secondary uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3 text-left shadow-[0_1px_0_var(--color-bg-tertiary)]">Invoice Date</th>
                    <th className="px-4 py-3 text-left shadow-[0_1px_0_var(--color-bg-tertiary)]">Invoice No</th>
                    {ri.totalInstallments > 1 && (
                      <th className="px-4 py-3 text-center shadow-[0_1px_0_var(--color-bg-tertiary)]">Installment</th>
                    )}
                    <th className="px-4 py-3 text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Total</th>
                    <th className="px-4 py-3 text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Paid</th>
                    <th className="px-4 py-3 text-right shadow-[0_1px_0_var(--color-bg-tertiary)]">Due</th>
                    <th className="px-4 py-3 text-center shadow-[0_1px_0_var(--color-bg-tertiary)]">Action</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {ri.invoices?.length > 0 ? ri.invoices.map((inv, index) => {
                    // Find associated installment
                    const installment = ri.installments?.find(inst => 
                      inst.invoice?._id === inv._id || inst.invoice === inv._id
                    );
                    const isPaid = inv.due < 0.01;
                    
                    return (
                      <tr key={index} className={`transition-colors ${
                        isPaid ? 'bg-green-500/5' : 'bg-bg-primary/40 hover:bg-bg-tertiary/20'
                      }`}>
                        <td className="px-4 py-3 rounded-l-lg">{formatDate(inv.invoiceDate)}</td>
                        <td className="px-4 py-3 font-medium text-accent hover:underline cursor-pointer" onClick={() => handleViewInvoice(inv._id)}>{inv.invoiceNo}</td>
                        {ri.totalInstallments > 1 && (
                          <td className="px-4 py-3 text-center">
                            {installment ? (
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                installment.status === 'Paid' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : 'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                #{installment.number}
                              </span>
                            ) : (
                              <span className="text-text-secondary">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 text-right text-text-primary">₹ {inv.total?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-green-500 font-medium">₹ {inv.paid?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-red-500 font-semibold">₹ {inv.due?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center rounded-r-lg">
                          <button
                            onClick={() => handleViewInvoice(inv._id)}
                            className="p-1.5 hover:bg-accent hover:text-white rounded-lg transition-colors text-accent"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={ri.totalInstallments > 1 ? 7 : 6} className="px-4 py-8 text-center text-text-secondary italic">No invoices generated yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringInvoiceDetails;
