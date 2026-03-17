import React, { useState } from 'react'
import InvoicesHeader from '../components/invoices/InvoicesHeader'
import InvoicesFilters from '../components/invoices/InvoicesFilters'
import InvoicesTable from '../components/invoices/InvoicesTable'

const INITIAL_INVOICES = [
  {
    id: 1,
    invoiceNo: 'INV-24-2510904',
    invoiceDate: '13th Mar 2026',
    customerName: 'RECEPTA HEALTHCARE PRIVATE LIMITED',
    customerCompany: 'RECEPTA HEALTHCARE PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '69b3b40d7ee9313f5f049dac',
    invoiceId: '69b3b47e7ee9313f5f049dd3',
  },
  {
    id: 2,
    invoiceNo: 'INV-24-2510903',
    invoiceDate: '13th Mar 2026',
    customerName: 'MITTIMART COMMERCE PRIVATE LIMITED',
    customerCompany: 'MITTIMART COMMERCE PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '693d234c9f8d941a6c848da0',
    invoiceId: '693d234c9f8d941a6c848da0_inv',
  },
  {
    id: 3,
    invoiceNo: 'INV-24-2510902',
    invoiceDate: '13th Mar 2026',
    customerName: 'Cosmoloop Private Limited',
    customerCompany: 'Cosmoloop Private Limited',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '684c270f8660e5f4fc297d97',
    invoiceId: '684c270f8660e5f4fc297d97_inv',
  },
  {
    id: 4,
    invoiceNo: 'INV-24-2510901',
    invoiceDate: '13th Mar 2026',
    customerName: 'HINDVEDGE HOSPITALITY SERVICES PRIVATE LIMITED',
    customerCompany: 'HINDVEDGE HOSPITALITY SERVICES PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '684bf3f0a08bd204e84723d6',
    invoiceId: '684bf3f0a08bd204e84723d6_inv',
  },
  {
    id: 5,
    invoiceNo: 'INV-24-2510900',
    invoiceDate: '13th Mar 2026',
    customerName: 'NEXSPEED DIGITAL PRIVATE LIMITED',
    customerCompany: 'NEXSPEED DIGITAL PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '684be7eaa08bd204e847230b',
    invoiceId: '684be7eaa08bd204e847230b_inv',
  },
  {
    id: 6,
    invoiceNo: 'INV-24-2510899',
    invoiceDate: '13th Mar 2026',
    customerName: 'AKXA CONSTRUCTION & BUILDERS PRIVATE LIMITED',
    customerCompany: 'AKXA CONSTRUCTION & BUILDERS PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '684bbec7a08bd204e847226a',
    invoiceId: '684bbec7a08bd204e847226a_inv',
  },
  {
    id: 7,
    invoiceNo: 'INV-24-2510898',
    invoiceDate: '13th Mar 2026',
    customerName: 'CROSSMEET SOFTWARE PRIVATE LIMITED',
    customerCompany: 'CROSSMEET SOFTWARE PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d2e5a703d6eddf9510163e',
    invoiceId: '67d2e5a703d6eddf9510163e_inv',
  },
  {
    id: 8,
    invoiceNo: 'INV-24-2510897',
    invoiceDate: '13th Mar 2026',
    customerName: 'PRIMEVA BIOSCIENCE PRIVATE LIMITED',
    customerCompany: 'PRIMEVA BIOSCIENCE PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d2af4303d6eddf95101541',
    invoiceId: '67d2af4303d6eddf95101541_inv',
  },
  {
    id: 9,
    invoiceNo: 'INV-24-2510896',
    invoiceDate: '13th Mar 2026',
    customerName: 'REVENTNEU PRIVATE LIMITED',
    customerCompany: 'REVENTNEU PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d2a27903d6eddf9510147b',
    invoiceId: '67d2a27903d6eddf9510147b_inv',
  },
  {
    id: 10,
    invoiceNo: 'INV-24-2510895',
    invoiceDate: '13th Mar 2026',
    customerName: 'BIZAMIGO CONSULTING PRIVATE LIMITED',
    customerCompany: 'BIZAMIGO CONSULTING PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d2977551ff1c98882bb291',
    invoiceId: '67d2977551ff1c98882bb291_inv',
  },
  {
    id: 11,
    invoiceNo: 'INV-24-2510894',
    invoiceDate: '13th Mar 2026',
    customerName: 'AMORERP PRIVATE LIMITED',
    customerCompany: 'AMORERP PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d285c903d6eddf95101384',
    invoiceId: '67d285c903d6eddf95101384_inv',
  },
  {
    id: 12,
    invoiceNo: 'INV-24-2510893',
    invoiceDate: '13th Mar 2026',
    customerName: 'SILVER BRIDGEMARK CONSULTING PRIVATE LIMITED',
    customerCompany: 'SILVER BRIDGEMARK CONSULTING PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d2743551ff1c98882bb149',
    invoiceId: '67d2743551ff1c98882bb149_inv',
  },
  {
    id: 13,
    invoiceNo: 'INV-24-2510892',
    invoiceDate: '13th Mar 2026',
    customerName: 'PALIPRAYAS FOUNDATION',
    customerCompany: 'PALIPRAYAS FOUNDATION',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d266fe51ff1c98882bb0da',
    invoiceId: '67d266fe51ff1c98882bb0da_inv',
  },
  {
    id: 14,
    invoiceNo: 'INV-24-2510891',
    invoiceDate: '12th Mar 2026',
    customerName: 'PRACTOVATE SOLUTIONS PRIVATE LIMITED',
    customerCompany: 'PRACTOVATE SOLUTIONS PRIVATE LIMITED',
    linkedService: 'MSME',
    price: '₹ 6000',
    gst: '₹ 0',
    total: '₹ 6000',
    due: '₹ 6000',
    customerId: '67c7ee9151ff1c98882b988b',
    invoiceId: '67c7ee9151ff1c98882b988b_inv',
  },
  {
    id: 15,
    invoiceNo: 'INV-24-2510890',
    invoiceDate: '12th Mar 2026',
    customerName: "MATATRON'S PROTOCOL PRIVATE LIMITED",
    customerCompany: "MATATRON'S PROTOCOL PRIVATE LIMITED",
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '69b2a8157ee9313f5f049b56',
    invoiceId: '69b2a8157ee9313f5f049b56_inv',
  },
  {
    id: 16,
    invoiceNo: 'INV-24-2510889',
    invoiceDate: '12th Mar 2026',
    customerName: 'TRUHIRE TECHNOLOGIES (OPC) PRIVATE LIMITED',
    customerCompany: 'TRUHIRE TECHNOLOGIES (OPC) PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '68eb5c6e83bcdcfffa471035',
    invoiceId: '68eb5c6e83bcdcfffa471035_inv',
  },
  {
    id: 17,
    invoiceNo: 'INV-24-2510888',
    invoiceDate: '12th Mar 2026',
    customerName: 'Edubrilliance Indian Foundation',
    customerCompany: 'Edubrilliance Indian Foundation',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '68c3c0aabb58fdcfd9956f8a',
    invoiceId: '68c3c0aabb58fdcfd9956f8a_inv',
  },
  {
    id: 18,
    invoiceNo: 'INV-24-2510887',
    invoiceDate: '12th Mar 2026',
    customerName: 'PRUVE TECHNOLOGIES PRIVATE LIMITED',
    customerCompany: 'PRUVE TECHNOLOGIES PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '684adf44a08bd204e84721c6',
    invoiceId: '684adf44a08bd204e84721c6_inv',
  },
  {
    id: 19,
    invoiceNo: 'INV-24-2510886',
    invoiceDate: '12th Mar 2026',
    customerName: 'Nomio Foodtech Private Limited',
    customerCompany: 'Nomio Foodtech Private Limited',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '684a6f1fa08bd204e8471ef4',
    invoiceId: '684a6f1fa08bd204e8471ef4_inv',
  },
  {
    id: 20,
    invoiceNo: 'INV-24-2510885',
    invoiceDate: '12th Mar 2026',
    customerName: 'SOLIDCLOUD (OPC) PRIVATE LIMITED',
    customerCompany: 'SOLIDCLOUD (OPC) PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d195a203d6eddf951010db',
    invoiceId: '67d195a203d6eddf951010db_inv',
  },
  {
    id: 21,
    invoiceNo: 'INV-24-2510884',
    invoiceDate: '12th Mar 2026',
    customerName: 'RLSS ENTERPRISES (OPC) PRIVATE LIMITED',
    customerCompany: 'RLSS ENTERPRISES (OPC) PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d1769e51ff1c98882bae67',
    invoiceId: '67d1769e51ff1c98882bae67_inv',
  },
  {
    id: 22,
    invoiceNo: 'INV-24-2510883',
    invoiceDate: '12th Mar 2026',
    customerName: 'MONKMAGIC DESSERTS PRIVATE LIMITED',
    customerCompany: 'MONKMAGIC DESSERTS PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d1425703d6eddf95100f3a',
    invoiceId: '67d1425703d6eddf95100f3a_inv',
  },
  {
    id: 23,
    invoiceNo: 'INV-24-2510882',
    invoiceDate: '12th Mar 2026',
    customerName: 'CHETTY EXPORTS PRIVATE LIMITED',
    customerCompany: 'CHETTY EXPORTS PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '67d11c8903d6eddf95100dbe',
    invoiceId: '67d11c8903d6eddf95100dbe_inv',
  },
  {
    id: 24,
    invoiceNo: 'INV-24-2510881',
    invoiceDate: '11th Mar 2026',
    customerName: 'TIARATECH WEARABLE PRIVATE LIMITED',
    customerCompany: 'TIARATECH WEARABLE PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '69b1580d65b9911c9c0b7a5a',
    invoiceId: '69b1580d65b9911c9c0b7a5a_inv',
  },
  {
    id: 25,
    invoiceNo: 'INV-24-2510880',
    invoiceDate: '11th Mar 2026',
    customerName: 'KARYOSETU TECHNOLOGIES PRIVATE LIMITED',
    customerCompany: 'KARYOSETU TECHNOLOGIES PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '69b1326a65b9911c9c0b79a5',
    invoiceId: '69b1326a65b9911c9c0b79a5_inv',
  },
  {
    id: 26,
    invoiceNo: 'INV-24-2510879',
    invoiceDate: '11th Mar 2026',
    customerName: 'ANANTBHUMI CREATION PRIVATE LIMITED',
    customerCompany: 'ANANTBHUMI CREATION PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '693a810a9f8d941a6c848978',
    invoiceId: '693a810a9f8d941a6c848978_inv',
  },
  {
    id: 27,
    invoiceNo: 'INV-24-2510878',
    invoiceDate: '11th Mar 2026',
    customerName: 'HUMANVISTA CONSULTANCY PRIVATE LIMITED',
    customerCompany: 'HUMANVISTA CONSULTANCY PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '693a61829f8d941a6c848900',
    invoiceId: '693a61829f8d941a6c848900_inv',
  },
  {
    id: 28,
    invoiceNo: 'INV-24-2510877',
    invoiceDate: '11th Mar 2026',
    customerName: 'SRIKARMAKAR UDYOG (OPC) PRIVATE LIMITED',
    customerCompany: 'SRIKARMAKAR UDYOG (OPC) PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '693a5750aa355b4052bfc38c',
    invoiceId: '693a5750aa355b4052bfc38c_inv',
  },
  {
    id: 29,
    invoiceNo: 'INV-24-2510876',
    invoiceDate: '11th Mar 2026',
    customerName: 'QUBACE MARKETS PRIVATE LIMITED',
    customerCompany: 'QUBACE MARKETS PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '693a536baa355b4052bfc354',
    invoiceId: '693a536baa355b4052bfc354_inv',
  },
  {
    id: 30,
    invoiceNo: 'INV-24-2510875',
    invoiceDate: '11th Mar 2026',
    customerName: 'XPETO TECHNOLOGIES PRIVATE LIMITED',
    customerCompany: 'XPETO TECHNOLOGIES PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '693a4d009f8d941a6c84877b',
    invoiceId: '693a4d009f8d941a6c84877b_inv',
  },
  {
    id: 31,
    invoiceNo: 'INV-24-2510874',
    invoiceDate: '11th Mar 2026',
    customerName: 'ETOILES SOLUTION PRIVATE LIMITED',
    customerCompany: 'ETOILES SOLUTION PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '68c2dbf0bb58fdcfd9956e0b',
    invoiceId: '68c2dbf0bb58fdcfd9956e0b_inv',
  },
  {
    id: 32,
    invoiceNo: 'INV-24-2510873',
    invoiceDate: '11th Mar 2026',
    customerName: 'CREISHAN REALTY PRIVATE LIMITED',
    customerCompany: 'CREISHAN REALTY PRIVATE LIMITED',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '68c278eebb58fdcfd9956d82',
    invoiceId: '68c278eebb58fdcfd9956d82_inv',
  },
  {
    id: 33,
    invoiceNo: 'INV-24-2510872',
    invoiceDate: '11th Mar 2026',
    customerName: 'Butterslate Private Limited',
    customerCompany: 'Butterslate Private Limited',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '68495fa3a08bd204e8471bed',
    invoiceId: '68495fa3a08bd204e8471bed_inv',
  },
  {
    id: 34,
    invoiceNo: 'INV-24-2510871',
    invoiceDate: '11th Mar 2026',
    customerName: 'Nexaforge Ventures Private Limited',
    customerCompany: 'Nexaforge Ventures Private Limited',
    linkedService: 'Annual Compliance',
    price: '₹ 2000',
    gst: '₹ 0',
    total: '₹ 2000',
    due: '₹ 2000',
    customerId: '68493e938660e5f4fc297498',
    invoiceId: '68493e938660e5f4fc297498_inv',
  },
]

