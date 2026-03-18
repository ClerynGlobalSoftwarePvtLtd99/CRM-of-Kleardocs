import React from 'react'
import { Users, UserPlus, UserCheck, Flame, Snowflake } from 'lucide-react'
import StatCard from '../StatCard'

const LeadsOverview = () => {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Leads Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Leads"
          value="1,245"
          icon={<Users size={24} />}
          trend="up"
          trendValue="12.5"
        />
        <StatCard
          title="New Leads"
          value="384"
          icon={<UserPlus size={24} />}
          trend="up"
          trendValue="8.2"
        />
        <StatCard
          title="Interacted Leads"
          value="482"
          icon={<UserCheck size={24} />}
          trend="up"
          trendValue="5.1"
        />
        <StatCard
          title="Hot Leads"
          value="126"
          icon={<Flame size={24} />}
          trend="up"
          trendValue="18.3"
        />
        <StatCard
          title="Cold Leads"
          value="253"
          icon={<Snowflake size={24} />}
          trend="down"
          trendValue="2.4"
        />
      </div>
    </section>
  )
}

export default LeadsOverview
