import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchDashboardData } from '../redux/slices/dashboardSlice'
import LeadsOverview from '../components/dashboard/LeadsOverview'
import CustomersOverview from '../components/dashboard/CustomersOverview'
import SalesFinance from '../components/dashboard/SalesFinance'
import CompliancesJobs from '../components/dashboard/CompliancesJobs'
import CompareGraphs from '../components/dashboard/CompareGraphs'
import DashboardCharts from '../components/dashboard/DashboardCharts'

const Dashboard = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <LeadsOverview />
      <CustomersOverview />
      <SalesFinance />
      <CompliancesJobs />
      
      {/* Compare Graphs Section */}
      <CompareGraphs />

      {/* Analytics Charts */}
      <DashboardCharts />
    </div>
  )
}

export default Dashboard