const Invoices = () => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [searchTerm, setSearchTerm] = useState('')
  const [type, setType] = useState('')
  const [func, setFunc] = useState('')
  const [value, setValue] = useState('')

  const extractNumber = (str) => {
    return parseFloat(str.replace(/[^0-9.-]+/g, ''))
  }

  const handleFilter = () => {
    let filteredData = INITIAL_INVOICES

    if (searchTerm.trim() !== '') {
      const lowerCaseSearch = searchTerm.toLowerCase()
      filteredData = filteredData.filter(
        (inv) =>
          inv.customerName.toLowerCase().includes(lowerCaseSearch) ||
          inv.customerCompany.toLowerCase().includes(lowerCaseSearch) ||
          inv.invoiceNo.toLowerCase().includes(lowerCaseSearch)
      )
    }

    if (type && func && value) {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        filteredData = filteredData.filter((inv) => {
          let fieldVal = 0
          if (type === 'Price') fieldVal = extractNumber(inv.price)
          else if (type === 'GST') fieldVal = extractNumber(inv.gst)
          else if (type === 'Total') fieldVal = extractNumber(inv.total)
          else if (type === 'Due') fieldVal = extractNumber(inv.due)

          if (func === '>=') return fieldVal >= numValue
          if (func === '<=') return fieldVal <= numValue
          if (func === '=') return fieldVal === numValue
          return true
        })
      }
    }

    setInvoices(filteredData)
  }

  const handleClear = () => {
    setSearchTerm('')
    setType('')
    setFunc('')
    setValue('')
    setInvoices(INITIAL_INVOICES)
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      <InvoicesHeader counts={2295} />

      <InvoicesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        type={type}
        setType={setType}
        func={func}
        setFunc={setFunc}
        value={value}
        setValue={setValue}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <InvoicesTable invoices={invoices} />
    </div>
  )
}

export default Invoices
