import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { 
  fetchLeadById, 
  addLeadFollowup, 
  addLeadInteraction, 
  assignLeadToAgent, 
  convertLeadToCustomer, 
  fetchLeadEmails,
  updateLeadEmailsThunk,
  updateExistingLead,
  sendEmailTemplateToLead,
  sendWhatsappTemplateToLead
} from "../redux/slices/leadsSlice";
import ContentLoader from "../components/common/ContentLoader";
import LeadDetailsCard from "../components/leads/lead-details/LeadDetailsCard";
import LeadHistorySection from "../components/leads/lead-details/LeadHistorySection";
import AddInteractionModal from "../components/leads/lead-modals/AddInteractionModal";
import ConvertCustomerModal from "../components/leads/lead-modals/ConvertCustomerModal";
import WhatsappTemplateModal from "../components/leads/lead-modals/WhatsappTemplateModal";
import SendTemplateModal from "../components/leads/lead-modals/SendTemplateModal";
import AddTemplateModal from "../components/templates/AddTemplateModal";
import EditContactModal from "../components/leads/lead-modals/EditContactModal";
import NextFollowupModal from "../components/leads/lead-modals/NextFollowupModal";
import ChangeAgentModal from "../components/leads/lead-modals/ChangeAgentModal";
import EditEmailsModal from "../components/customers/EditEmailsModal";
import { User, Phone, Briefcase, Globe, Calendar, Clock, MapPin, Tag, CheckCircle, Flame, AlertCircle, MessageSquare } from "lucide-react";

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLead: lead, loading, error, emails } = useSelector((state) => state.leads);
  const { agents } = useSelector((state) => state.users);

  const [history, setHistory] = useState([]);

  // Modal States
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showEmailsModal, setShowEmailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const [selectedHistoryEmail, setSelectedHistoryEmail] = useState(null);
  const [interactionForm, setInteractionForm] = useState({
    details: "",
    called: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
      dispatch(fetchLeadEmails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error.includes('not found')) navigate('/leads');
    }
  }, [error, navigate]);

  useEffect(() => {
    if (lead) {
      const leadHistory = lead.history || [];
      const formattedHistory = leadHistory.filter(h => h && typeof h === 'object').map(h => {
        const historyItem = {
          id: h._id || Date.now(),
          datetime: h.createdAt ? new Date(h.createdAt).toLocaleString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
          }) : new Date().toLocaleString(),
          user: h.createdBy?.name || 'System',
          type: h.type || 'interaction',
          text: h.details || 'History Entry',
          notes: h.notes || '',
          called: h.phoneCalled || false
        };
        
        if (h.type === 'converted') historyItem.text = `Converted to customer`;
        return historyItem;
      });
      setHistory(formattedHistory);
    }
  }, [lead]);

  const handleAddInteraction = () => setShowAddInteraction(true);

  const handleSubmitInteraction = async () => {
    if (!interactionForm.details.trim()) return;
    try {
      await dispatch(addLeadInteraction({
        id,
        interactionData: {
          type: interactionForm.called ? "call" : "text",
          details: interactionForm.details,
          phoneCalled: interactionForm.called,
        }
      })).unwrap();
      
      setInteractionForm({ details: "", called: false });
      setShowAddInteraction(false);
      toast.success("Interaction Added");
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleConvertToCustomer = async (convertData) => {
    try {
      const result = await dispatch(convertLeadToCustomer({ id, convertData })).unwrap();
      setShowConvertModal(false);
      toast.success("Converted to Customer");
      
      // Navigate to customer details with the 6-button view
      const customerId = result.conversion?.customer?._id || result.conversion?._id;
      if (customerId) {
        navigate(`/customer/${customerId}?view=converted`);
      } else {
        navigate('/customers');
      }
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleScheduleFollowup = async (followupData) => {
    try {
      const apiData = {
        followupDate: followupData.nextFollowup,
        phoneCalled: followupData.called || false,
        details: followupData.details || ""
      };
      await dispatch(addLeadFollowup({ id, followupData: apiData })).unwrap();
      setShowFollowupModal(false);
      toast.success("Followup Scheduled");
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleAssignAgent = async (newAgentId) => {
    try {
      await dispatch(assignLeadToAgent({ id, assignData: { agentId: newAgentId } })).unwrap();
      setShowAssignModal(false);
      toast.success(`Agent updated`);
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleEditLead = async (updatedData) => {
    try {
      await dispatch(updateExistingLead({ id: lead._id, leadData: updatedData })).unwrap();
      setShowEditModal(false);
      toast.success("Lead updated successfully!");
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleUpdateEmails = async (updatedLead) => {
    try {
      await dispatch(updateLeadEmailsThunk({ id: lead._id, emails: updatedLead.emails || [] })).unwrap();
      setShowEmailsModal(false);
      toast.success("Emails updated successfully!");
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleSendEmailTemplate = async (templateData) => {
    try {
      await dispatch(sendEmailTemplateToLead({ id: lead._id, templateData })).unwrap();
      setShowAddTemplateModal(false);
      toast.success("Email sent!");
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleSendWhatsappTemplate = async (templateData) => {
    try {
      await dispatch(sendWhatsappTemplateToLead({ id: lead._id, templateData })).unwrap();
      setShowWhatsappModal(false);
      toast.success("WhatsApp message sent!");
      dispatch(fetchLeadById(id));
    } catch (err) {
      toast.error(String(err));
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-bg-primary min-h-screen flex items-center justify-center">
        <ContentLoader message="Loading premium lead insights..." />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="p-6 bg-bg-primary min-h-screen text-text-primary">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* SECTION 1: HEADER & PRIMARY ACTIONS */}
        <div className="bg-bg-secondary p-6 rounded-2xl border border-bg-tertiary shadow-lg relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 w-1 h-full bg-crm-orange"></div>
          
          {/* Row 1: Title & Top Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black tracking-tight uppercase">Lead Details</h1>
              {lead.isCustomer && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-500 text-white uppercase tracking-widest shadow-sm">
                  Customer
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {!lead.isCustomer && (
                <button 
                  onClick={() => setShowConvertModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest"
                >
                  Convert to Customer
                </button>
              )}
              <button 
                onClick={() => setShowFollowupModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                Next Followup
              </button>
              <button 
                onClick={() => setShowEmailsModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                Emails
              </button>
              <button 
                onClick={() => setShowEditModal(true)}
                className="bg-crm-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Row 2: Secondary Actions (Right Aligned) */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <div className="flex items-center gap-2 mr-2 bg-bg-tertiary/20 px-4 py-2 rounded-xl border border-bg-tertiary">
              <span className="text-[10px] font-black uppercase text-text-secondary opacity-60">Agent:</span>
              <span className="text-sm font-black text-crm-orange">{lead.agent?.name || 'Unassigned'}</span>
            </div>

            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest"
            >
              Change Assign
            </button>
            
            <button
              onClick={() => setShowAddTemplateModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest"
            >
              Send Template
            </button>
            
            <button
              onClick={() => setShowWhatsappModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} />
              Send Whatsapp Template
            </button>
          </div>

          {/* Row 3: Lead Identity & Status Badges */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-bg-tertiary/10">
            <div className="flex items-center gap-3 pr-4 border-r border-bg-tertiary">
              <span className="text-xl font-black tracking-tight text-text-primary uppercase">{lead.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded bg-green-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">CUSTOMER</span>
              <span className="px-3 py-1 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">CALL</span>
              <span className={`px-3 py-1 rounded text-white text-[10px] font-black uppercase tracking-widest shadow-sm ${lead.type === 'Hot' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {(lead.type || 'HOT').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded text-white text-[10px] font-black uppercase tracking-widest shadow-sm ${lead.priority === 'High' ? 'bg-red-500' : 'bg-green-500'}`}>
                {(lead.priority || 'HIGH').toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded bg-orange-100 text-orange-700 border border-orange-200 text-[10px] font-black uppercase tracking-widest">
                {(lead.response || 'Interested').toUpperCase()}
              </span>
            </div>
          </div>

          
        </div>

        {/* SECTION 2: INFORMATION & STATUS TABLETS */}
        <LeadDetailsCard
          lead={lead}
          onChangeAssignClick={() => setShowAssignModal(true)}
          onSendTemplateClick={() => setShowAddTemplateModal(true)}
          onSendWhatsappTemplateClick={() => setShowWhatsappModal(true)}
        />

        {/* SECTION 3: BOTTOM CONTENT (HISTORY & INTERACTION) */}
        <LeadHistorySection
          history={history}
          onAddInteraction={handleAddInteraction}
          onViewEmail={(item) => setSelectedHistoryEmail(item)}
          interactionForm={interactionForm}
          setInteractionForm={setInteractionForm}
          handleAddInteraction={handleSubmitInteraction}
        />
      </div>

      {/* Modals remain same but ensure they match new specs in their own files */}
      {showConvertModal && <ConvertCustomerModal lead={lead} onClose={() => setShowConvertModal(false)} onConvert={handleConvertToCustomer} />}
      {showFollowupModal && <NextFollowupModal lead={lead} onClose={() => setShowFollowupModal(false)} onUpdate={handleScheduleFollowup} />}
      {showAssignModal && <ChangeAgentModal currentAgentId={lead.agent?._id} onClose={() => setShowAssignModal(false)} onUpdate={handleAssignAgent} />}
      {showEmailsModal && <EditEmailsModal customer={lead} onClose={() => setShowEmailsModal(false)} onUpdate={handleUpdateEmails} />}
      {showEditModal && <EditContactModal lead={lead} onClose={() => setShowEditModal(false)} onUpdate={handleEditLead} />}
      {showWhatsappModal && <WhatsappTemplateModal lead={lead} onClose={() => setShowWhatsappModal(false)} onSend={handleSendWhatsappTemplate} />}
      {showAddTemplateModal && (
        <SendTemplateModal
          lead={lead}
          onClose={() => setShowAddTemplateModal(false)}
          onSendTemplate={handleSendEmailTemplate}
        />
      )}{showAddInteraction && <AddInteractionModal interactionForm={interactionForm} setInteractionForm={setInteractionForm} onClose={() => setShowAddInteraction(false)} onSubmit={handleSubmitInteraction} />}

      {selectedHistoryEmail && (
        <SendTemplateModal
          templates={[{ id: selectedHistoryEmail.id, created: selectedHistoryEmail.datetime, name: selectedHistoryEmail.text, subject: selectedHistoryEmail.subject, status: "Active", previewBody: selectedHistoryEmail.body, previewOnly: true }]}
          previewMode onClose={() => setSelectedHistoryEmail(null)} onSendTemplate={() => { }}
        />
      )}
    </div>
  );
};

export default LeadDetailsPage;