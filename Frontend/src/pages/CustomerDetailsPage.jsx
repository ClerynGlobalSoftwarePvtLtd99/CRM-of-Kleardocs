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
import { 
  fetchCustomerById, updateCustomerEmails, addCustomerDirector, 
  addServiceToCustomer, endCustomerService, sendCustomerWhatsapp, 
  addCustomerFinancialYear, initCustomerCompliances 
} from "../redux/slices/customersSlice";
import { createInvoice } from "../redux/slices/invoicesSlice";
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
import AddFinancialYearModal from "../components/customers/AddFinancialYearModal";
import EmailTemplateDetailsModal from "../components/customers/EmailTemplateDetailsModal";

// Modals
import ModifyComplianceModal from "../components/customers/ModifyComplianceModal";
import AddInvoiceModal from "../components/customers/AddInvoiceModal";
import EndServiceModal from "../components/customers/EndServiceModal";

// History Tables
import CustomerAnnualComplianceTable from "../components/customers/CustomerAnnualComplianceTable";
import CustomerServicesTable from "../components/customers/CustomerServicesTable";
import CustomerInvoicesTable from "../components/customers/CustomerInvoicesTable";
import CustomerRecurringInvoicesTable from "../components/customers/CustomerRecurringInvoicesTable";
import CustomerEmailHistoryTable from "../components/customers/CustomerEmailHistoryTable";
import CustomerDirectors from "../components/customers/CustomerDirectors";
import { getCurrentFinancialYear } from "../utils/dateUtils";


