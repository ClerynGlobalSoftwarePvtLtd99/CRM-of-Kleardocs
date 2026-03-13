import React, { useState } from 'react'
import RecurringInvoicesHeader from '../components/recurringInvoices/RecurringInvoicesHeader'
import RecurringInvoicesFilters from '../components/recurringInvoices/RecurringInvoicesFilters'
import RecurringInvoicesTable from '../components/recurringInvoices/RecurringInvoicesTable'

const INITIAL_INVOICES = [
  {
    id: 1,
    created: '12th Mar 2026 5:19 pm',
    customerName: "MATATRON'S PROTOCOL PRIVATE LIMITED",
    customerCompany: "MATATRON'S PROTOCOL PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '12th Mar 2026',
    endDate: '12th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '12th Jun 2026',
    status: 'Active',
    customerId: '69b2a8157ee9313f5f049b56'
  },
  {
    id: 2,
    created: '11th Mar 2026 5:27 pm',
    customerName: "TIARATECH WEARABLE PRIVATE LIMITED",
    customerCompany: "TIARATECH WEARABLE PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '11th Mar 2026',
    endDate: '11th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '11th Jun 2026',
    status: 'Active',
    customerId: '69b1580d65b9911c9c0b7a5a'
  },
  {
    id: 3,
    created: '11th Mar 2026 2:49 pm',
    customerName: "KARYOSETU TECHNOLOGIES PRIVATE LIMITED",
    customerCompany: "KARYOSETU TECHNOLOGIES PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '11th Mar 2026',
    endDate: '11th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '11th Jun 2026',
    status: 'Active',
    customerId: '69b1326a65b9911c9c0b79a5'
  },
  {
    id: 4,
    created: '10th Mar 2026 10:52 am',
    customerName: "UMAMI MILK PRIVATE LIMITED",
    customerCompany: "UMAMI MILK PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '10th Mar 2026',
    endDate: '10th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '10th Jun 2026',
    status: 'Active',
    customerId: '69afaa257ee9313f5f049541'
  },
  {
    id: 5,
    created: '9th Mar 2026 1:28 pm',
    customerName: "PROSPERKEY REALTY PRIVATE LIMITED",
    customerCompany: "PROSPERKEY REALTY PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '9th Mar 2026',
    endDate: '9th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '9th Jun 2026',
    status: 'Active',
    customerId: '69ae7d657ee9313f5f04913f'
  },
  {
    id: 6,
    created: '7th Mar 2026 12:03 pm',
    customerName: "RKS GLOBAL AI CONSULTING PRIVATE LIMITED",
    customerCompany: "RKS GLOBAL AI CONSULTING PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '7th Mar 2026',
    endDate: '7th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '7th Jun 2026',
    status: 'Active',
    customerId: '69abc6a87ee9313f5f048ec6'
  },
  {
    id: 7,
    created: '6th Mar 2026 6:54 pm',
    customerName: "ABHIRAM DELICACY PRIVATE LIMITED",
    customerCompany: "ABHIRAM DELICACY PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '6th Mar 2026',
    endDate: '6th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '6th Jun 2026',
    status: 'Active',
    customerId: '69aad42965b9911c9c0b70d1'
  },
  {
    id: 8,
    created: '6th Mar 2026 10:55 am',
    customerName: "KONGE'S ENTERTAINMENT PRIVATE LIMITED",
    customerCompany: "KONGE'S ENTERTAINMENT PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '6th Mar 2026',
    endDate: '6th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '6th Jun 2026',
    status: 'Active',
    customerId: '69aa64b47ee9313f5f048a0b'
  },
  {
    id: 9,
    created: '5th Mar 2026 12:51 pm',
    customerName: "PAPER SKY PRIVATE LIMITED",
    customerCompany: "PAPER SKY PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '5th Mar 2026',
    endDate: '5th Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '5th Jun 2026',
    status: 'Active',
    customerId: '69a92e477ee9313f5f04860f'
  },
  {
    id: 10,
    created: '2nd Mar 2026 1:27 pm',
    customerName: "Indbuy Global Private Limited",
    customerCompany: "Indbuy Global Private Limited",
    linkedServices: 'Annual Compliance',
    startDate: '2nd Mar 2026',
    endDate: '2nd Mar 2027',
    interval: '3 Months',
    nextInvoiceDate: '2nd Jun 2026',
    status: 'Active',
    customerId: '69a53f157ee9313f5f04730a'
  },
  {
    id: 11,
    created: '28th Feb 2026 6:24 pm',
    customerName: "CRAVENEST FOODS PRIVATE LIMITED",
    customerCompany: "CRAVENEST FOODS PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '28th Feb 2026',
    endDate: '28th Feb 2027',
    interval: '3 Months',
    nextInvoiceDate: '28th May 2026',
    status: 'Active',
    customerId: '69a2b1cb65b9911c9c0b52fd'
  },
  {
    id: 12,
    created: '28th Feb 2026 6:18 pm',
    customerName: "CRAVENEST FOODS PRIVATE LIMITED",
    customerCompany: "CRAVENEST FOODS PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '28th Feb 2026',
    endDate: '28th Feb 2027',
    interval: '3 Months',
    nextInvoiceDate: '28th May 2026',
    status: 'Inactive',
    customerId: '69a2b1cb65b9911c9c0b52fd_2'
  },
  {
    id: 13,
    created: '28th Feb 2026 4:21 pm',
    customerName: "INFINITYXGRO PRIVATE LIMITED",
    customerCompany: "INFINITYXGRO PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '28th Feb 2026',
    endDate: '28th Feb 2027',
    interval: '3 Months',
    nextInvoiceDate: '28th May 2026',
    status: 'Active',
    customerId: '69a2c85765b9911c9c0b5503'
  },
  {
    id: 14,
    created: '28th Feb 2026 3:02 pm',
    customerName: "CRAVENEST FOODS PRIVATE LIMITED",
    customerCompany: "CRAVENEST FOODS PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '28th Feb 2026',
    endDate: '28th Feb 2027',
    interval: '3 Months',
    nextInvoiceDate: '28th May 2026',
    status: 'Inactive',
    customerId: '69a2b1cb65b9911c9c0b52fd_3'
  },
  {
    id: 15,
    created: '27th Feb 2026 6:45 pm',
    customerName: "COWMAN AGRO INDUSTRIES PRIVATE LIMITED",
    customerCompany: "COWMAN AGRO INDUSTRIES PRIVATE LIMITED",
    linkedServices: 'Annual Compliance',
    startDate: '27th Feb 2026',
    endDate: '27th Feb 2027',
    interval: '3 Months',
    nextInvoiceDate: '27th May 2026',
    status: 'Active',
    customerId: '69a198ba7ee9313f5f0469c1'
  }
]

const RecurringInvoices = () => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateType, setDateType] = useState('')
  const [status, setStatus] = useState('')

  const handleFilter = () => {
    let filteredData = INITIAL_INVOICES

    if (searchTerm.trim() !== '') {
      const lowerCaseSearch = searchTerm.toLowerCase()
      filteredData = filteredData.filter(
        (inv) =>
          inv.customerName.toLowerCase().includes(lowerCaseSearch) ||
          inv.customerCompany.toLowerCase().includes(lowerCaseSearch)
      )
    }

    if (status !== '') {
      filteredData = filteredData.filter((inv) => inv.status.toLowerCase() === status.toLowerCase())
    }

    setInvoices(filteredData)
  }

  const handleClear = () => {
    setSearchTerm('')
    setDateType('')
    setStatus('')
    setInvoices(INITIAL_INVOICES)
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      <RecurringInvoicesHeader counts={invoices.length} />

      <RecurringInvoicesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateType={dateType}
        setDateType={setDateType}
        status={status}
        setStatus={setStatus}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <RecurringInvoicesTable invoices={invoices} />
    </div>
  )
}

export default RecurringInvoices
