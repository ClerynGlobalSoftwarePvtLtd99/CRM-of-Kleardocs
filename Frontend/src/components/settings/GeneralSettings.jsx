import React from 'react'
import { InputGroup, SelectGroup } from './SettingsFormInputs'
import { Loader2 } from 'lucide-react'

const GeneralSettings = ({
  formData,
  handleChange,
  handleUpdateSettings,
  templateOptions,
  isLoading,
  isSaving,
}) => {
  if (isLoading) {
    return (
      <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">
          Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="h-4 w-32 rounded bg-[var(--color-bg-tertiary)] animate-pulse" />
              <div className="h-10 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    )
  }

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
          label="Invoice Starting Number"
          id="invoiceStartingNumber"
          type="number"
          value={formData.invoiceStartingNumber}
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
          type="email"
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
          label="GST Template (2nd of every month)"
          id="gstTemplate"
          value={formData.gstTemplate}
          onChange={handleChange}
          options={templateOptions}
        />
        <SelectGroup
          label="Service List Template (After 2 days)"
          id="serviceListTemplate"
          value={formData.serviceListTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 5 */}
        <SelectGroup
          label="PTax Template (after 7 days)"
          id="ptaxTemplate"
          value={formData.ptaxTemplate}
          onChange={handleChange}
          options={templateOptions}
        />
        <SelectGroup
          label="Website Template (After 10 days)"
          id="websiteTemplate"
          value={formData.websiteTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 6 */}
        <SelectGroup
          label="StartupIndia Template (after 15 days)"
          id="startupIndiaTemplate"
          value={formData.startupIndiaTemplate}
          onChange={handleChange}
          options={templateOptions}
        />
        <SelectGroup
          label="ISO Template (after 20 days)"
          id="isoTemplate"
          value={formData.isoTemplate}
          onChange={handleChange}
          options={templateOptions}
        />

        {/* Row 7 – full width */}
        <SelectGroup
          label="INC20 Template (after 120 and 150 days)"
          id="inc20Template"
          value={formData.inc20Template}
          onChange={handleChange}
          options={templateOptions}
          fullWidth
        />

        {/* Firm Details Section */}
        <div className="col-span-1 md:col-span-2 pt-6 border-t border-[var(--color-bg-tertiary)] mt-2">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
            Firm Details (For Reports)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <InputGroup
              label="Firm Name"
              id="firmName"
              value={formData.firmName}
              onChange={handleChange}
            />
            <InputGroup
              label="Firm Registration Number (FRN)"
              id="firmRegistrationNumber"
              value={formData.firmRegistrationNumber}
              onChange={handleChange}
            />
            <InputGroup
              label="Firm Address"
              id="firmAddress"
              value={formData.firmAddress}
              onChange={handleChange}
              fullWidth
            />
            <InputGroup
              label="Proprietor/Partner Name"
              id="proprietorName"
              value={formData.proprietorName}
              onChange={handleChange}
            />
            <InputGroup
              label="Membership Number"
              id="membershipNumber"
              value={formData.membershipNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="col-span-1 md:col-span-2 mt-4">
          <button
            onClick={handleUpdateSettings}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-yellow-500 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Update Settings'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

export default GeneralSettings
