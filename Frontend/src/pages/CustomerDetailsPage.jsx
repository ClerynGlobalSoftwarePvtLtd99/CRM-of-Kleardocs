import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { 
  Building2, Phone, Mail, MapPin, Calendar, User, 
  ArrowLeft, FileText, Send, Edit, MessageSquare, Plus, 
  UserPlus, Briefcase, Trash2, CheckCircle2, AlertCircle,
  Copy, Eye, EyeOff, Globe, Printer, ExternalLink, Download,
  Search, ChevronDown, IdCard, ShieldCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchCustomerById, updateCustomerEmails, addCustomerDirector, addServiceToCustomer, endCustomerService } from "../redux/slices/customersSlice";
import ErrorBoundary from "../components/ErrorBoundary";
import ContentLoader from "../components/common/ContentLoader";

// Modals
import DirectorReportModal from "../components/customers/DirectorReportModal";
import BoardResolutionModal from "../components/customers/BoardResolutionModal";
import EditEmailsModal from "../components/customers/EditEmailsModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import SendTemplateModal from "../components/customers/SendTemplateModal";
import ConsentLetterModal from "../components/customers/ConsentLetterModal";
import AuditorsReportModal from "../components/customers/AuditorsReportModal";
import AddDirectorModal from "../components/customers/AddDirectorModal";
import AddServiceModal from "../components/customers/AddServiceModal";
import WhatsappTemplateModal from "../components/leads/lead-modals/WhatsappTemplateModal";
import GenericDocumentModal from "../components/customers/GenericDocumentModal";
import AddAccountantJobModal from "../components/customers/AddAccountantJobModal";

// Modals
import ModifyComplianceModal from "../components/customers/ModifyComplianceModal";
import AddInvoiceModal from "../components/customers/AddInvoiceModal";

