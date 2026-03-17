import React from 'react'
import { InputGroup, SelectGroup } from './SettingsFormInputs'

const GeneralSettings = ({ formData, handleChange, handleUpdateSettings, templateOptions }) => {
  return (
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
          options={templateOptions}
        />
        <SelectGroup
          label="Recurring Invoice Template"
          id="recurringInvoiceTemplate"
          value={formData.recurringInvoiceTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 4 */}
        <SelectGroup
          label="GST template(2nd for every month)"
          id="gstTemplate"
          value={formData.gstTemplate}
          onChange={handleChange}
          options={templateOptions}
        />
        <SelectGroup
          label="Service List Template(After 2 days)"
          id="serviceListTemplate"
          value={formData.serviceListTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 5 */}
        <SelectGroup
          label="PTax Template (after 7 days compliance start)"
          id="ptaxTemplate"
          value={formData.ptaxTemplate}
          onChange={handleChange}
          options={templateOptions}
        />
        <SelectGroup
          label="Website Template(After 10 days)"
          id="websiteTemplate"
          value={formData.websiteTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 6 */}
        <SelectGroup
          label="StartupIndia Template (after 15 days of comliances start)"
          id="startupIndiaTemplate"
          value={formData.startupIndiaTemplate}
          onChange={handleChange}
          options={templateOptions}
        />
        <SelectGroup
          label="ISO Template(after 20 days of compliance start)"
          id="isoTemplate"
          value={formData.isoTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 7 */}
        <SelectGroup
          label="INC20 Template (after 120 and 150 days of incorporation)"
          id="inc20Template"
          value={formData.inc20Template}
          onChange={handleChange}
          options={templateOptions}
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
  )
}

export default GeneralSettings
