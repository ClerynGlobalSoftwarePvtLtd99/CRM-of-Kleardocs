import React from 'react'
import { useSelector } from 'react-redux'
import { Users, UserPlus, UserCheck, Flame, Snowflake } from 'lucide-react'
import StatCard from '../StatCard'

const LeadsOverview = () => {
  const { kpis } = useSelector((state) => state.dashboard);

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Leads Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Leads"
          value={kpis.totalLeads?.value || 0}
          icon={<Users size={24} />}
          trend={kpis.totalLeads?.trend || 'up'}
          trendValue={kpis.totalLeads?.trendValue || 0}
        />
        <StatCard
          title="New Leads"
          value={kpis.newLeads?.value || 0}
          icon={<UserPlus size={24} />}
          trend={kpis.newLeads?.trend || 'up'}
          trendValue={kpis.newLeads?.trendValue || 0}
        />
        <StatCard
          title="Interacted Leads"
          value={kpis.interactedLeads?.value || 0}
          icon={<UserCheck size={24} />}
          trend={kpis.interactedLeads?.trend || 'up'}
          trendValue={kpis.interactedLeads?.trendValue || 0}
        />
        <StatCard
          title="Hot Leads"
          value={kpis.hotLeads?.value || 0}
          icon={<Flame size={24} />}
          trend={kpis.hotLeads?.trend || 'up'}
          trendValue={kpis.hotLeads?.trendValue || 0}
        />
        <StatCard
          title="Cold Leads"
          value={kpis.coldLeads?.value || 0}
          icon={<Snowflake size={24} />}
          trend={kpis.coldLeads?.trend || 'down'}
          trendValue={kpis.coldLeads?.trendValue || 0}
        />
      </div>
    </section>
  )
}

export default LeadsOverview