const CustomerDetailsPage = () => {
  const { id } = useParams();

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCustomer: customer, loading, error } = useSelector((state) => state.customers);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(() => getCurrentFinancialYear());
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
    addInvoice: false,
    endService: false
  });
  const [genericTitle, setGenericTitle] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchCustomerById({ customerId: id, year: selectedYear || undefined }));
  }, [dispatch, id, selectedYear]);

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
      dispatch(fetchCustomerById({ customerId: id, year: selectedYear }));
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
        setSelectedItem(payload);
        toggleModal('endService', true);
        break;
      case 'viewInvoice':
        navigate(`/invoice/${payload._id || payload.id}`);
        break;
      case 'viewRecurring':
        navigate(`/recurring-invoice-details/${payload._id || payload.id}`);
        break;
      case 'viewEmail':
        // Show email template details in dedicated modal
        setSelectedItem(payload);
        toggleModal('emailTemplateDetails', true);
        break;
      case 'addFinancialYear':
        toggleModal('addFinancialYear', true);
        break;
      case 'addService':
        toggleModal('addService', true);
        break;
      case 'viewComplianceYear':
        // Load compliances for selected financial year
        setSelectedYear(payload);
        dispatch(fetchCustomerById({ customerId: id, year: payload })).unwrap().then((data) => {
          // Requirement check: "when click view button this time assign all Annual compliance"
          // If the fetched compliances are empty, we can offer to initialize or do it automatically.
          // For now, the user sees the "Assign" button in the table if it's empty.
          toast.success(`Showing records for financial year: ${payload}`);
        });
        break;
      case 'initCompliances':
        // Trigger manual assignment of compliance templates
        toast.promise(
          dispatch(initCustomerCompliances({ customerId: id, financialYear: payload })).unwrap(),
          {
            loading: 'Assigning default compliances...',
            success: 'Compliances assigned successfully',
            error: (err) => `Failed to assign: ${err}`
          }
        ).then(() => {
          // Refresh data after assignment
          dispatch(fetchCustomerById({ customerId: id, year: payload }));
        });
        break;
      default:
        console.log("Unhandled action:", action, payload);
        toast.error(`Action ${action} not implemented yet`);
    }
  };

  const handleConfirmEndService = async () => {
    if (!selectedItem) return;
    try {
      await dispatch(endCustomerService({ customerId: id, serviceId: selectedItem._id || selectedItem.id })).unwrap();
      toast.success("Service ended successfully");
      dispatch(fetchCustomerById({ customerId: id, year: selectedYear || undefined }));
    } catch (err) {
      toast.error(String(err || "Failed to end service"));
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
                    <div className="bg-[#2e7d32] text-white px-3 py-1 rounded-[16px] text-[0.8125rem] flex items-center justify-center font-medium leading-none">
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
                <button 
                  onClick={() => toggleModal('sendTemplate', true)} 
                  disabled={!customer.emails || customer.emails.length === 0}
                  title={!customer.emails || customer.emails.length === 0 ? "Add an email first to send templates" : ""}
                  className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-[4px] text-[0.8125rem] leading-tight font-bold uppercase shadow-md transition-all text-center min-w-[100px] flex items-center justify-center min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2e7d32]"
                >
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
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Sales Person:</b> {customer.salesPerson || customer.saleBy?.name || 'N/A'}</h6>
             </div>
             
             {/* Right Column Stack */}
             <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col">
                   <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Emails</b></h6>
                   <div className="text-[1rem] leading-normal tracking-[0.00938em]">
                     {customer.emails && customer.emails.length > 0 ? (
                        customer.emails.map((email, i) => <p key={i}>{email}</p>)
                     ) : <p className="italic text-text-secondary">No emails added</p>}
                   </div>
                </div>
                <div className="flex flex-col">
                   <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Address</b></h6>
                   <p className="text-[1rem] leading-normal tracking-[0.00938em] wrap-break-word">{customer.address}</p>
                </div>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">State:</b> <span className="uppercase">{customer.state}</span></h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Username:</b> {customer.username}</h6>
                <h6 className="text-[1.1rem] leading-[1.6]"><b className="font-bold">Password:</b> {customer.password || 'e2y22gb2'}</h6>
             </div>
          </div>
        </div>

        {/* ADDITIONAL SECTIONS (DIRECTORS, SERVICES, etc.) */}
        <CustomerDirectors directors={customer.directors || []} customerId={customer._id} />

        {/* HISTORY TABLES */}
        <div className="space-y-6 pb-12">
          <CustomerAnnualComplianceTable 
            compliances={customer.compliances || []}
            financialYears={customer.financialYears || []}
            selectedYear={selectedYear}
            onAction={handleTableAction}
          />
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
          dispatch(fetchCustomerById({ customerId: id }));
      }} />}
      {showModals.addAccountantJob && <AddAccountantJobModal customer={customer} onClose={() => toggleModal('addAccountantJob', false)} onSuccess={() => dispatch(fetchCustomerById({ customerId: id }))} />}
      {showModals.addFinancialYear && (
        <AddFinancialYearModal 
          customer={customer} 
          onClose={() => toggleModal('addFinancialYear', false)} 
          onSuccess={(addedYear) => {
            // addedYear is the year string returned from the modal after successful creation.
            // Set it as the selected year so the table shows that year's newly created records.
            const yearToLoad = (typeof addedYear === 'string' && addedYear) 
              ? addedYear 
              : getCurrentFinancialYear();
            toggleModal('addFinancialYear', false);
            setSelectedYear(yearToLoad);
            // fetchCustomerById will fire automatically via the selectedYear useEffect,
            // but we dispatch manually here to ensure it runs even if year didn't change.
            dispatch(fetchCustomerById({ customerId: id, year: yearToLoad }));
          }} 
        />
      )}
      {showModals.emailTemplateDetails && <EmailTemplateDetailsModal emailTemplate={selectedItem} onClose={() => toggleModal('emailTemplateDetails', false)} />}
      {showModals.generic && <GenericDocumentModal customer={customer} title={genericTitle} onClose={() => toggleModal('generic', false)} />}
      {showModals.addDirector && <AddDirectorModal customer={customer} onClose={() => toggleModal('addDirector', false)} onAdd={() => dispatch(fetchCustomerById({ customerId: id }))} />}
      {showModals.addService && (
        <AddServiceModal 
          customerId={customer._id} 
          onClose={() => toggleModal('addService', false)} 
          selectedYear={selectedYear} 
        />
      )}
      {showModals.auditorAppointment && <AuditorsReportModal customer={customer} onClose={() => toggleModal('auditorAppointment', false)} />}
      {showModals.consentLetter && <ConsentLetterModal customer={customer} onClose={() => toggleModal('consentLetter', false)} />}
      {showModals.edit && <EditCustomerModal customer={customer} onClose={() => toggleModal('edit', false)} onUpdate={() => {
        dispatch(fetchCustomerById({ customerId: id })); // Refresh customer data after update
      }} />}
      {showModals.modifyCompliance && (
        <ModifyComplianceModal 
          customerId={customer._id} 
          compliance={selectedItem} 
          onClose={() => toggleModal('modifyCompliance', false)} 
        />
      )}
      {showModals.addInvoice && <AddInvoiceModal 
        customer={customer} 
        service={selectedItem} 
        onClose={() => toggleModal('addInvoice', false)} 
        onAdd={(data) => {
            // Convert dd/mm/yyyy → ISO yyyy-mm-dd
            const toISO = (dateStr) => {
              if (!dateStr) return undefined;
              const parts = dateStr.split('/');
              if (parts.length !== 3) return dateStr;
              const [day, month, year] = parts;
              return `${year}-${month}-${day}`;
            };

            // selectedItem may be a service or a compliance
            // Service shape: { id, name, service (ObjectId ref), ... }
            // Compliance shape: { _id, financialYear, name, ... }
            const isCompliance = !!selectedItem?.financialYear;
            const serviceId = !isCompliance 
              ? (selectedItem?.service?._id || selectedItem?.service || selectedItem?.id || undefined)
              : undefined;

            const payload = {
                customerId: id,
                invoiceDate: toISO(data.date),
                recurring: data.isRecurring,
                interval: data.isRecurring ? Number(data.interval) : undefined,
                intervalType: data.isRecurring ? data.intervalType : undefined,
                endDate: (data.isRecurring && data.endDate) ? toISO(data.endDate) : undefined,
                description: data.description || undefined,
                complianceId: isCompliance ? selectedItem?._id : undefined,
                items: [{
                    serviceId,
                    description: selectedItem?.name || selectedItem?.serviceName || "",
                    professionalFees: Number(data.price),
                    govtFees: Number(data.governmentFees),
                    gstPercent: Number(data.gst),
                    hsn: selectedItem?.hsn || "998399"
                }]
            };

            dispatch(createInvoice(payload)).then(() => {
                dispatch(fetchCustomerById({ customerId: id }));
                toast.success("Invoice created successfully");
                toggleModal('addInvoice', false);
            }).catch((err) => {
                toast.error(String(err) || "Failed to create invoice");
            });
        }} 
      />}
      {showModals.endService && (
        <EndServiceModal
          service={selectedItem}
          onClose={() => toggleModal('endService', false)}
          onConfirm={handleConfirmEndService}
        />
      )}

    </div>
  );
};

export default CustomerDetailsPage;
