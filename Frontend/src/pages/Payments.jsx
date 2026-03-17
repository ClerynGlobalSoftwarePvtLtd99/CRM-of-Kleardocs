import React, { useState } from 'react'
import PaymentsHeader from '../components/payments/PaymentsHeader'
import PaymentsFilters from '../components/payments/PaymentsFilters'
import PaymentsTable from '../components/payments/PaymentsTable'

const PAYMENT_TYPES = ['Cash', 'Card', 'UPI', 'Net Banking']

const INITIAL_PAYMENTS = [
  {
    id: 1,
    payDate: '2nd Mar 2026 2:30 pm',
    customerName: 'Indbuy Global Private Limited',
    customerCompany: 'Indbuy Global Private Limited',
    invoiceNo: 'INV-24-2510796',
    paymentType: 'UPI',
    amount: '₹ 3250',
    customerId: '69a53f157ee9313f5f04730a',
    invoiceId: '69a543007ee9313f5f047332',
  },
  {
    id: 2,
    payDate: '17th Feb 2026 4:36 pm',
    customerName: 'SETH SANVARIYA PRIVATE LIMITED',
    customerCompany: 'SETH SANVARIYA PRIVATE LIMITED',
    invoiceNo: 'INV-24-2510583',
    paymentType: 'UPI',
    amount: '₹ 2000',
    customerId: '6985e7db65b9911c9c0b1efd',
    invoiceId: '6985e82d65b9911c9c0b1f25',
  },
  {
    id: 3,
    payDate: '12th Feb 2026 2:54 pm',
    customerName: 'ARAJ MEDIA PRIVATE LIMITED',
    customerCompany: 'ARAJ MEDIA PRIVATE LIMITED',
    invoiceNo: 'INV-24-2510624',
    paymentType: 'UPI',
    amount: '₹ 1500',
    customerId: '698d975d7ee9313f5f04421a',
    invoiceId: '698d97fc7ee9313f5f04428c',
  },
  {
    id: 4,
    payDate: '10th Feb 2026 11:15 am',
    customerName: 'TechNova Solutions',
    customerCompany: 'TechNova Solutions Ltd',
    invoiceNo: 'INV-24-2510620',
    paymentType: 'Net Banking',
    amount: '₹ 45000',
    customerId: 'dummy4',
    invoiceId: 'dummyinv4',
  },
  {
    id: 5,
    payDate: '8th Feb 2026 4:20 pm',
    customerName: 'Global Trade Corp',
    customerCompany: 'Global Trade Corporation',
    invoiceNo: 'INV-24-2510615',
    paymentType: 'Card',
    amount: '₹ 12000',
    customerId: 'dummy5',
    invoiceId: 'dummyinv5',
  },
  {
    id: 6,
    payDate: '5th Feb 2026 9:00 am',
    customerName: 'Aero Dynamics',
    customerCompany: 'Aero Dynamics Pvt Ltd',
    invoiceNo: 'INV-24-2510601',
    paymentType: 'Cash',
    amount: '₹ 500',
    customerId: 'dummy6',
    invoiceId: 'dummyinv6',
  },
  {
    id: 7,
    payDate: '1st Feb 2026 3:45 pm',
    customerName: 'Zenith Enterpises',
    customerCompany: 'Zenith Enterpises LLC',
    invoiceNo: 'INV-24-2510590',
    paymentType: 'UPI',
    amount: '₹ 8500',
    customerId: 'dummy7',
    invoiceId: 'dummyinv7',
  },
  {
    id: 8,
    payDate: '28th Jan 2026 10:30 am',
    customerName: 'Future Web Devs',
    customerCompany: 'Future Web Devs',
    invoiceNo: 'INV-24-2510550',
    paymentType: 'Net Banking',
    amount: '₹ 32000',
    customerId: 'dummy8',
    invoiceId: 'dummyinv8',
  },
  {
    id: 9,
    payDate: '25th Jan 2026 1:15 pm',
    customerName: 'Blue Sky Media',
    customerCompany: 'Blue Sky Media',
    invoiceNo: 'INV-24-2510545',
    paymentType: 'Card',
    amount: '₹ 15600',
    customerId: 'dummy9',
    invoiceId: 'dummyinv9',
  },
  {
    id: 10,
    payDate: '20th Jan 2026 5:50 pm',
    customerName: 'Eco Green Farm',
    customerCompany: 'Eco Green Farm Co.',
    invoiceNo: 'INV-24-2510530',
    paymentType: 'UPI',
    amount: '₹ 4200',
    customerId: 'dummy10',
    invoiceId: 'dummyinv10',
  },
  {
    id: 11,
    payDate: '15th Jan 2026 11:20 am',
    customerName: 'Apex Logistics',
    customerCompany: 'Apex Logistics Inc.',
    invoiceNo: 'INV-24-2510500',
    paymentType: 'Net Banking',
    amount: '₹ 89000',
    customerId: 'dummy11',
    invoiceId: 'dummyinv11',
  },
  {
    id: 12,
    payDate: '10th Jan 2026 2:10 pm',
    customerName: 'City Lights Retail',
    customerCompany: 'City Lights Retail',
    invoiceNo: 'INV-24-2510480',
    paymentType: 'Cash',
    amount: '₹ 1200',
    customerId: 'dummy12',
    invoiceId: 'dummyinv12',
  },
  {
    id: 13,
    payDate: '5th Jan 2026 9:30 am',
    customerName: 'Nova Software',
    customerCompany: 'Nova Software Pvt Ltd',
    invoiceNo: 'INV-24-2510450',
    paymentType: 'Card',
    amount: '₹ 34500',
    customerId: 'dummy13',
    invoiceId: 'dummyinv13',
  },
  {
    id: 14,
    payDate: '2nd Jan 2026 4:45 pm',
    customerName: 'Prime Builders',
    customerCompany: 'Prime Builders Corp',
    invoiceNo: 'INV-24-2510420',
    paymentType: 'UPI',
    amount: '₹ 7500',
    customerId: 'dummy14',
    invoiceId: 'dummyinv14',
  },
  {
    id: 15,
    payDate: '28th Dec 2025 10:00 am',
    customerName: 'Omega Analytics',
    customerCompany: 'Omega Analytics',
    invoiceNo: 'INV-24-2510400',
    paymentType: 'Net Banking',
    amount: '₹ 55000',
    customerId: 'dummy15',
    invoiceId: 'dummyinv15',
  },
  {
    id: 16,
    payDate: '20th Dec 2025 3:20 pm',
    customerName: 'Silver Cloud',
    customerCompany: 'Silver Cloud IT Support',
    invoiceNo: 'INV-24-2510380',
    paymentType: 'UPI',
    amount: '₹ 2800',
    customerId: 'dummy16',
    invoiceId: 'dummyinv16',
  },
  {
    id: 17,
    payDate: '15th Dec 2025 12:15 pm',
    customerName: 'Sunrise Travel',
    customerCompany: 'Sunrise Travel Agency',
    invoiceNo: 'INV-24-2510350',
    paymentType: 'Card',
    amount: '₹ 18000',
    customerId: 'dummy17',
    invoiceId: 'dummyinv17',
  },
  {
    id: 18,
    payDate: '10th Dec 2025 5:30 pm',
    customerName: 'Pioneer Education',
    customerCompany: 'Pioneer Education Trust',
    invoiceNo: 'INV-24-2510320',
    paymentType: 'Cash',
    amount: '₹ 800',
    customerId: 'dummy18',
    invoiceId: 'dummyinv18',
  },
  {
    id: 19,
    payDate: '5th Dec 2025 11:45 am',
    customerName: 'Alpha Designs',
    customerCompany: 'Alpha Designs Studio',
    invoiceNo: 'INV-24-2510300',
    paymentType: 'UPI',
    amount: '₹ 6500',
    customerId: 'dummy19',
    invoiceId: 'dummyinv19',
  },
  {
    id: 20,
    payDate: '1st Dec 2025 2:00 pm',
    customerName: 'NexGen Health',
    customerCompany: 'NexGen Health Clinics',
    invoiceNo: 'INV-24-2510280',
    paymentType: 'Net Banking',
    amount: '₹ 42000',
    customerId: 'dummy20',
    invoiceId: 'dummyinv20',
  },
]

const Payments = () => {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentType, setPaymentType] = useState('')

  const handleFilter = () => {
    let filteredData = INITIAL_PAYMENTS

    if (searchTerm.trim() !== '') {
      const lowerCaseSearch = searchTerm.toLowerCase()
      filteredData = filteredData.filter(
        (payment) =>
          payment.customerName.toLowerCase().includes(lowerCaseSearch) ||
          payment.customerCompany.toLowerCase().includes(lowerCaseSearch) ||
          payment.invoiceNo.toLowerCase().includes(lowerCaseSearch)
      )
    }

    if (paymentType !== '') {
      filteredData = filteredData.filter(
        (payment) => payment.paymentType === paymentType
      )
    }

    setPayments(filteredData)
  }

  const handleClear = () => {
    setSearchTerm('')
    setPaymentType('')
    setPayments(INITIAL_PAYMENTS)
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      <PaymentsHeader paymentsCount={payments.length} />

      <PaymentsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        PAYMENT_TYPES={PAYMENT_TYPES}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <PaymentsTable payments={payments} />
    </div>
  )
}

export default Payments
