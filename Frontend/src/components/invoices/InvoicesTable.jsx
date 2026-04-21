import React from 'react'
import { Link, useNavigate } from 'react-router'
import { Eye, Download } from 'lucide-react'
import CompanyLogo from '../common/CompanyLogo'
import { generateInvoicePdf } from '../../utils/invoicePdfGenerator'

const InvoicesTable = ({ invoices }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '-';
    // Format to "13 Mar 2026" or similar
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handlePdfAction = (inv, action) => {
    const invoicePayload = {
      number: inv.invoiceNo,
      date: formatDate(inv.invoiceDate),
      items: (inv.items || []).map(i => ({
         product: { name: i.service?.name || i.description },
         hsn: i.hsn,
         price: i.price,
         amount: i.amount,
         gstPercent: i.gstPercent,
         gstAmount: i.gstAmount
      })),
      totals: {
         subTotal: inv.subTotal,
         gst: inv.totalGst,
         total: inv.total,
         paid: inv.paid,
         due: inv.due
      }
    };
    const customerPayload = {
      companyName: inv.customer?.companyName || inv.customer?.name,
      customerName: inv.customer?.name,
      phone: inv.customer?.phone,
      address: inv.customer?.address,
      state: inv.customer?.state
    };
    generateInvoicePdf(invoicePayload, customerPayload, action);
  };

  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-100">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1 px-4">
        <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-text-secondary text-sm uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-bg-secondary px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Logo
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Inv. No
              </th>
              <th className="sticky top-0 z-20 bg-bg-secondary px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Date
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Customer & Company
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Service
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Price
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                GST
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Total
              </th>
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-right shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Due Balance
              </th>
              {/* <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-center shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                PDF
              </th> */}
              <th className="sticky top-0 z-20 bg-[var(--color-bg-secondary)] px-1.5 py-3 font-medium text-center shadow-[0_1px_0_var(--color-bg-tertiary)] text-sm">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoices || []).map((inv) => (
              <tr key={inv._id} className="bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group rounded-md shadow-sm">
                <td className="px-1.5 py-6 text-sm rounded-l-lg">
                  <CompanyLogo name={inv.customer?.companyName || inv.customer?.name} size="w-10 h-10" />
                </td>
                <td className="px-1.5 py-6 text-sm text-[var(--color-text-primary)] font-medium">
                  <Link to={`/invoice/${inv._id}`} className="hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-bg-tertiary)] underline-offset-4 hover:decoration-[var(--color-accent)] break-words">
                    {inv.invoiceNo}
                  </Link>
                </td>
                <td className="px-1.5 py-6 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  {formatDate(inv.invoiceDate)}
                </td>
                <td className="px-1.5 py-6 text-sm">
                  <div className="flex flex-col gap-0.5 w-full">
                    <Link to={`/customer/${inv.customer?._id}`} className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-bg-tertiary)] underline-offset-4 hover:decoration-[var(--color-accent)] break-words" title={inv.customer?.name}>
                      {inv.customer?.name}
                    </Link>
                    <span className="text-xs text-[var(--color-text-secondary)] break-words" title={inv.customer?.companyName}>{inv.customer?.companyName}</span>
                  </div>
                </td>
                <td className="px-1.5 py-6 text-sm text-[var(--color-text-secondary)] truncate max-w-[150px]">
                  {inv.items?.[0]?.service?.name || inv.items?.[0]?.description}
                </td>
                <td className="px-1.5 py-6 text-sm text-right font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                  {formatCurrency(inv.subTotal)}
                </td>
                <td className="px-1.5 py-6 text-sm text-right font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                  {formatCurrency(inv.totalGst)}
                </td>
                <td className="px-1.5 py-6 text-sm text-right font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
                  {formatCurrency(inv.total)}
                </td>
                <td className="px-1.5 py-6 text-sm text-right font-semibold text-red-500 whitespace-nowrap">
                  {formatCurrency(inv.due)}
                </td>
                {/* <td className="px-1.5 py-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePdfAction(inv, 'view')}
                      className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                      title="View PDF"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handlePdfAction(inv, 'download')}
                      className="p-1.5 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td> */}
                <td className="px-1.5 py-6 text-center rounded-r-lg">
                  <Link to={`/invoice/${inv._id}`} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-semibold shadow-sm transition-colors cursor-pointer inline-block">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {(invoices || []).length === 0 && (
              <tr>
                <td colSpan="11" className="px-4 py-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] rounded-lg">
                   No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoicesTable
