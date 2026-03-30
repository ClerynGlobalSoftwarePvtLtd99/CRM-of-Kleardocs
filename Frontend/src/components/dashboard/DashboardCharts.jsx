import React from 'react'
import { useSelector } from 'react-redux'
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

// Custom Tooltip for dark theme
const CustomTooltip = ({ active, payload, label, isCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-3 rounded-lg shadow-xl">
        <p className="text-[var(--color-text-secondary)] text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {entry.name}: {isCurrency ? `₹${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const ChartCard = ({ title, data, dataKey, color, isCurrency }) => (
  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-5">
    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
      {title}
    </h3>
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-bg-tertiary)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (!value) return '';
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
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
            content={<CustomTooltip isCurrency={isCurrency} />}
            cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.4 }}
          />
          <Bar
            dataKey={dataKey}
            name={title.split(' ').pop()} // Get the last word for the label
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
  const { graphs } = useSelector((state) => state.dashboard);

  return (
    <div className="mt-8 pb-8">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Analytics Overview
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <ChartCard 
          title="Daily New Leads" 
          data={graphs.dailyLeads} 
          dataKey="count" 
          color="#D9B24E" 
        />
        <ChartCard
          title="Daily Interacted Leads"
          data={graphs.dailyInteractions}
          dataKey="count"
          color="#8B7230"
        />
        <ChartCard
          title="Daily Sales (Amount)"
          data={graphs.dailySales}
          dataKey="amount"
          color="#10B981"
          isCurrency={true}
        />
        <ChartCard
          title="Daily Sales Count"
          data={graphs.dailySalesCount}
          dataKey="count"
          color="#3B82F6"
        />
      </div>
    </div>
  )
}

export default DashboardCharts
