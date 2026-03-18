import React from 'react'
import { Plus } from 'lucide-react'

const PaymentsHeader = ({ paymentsCount }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Payments ({paymentsCount})</h1>
    </div>
  )
}

export default PaymentsHeader
