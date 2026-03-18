import React, { useState, useMemo } from "react";
import { Plus, Download, Building2, Phone, Calendar, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router";
import CustomersFilter from "../components/customers/CustomersFilter";
import NewCustomerModal from "../components/customer-modals/NewCustomerModal";
import CompanyLogo from "../components/common/CompanyLogo";
import toast from "react-hot-toast";

const Customers = () => {
  const navigate = useNavigate();
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  
  const [filters, setFilters] = useState({
    search: "",
    dataType: "onboarding",
    type: "",
    status: "",
    annualcompliance: "",
    gstservices: "",
    taxation: "",
    bookkeeping: ""
  });

  // State for customers
  const [customers, setCustomers] = useState([
    {
      id: "69b53f8665b9911c9c0b8336",
      customerName: "NEBULSOFT TECHNOLOGIA PRIVATE LIMITED",
      phone: "9775520007",
      companyName: "NEBULSOFT TECHNOLOGIA PRIVATE LIMITED",
      type: "Private Limited Company",
      onboardingDate: "14-03-2026",
      incorporationDate: "06-03-2026",
      logo: null,
    },
    {
      id: "2",
      customerName: "KLEARDOCS SOLUTIONS LLP",
      phone: "9876543210",
      companyName: "KLEARDOCS SOLUTIONS LLP",
      type: "LLP",
      onboardingDate: "10-03-2026",
      incorporationDate: "01-03-2026",
      logo: null,
    },
    {
      id: "3",
      customerName: "VIRALITY360 PRIVATE LIMITED",
      phone: "7891858821",
      companyName: "VIRALITY360 PRIVATE LIMITED",
      type: "Private Limited Company",
      onboardingDate: "04-02-2026",
      incorporationDate: "29-12-2025",
      logo: null,
    }
  ]);

  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      const searchMatch = !filters.search || 
        cust.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        cust.phone.includes(filters.search) ||
        cust.companyName.toLowerCase().includes(filters.search.toLowerCase());
      
      const typeMatch = !filters.type || cust.type === filters.type;
      
      return searchMatch && typeMatch;
    });
  }, [filters, customers]);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      dataType: "onboarding",
      type: "",
      status: "",
      annualcompliance: "",
      gstservices: "",
      taxation: "",
      bookkeeping: ""
    });
    toast.success("Filters cleared");
  };

  const handleExport = () => {
    if (filteredCustomers.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["ID", "Customer Name", "Phone", "Company Name", "Type", "Onboarding Date", "Incorporation Date"];
    const csvContent = [
      headers.join(","),
      ...filteredCustomers.map(c => [
        c.id,
        `"${c.customerName}"`,
        c.phone,
        `"${c.companyName}"`,
        `"${c.type}"`,
        `"${c.onboardingDate}"`,
        `"${c.incorporationDate}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Customer data exported successfully!");
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-crm-blue rounded-full"></div>
          <div>
            <h1 className="text-3xl font-normal text-text-primary">Customers ({filteredCustomers.length})</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewCustomerModal(true)}
            className="btn-raised btn-raised-blue text-white px-6 py-3 rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} /> New Customer
          </button>
          <button
            onClick={handleExport}
            className="btn-raised btn-raised-blue text-white px-6 py-3 rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-bg-tertiary hover:bg-bg-tertiary/10 transition-colors"
        >
          <div className="flex items-center gap-2 text-text-primary font-bold uppercase tracking-wider text-sm">
            <Filter size={16} className="text-crm-orange" />
            Filter Section
          </div>
          <div className={`transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>
            <Plus size={16} />
          </div>
        </button>
        {showFilter && (
          <div className="p-6">
            <CustomersFilter 
              filters={filters} 
              setFilters={setFilters} 
              onClear={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* LIST TABLE HEADER (Hidden on mobile) */}
      <div className="hidden lg:grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-4 px-8 py-4 bg-bg-tertiary/30 rounded-t-lg border-x border-t border-bg-tertiary text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
        <span>Logo</span>
        <span>Name</span>
        <span>Phone</span>
        <span>Type</span>
        <span>Onboarding Date</span>
        <span>Incorporation Date</span>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="p-20 text-center bg-bg-secondary border border-bg-tertiary rounded-lg">
            <p className="text-text-secondary italic">No customers found matching your filters.</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const isMatch = filters.search && (
              cust.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
              cust.phone.includes(filters.search) ||
              cust.companyName.toLowerCase().includes(filters.search.toLowerCase())
            );

            return (
              <div
                key={cust.id}
                onClick={() => navigate(`/customer/${cust.id}`)}
                className={`bg-bg-secondary border border-bg-tertiary lg:rounded-none rounded-lg p-6 lg:p-4 lg:grid lg:grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1.5fr] items-center gap-4 hover:border-crm-orange/50 transition-all cursor-pointer group shadow-sm last:rounded-b-lg first:rounded-t-lg ${isMatch ? 'row-highlight' : ''}`}
              >
                {/* Logo */}
                <div className="flex items-center justify-start lg:justify-center mb-4 lg:mb-0">
                  <CompanyLogo name={cust.companyName} size="w-12 h-12" />
                </div>

                {/* Name */}
                <div className="mb-4 lg:mb-0">
                  <span className="block lg:hidden text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Company Name</span>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-crm-blue transition-colors">{cust.companyName}</h3>
                </div>

                {/* Phone */}
                <div className="mb-4 lg:mb-0 flex items-center gap-2">
                  <Phone size={14} className="text-crm-blue lg:hidden" />
                  <div>
                    <span className="block lg:hidden text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Phone</span>
                    <span className="text-sm text-text-primary">{cust.phone}</span>
                  </div>
                </div>

                {/* Type */}
                <div className="mb-4 lg:mb-0">
                  <span className="block lg:hidden text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Type</span>
                  <span className="inline-block px-3 py-1 bg-crm-orange/10 text-crm-orange text-[10px] font-bold rounded border border-crm-orange/20 uppercase">
                    {cust.type}
                  </span>
                </div>

                {/* Dates */}
                <div className="mb-4 lg:mb-0 flex flex-col gap-1">
                  <span className="block lg:hidden text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Onboarding Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-crm-green" />
                    <span className="text-sm text-text-primary">{cust.onboardingDate}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="block lg:hidden text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Incorporation Date</span>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Calendar size={14} />
                    <span className="text-sm">{cust.incorporationDate}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showNewCustomerModal && (
        <NewCustomerModal 
          onClose={() => setShowNewCustomerModal(false)} 
          onAdd={handleAddCustomer}
        />
      )}
    </div>
  );
};

export default Customers;
