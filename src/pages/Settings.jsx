import React, { useState } from 'react'
import toast from 'react-hot-toast'
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
      <GeneralSettings 
        formData={formData}
        handleChange={handleChange}
        handleUpdateSettings={handleUpdateSettings}
        templateOptions={templateOptions}
      />
      
      <EmailCount />
    </div>
  )
}

export default Settings
