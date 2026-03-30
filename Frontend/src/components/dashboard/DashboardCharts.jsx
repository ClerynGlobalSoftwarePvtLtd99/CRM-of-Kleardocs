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

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatDateToOrdinal = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  return `${getOrdinal(day)} ${month}`;
};

// Custom Tooltip for dark theme
const CustomTooltip = ({ active, payload, label, isCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-3 rounded-lg shadow-xl">
        <p className="text-[var(--color-text-secondary)] text-xs mb-2">{formatDateToOrdinal(label)}</p>
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
  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-5 shadow-sm">
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-bg-tertiary)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="var(--color-text-secondary)"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            interval={(index) => (index + 1) % 2 === 0}
            tickFormatter={(value) => {
              if (!value) return '';
              const date = new Date(value);
              const day = date.getDate();
              const month = date.toLocaleString('default', { month: 'short' });
              return `${getOrdinal(day)} ${month}`;
            }}
          />
          <YAxis
            stroke="var(--color-text-secondary)"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
            }
          />
          <Tooltip
            content={<CustomTooltip isCurrency={isCurrency} />}
            cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.2 }}
          />
          <Legend 
            verticalAlign="top" 
            align="center" 
            iconType="rect"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '13px' }}
          />
          <Bar
            dataKey={dataKey}
            name={title}
            fill={color}
            radius={[2, 2, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const DashboardCharts = () => {
  const { graphs } = useSelector((state) => state.dashboard);

  return (
    <div className="mt-8 pb-12">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[var(--color-accent)] rounded-full"></span>
        Analytics Overview
      </h2>
      <div className="grid grid-cols-1 gap-8">
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