// History Tables
import CustomerAnnualComplianceTable from "../components/customers/CustomerAnnualComplianceTable";
import CustomerServicesTable from "../components/customers/CustomerServicesTable";
import CustomerInvoicesTable from "../components/customers/CustomerInvoicesTable";
import CustomerRecurringInvoicesTable from "../components/customers/CustomerRecurringInvoicesTable";
import CustomerEmailHistoryTable from "../components/customers/CustomerEmailHistoryTable";
import CustomerDirectors from "../components/customers/CustomerDirectors";
const CustomerDetailsPage = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCustomer: customer, loading, error } = useSelector((state) => state.customers);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModals, setShowModals] = useState({
    directorReport: false,
    boardResolution: false,
    emails: false,
    edit: false,
    sendTemplate: false,
    whatsapp: false,
    addDirector: false,
    addService: false,
    addAccountantJob: false,
    generic: false,
    auditorAppointment: false,
    modifyCompliance: false,
    addInvoice: false
  });
  const [genericTitle, setGenericTitle] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchCustomerById(id));
  }, [dispatch, id]);

  const toggleModal = (name, show, title = "") => {
    if (title) setGenericTitle(title);
    setShowModals(prev => ({ ...prev, [name]: show }));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-bg-primary"><ContentLoader message="Loading premium customer data..." /></div>;
  if (!customer) return <div className="flex items-center justify-center min-h-screen bg-bg-primary text-text-secondary uppercase font-black">Customer Not Found</div>;

  const handleUpdateEmails = async (updatedData) => {
    try {
      await dispatch(updateCustomerEmails({ customerId: customer._id, emails: updatedData.emails })).unwrap();
      toast.success("Registry Updated");
      toggleModal('emails', false);
      dispatch(fetchCustomerById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleTableAction = (action, payload) => {
    switch(action) {
      case 'modifyCompliance':
        setSelectedItem(payload);
        toggleModal('modifyCompliance', true);
        break;
      case 'addInvoice':
        setSelectedItem(payload);
        toggleModal('addInvoice', true);
        break;
      case 'endService':
        dispatch(endCustomerService({ customerId: id, serviceId: payload._id }));
        toast.success("Service ended");
        break;
      case 'viewInvoice':
        navigate(`/invoice/${payload._id || payload.id}`);
        break;
      case 'viewRecurring':
        navigate(`/recurring-invoice-details/${payload._id || payload.id}`);
        break;
      case 'viewEmail':
        toast.success(`Viewing email: ${payload.name || payload.templateName}`);
        break;
      case 'addFinancialYear':
        toast.success("Add Financial Year modal not yet connected");
        break;
      case 'viewComplianceYear':
        toast.success(`Filtering by year: ${payload}`);
        break;
      default:
        console.log("Unhandled action:", action, payload);
    }
  };

  return (
    <div className="p-6 bg-bg-primary min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        <div className="flex flex-col gap-6 w-full text-text-primary bg-bg-primary">
          {/* MUI Stack - Top Header Section */}
          <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
            
            {/* Left Side Stack */}
            <div className="flex flex-col gap-2">
              <h5 className="text-[1.5rem] font-normal leading-[1.334] mb-1">
                Customer Details
              </h5>
              <div className="flex items-center gap-4 flex-wrap">
                <h6 className="text-[1.25rem] font-medium leading-[1.6]">
                  {customer.companyName}
                </h6>
                {customer.newlyIncorporated && (
                    <div className="bg-[#2e7d32] text-white px-3 py-1 rounded-[16px] text-[0.8125rem] flex items-center justify-center font-medium leading-[1]">
                      <span>New Incorporation</span>
                    </div>
                )}
              </div>
            </div>

            {/* Right Side Stack (Buttons) */}
            <div className="flex flex-col gap-3 xl:items-end w-full xl:w-auto">
              {/* Row 1 Actions (Primary) */}
              <div className="flex flex-wrap items-center gap-2 justify-start xl:justify-end">
                <button onClick={() => toggleModal('directorReport', true)} className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Director<br/>Report
                </button>
                <button onClick={() => toggleModal('boardResolution', true)} className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Board<br/>Resolution
                </button>
                <button onClick={() => toggleModal('emails', true)} className="bg-[#ed6c02] hover:bg-[#e65100] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Emails
                </button>
                <button onClick={() => toggleModal('addAccountantJob', true)} className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Add<br/>Accountant<br/>Job
                </button>
                <button onClick={() => toggleModal('edit', true)} className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Edit
                </button>
                <button onClick={() => toggleModal('sendTemplate', true)} className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Send<br/>Template
                </button>
              </div>

              {/* Row 2 Actions (Secondary) */}
              <div className="flex flex-wrap items-center gap-2 justify-start xl:justify-end">
                <button onClick={() => toggleModal('consentLetter', true)} className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Consent<br/>Letter
                </button>
                <button onClick={() => toggleModal('auditorAppointment', true)} className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Auditor’s<br/>Report
                </button>
                <button onClick={() => toggleModal('whatsapp', true)} className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Send<br/>Whatsapp<br/>Template
                </button>
                <button onClick={() => toggleModal('addDirector', true)} className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Add<br/>Director
                </button>
                <button onClick={() => toggleModal('addService', true)} className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px]">
                  Add<br/>Services
                </button>
              </div>
            </div>
          </div>

          <hr className="border-t border-bg-tertiary opacity-50 my-2" />

          {/* Details Grid (MuiStack-root css-2k8yrx) */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 pt-2">
             {/* Left Column Stack */}
             <div className="flex flex-col gap-3 flex-1">
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Customer Name:</b> {customer.name}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Customer Phone:</b> {customer.phone}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Company Name:</b> {customer.companyName}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Type:</b> {customer.type}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Onboarding Date:</b> {customer.onboardingDate ? new Date(customer.onboardingDate).toLocaleDateString('en-GB') : 'N/A'}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Incorporation Date:</b> {customer.incorporationDate ? new Date(customer.incorporationDate).toLocaleDateString('en-GB') : 'N/A'}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Sales Person:</b> {customer.agent?.name || 'Ritu Kaur'}</h6>
             </div>
             
             {/* Right Column Stack */}
             <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col">
                   <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Emails</b></h6>
                   <div className="text-[1rem] leading-[1.5] tracking-[0.00938em]">
                     {customer.emails && customer.emails.length > 0 ? (
                        customer.emails.map((email, i) => <p key={i}>{email}</p>)
                     ) : <p className="italic text-text-secondary">No emails added</p>}
                   </div>
                </div>
                <div className="flex flex-col">
                   <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Address</b></h6>
                   <p className="text-[1rem] leading-[1.5] tracking-[0.00938em] break-words">{customer.address}</p>
                </div>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">State:</b> <span className="uppercase">{customer.state}</span></h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Username:</b> {customer.username}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Password:</b> {customer.password || 'e2y22gb2'}</h6>
             </div>
          </div>
        </div>

        {/* ADDITIONAL SECTIONS (DIRECTORS, SERVICES, etc.) */}
        <CustomerDirectors directors={customer.directors || []} />

        {/* HISTORY TABLES */}
        <div className="space-y-6 pb-12">
          <CustomerAnnualComplianceTable compliances={customer.annualCompliances || []} onAction={handleTableAction} />
          <CustomerServicesTable services={customer.services || []} onAction={handleTableAction} />
          <CustomerInvoicesTable invoices={customer.invoices || []} onAction={handleTableAction} />
          <CustomerRecurringInvoicesTable recurringInvoices={customer.recurringInvoices || []} onAction={handleTableAction} />
          <CustomerEmailHistoryTable emailHistory={customer.emailHistory || []} onAction={handleTableAction} />
        </div>

      </div>

      {/* MODALS RENDERING */}
      {showModals.directorReport && <DirectorReportModal customer={customer} onClose={() => toggleModal('directorReport', false)} />}
      {showModals.boardResolution && <BoardResolutionModal customer={customer} onClose={() => toggleModal('boardResolution', false)} />}
      {showModals.emails && <EditEmailsModal customer={customer} onClose={() => toggleModal('emails', false)} onUpdate={handleUpdateEmails} />}
      {showModals.sendTemplate && <SendTemplateModal customer={customer} onClose={() => toggleModal('sendTemplate', false)} />}
      {showModals.whatsapp && <WhatsappTemplateModal lead={customer} onClose={() => toggleModal('whatsapp', false)} onSend={(data) => {
          dispatch(sendCustomerWhatsapp({ customerId: id, data }));
          dispatch(fetchCustomerById(id));
      }} />}
      {showModals.addAccountantJob && <AddAccountantJobModal customer={customer} onClose={() => toggleModal('addAccountantJob', false)} onSuccess={() => dispatch(fetchCustomerById(id))} />}
      {showModals.generic && <GenericDocumentModal customer={customer} title={genericTitle} onClose={() => toggleModal('generic', false)} />}
      {showModals.addDirector && <AddDirectorModal customer={customer} onClose={() => toggleModal('addDirector', false)} onAdd={() => dispatch(fetchCustomerById(id))} />}
      {showModals.addService && <AddServiceModal customer={customer} onClose={() => toggleModal('addService', false)} onAdd={(data) => {
          dispatch(addServiceToCustomer({ customerId: id, serviceData: data }));
          dispatch(fetchCustomerById(id));
      }} />}
      {showModals.auditorAppointment && <AuditorsReportModal customer={customer} onClose={() => toggleModal('auditorAppointment', false)} />}
      {showModals.modifyCompliance && <ModifyComplianceModal customer={customer} compliance={selectedItem} onClose={() => toggleModal('modifyCompliance', false)} onSuccess={() => dispatch(fetchCustomerById(id))} />}
      {showModals.addInvoice && <AddInvoiceModal 
        customer={customer} 
        service={selectedItem} 
        onClose={() => toggleModal('addInvoice', false)} 
        onAdd={(data) => {
            dispatch(createInvoice({ 
                ...data, 
                customerId: id, 
                serviceId: selectedItem?.service || undefined,
                complianceId: selectedItem?.financialYear ? selectedItem?._id : undefined 
            })).then(() => dispatch(fetchCustomerById(id)));
        }} 
      />}

    </div>
  );
};

export default CustomerDetailsPage;
