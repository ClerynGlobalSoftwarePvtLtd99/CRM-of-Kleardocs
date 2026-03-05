import React, { useState } from 'react'
import toast from 'react-hot-toast'
import DateRangePicker from '../components/DateRangePicker'

const templateOptions = [
  'Compliance Update',
  'Annual Compliance Service - Jagjyot Singh',
  'Annual Compliance Service - Ritu Kaur',
  'Annual Compliance Service plus GST plus ESI - Ritu Kaur',
  'Annual Compliance - Onboarding',
  'Startup India Registration',
  'Startup India Promotion',
  'Website',
  'Professional Tax',
  'GST Filing',
  'Service List',
  'Next Quarter Payment',
  'INC 20A Reminder',
  'ROC plus GST plus ESI plus TDS',
  'Package plus payment details',
  'Annual Compliance plus Bookkeeping',
  'Director Resignation',
]

const InputGroup = ({
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

const SelectGroup = ({ label, id, value, onChange, fullWidth = false }) => (
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
      {templateOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)

const Settings = () => {
  const [formData, setFormData] = useState({
    invoicePrefix: 'INV-24-25',
    invoiceNumber: '10835',
    emailFromName: 'Startup Station',
    fromEmail: 'bizdev@startupstation.in',
    invoiceTemplate: 'Compliance Update',
    recurringInvoiceTemplate: 'Next Quarter Payment',
    gstTemplate: 'GST Filing',
    serviceListTemplate: 'Startup India Registration',
    ptaxTemplate: 'Professional Tax',
    websiteTemplate: 'Website',
    startupIndiaTemplate: 'Startup India Promotion',
    isoTemplate: 'Service List',
    inc20Template: 'INC 20A Reminder',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleUpdateSettings = () => {
    // Save these data logic here
    toast.success('Settings updated successfully', {
      style: {
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-bg-tertiary)',
      },
      iconTheme: {
        primary: '#10b981', // green color
        secondary: '#fff',
      },
    })
  }

  return (
    <div className="w-full h-full space-y-8 pb-10">
      {/* Section 1: Settings */}
      <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">
          Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Row 1 */}
          <InputGroup
            label="Invoice Prefix"
            id="invoicePrefix"
            value={formData.invoicePrefix}
            onChange={handleChange}
          />
          <InputGroup
            label="Invoice Number"
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
          />

          {/* Row 2 */}
          <InputGroup
            label="Email From Name"
            id="emailFromName"
            value={formData.emailFromName}
            onChange={handleChange}
          />
          <InputGroup
            label="From Email"
            id="fromEmail"
            value={formData.fromEmail}
            onChange={handleChange}
          />

          {/* Row 3 */}
          <SelectGroup
            label="Invoice Template"
            id="invoiceTemplate"
            value={formData.invoiceTemplate}
            onChange={handleChange}
          />
          <SelectGroup
            label="Recurring Invoice Template"
            id="recurringInvoiceTemplate"
            value={formData.recurringInvoiceTemplate}
            onChange={handleChange}
          />

          {/* Row 4 */}
          <SelectGroup
            label="GST template(2nd for every month)"
            id="gstTemplate"
            value={formData.gstTemplate}
            onChange={handleChange}
          />
          <SelectGroup
            label="Service List Template(After 2 days)"
            id="serviceListTemplate"
            value={formData.serviceListTemplate}
            onChange={handleChange}
          />

          {/* Row 5 */}
          <SelectGroup
            label="PTax Template (after 7 days compliance start)"
            id="ptaxTemplate"
            value={formData.ptaxTemplate}
            onChange={handleChange}
          />
          <SelectGroup
            label="Website Template(After 10 days)"
            id="websiteTemplate"
            value={formData.websiteTemplate}
            onChange={handleChange}
          />

          {/* Row 6 */}
          <SelectGroup
            label="StartupIndia Template (after 15 days of comliances start)"
            id="startupIndiaTemplate"
            value={formData.startupIndiaTemplate}
            onChange={handleChange}
          />
          <SelectGroup
            label="ISO Template(after 20 days of compliance start)"
            id="isoTemplate"
            value={formData.isoTemplate}
            onChange={handleChange}
          />

          {/* Row 7 */}
          <SelectGroup
            label="INC20 Template (after 120 and 150 days of incorporation)"
            id="inc20Template"
            value={formData.inc20Template}
            onChange={handleChange}
            fullWidth
          />

          {/* Row 8 */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              onClick={handleUpdateSettings}
              className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)]"
            >
              Update Settings
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Email Count */}
      <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">
          Email Count
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Email Count
            </span>
            <div className="flex-1 w-full sm:w-auto">
              <DateRangePicker />
            </div>
            <button className="bg-[var(--color-accent)] hover:bg-yellow-600 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)]">
              Go
            </button>
          </div>
          <div className="text-sm font-semibold pr-2">
            Total Emails:{' '}
            <span className="text-[var(--color-accent)] text-lg ml-1">0</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[var(--color-bg-tertiary)] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg-primary)] border-b border-[var(--color-bg-tertiary)]">
                <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
                  Date
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)]">
                  Count
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-[var(--color-text-secondary)] w-[50%]">
                  Template
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy row just to match the visual layout in user's request */}
              <tr className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] transition-colors">
                <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                  2026-03-05
                </td>
                <td className="py-3 px-4 text-sm font-medium text-[var(--color-text-primary)]">
                  0
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                  Next Quarter Payment
                </td>
              </tr>
              <tr className="hover:bg-[var(--color-bg-primary)] transition-colors">
                <td
                  colSpan="3"
                  className="py-8 text-center text-sm text-[var(--color-text-secondary)] italic"
                >
                  No email data for selected range.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Settings
