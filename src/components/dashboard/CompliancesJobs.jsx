import React from 'react'
import { Clock, Briefcase, AlertTriangle } from 'lucide-react'
import StatCard from '../StatCard'

const CompliancesJobs = () => {
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliances */}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
            Compliances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <StatCard
                title="Ongoing Compliances"
                value="84"
                icon={<Clock size={24} />}
              />
            </div>
            <StatCard
              title="Not Done Compliances"
              value="45"
              icon={<AlertTriangle size={24} />}
            />
            <StatCard
              title="Expired Not Done"
              value="12"
              icon={<AlertTriangle size={24} className="text-red-500" />}
            />
          </div>
        </div>

        {/* Jobs */}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
            Accountant Jobs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <StatCard
                title="Ongoing Jobs"
                value="126"
                icon={<Briefcase size={24} />}
              />
            </div>
            <StatCard
              title="Not Done Jobs"
              value="58"
              icon={<AlertTriangle size={24} />}
            />
            <StatCard
              title="Expired Not Done Jobs"
              value="18"
              icon={<AlertTriangle size={24} className="text-red-500" />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompliancesJobs
