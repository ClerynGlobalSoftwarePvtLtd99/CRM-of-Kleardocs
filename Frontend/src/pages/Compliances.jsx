import React, { useState } from "react";
import CompliancesHeader from "../components/compliances/CompliancesHeader";
import CompliancesFilter from "../components/compliances/CompliancesFilter";
import CompliancesTable from "../components/compliances/CompliancesTable";

const dummyData = [
  {
    id: 1,
    customerName: "Amit Sharma",
    phone: "9876543210",
    company: "ABC Pvt Ltd",
    compliance: "MGT-07",
    expiry: "10/05/2025",
    status: "To Be Done",
    completed: "",
    accountant: "Rahul",
  },
  {
    id: 2,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
  {
    id: 3,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
  {
    id: 4,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
  {
    id: 5,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
  {
    id: 6,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
  {
    id: 7,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
  {
    id: 8,
    customerName: "Priya Singh",
    phone: "9999999999",
    company: "XYZ Ltd",
    compliance: "AOC-04",
    expiry: "02/04/2025",
    status: "Completed",
    completed: "01/04/2025",
    accountant: "Priya",
  },
];

const Compliances = () => {

  const [filters, setFilters] = useState({
    search: "",
    compliance: "",
    status: "",
    accountant: "",
    startDate: null,
    endDate: null,
  });

  const [tableData, setTableData] = useState([]);

  const [financialYear , setFinancialYear] = useState("");

  const handleView = () => {

    if (!financialYear) {
      alert("Please select financial year");
      return;
    }
  
    let filtered = dummyData;
  
    // Search
    if (filters.search) {
      filtered = filtered.filter(
        (d) =>
          d.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
          d.company.toLowerCase().includes(filters.search.toLowerCase()) ||
          d.phone.includes(filters.search)
      );
    }
  
    // Compliance
    if (filters.compliance) {
      filtered = filtered.filter((d) => d.compliance === filters.compliance);
    }
  
    // Status
    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status);
    }
  
    // Accountant
    if (filters.accountant) {
      filtered = filtered.filter((d) => d.accountant === filters.accountant);
    }
  
    setTableData(filtered);
  };

  return (
    <div className="space-y-6">

      <CompliancesHeader
        financialYear = {financialYear}
        setFinancialYear = {setFinancialYear}
        onView = {handleView}
      />

      <CompliancesFilter
        filters={filters}
        setFilters={setFilters}
        onView={handleView}
      />

      <CompliancesTable data={tableData} />

    </div>
  );
};

export default Compliances;