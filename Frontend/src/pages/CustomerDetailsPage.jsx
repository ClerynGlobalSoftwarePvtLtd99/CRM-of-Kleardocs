import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { 
  Building2, Phone, Mail, MapPin, Calendar, User, 
  ArrowLeft, FileText, Send, Edit, MessageSquare, Plus, 
  UserPlus, Briefcase, Trash2, CheckCircle2, AlertCircle,
  Copy, Eye, EyeOff, Globe, Printer, ExternalLink, Download,
  Search, ChevronDown, IdCard
} from "lucide-react";
import { toast } from "react-hot-toast";

// Modals
import DirectorReportModal from "../components/customer-modals/DirectorReportModal";
import BoardResolutionModal from "../components/customer-modals/BoardResolutionModal";
import EditEmailsModal from "../components/customer-modals/EditEmailsModal";
import AddAccountantJobModal from "../components/customer-modals/AddAccountantJobModal";
import EditCustomerModal from "../components/customer-modals/EditCustomerModal";
import SendTemplateModal from "../components/customer-modals/SendTemplateModal";
import ConsentLetterModal from "../components/customer-modals/ConsentLetterModal";
import AuditorsReportModal from "../components/customer-modals/AuditorsReportModal";
import AddDirectorModal from "../components/customer-modals/AddDirectorModal";
import AddServiceModal from "../components/customer-modals/AddServiceModal";
import WhatsappTemplateModal from "../components/lead-modals/WhatsappTemplateModal";
import ModifyComplianceModal from "../components/customer-modals/ModifyComplianceModal";
import AddInvoiceModal from "../components/customer-modals/AddInvoiceModal";
import EndServiceModal from "../components/customer-modals/EndServiceModal";

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    id: id || "69b94faa7ee9313f5f04acd3",
    customerName: "VIRALITY360 PRIVATE LIMITED",
    phone: "7891858821",
    companyName: "VIRALITY360 PRIVATE LIMITED",
    type: "Private Limited Company",
    onboardingDate: "4th February 2026",
    incorporationDate: "29th December 2025",
    salesPerson: "Ritu Kaur",
    emails: ["imeenasanju@gmail.com"],
    address: "C/O GAURAV MISHRA, NEW PATHAKPURA, Orai, Orai, Jalaun- 285001, Uttar Pradesh",
    state: "UTTAR PRADESH",
    username: "VIRALITY0000",
    password: "w6ss645g",
    newlyIncorporated: true,
    directors: [
      { name: "RAJ MISHRA", phone: "7891858821", designation: "Managing Director", din: "09123456" }
    ],
    compliances: [
      { id: 1, name: "Preparation of 07 Required Statutory Registers", expiry: "-", status: "To Be Done", completedOn: "-", accountant: "-" },
      { id: 2, name: "Preparation & Filing of Form DPT - 03", expiry: "-", status: "To Be Done", completedOn: "-", accountant: "-" },
      { id: 3, name: "Preparation of Notice and Minutes of Board Meetings", expiry: "-", status: "To Be Done", completedOn: "-", accountant: "-" },
      { id: 4, name: "Preparation of Notice and Minutes of the Annual General Meeting & Extra-Ordinary General Meeting", expiry: "-", status: "To Be Done", completedOn: "-", accountant: "-" },
      { id: 5, name: "Preparation & Filing of Form ADT-01 (Auditor Appointment)", expiry: "24th Mar 2026", status: "To Be Done", completedOn: "-", accountant: "-" },
      { id: 6, name: "Preparation & Filing of Form INC - 20A", expiry: "21st Aug 2026", status: "To Be Done", completedOn: "-", accountant: "-" },
      { id: 7, name: "Issuance of Share Certificates (for all Shareholders)", expiry: "24th Mar 2026", status: "To Be Done", completedOn: "-", accountant: "-" },
    ],
    services: [
      { id: 1, name: "Annual Compliance", startDate: "17th Mar 2026", endDate: "-", status: "Active" }
    ],
    invoices: [
      { id: 1, date: "17th Mar 2026", number: "INV-24-2510941", service: "Annual Compliance", price: 2000, gst: 0, total: 2000, due: 2000 }
    ],
    recurringInvoices: [
      { id: 1, startDate: "17th Mar 2026", endDate: "17th Mar 2027", service: "Annual Compliance", interval: "3 Months", nextDate: "17th Jun 2026", status: "Active" }
    ],
    emailHistory: [
      { id: 1, date: "17th Mar 2026 6:28 pm", name: "Annual Compliance - Onboarding" }
    ]
  });

  const [showModals, setShowModals] = useState({
    directorReport: false,
    boardResolution: false,
    emails: false,
    addJob: false,
    editCustomer: false,
    sendTemplate: false,
    consentLetter: false,
    auditorsReport: false,
    addDirector: false,
    addService: false,
    whatsapp: false,
    modifyComp: false,
    addInvoice: false,
    endService: false,
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = (modalName, show, item = null) => {
    setSelectedItem(item);
    setShowModals(prev => ({ ...prev, [modalName]: show }));
  };

  const handleUpdateEmails = (newEmails) => {
    setCustomer(prev => ({ ...prev, emails: newEmails }));
    toast.success("Emails updated successfully!");
  };

  const handleUpdateCustomer = (updatedData) => {
    setCustomer(prev => ({ ...prev, ...updatedData }));
    toast.success("Customer updated successfully!");
  };

  const handleAddDirector = (newDirector) => {
    setCustomer(prev => ({ ...prev, directors: [...prev.directors, newDirector] }));
    toast.success("Director added!");
  };

  const handleAddService = (newService) => {
    setCustomer(prev => ({ 
      ...prev, 
      services: [...prev.services, { id: Date.now(), ...newService, status: "Active" }] 
    }));
    toast.success("Service added!");
  };

  const handleUpdateCompliance = (updatedComp) => {
    setCustomer(prev => ({
      ...prev,
      compliances: prev.compliances.map(c => c.id === updatedComp.id ? updatedComp : c)
    }));
    toast.success("Compliance updated!");
  };

  const handleEndService = (serviceId) => {
    setCustomer(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === serviceId ? { ...s, status: "Terminated", endDate: new Date().toLocaleDateString() } : s)
    }));
    toast.success("Service ended successfully");
  };

  return (
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
                { label: "Customer Name", value: customer.customerName },
                { label: "Customer Phone", value: customer.phone },
                { label: "Company Name", value: customer.companyName },
                { label: "Type", value: customer.type },
                { label: "Onboarding Date", value: customer.onboardingDate },
                { label: "Incorporation Date", value: customer.incorporationDate },
                { label: "Sales Person", value: customer.salesPerson },
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
                  {customer.emails.map((email, idx) => (
                    <span key={idx} className="text-blue-400 hover:underline cursor-pointer">{email}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-start gap-2 text-lg">
                <span className="font-bold text-text-primary">Address</span>
                <span className="text-text-primary">{customer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-text-primary">State:</span>
                  <span className="text-text-primary uppercase">{customer.state}</span>
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
            {customer.directors.map((director, idx) => (
              <div key={idx} className="bg-bg-tertiary/20 border border-bg-tertiary rounded-2xl p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-bl-full border-b border-l border-yellow-500/10 group-hover:bg-yellow-500/10 transition-all"></div>
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
                <button className="absolute bottom-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={16} />
                </button>
              </div>
            ))}
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
                {customer.compliances.map((comp) => (
                  <tr key={comp.id} className="hover:bg-bg-tertiary/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{comp.name}</td>
                    <td className={`px-6 py-4 text-sm ${comp.expiry !== '-' ? 'text-crm-orange font-bold' : ''}`}>{comp.expiry}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{comp.status}</td>
                    <td className="px-6 py-4 text-sm">{comp.completedOn}</td>
                    <td className="px-6 py-4 text-sm">{comp.accountant}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleModal("modifyComp", true, comp)}
                        className="btn-raised btn-raised-green px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all"
                      >
                        Modify
                      </button>
                    </td>
                  </tr>
                ))}
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
                {customer.services.map((svc) => (
                  <tr key={svc.id}>
                    <td className="px-6 py-4 text-sm">{svc.name}</td>
                    <td className="px-6 py-4 text-sm">{svc.startDate}</td>
                    <td className="px-6 py-4 text-sm">{svc.endDate}</td>
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
                ))}
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
                {customer.invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-6 py-4 text-sm">{inv.date}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{inv.number}</td>
                    <td className="px-6 py-4 text-sm">{inv.service}</td>
                    <td className="px-6 py-4 text-sm">₹ {inv.price}</td>
                    <td className="px-6 py-4 text-sm">₹ {inv.gst}</td>
                    <td className="px-6 py-4 text-sm">₹ {inv.total}</td>
                    <td className="px-6 py-4 text-sm text-crm-orange font-bold">₹ {inv.due}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/invoice/${inv.id}`)}
                        className="btn-raised btn-raised-orange-light px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-[#F8C67E] text-black shadow-[0_4px_0_#D9A05B]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
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
                {customer.recurringInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-6 py-4 text-sm">{inv.startDate}</td>
                    <td className="px-6 py-4 text-sm">{inv.endDate}</td>
                    <td className="px-6 py-4 text-sm">{inv.service}</td>
                    <td className="px-6 py-4 text-sm">{inv.interval}</td>
                    <td className="px-6 py-4 text-sm">{inv.nextDate}</td>
                    <td className="px-6 py-4 text-sm text-crm-green font-bold">{inv.status}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toast.success("Opening recurring invoice details...")}
                        className="btn-raised btn-raised-orange-light px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-[#F8C67E] text-black shadow-[0_4px_0_#D9A05B] active:translate-y-1 active:shadow-none"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
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
                {customer.emailHistory.map((hist) => (
                  <tr key={hist.id}>
                    <td className="px-6 py-4 text-sm">{hist.date}</td>
                    <td className="px-6 py-4 text-sm font-medium">{hist.name}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toast.success("Opening email history details...")}
                        className="btn-raised btn-raised-blue px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RENDER MODALS */}
      {showModals.directorReport && <DirectorReportModal customer={customer} onClose={() => toggleModal("directorReport", false)} />}
      {showModals.boardResolution && <BoardResolutionModal customer={customer} onClose={() => toggleModal("boardResolution", false)} />}
      {showModals.emails && <EditEmailsModal customer={customer} onClose={() => toggleModal("emails", false)} onUpdate={handleUpdateEmails} />}
      {showModals.addJob && <AddAccountantJobModal onClose={() => toggleModal("addJob", false)} />}
      {showModals.editCustomer && <EditCustomerModal customer={customer} onClose={() => toggleModal("editCustomer", false)} onUpdate={handleUpdateCustomer} />}
      {showModals.sendTemplate && <SendTemplateModal customer={customer} onClose={() => toggleModal("sendTemplate", false)} />}
      {showModals.consentLetter && <ConsentLetterModal customer={customer} onClose={() => toggleModal("consentLetter", false)} />}
      {showModals.auditorsReport && <AuditorsReportModal customer={customer} onClose={() => toggleModal("auditorsReport", false)} />}
      
      {showModals.addDirector && (
        <AddDirectorModal 
          onClose={() => toggleModal("addDirector", false)} 
          onAdd={handleAddDirector} 
        />
      )}
      
      {showModals.addService && (
        <AddServiceModal 
          onClose={() => toggleModal("addService", false)} 
          onAdd={handleAddService} 
        />
      )}

      {showModals.modifyComp && (
        <ModifyComplianceModal 
          compliance={selectedItem}
          onClose={() => toggleModal("modifyComp", false)} 
          onUpdate={handleUpdateCompliance} 
        />
      )}

      {showModals.addInvoice && (
        <AddInvoiceModal 
          service={selectedItem}
          onClose={() => toggleModal("addInvoice", false)} 
          onAdd={(data) => {
            setCustomer(prev => ({
              ...prev,
              invoices: [{ id: Date.now(), ...data, number: `INV-24-${Math.floor(Math.random()*10000000)}`, service: selectedItem.name, total: parseFloat(data.price) + parseFloat(data.governmentFees || 0) }, ...prev.invoices]
            }));
            toast.success("Invoice added!");
          }} 
        />
      )}

      {showModals.endService && (
        <EndServiceModal 
          service={selectedItem}
          onClose={() => toggleModal("endService", false)} 
          onConfirm={handleEndService} 
        />
      )}

      {showModals.whatsapp && (
        <WhatsappTemplateModal 
          lead={{ name: customer.customerName, companyName: customer.companyName, phone: customer.phone }} 
          onClose={() => toggleModal("whatsapp", false)} 
          onSend={(data) => {
            toast.success("WhatsApp message sent!");
            toggleModal("whatsapp", false);
          }}
        />
      )}

    </div>
  );
};

export default CustomerDetailsPage;
