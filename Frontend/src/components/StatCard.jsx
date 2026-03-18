import React from 'react'

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'accent',
}) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-5 hover:border-[var(--color-accent)] transition-colors shadow-sm group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] text-[var(--color-accent)] group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>

      {trend && trendValue && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}
          >
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            {trendValue}%
          </span>
          <span className="text-[var(--color-text-secondary)] ml-2">
            vs last month
          </span>
        </div>
      )}
    </div>
  )
}

export default StatCard
