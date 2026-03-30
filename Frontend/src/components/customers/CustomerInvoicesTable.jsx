import React from "react";

const CustomerInvoicesTable = ({ invoices = [], onAction }) => {
  return (
    <div className="bg-bg-secondary rounded-sm shadow-sm border border-bg-tertiary overflow-hidden">
      <div className="p-4 border-b border-bg-tertiary bg-bg-secondary">
        <h3 className="text-[17px] font-bold text-text-primary">Invoices</h3>
      </div>

      <div className="bg-bg-primary p-4">
        <div className="hidden lg:grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_80px] gap-4 px-4 py-2 mb-1 text-[13px] font-bold text-text-primary">
          <div>Invoice Date</div>
          <div>Invoice No</div>
          <div>Linked Service</div>
          <div>Price</div>
          <div>GST</div>
          <div>Total</div>
          <div>Due</div>
          <div className="text-center">View</div>
        </div>

        <div className="space-y-2">
          {invoices.length > 0 ? (
            invoices.map((inv, i) => (
              <div 
                key={i} 
                className="bg-bg-secondary p-3 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-bg-tertiary lg:grid lg:grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_80px] lg:items-center gap-4 flex flex-col"
              >
                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Invoice Date:</span>
                  {inv.date ? new Date(inv.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                <div className="text-[13px] text-text-primary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Invoice No:</span>
                  {inv.invoiceNo || `INV-XX-${i}`}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Linked Service:</span>
                  {inv.linkedService || '-'}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Price:</span>
                  ₹ {inv.price || 0}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">GST:</span>
                  ₹ {inv.gstAmount || 0}
                </div>

                <div className="text-[13px] text-text-secondary">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Total:</span>
                  ₹ {inv.total || 0}
                </div>

                <div className="text-[13px] text-[#dc3545]">
                  <span className="lg:hidden font-bold block mb-1 text-text-primary">Due:</span>
                  ₹ {inv.due || 0}
                </div>

                <div className="flex justify-end lg:justify-center">
                  <button 
                    onClick={() => onAction && onAction('viewInvoice', inv)}
                    className="bg-[#f08c3e] hover:bg-[#e67e22] text-white px-3 py-1 font-bold text-[11px] uppercase rounded-[3px] transition-colors shadow-sm"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-bg-secondary p-4 rounded-sm border border-bg-tertiary text-center text-sm text-text-secondary italic">
              No invoices found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoicesTable;
