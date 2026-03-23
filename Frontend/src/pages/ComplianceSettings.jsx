import React, { useState } from 'react'
import FinancialYearSection from '../components/complianceSettings/FinancialYearSection'
import AnnualComplianceSection from '../components/complianceSettings/AnnualComplianceSection'

const ComplianceSettings = () => {
  return (
    <div className="w-full h-full space-y-8 pb-10 fade-in animate-in duration-300">
      <FinancialYearSection />
      <AnnualComplianceSection />
    </div>
  )
}

export default ComplianceSettings
