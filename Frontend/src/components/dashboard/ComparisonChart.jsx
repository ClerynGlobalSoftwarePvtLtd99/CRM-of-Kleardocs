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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-3 rounded-lg shadow-xl">
        <p className="text-[var(--color-text-secondary)] text-xs mb-2 font-bold">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const ComparisonChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl mt-6">
        <p className="text-[var(--color-text-secondary)] italic">Select date ranges and click "Load Graphs" to see comparison.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-text-secondary)" 
              fontSize={11} 
              tickLine={true} 
              axisLine={true}
              interval={Math.floor(data.length / 10)} // Automatically space out Day labels
            />
            <YAxis 
              stroke="var(--color-text-secondary)" 
              fontSize={11} 
              tickLine={true} 
              axisLine={true} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.2 }} />
            <Legend 
              verticalAlign="top" 
              align="center" 
              iconType="rect" 
              wrapperStyle={{ paddingBottom: '25px', fontSize: '13px' }}
            />
            <Bar 
              dataKey="range1" 
              name="Period 1" 
              fill="#3B82F6" // Blue
              radius={[2, 2, 0, 0]} 
              barSize={12} 
            />
            <Bar 
              dataKey="range2" 
              name="Period 2" 
              fill="#FF6B00" // Vibrant Orange
              radius={[2, 2, 0, 0]} 
              barSize={12} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-6">
        <span className="text-[var(--color-text-secondary)] text-sm font-medium">{title}</span>
      </div>
    </div>
  )
}

export default ComparisonChart
