import React, { useState, useMemo, useEffect } from "react";
import { Plus, Download, Building2, Phone, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CustomersFilter from "../components/customers/CustomersFilter";
import ContentLoader from "../components/common/ContentLoader";
import NewCustomerModal from "../components/customers/NewCustomerModal";
import CompanyLogo from "../components/common/CompanyLogo";
import { fetchCustomers, createCustomer } from "../redux/slices/customersSlice";
import toast from "react-hot-toast";

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: customers, loading, error } = useSelector((state) => state.customers);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  
  const [filters, setFilters] = useState({
    search: "",
    dataType: "onboarding",
    type: "",
    status: "",
    activeService: ""
  });

  // Fetch customers on component mount and when filters change
  useEffect(() => {
    const queryParams = {
      search: filters.search || undefined,
      type: filters.type || undefined,
      activeService: filters.activeService || undefined,
      page: 1,
      limit: 50
    };
    
    // console.log('Fetching customers with params:', queryParams);
    dispatch(fetchCustomers(queryParams));
  }, [dispatch, filters.search, filters.type, filters.activeService]);

  // Debug customers data
  useEffect(() => {
    // console.log('Customers data from Redux:', customers);
  }, [customers]);

  const handleAddCustomer = async (customerData) => {
    try {
      const result = await dispatch(createCustomer(customerData));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Customer added successfully!');
        setShowNewCustomerModal(false);
      } else {
        toast.error('Failed to add customer');
      }
    } catch (error) {
      toast.error('Failed to add customer');
    }
  };

  const filteredCustomers = useMemo(() => {
    // Since we're fetching from backend with filters, we can use the customers directly
    return customers || [];
  }, [customers]);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      dataType: "onboarding",
      type: "",
      status: "",
      activeService: ""
    });
    toast.success("Filters cleared");
  };

  const handleExport = () => {
    if (filteredCustomers.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["ID", "Name", "Phone", "Company Name", "Type", "GST", "State", "Address", "Onboarding Date", "Incorporation Date"];
    const csvContent = [
      headers.join(","),
      ...filteredCustomers.map(c => [
        c._id || c.id,
        `"${c.name || c.customerName}"`,
        c.phone || "",
        `"${c.companyName || ""}"`,
        `"${c.type || ""}"`,
        `"${c.gst || ""}"`,
        `"${c.state || ""}"`,
        `"${c.address || ""}"`,
        `"${c.onboardingDate ? new Date(c.onboardingDate).toLocaleDateString('en-IN') : ""}"`,
        `"${c.incorporationDate ? new Date(c.incorporationDate).toLocaleDateString('en-IN') : ""}"`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader message="Fetching customers..." />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

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
            disabled={loading || filteredCustomers.length === 0}
            className="btn-raised btn-raised-blue text-white px-6 py-3 rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <CustomersFilter 
        filters={filters} 
        setFilters={setFilters} 
        onClear={handleClearFilters}
      />

      {/* LIST SECTION (Scrollable Table) */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden shadow-sm flex flex-col h-[65vh] min-h-[400px]">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-bg-tertiary flex-1 px-4 text-text-primary">
          <table className="w-full text-left relative" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
            <thead>
              <tr className="text-text-secondary text-[10px] sm:text-xs uppercase tracking-wider font-black">
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)]">Logo</th>
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)]">Name</th>
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)]">Phone</th>
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)]">Type</th>
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)] whitespace-nowrap">Onboarding Date</th>
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)] whitespace-nowrap">Incorporation Date</th>
                <th className="sticky top-0 z-20 bg-bg-secondary px-2 py-3 shadow-[0_1px_0_var(--color-bg-tertiary)] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-20 text-center text-text-secondary italic bg-bg-primary rounded-lg border border-dashed border-bg-tertiary group">
                    No customers found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isMatch = filters.search && (
                    (cust.name || cust.customerName || "").toLowerCase().includes(filters.search.toLowerCase()) ||
                    (cust.phone || "").includes(filters.search) ||
                    (cust.companyName || "").toLowerCase().includes(filters.search.toLowerCase())
                  );

                  return (
                    <tr 
                      key={cust._id || cust.id}
                      onClick={() => navigate(`/customer/${cust._id || cust.id}`)}
                      className={`bg-bg-primary hover:bg-bg-tertiary/50 transition-colors group cursor-pointer shadow-sm relative z-10 ${isMatch ? 'ring-1 ring-crm-orange/50' : ''}`}
                    >
                      <td className="px-2 py-3 rounded-l-lg border-y border-l border-transparent group-hover:border-bg-tertiary">
                        <CompanyLogo name={cust.companyName || cust.name} size="w-10 h-10" />
                      </td>
                      <td className="px-2 py-3 border-y border-transparent group-hover:border-bg-tertiary">
                        <h3 className="text-sm font-bold text-text-primary group-hover:text-crm-blue transition-colors">
                          {cust.companyName || cust.name}
                        </h3>
                      </td>
                      <td className="px-2 py-3 text-sm text-text-primary whitespace-nowrap border-y border-transparent group-hover:border-bg-tertiary flex items-center gap-2 h-full min-h-[64px]">
                        <Phone size={14} className="text-crm-blue lg:hidden" />
                        {cust.phone || 'N/A'}
                      </td>
                      <td className="px-2 py-3 border-y border-transparent group-hover:border-bg-tertiary">
                        <span className="inline-block px-2 py-1 bg-crm-orange/10 text-crm-orange text-[10px] font-bold rounded border border-crm-orange/20 uppercase whitespace-nowrap">
                          {cust.type}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-sm text-text-primary border-y border-transparent group-hover:border-bg-tertiary whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-crm-green" />
                          <span>{cust.onboardingDate ? new Date(cust.onboardingDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm border-y border-transparent group-hover:border-bg-tertiary whitespace-nowrap">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Calendar size={14} />
                          <span>{cust.incorporationDate ? new Date(cust.incorporationDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right rounded-r-lg border-y border-r border-transparent group-hover:border-bg-tertiary">
                        <div className="flex justify-end">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/customer/${cust._id || cust.id}`); }}
                            className="btn-raised btn-raised-blue px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all relative z-20"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
