import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, X, MapPin, Calendar, Pause, Eye } from 'lucide-react';
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
    <div className="flex-1 p-4 md:p-8 w-full text-[var(--color-text-primary)]">
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
        <div className="p-8 text-[var(--color-text-secondary)] bg-bg-secondary rounded-2xl border border-bg-tertiary">
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

          {/* Location & Dates */}
          <div className="p-6 border-b border-bg-tertiary grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Dates</p>
              <div className="text-sm">
                <span className="text-text-secondary">Start:</span> {formatDate(ri.startDate)}
              </div>
              <div className="text-sm">
                <span className="text-text-secondary">End:</span> {formatDate(ri.endDate)}
              </div>
              <div className="text-sm font-semibold text-[var(--color-accent)]">
                <span className="text-text-secondary">Next Invoice:</span> {formatDate(ri.nextDate)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Customer Details</p>
              <div className="text-sm">{ri.customer?.phone}</div>
              <div className="text-sm truncate">{ri.customer?.emails?.join(', ')}</div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Address</p>
              <div className="text-sm flex gap-2">
                <MapPin size={14} className="text-text-secondary shrink-0 mt-0.5" />
                <span>{ri.customer?.address}</span>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="p-6 border-b border-bg-tertiary">
            <h3 className="text-lg font-bold mb-4 text-text-primary">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-tertiary/20 text-xs font-semibold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">HSN/SAC</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">GST</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-tertiary">
                  {ri.items?.map((item, index) => {
                    const price = (item.professionalFees || 0) + (item.govtFees || 0);
                    const gstAmount = (price * (item.gstPercent || 0)) / 100;
                    return (
                      <tr key={index} className="hover:bg-bg-tertiary/10 transition-colors">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{item.hsn}</td>
                        <td className="px-4 py-3 font-medium">{item.service?.name || item.description}</td>
                        <td className="px-4 py-3 text-right">₹ {price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">₹ {gstAmount.toFixed(2)} @ {item.gstPercent}%</td>
                        <td className="px-4 py-3 text-right font-semibold">₹ {(price + gstAmount).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-bg-tertiary/10">
                  <tr className="font-bold">
                    <td colSpan="5" className="px-4 py-3 text-right">TOTAL</td>
                    <td className="px-4 py-3 text-right">₹ {total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Generated Invoices */}
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 text-text-primary">Generated Invoices History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-tertiary/20 text-xs font-semibold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                  <tr>
                    <th className="px-4 py-3 text-left">Invoice Date</th>
                    <th className="px-4 py-3 text-left">Invoice No</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Due</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-tertiary">
                  {ri.invoices?.length > 0 ? ri.invoices.map((inv, index) => (
                    <tr key={index} className="hover:bg-bg-tertiary/10 transition-colors">
                      <td className="px-4 py-3">{formatDate(inv.invoiceDate)}</td>
                      <td className="px-4 py-3 font-medium">{inv.invoiceNo}</td>
                      <td className="px-4 py-3 text-right">₹ {inv.total?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-600">₹ {inv.paid?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-semibold">₹ {inv.due?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleViewInvoice(inv._id)}
                          className="p-1.5 hover:bg-[var(--color-accent)] hover:text-white rounded-lg transition-colors text-[var(--color-accent)]"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-text-secondary italic">No invoices generated yet.</td>
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
