import React, { useState } from 'react'
import FinancialYearSection from '../components/complianceSettings/FinancialYearSection'
import AnnualComplianceSection from '../components/complianceSettings/AnnualComplianceSection'

const ComplianceSettings = () => {
  // Shared state that Section 1 manages and Section 2 reads
  const [financialYears, setFinancialYears] = useState([
    { id: '1', year: '2023-2024' },
    { id: '2', year: '2024-2025' },
    { id: '3', year: '2025-2026' },
  ])

  return (
    <div className="w-full h-full space-y-8 pb-10 fade-in animate-in duration-300">
      <FinancialYearSection
        financialYears={financialYears}
        setFinancialYears={setFinancialYears}
      />

      <AnnualComplianceSection financialYears={financialYears} />
    </div>
  )
}

export default ComplianceSettings
