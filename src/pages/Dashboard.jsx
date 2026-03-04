import React from 'react'
import StatCard from '../components/StatCard'
import DashboardCharts from '../components/DashboardCharts'
import CompareGraphs from '../components/CompareGraphs'
import {
  Users,
  UserPlus,
  UserCheck,
  Flame,
  Snowflake,
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  CreditCard,
} from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Leads Section */}
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

      {/* 2. Customer Section */}
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

      {/* 3. Sales Section */}
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

      {/* 4. Compliances & Jobs Section */}
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

      {/* Compare Graphs Section */}
      <CompareGraphs />

      {/* 5. Analytics Charts */}
      <DashboardCharts />
    </div>
  )
}

export default Dashboard
