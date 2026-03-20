import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, X, MapPin, Calendar, Pause, Eye } from 'lucide-react';

const RecurringInvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  // Mock data - in real app, this would come from API based on id
  const invoice = {
    id: id || "1",
    created: '19th Mar 2026 10:45 am',
    customerName: "VIRALITY360 PRIVATE LIMITED",
    customerCompany: "VIRALITY360 PRIVATE LIMITED",
    service: "Annual Compliance",
    startDate: "19th Mar 2026",
    endDate: "19th Mar 2027",
    interval: "3 Months",
    nextInvoiceDate: "19th Jun 2026",
    status: isDisabled ? "Disabled" : "Active",
    amount: 2000,
    gst: 0
  };

  const invoiceItems = [
    {
      no: 1,
      hsnSac: "998399",
      product: invoice.service,
      price: invoice.amount,
      gst: invoice.gst,
      amount: invoice.amount
    }
  ];

  const generatedInvoices = [
    {
      date: invoice.startDate,
      number: "INV-24-2510971",
      price: invoice.amount,
      gst: invoice.gst,
      total: invoice.amount,
      due: invoice.amount
    }
  ];

  const handleDisableRecurring = () => {
    setIsDisabled(!isDisabled);
  };

  const handleViewInvoice = () => {
    // Navigate to invoice details page with the invoice number
    navigate(`/invoice/${generatedInvoices[0].number}`);
  };

  return (
    <div className="flex-1 p-4 md:p-8 w-full text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/recurring-invoices')}
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
              isDisabled 
                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
              {invoice.status}
            </span>
          </div>
          
          <button
            onClick={handleDisableRecurring}
            className={`btn-raised px-4 py-2 rounded-md text-[13px] font-bold transition-all ${
              isDisabled 
                ? 'btn-raised-green text-white' 
                : 'btn-raised-red text-white'
            }`}
          >
            {isDisabled ? 'Enable Recurring' : 'Disable Recurring'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-sm overflow-hidden">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-bg-tertiary gap-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Created:</span>
              <span className="text-sm font-medium text-text-primary">
                {invoice.created}
              </span>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="p-6 border-b border-bg-tertiary">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">South Delhi-110019, Delhi</span>
            </div>
            <div className="text-sm text-text-secondary">
              Place of Supply (7 - DELHI)
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
                {invoiceItems.map((item, index) => (
                  <tr key={index} className="hover:bg-bg-tertiary/10 transition-colors">
                    <td className="px-4 py-3">{item.no}</td>
                    <td className="px-4 py-3">{item.hsnSac}</td>
                    <td className="px-4 py-3 font-medium">{item.product}</td>
                    <td className="px-4 py-3 text-right">₹ {item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">₹ {item.gst.toFixed(2)} @ 0%</td>
                    <td className="px-4 py-3 text-right font-semibold">₹ {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generated Invoices */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 text-text-primary">Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/20 text-xs font-semibold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left">Invoice Date</th>
                  <th className="px-4 py-3 text-left">Invoice No</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">GST</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {generatedInvoices.map((inv, index) => (
                  <tr key={index} className="hover:bg-bg-tertiary/10 transition-colors">
                    <td className="px-4 py-3">{inv.date}</td>
                    <td className="px-4 py-3 font-medium">{inv.number}</td>
                    <td className="px-4 py-3 text-right">₹ {inv.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">₹ {inv.gst.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹ {inv.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹ {inv.due.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* View Button in Bottom Right */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleViewInvoice}
              className="btn-raised btn-raised-orange px-4 py-2 rounded-md text-[13px] font-bold transition-all flex items-center gap-2"
            >
              <Eye size={16} />
              View Invoice Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringInvoiceDetails;
