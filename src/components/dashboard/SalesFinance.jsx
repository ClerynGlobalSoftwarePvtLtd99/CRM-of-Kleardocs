import React from 'react'
import { FileText, DollarSign, CreditCard, AlertTriangle } from 'lucide-react'
import StatCard from '../StatCard'

const SalesFinance = () => {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Sales & Finance
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Invoices"
          value="1,540"
          icon={<FileText size={24} />}
        />
        <StatCard
          title="Total Sales"
          value="$450,230"
          icon={<DollarSign size={24} />}
          trend="up"
          trendValue="15.8"
        />
        <StatCard
          title="Total Payments (Count)"
          value="1,420"
          icon={<CreditCard size={24} />}
        />
        <StatCard
          title="Payment Received"
          value="$380,450"
          icon={<DollarSign size={24} />}
          trend="up"
          trendValue="12.1"
        />
        <StatCard
          title="Unpaid / Partial Invoices"
          value="120"
          icon={<AlertTriangle size={24} />}
          trend="down"
          trendValue="5.4"
        />
        <StatCard
          title="Total Dues"
          value="$69,780"
          icon={<DollarSign size={24} />}
          trend="up"
          trendValue="2.3"
        />
      </div>
    </section>
  )
}

export default SalesFinance
