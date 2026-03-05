import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const dummyData = [
  { name: '1', leads: 400, interacted: 240, sales: 2400, salesCount: 15 },
  { name: '5', leads: 300, interacted: 139, sales: 1398, salesCount: 8 },
  { name: '10', leads: 200, interacted: 980, sales: 4800, salesCount: 30 },
  { name: '15', leads: 278, interacted: 390, sales: 3908, salesCount: 24 },
  { name: '20', leads: 189, interacted: 480, sales: 4800, salesCount: 35 },
  { name: '25', leads: 239, interacted: 380, sales: 3800, salesCount: 22 },
  { name: '30', leads: 349, interacted: 430, sales: 4300, salesCount: 28 },
]


// Custom Tooltip for dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-3 rounded-lg shadow-xl">
        <p className="text-[var(--color-text-secondary)] text-sm mb-2">{`Day ${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const ChartCard = ({ title, dataKey, color }) => (
  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-5">
    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
      {title}
    </h3>
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dummyData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-bg-tertiary)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.4 }}
          />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const DashboardCharts = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Analytics Overview
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Daily New Leads" dataKey="leads" color="#D9B24E" />
        <ChartCard
          title="Daily Interacted Leads"
          dataKey="interacted"
          color="#8B7230"
        />
        <ChartCard
          title="Daily Sales (Amount)"
          dataKey="sales"
          color="#10B981"
        />
        <ChartCard
          title="Daily Sales Count"
          dataKey="salesCount"
          color="#3B82F6"
        />
      </div>
    </div>
  )
}

export default DashboardCharts
