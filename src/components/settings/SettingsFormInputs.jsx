import React from 'react'

export const InputGroup = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  fullWidth = false,
}) => (
  <div
    className={`flex flex-col gap-1.5 ${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
  >
    <label
      htmlFor={id}
      className="text-sm font-semibold text-[var(--color-text-primary)]"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
    />
  </div>
)

export const SelectGroup = ({ label, id, value, onChange, fullWidth = false, options }) => (
  <div
    className={`flex flex-col gap-1.5 ${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
  >
    <label
      htmlFor={id}
      className="text-sm font-semibold text-[var(--color-text-primary)]"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem',
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)
