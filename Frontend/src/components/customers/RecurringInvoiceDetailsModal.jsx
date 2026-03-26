import React from "react";
import { X, MapPin, Calendar } from "lucide-react";

const RecurringInvoiceDetailsModal = ({ invoice, onClose }) => {
  const invoiceItems = [
    {
      no: 1,
      hsnSac: "998399",
      product: invoice.service || "Annual Compliance",
      price: invoice.amount || 2000,
      gst: invoice.gst || 0,
      amount: invoice.amount || 2000
    }
  ];

  const generatedInvoices = [
    {
      date: invoice.startDate || "19th Mar 2026",
      number: "INV-24-2510971",
      price: invoice.amount || 2000,
      gst: invoice.gst || 0,
      total: invoice.amount || 2000,
      due: invoice.amount || 2000
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-4xl bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-bg-tertiary gap-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-secondary">Status:</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm font-bold rounded-lg border border-green-500/20">
                {invoice.status || "Active"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Created:</span>
              <span className="text-sm font-medium text-text-primary">
                {invoice.startDate || "19th Mar 2026 10:45 am"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
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
                  <th className="px-4 py-3 text-center">View</th>
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
                    <td className="px-4 py-3 text-center">
                      <button className="btn-raised btn-raised-orange px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringInvoiceDetailsModal;
