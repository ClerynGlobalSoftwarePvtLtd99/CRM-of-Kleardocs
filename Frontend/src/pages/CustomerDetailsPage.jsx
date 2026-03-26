import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { 
  Building2, Phone, Mail, MapPin, Calendar, User, 
  ArrowLeft, FileText, Send, Edit, MessageSquare, Plus, 
  UserPlus, Briefcase, Trash2, CheckCircle2, AlertCircle,
  Copy, Eye, EyeOff, Globe, Printer, ExternalLink, Download,
  Search, ChevronDown, IdCard
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchCustomerById, updateCustomerEmails, addCustomerDirector, addServiceToCustomer, endCustomerService } from "../redux/slices/customersSlice";
import ErrorBoundary from "../components/ErrorBoundary";
import ContentLoader from "../components/common/ContentLoader";

// Modals
import DirectorReportModal from "../components/customers/DirectorReportModal";
import BoardResolutionModal from "../components/customers/BoardResolutionModal";
import EditEmailsModal from "../components/customers/EditEmailsModal";
import AddAccountantJobModal from "../components/customers/AddAccountantJobModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import SendTemplateModal from "../components/customers/SendTemplateModal";
import ConsentLetterModal from "../components/customers/ConsentLetterModal";
import AuditorsReportModal from "../components/customers/AuditorsReportModal";
import AddDirectorModal from "../components/customers/AddDirectorModal";
import AddServiceModal from "../components/customers/AddServiceModal";
import WhatsappTemplateModal from "../components/lead-modals/WhatsappTemplateModal";
import ModifyComplianceModal from "../components/customers/ModifyComplianceModal";
import AddInvoiceModal from "../components/customers/AddInvoiceModal";
import EndServiceModal from "../components/customers/EndServiceModal";
import { generateInvoicePdf } from "../utils/invoicePdfGenerator";
import RecurringInvoiceDetailsModal from "../components/customers/RecurringInvoiceDetailsModal";
import EmailTemplateDetailsModal from "../components/customers/EmailTemplateDetailsModal";

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCustomer, loading, error } = useSelector((state) => state.customers);
  
  // Move ALL useState hooks to the top before any conditional returns
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailsModal, setShowEmailsModal] = useState(false);
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);
  const [showAddDirectorModal, setShowAddDirectorModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showSendTemplateModal, setShowSendTemplateModal] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showAddComplianceModal, setShowAddComplianceModal] = useState(false);
  const [showModifyComplianceModal, setShowModifyComplianceModal] = useState(false);
  const [showDirectorReportModal, setShowDirectorReportModal] = useState(false);
  const [showBoardResolutionModal, setShowBoardResolutionModal] = useState(false);
  const [showConsentLetterModal, setShowConsentLetterModal] = useState(false);
  const [showAuditorsReportModal, setShowAuditorsReportModal] = useState(false);
  const [showAddAccountantJobModal, setShowAddAccountantJobModal] = useState(false);
  const [showRecurringInvoiceDetailsModal, setShowRecurringInvoiceDetailsModal] = useState(false);
  const [showEmailTemplateDetailsModal, setShowEmailTemplateDetailsModal] = useState(false);
  const [showEndServiceModal, setShowEndServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedRecurringInvoice, setSelectedRecurringInvoice] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customer, setCustomer] = useState(currentCustomer);

  // Fetch customer data on component mount
  useEffect(() => {
    if (id) {
      console.log('Fetching customer details for ID:', id);
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (customer) {
      console.log('Customer data loaded:', customer);
      console.log('Customer services:', customer.services);
      // Check if services are populated correctly
      if (customer.services && customer.services.length > 0) {
        customer.services.forEach((svc, index) => {
          console.log(`Service ${index}:`, svc);
        });
      }
    }
  }, [customer]);

  // Update local customer state when Redux data changes
  useEffect(() => {
    if (currentCustomer) {
      setCustomer(currentCustomer);
    }
  }, [currentCustomer]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader message="Fetching customer details..." />
      </div>
    );
  }

  // Handle error state
  if (error) {
    const errorMessage = typeof error === 'string' ? error : 
                         error?.message || 
                         error?.toString() || 
                         'An error occurred';
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Handle no customer found
  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">Customer not found</p>
        </div>
      </div>
    );
  }

  const toggleModal = (modalName, show, item = null) => {
    setSelectedItem(item);
    // Use individual state setters instead of showModals object
    switch(modalName) {
      case 'directorReport': setShowDirectorReportModal(show); break;
      case 'boardResolution': setShowBoardResolutionModal(show); break;
      case 'emails': setShowEmailsModal(show); break;
      case 'addJob': setShowAddAccountantJobModal(show); break;
      case 'editCustomer': setShowEditModal(show); break;
      case 'sendTemplate': setShowSendTemplateModal(show); break;
      case 'consentLetter': setShowConsentLetterModal(show); break;
      case 'auditorsReport': setShowAuditorsReportModal(show); break;
      case 'addDirector': setShowAddDirectorModal(show); break;
      case 'addService': setShowAddServiceModal(show); break;
      case 'whatsapp': setShowWhatsappModal(show); break;
      case 'modifyComp': setShowModifyComplianceModal(show); break;
      case 'addInvoice': setShowAddInvoiceModal(show); break;
      case 'endService': setShowEndServiceModal(show); break;
      case 'recurringInvoiceDetails': setShowRecurringInvoiceDetailsModal(show); break;
      case 'emailTemplateDetails': setShowEmailTemplateDetailsModal(show); break;
      default: break;
    }
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomer(prev => ({ ...prev, ...updatedCustomer }));
    toast.success("Customer updated successfully!");
  };

  const handleUpdateEmails = async (updatedCustomer) => {
  try {
    if (!customer || !customer._id) {
      throw new Error('Customer data not available');
    }
    
    // Ensure customer has emails property
    const customerWithEmails = {
      ...customer,
      emails: customer.emails || []
    };
    
    setEmailUpdateLoading(true);
    
    const result = await dispatch(updateCustomerEmails({ 
      customerId: customer._id, 
      emails: updatedCustomer.emails || [] 
    })).unwrap();
    
    // Update local state to reflect changes immediately
    setCustomer(prev => ({ 
      ...prev, 
      emails: updatedCustomer.emails || [] 
    }));
    console.log('Emails updated successfully:', result);
    toast.success("Emails updated successfully!");
    
    // Close modal after successful update
    setShowEmailsModal(false);
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : 
                         error?.message || 
                         error?.toString() || 
                         'Failed to update emails';
    console.error('Email update error:', error);
    toast.error(errorMessage);
  } finally {
    setEmailUpdateLoading(false);
  }
};

  const handleAddDirector = async (newDirector) => {
  try {
    const directorData = {
      name: newDirector.name,
      email: newDirector.email,
      phone: newDirector.phone,
      pan: newDirector.pan,
      din: newDirector.din
    };
    
    await dispatch(addCustomerDirector({ 
      customerId: customer._id, 
      directorData 
    })).unwrap();
    
    // Don't update local state - Redux will handle it
    toast.success("Director added!");
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : 
                         error?.message || 
                         error?.toString() || 
                         'Failed to add director';
    toast.error(errorMessage);
  }
};

  const handleDeleteDirector = (index) => {
    setCustomer(prev => ({
      ...prev,
      directors: prev.directors.filter((_, i) => i !== index)
    }));
    toast.success("Director deleted!");
  };

  const handleAddService = async (newService) => {
    try {
      await dispatch(addServiceToCustomer({ 
        customerId: customer._id, 
        serviceData: {
          serviceName: newService.serviceName,
          startDate: newService.startDate,
          status: "Active"
        }
      })).unwrap();
      
      toast.success("Service added!");
      
      // Refresh customer data to get updated services list
      await dispatch(fetchCustomerById(customer._id));
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 
                           error?.message || 
                           error?.toString() || 
                           'Failed to add service';
      toast.error(errorMessage);
    }
  };

  const handleUpdateCompliance = (updatedComp) => {
    setCustomer(prev => ({
      ...prev,
      compliances: prev.compliances.map(c => c.id === updatedComp.id ? updatedComp : c)
    }));
    toast.success("Compliance updated!");
  };

  const handleEndService = async (serviceId) => {
    try {
      await dispatch(endCustomerService({ 
        customerId: customer._id, 
        serviceId 
      })).unwrap();
      
      toast.success("Service ended and removed!");
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 
                           error?.message || 
                           error?.toString() || 
                           'Failed to end service';
      toast.error(errorMessage);
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-4 bg-bg-primary min-h-screen text-text-primary">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ROW 1: HEADER & PRIMARY ACTIONS */}
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/customers" className="p-2.5 hover:bg-bg-secondary rounded-xl transition-all border border-bg-tertiary shadow-sm">
              <ArrowLeft size={20} className="text-yellow-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-3 italic">
                CUSTOMER DETAILS
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Director Report", modal: "directorReport", color: "btn-raised-blue text-white" },
              { label: "Board Resolution", modal: "boardResolution", color: "btn-raised-blue text-white" },
              { label: "Emails", modal: "emails", color: "btn-raised-orange text-white" },
              { label: "Add Accountant Job", modal: "addJob", color: "btn-raised-blue text-white" },
              { label: "Edit", modal: "editCustomer", color: "btn-raised-orange text-white" },
              { label: "Send Template", modal: "sendTemplate", color: "btn-raised-green text-white" },
            ].map((btn, i) => (
              <button 
                key={i}
                onClick={() => toggleModal(btn.modal, true)}
                className={`${btn.color} btn-raised px-4 py-2 rounded-md text-[13px] font-bold transition-all flex items-center justify-center min-w-[120px]`}
              >
                {btn.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 2: NAME & SECONDARY ACTIONS */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{customer.companyName}</h2>
              {customer.newlyIncorporated && (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-lg border border-green-500/20">
                  New Incorportation
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Consent Letter", modal: "consentLetter", color: "btn-raised-blue text-white" },
              { label: "Auditor’s Report", modal: "auditorsReport", color: "btn-raised-blue text-white" },
              { label: "Send Whatsapp Template", modal: "whatsapp", color: "btn-raised-green text-white" },
              { label: "Add Director", modal: "addDirector", color: "btn-raised-blue text-white" },
              { label: "Add Service", modal: "addService", color: "btn-raised-green text-white" },
            ].map((btn, i) => (
              <button 
                key={i}
                onClick={() => toggleModal(btn.modal, true)}
                className={`${btn.color} btn-raised px-4 py-2 rounded-md text-[13px] font-bold transition-all flex items-center justify-center min-w-[140px]`}
              >
                {btn.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: CUSTOMER ALL DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-6 border-b border-bg-tertiary px-4">
          
          {/* Column 1: Basic Info */}
          <div className="space-y-4">
             {[
                { label: "Customer Name", value: customer.name },
                { label: "Customer Phone", value: customer.phone },
                { label: "Company Name", value: customer.companyName },
                { label: "Type", value: customer.type },
                { label: "Onboarding Date", value: customer.onboardingDate ? new Date(customer.onboardingDate).toLocaleDateString('en-IN') : 'N/A' },
                { label: "Incorporation Date", value: customer.incorporationDate ? new Date(customer.incorporationDate).toLocaleDateString('en-IN') : 'N/A' },
                { label: "Sales Person", value: customer.salesPerson || 'N/A' },
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-text-primary">{item.label}:</span>
                  <span className="text-text-primary">{item.value}</span>
                </div>
             ))}
          </div>

          {/* Column 2: Contact & Login Info */}
          <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg">
                <span className="font-bold text-text-primary">Emails</span>
                <div className="flex flex-col">
                  {customer?.emails && customer.emails.length > 0 ? (
                    customer.emails.map((email, idx) => (
                      <span key={idx} className="text-blue-400 hover:underline cursor-pointer">{email}</span>
                    ))
                  ) : (
                    <span className="text-text-primary">No emails added</span>
                  )}
                </div>
              </div>
              <div className="flex flex-start gap-2 text-lg">
                <span className="font-bold text-text-primary">Address</span>
                <span className="text-text-primary">{customer.address || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-text-primary">State:</span>
                  <span className="text-text-primary uppercase">{customer.state || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-lg pt-4">
                  <span className="font-bold text-text-primary">Username:</span>
                  <span className="text-text-primary">{customer.username}</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-text-primary">Password:</span>
                  <span className="text-text-primary">{customer.password}</span>
              </div>
          </div>
        </div>

        {/* SECTION 3: DIRECTORS */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black tracking-tight italic uppercase mb-8 flex items-center gap-3">
            <User size={24} className="text-yellow-500" /> Directors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customer?.directors && customer.directors.length > 0 ? (
              customer.directors.map((director, idx) => (
                <div key={idx} className="bg-bg-tertiary/20 border border-bg-tertiary rounded-2xl p-6 relative group overflow-hidden">
                  <div className="relative space-y-3">
                    <div className="flex flex-col">
                      <h4 className="text-base font-black uppercase tracking-tight italic text-yellow-500 leading-tight">{director.name}</h4>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{director.designation || "Director"}</span>
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-sm font-bold flex items-center gap-2 text-text-primary">
                        <Phone size={14} className="text-yellow-500/50" /> {director.phone}
                      </p>
                      {director.din && (
                        <p className="text-xs font-medium flex items-center gap-2 text-text-secondary">
                          <IdCard size={14} className="text-blue-500/50" /> DIN: {director.din}
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteDirector(idx)}
                    className="absolute bottom-4 right-4 p-2 text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                  >
                      <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-text-secondary py-8">
                No directors available
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: ANNUAL COMPLIANCE */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-bg-tertiary flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold">Annual Compliance</h2>
            <div className="flex items-center gap-3">
              <div className="fieldset-input !mt-0 !min-w-[200px]">
                <span className="fieldset-label uppercase">Select Financial Year</span>
                <select className="!text-sm">
                  <option>2025-2026</option>
                  <option>2024-2025</option>
                </select>
              </div>
              <button 
                onClick={() => toast.success("Showing compliance for selected year")}
                className="btn-raised btn-raised-green px-6 py-2 rounded text-sm font-bold uppercase transition-all"
              >
                View
              </button>
              <button 
                onClick={() => toast.success("Add Financial Year functionality coming soon")}
                className="btn-raised btn-raised-orange px-6 py-2 rounded text-sm font-bold uppercase transition-all"
              >
                Add Financial Year
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-tertiary/20 text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                <tr>
                  <th className="px-6 py-4">Compliance Name</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Completed On</th>
                  <th className="px-6 py-4">Accountant</th>
                  <th className="px-6 py-4">Modify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {customer?.compliances && customer.compliances.length > 0 ? (
                  customer.compliances.map((comp) => (
                    <tr key={comp._id} className="hover:bg-bg-tertiary/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{comp.name}</td>
                      <td className={`px-6 py-4 text-sm ${comp.expiryDate && comp.expiryDate !== '-' ? 'text-crm-orange font-bold' : ''}`}>
                        {comp.expiryDate ? new Date(comp.expiryDate).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{comp.status}</td>
                      <td className="px-6 py-4 text-sm">{comp.completedOn ? new Date(comp.completedOn).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm">{comp.accountant || '-'}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleModal("modifyComp", true, comp)}
                          className="btn-raised btn-raised-green px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all"
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-text-secondary">
                      No compliance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: SERVICES */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-bg-tertiary">
            <h2 className="text-xl font-bold">Services</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-tertiary/20 text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                <tr>
                  <th className="px-6 py-4">Service Name</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Add Invoice</th>
                  <th className="px-6 py-4 text-right">End Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {customer?.services && customer.services.length > 0 ? (
                  customer.services.map((svc) => (
                    <tr key={svc._id}>
                      <td className="px-6 py-4 text-sm">{svc.service?.name || svc.name}</td>
                      <td className="px-6 py-4 text-sm">{svc.startDate ? new Date(svc.startDate).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm">{svc.endDate ? new Date(svc.endDate).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm text-crm-green font-bold">{svc.status}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleModal("addInvoice", true, svc)}
                          className="btn-raised btn-raised-orange px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all"
                        >
                          Add Invoice
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleModal("endService", true, svc)}
                          className="btn-raised-red px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-red-600 text-white shadow-[0_4px_0_rgb(185,28,28)] active:translate-y-1 active:shadow-none"
                        >
                          End Service
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-text-secondary">
                      No services available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 6: INVOICES */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-bg-tertiary">
            <h2 className="text-xl font-bold">Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-tertiary/20 text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                <tr>
                  <th className="px-6 py-4">Invoice Date</th>
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Linked Service</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">GST</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Due</th>
                  <th className="px-6 py-4">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {customer?.invoices && customer.invoices.length > 0 ? (
                  customer.invoices.map((inv) => (
                    <tr key={inv._id}>
                      <td className="px-6 py-4 text-sm">{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{inv.invoiceNo || '-'}</td>
                      <td className="px-6 py-4 text-sm">{inv.linkedService || '-'}</td>
                      <td className="px-6 py-4 text-sm">₹ {inv.price || 0}</td>
                      <td className="px-6 py-4 text-sm">₹ {inv.gst || 0}</td>
                      <td className="px-6 py-4 text-sm">₹ {inv.total || 0}</td>
                      <td className="px-6 py-4 text-sm text-crm-orange font-bold">₹ {inv.due || 0}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/invoice/${inv._id}`)}
                          className="btn-raised btn-raised-blue px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-text-secondary">
                      No invoices available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 7: RECURRING INVOICES */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-bg-tertiary">
            <h2 className="text-xl font-bold">Recurring Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-tertiary/20 text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                <tr>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Linked Service</th>
                  <th className="px-6 py-4">Interval</th>
                  <th className="px-6 py-4">Next Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {customer?.recurringInvoices && customer.recurringInvoices.length > 0 ? (
                  customer.recurringInvoices.map((inv) => (
                    <tr key={inv._id}>
                      <td className="px-6 py-4 text-sm">{inv.startDate ? new Date(inv.startDate).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm">{inv.endDate ? new Date(inv.endDate).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm">{inv.linkedService || '-'}</td>
                      <td className="px-6 py-4 text-sm">{inv.interval || '-'}</td>
                      <td className="px-6 py-4 text-sm">{inv.nextDate ? new Date(inv.nextDate).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-6 py-4 text-sm text-crm-green font-bold">{inv.status}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/recurring-invoice-details/${inv._id}`)}
                          className="btn-raised btn-raised-blue px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">
                      No recurring invoices available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 8: EMAIL TEMPLATE HISTORY */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-bg-tertiary">
            <h2 className="text-xl font-bold">Email Template History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-tertiary/20 text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-bg-tertiary">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 w-32">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {customer?.emailHistory && customer.emailHistory.length > 0 ? (
                  customer.emailHistory.map((hist) => (
                    <tr key={hist.id}>
                      <td className="px-6 py-4 text-sm">{new Date(hist.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm font-medium">{hist.name}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleModal("emailTemplateDetails", true, hist)}
                          className="text-blue-400 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-text-secondary">
                      No email history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RENDER MODALS */}
      {showDirectorReportModal && <DirectorReportModal customer={customer} onClose={() => toggleModal("directorReport", false)} />}
      {showBoardResolutionModal && <BoardResolutionModal customer={customer} onClose={() => toggleModal("boardResolution", false)} />}
      {showEmailsModal && <EditEmailsModal customer={customer} onClose={() => toggleModal("emails", false)} onUpdate={handleUpdateEmails} loading={emailUpdateLoading} />}
      {showAddAccountantJobModal && <AddAccountantJobModal onClose={() => toggleModal("addJob", false)} />}
      {showEditModal && <EditCustomerModal customer={customer} onClose={() => toggleModal("editCustomer", false)} onUpdate={handleUpdateCustomer} />}
      {showSendTemplateModal && <SendTemplateModal customer={customer} onClose={() => toggleModal("sendTemplate", false)} />}
      {showConsentLetterModal && <ConsentLetterModal customer={customer} onClose={() => toggleModal("consentLetter", false)} />}
      {showAuditorsReportModal && <AuditorsReportModal customer={customer} onClose={() => toggleModal("auditorsReport", false)} />}
      
      {showAddDirectorModal && (
        <AddDirectorModal 
          onClose={() => toggleModal("addDirector", false)} 
          onAdd={handleAddDirector} 
        />
      )}
      
      {showAddServiceModal && (
        <AddServiceModal 
          onClose={() => toggleModal("addService", false)} 
          onAdd={handleAddService} 
        />
      )}

      {showModifyComplianceModal && (
        <ModifyComplianceModal 
          compliance={selectedItem}
          onClose={() => toggleModal("modifyComp", false)} 
          onUpdate={handleUpdateCompliance} 
        />
      )}

      {showAddInvoiceModal && (
        <AddInvoiceModal 
          service={selectedItem}
          onClose={() => toggleModal("addInvoice", false)} 
          onAdd={(data) => {
            const newInvoice = { 
              id: Date.now(), 
              ...data, 
              number: `INV-24-${Math.floor(Math.random()*10000000)}`, 
              service: selectedItem.name, 
              total: parseFloat(data.price) + parseFloat(data.governmentFees || 0) 
            };
            
            setCustomer(prev => ({
              ...prev,
              invoices: [newInvoice, ...prev.invoices]
            }));
            
            // If it's a recurring invoice, also add to recurring invoices
            if (data.isRecurring) {
              const recurringInvoice = {
                id: Date.now(),
                customer: customer.name,
                service: selectedItem.name,
                interval: data.interval,
                intervalType: data.intervalType,
                startDate: data.date,
                endDate: data.endDate,
                amount: parseFloat(data.price) + parseFloat(data.governmentFees || 0),
                gst: data.gst,
                status: 'active',
                nextInvoiceDate: data.date
              };
              
              setCustomer(prev => ({
                ...prev,
                recurringInvoices: [...(prev.recurringInvoices || []), recurringInvoice]
              }));
            }
            
            toast.success(data.isRecurring ? "Recurring invoice added!" : "Invoice added!");
            generateInvoicePdf(newInvoice, customer);
          }} 
        />
      )}

      {showEndServiceModal && (
        <EndServiceModal 
          service={selectedItem}
          onClose={() => toggleModal("endService", false)} 
          onConfirm={handleEndService} 
        />
      )}

      {showWhatsappModal && (
        <WhatsappTemplateModal 
          lead={{ name: customer.name, companyName: customer.companyName, phone: customer.phone }} 
          onClose={() => toggleModal("whatsapp", false)} 
          onSend={(data) => {
            toast.success("WhatsApp message sent!");
            toggleModal("whatsapp", false);
          }}
        />
      )}

      {showRecurringInvoiceDetailsModal && (
        <RecurringInvoiceDetailsModal 
          invoice={selectedItem}
          onClose={() => toggleModal("recurringInvoiceDetails", false)} 
        />
      )}

      {showEmailTemplateDetailsModal && (
        <EmailTemplateDetailsModal 
          emailHistory={selectedItem}
          onClose={() => toggleModal("emailTemplateDetails", false)} 
        />
      )}

    </div>
    </ErrorBoundary>
  );
};

export default CustomerDetailsPage;
