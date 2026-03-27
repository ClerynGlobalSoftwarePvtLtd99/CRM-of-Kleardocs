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

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isConvertedView = searchParams.get("view") === "converted";
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCustomer: customer, loading, error } = useSelector((state) => state.customers);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showModals, setShowModals] = useState({
    directorReport: false,
    boardResolution: false,
    emails: false,
    edit: false,
    sendTemplate: false,
    whatsapp: false,
    addDirector: false,
    addService: false,
    generic: false,
    auditorAppointment: false
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

  return (
    <div className="p-6 bg-bg-primary min-h-screen text-text-primary">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 bg-bg-secondary p-6 rounded-2xl border border-bg-tertiary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-crm-orange"></div>
          <div className="flex items-center gap-6">
            <Link to="/customers" className="p-3 bg-bg-primary border border-bg-tertiary rounded-xl hover:text-crm-orange transition-all shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
                Customer Details
                {customer.newlyIncorporated && (
                  <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-black tracking-widest not-italic">NEWLY INCORPORATED</span>
                )}
              </h1>
              <p className="text-sm font-bold text-text-secondary opacity-60 uppercase tracking-widest">{customer.companyName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isConvertedView ? (
              // THE 11 BUTTONS FOR CONVERTED VIEW
              <div className="flex flex-wrap gap-2">
                <button onClick={() => toggleModal('directorReport', true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Director report</button>
                <button onClick={() => toggleModal('boardResolution', true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Board Resolution</button>
                <button onClick={() => toggleModal('emails', true)} className="bg-crm-orange hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Emails</button>
                <button onClick={() => toggleModal('generic', true, 'Data Accountant job')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Data Accountant job</button>
                <button onClick={() => toggleModal('edit', true)} className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-bg-tertiary">Edit</button>
                <button onClick={() => toggleModal('sendTemplate', true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Send Template</button>
                <button onClick={() => toggleModal('consentLetter', true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Consent Letter</button>
                <button onClick={() => toggleModal('auditorsReport', true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Auditors’s Report</button>
                <button onClick={() => toggleModal('whatsapp', true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Send Whatsapp template</button>
                <button onClick={() => toggleModal('addDirector', true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Add Director</button>
                <button onClick={() => toggleModal('addService', true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Add Services</button>
              </div>
            ) : (
              // STANDARD VIEW BUTTONS
              <div className="flex flex-wrap gap-3">
                <button onClick={() => toggleModal('emails', true)} className="bg-crm-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all">Emails</button>
                <button onClick={() => toggleModal('sendTemplate', true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all">Send Template</button>
                <button onClick={() => toggleModal('whatsapp', true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all">Whatsapp</button>
                <button onClick={() => toggleModal('edit', true)} className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-bg-tertiary">Edit Profile</button>
              </div>
            )}
          </div>
        </div>

        {/* INFO GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 bg-bg-secondary p-8 rounded-3xl border border-bg-tertiary shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-bg-tertiary pb-4">
                 <h2 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2">
                    <ShieldCheck className="text-crm-orange" size={20} /> Corporate Identity
                 </h2>
                 <span className="text-[10px] font-black bg-bg-tertiary/30 px-3 py-1 rounded-full text-text-secondary uppercase">UID: {customer._id.slice(-8).toUpperCase()}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 block mb-1">Company Entity</label>
                       <p className="text-lg font-black text-text-primary">{customer.companyName}</p>
                    </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 block mb-1">Primary Contact</label>
                        <p className="font-bold text-text-primary">{customer.name}</p>
                        <p className="text-sm font-medium text-text-secondary">{customer.phone}</p>
                        {customer.newlyIncorporated && (
                          <span className="mt-2 inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">New Incorporation</span>
                        )}
                     </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 block mb-1">Registered Address</label>
                       <p className="text-sm font-bold leading-relaxed">{customer.address}</p>
                       <p className="text-xs font-black text-crm-orange mt-1 uppercase tracking-wider">{customer.state}</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                     <div className="bg-bg-primary/50 p-4 rounded-2xl border border-bg-tertiary space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50">Portal Authentication</label>
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-text-secondary opacity-40">Username:</span>
                              <span className="text-xs font-bold font-mono text-crm-orange">{customer.username}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-text-secondary opacity-40">Password:</span>
                              <span className="text-xs font-bold font-mono">{customer.password || 'e2y22gb2'}</span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 block mb-1">Sales Person</label>
                        <p className="text-sm font-black text-crm-orange uppercase tracking-tight">{customer.agent?.name || 'Ritu Kaur'}</p>
                     </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 block mb-1">Entity Classification</label>
                       <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase border border-blue-500/20">{customer.type}</span>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 block mb-1">Timeline</label>
                       <div className="flex gap-4">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-text-secondary uppercase">Onboarded</span>
                             <span className="text-xs font-bold">{new Date(customer.onboardingDate).toLocaleDateString()}</span>
                          </div>
                          {customer.incorporationDate && (
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-text-secondary uppercase">Incorporation</span>
                               <span className="text-xs font-bold">{new Date(customer.incorporationDate).toLocaleDateString()}</span>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-bg-secondary p-8 rounded-3xl border border-bg-tertiary shadow-sm flex flex-col items-center justify-center text-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={32} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight italic">Active Profile</h3>
                    <p className="text-xs font-bold text-text-secondary max-w-[200px] mx-auto">This customer is fully verified and compliant for current financial year.</p>
                 </div>
              </div>
              <div className="bg-bg-tertiary/10 p-6 rounded-3xl border border-dashed border-bg-tertiary flex flex-col gap-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Distribution List</label>
                 <div className="space-y-2">
                    {customer.emails?.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className="flex items-center gap-2 text-xs font-bold text-crm-orange hover:underline truncate">
                        <Mail size={12} className="opacity-50" /> {email}
                      </a>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* ADDITIONAL SECTIONS (DIRECTORS, SERVICES, etc.) REMAIN COLLAPSIBLE OR ACCESSIBLE VIA TABS */}
        <div className="bg-bg-secondary p-8 rounded-3xl border border-bg-tertiary shadow-sm">
           <h2 className="text-xl font-black uppercase tracking-tight italic mb-8 flex items-center gap-3">
              <UserPlus className="text-blue-500" size={24} /> Board of Directors
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customer.directors?.map((d, i) => (
                <div key={i} className="p-6 bg-bg-primary border border-bg-tertiary rounded-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:bg-blue-500/10 transition-colors"></div>
                   <h4 className="text-sm font-black uppercase italic leading-tight mb-3">{d.name}</h4>
                   <div className="space-y-1.5 opacity-70">
                      <p className="text-[10px] font-bold flex items-center gap-2"><Phone size={10} /> {d.phone}</p>
                      <p className="text-[10px] font-bold flex items-center gap-2"><Mail size={10} /> {d.email || 'N/A'}</p>
                      <p className="text-[10px] font-bold flex items-center gap-2"><IdCard size={10} /> DIN: {d.din || 'N/A'}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* MODALS RENDERING */}
      {showModals.directorReport && <DirectorReportModal customer={customer} onClose={() => toggleModal('directorReport', false)} />}
      {showModals.boardResolution && <BoardResolutionModal customer={customer} onClose={() => toggleModal('boardResolution', false)} />}
      {showModals.emails && <EditEmailsModal customer={customer} onClose={() => toggleModal('emails', false)} onUpdate={handleUpdateEmails} />}
      {showModals.edit && <EditCustomerModal customer={customer} onClose={() => toggleModal('edit', false)} onUpdate={() => dispatch(fetchCustomerById(id))} />}
      {showModals.sendTemplate && <SendTemplateModal lead={customer} onClose={() => toggleModal('sendTemplate', false)} onSendTemplate={() => {}} />}
      {showModals.whatsapp && <WhatsappTemplateModal lead={customer} onClose={() => toggleModal('whatsapp', false)} onSend={() => {}} />}
      {showModals.generic && <GenericDocumentModal customer={customer} title={genericTitle} onClose={() => toggleModal('generic', false)} />}
      {showModals.auditorAppointment && <AuditorsReportModal customer={customer} onClose={() => toggleModal('auditorAppointment', false)} />}

    </div>
  );
};

export default CustomerDetailsPage;
