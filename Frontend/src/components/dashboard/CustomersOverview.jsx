import React from 'react'
import { Users, CheckCircle } from 'lucide-react'
import StatCard from '../StatCard'

const CustomersOverview = () => {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Customers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Customers"
          value="892"
          icon={<Users size={24} />}
          trend="up"
          trendValue="4.2"
        />
        <StatCard
          title="Customers with Annual Compliance"
          value="435"
          icon={<CheckCircle size={24} />}
          trend="up"
          trendValue="11.4"
        />
      </div>
    </section>
  )
}

export default CustomersOverview
