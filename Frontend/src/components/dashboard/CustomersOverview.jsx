import React from 'react'
import { useSelector } from 'react-redux'
import { Users, CheckCircle } from 'lucide-react'
import StatCard from '../StatCard'

const CustomersOverview = () => {
  const { kpis } = useSelector((state) => state.dashboard);

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Customers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Customers"
          value={kpis.totalCustomers?.value || 0}
          icon={<Users size={24} />}
          trend={kpis.totalCustomers?.trend || 'up'}
          trendValue={kpis.totalCustomers?.trendValue || 0}
        />
        <StatCard
          title="Customers with Annual Compliance"
          value={kpis.withAnnualCompliance?.value || 0}
          icon={<CheckCircle size={24} />}
          trend={kpis.withAnnualCompliance?.trend || 'up'}
          trendValue={kpis.withAnnualCompliance?.trendValue || 0}
        />
      </div>
    </section>
  )
}

export default CustomersOverview
