import React from 'react'
import { useSelector } from 'react-redux'
import { FileText, IndianRupee, CreditCard, AlertTriangle } from 'lucide-react'
import StatCard from '../StatCard'

const SalesFinance = () => {
  const { kpis } = useSelector((state) => state.dashboard);

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Sales & Finance
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Invoices"
          value={kpis.totalInvoices?.value?.toLocaleString() || 0}
          icon={<FileText size={24} />}
          trend={kpis.totalInvoices?.trendValue !== null ? kpis.totalInvoices?.trend : undefined}
          trendValue={kpis.totalInvoices?.trendValue !== null ? kpis.totalInvoices?.trendValue : undefined}
        />
        <StatCard
          title="Total Sales"
          value={`₹${kpis.totalSales?.value?.toLocaleString() || 0}`}
          icon={<IndianRupee size={24} />}
          trend={kpis.totalSales?.trend || 'up'}
          trendValue={kpis.totalSales?.trendValue || 0}
        />
        <StatCard
          title="Total Payments (Count)"
          value={kpis.totalPayments?.value?.toLocaleString() || 0}
          icon={<CreditCard size={24} />}
          trend={kpis.totalPayments?.trendValue !== null ? kpis.totalPayments?.trend : undefined}
          trendValue={kpis.totalPayments?.trendValue !== null ? kpis.totalPayments?.trendValue : undefined}
        />
        <StatCard
          title="Payment Received"
          value={`₹${kpis.paymentReceived?.value?.toLocaleString() || 0}`}
          icon={<IndianRupee size={24} />}
          trend={kpis.paymentReceived?.trend || 'up'}
          trendValue={kpis.paymentReceived?.trendValue || 0}
        />
        <StatCard
          title="Unpaid / Partial Invoices"
          value={kpis.unpaidPartialInvoices?.value?.toLocaleString() || 0}
          icon={<AlertTriangle size={24} />}
          trend={kpis.unpaidPartialInvoices?.trend || 'down'}
          trendValue={kpis.unpaidPartialInvoices?.trendValue || 0}
        />
        <StatCard
          title="Total Dues"
          value={`₹${kpis.totalDues?.value?.toLocaleString() || 0}`}
          icon={<IndianRupee size={24} />}
          trend={kpis.totalDues?.trend || 'up'}
          trendValue={kpis.totalDues?.trendValue || 0}
        />
      </div>
    </section>
  )
}

export default SalesFinance
