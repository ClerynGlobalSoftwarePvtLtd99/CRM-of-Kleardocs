import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchSettings, updateSettings } from '../redux/slices/settingsSlice'
import GeneralSettings from '../components/settings/GeneralSettings'
import EmailCount from '../components/settings/EmailCount'

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

const Settings = () => {
  const dispatch = useAppDispatch()
  const { settings, settingsLoading, updateLoading } = useAppSelector((state) => state.settings)

  // Local form state, seeded from Redux when settings load
  const [formData, setFormData] = useState({
    invoicePrefix: '',
    invoiceStartingNumber: '',
    emailFromName: '',
    fromEmail: '',
    invoiceTemplate: '',
    recurringInvoiceTemplate: '',
    gstTemplate: '',
    serviceListTemplate: '',
    ptaxTemplate: '',
    websiteTemplate: '',
    startupIndiaTemplate: '',
    isoTemplate: '',
    inc20Template: '',
  })

  // Load settings from backend on mount
  useEffect(() => {
    dispatch(fetchSettings())
  }, [dispatch])

  // Seed form when Redux state loads
  useEffect(() => {
    if (settings) {
      setFormData({
        invoicePrefix: settings.invoicePrefix || '',
        invoiceStartingNumber: settings.invoiceStartingNumber ?? '',
        emailFromName: settings.emailFromName || '',
        fromEmail: settings.fromEmail || '',
        invoiceTemplate: settings.invoiceTemplate || '',
        recurringInvoiceTemplate: settings.recurringInvoiceTemplate || '',
        gstTemplate: settings.gstTemplate || '',
        serviceListTemplate: settings.serviceListTemplate || '',
        ptaxTemplate: settings.ptaxTemplate || '',
        websiteTemplate: settings.websiteTemplate || '',
        startupIndiaTemplate: settings.startupIndiaTemplate || '',
        isoTemplate: settings.isoTemplate || '',
        inc20Template: settings.inc20Template || '',
      })
    }
  }, [settings])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleUpdateSettings = () => {
    dispatch(updateSettings(formData))
      .unwrap()
      .then(() => {
        toast.success('Settings updated successfully', {
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-bg-tertiary)',
          },
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        })
      })
      .catch((err) => {
        toast.error(err || 'Failed to update settings', {
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
          },
        })
      })
  }

  return (
    <div className="w-full h-full space-y-8 pb-10">
      <GeneralSettings
        formData={formData}
        handleChange={handleChange}
        handleUpdateSettings={handleUpdateSettings}
        templateOptions={templateOptions}
        isLoading={settingsLoading}
        isSaving={updateLoading}
      />

      <EmailCount />
    </div>
  )
}

export default Settings
