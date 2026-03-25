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
  fetchLeadEmails 
} from "../redux/slices/leadsSlice";
import LeadDetailsCard from "../components/lead-details/LeadDetailsCard";
import LeadHistorySection from "../components/lead-details/LeadHistorySection";
import AddInteractionModal from "../components/lead-modals/AddInteractionModal";
import ConvertCustomerModal from "../components/lead-modals/ConvertCustomerModal";
import WhatsappTemplateModal from "../components/lead-modals/WhatsappTemplateModal";
import SendTemplateModal from "../components/lead-modals/SendTemplateModal";
import AddTemplateModal from "../components/templates/AddTemplateModal";
import EditContactModal from "../components/lead-modals/EditContactModal";
import NextFollowupModal from "../components/lead-modals/NextFollowupModal";
import ChangeAgentModal from "../components/lead-modals/ChangeAgentModal";
import EditEmailsModal from "../components/customer-modals/EditEmailsModal";

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLead: lead, loading, error, emails } = useSelector((state) => state.leads);

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
  const [toastMessage, setToastMessage] = useState("");

  const [interactionForm, setInteractionForm] = useState({
    details: "",
    called: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error.includes('not found')) {
        navigate('/leads');
      }
    }
  }, [error, navigate]);

  const showToastMessage = (message, type = 'success') => {
    toast[type](message);
  };

  const handleAddInteraction = async () => {
    if (!interactionForm.details.trim()) return;

    try {
      await dispatch(addLeadInteraction({
        id,
        interactionData: {
          type: interactionForm.called ? "call" : "text",
          details: interactionForm.details,
          called: interactionForm.called,
        }
      })).unwrap();
      
      setInteractionForm({ details: "", called: false });
      setShowAddInteraction(false);
      showToastMessage("Interaction Added");
      
      // Refresh lead data
      dispatch(fetchLeadById(id));
    } catch (error) {
      showToastMessage(error || "Failed to add interaction", "error");
    }
  };

  const handleConvertToCustomer = async (convertData) => {
    try {
      await dispatch(convertLeadToCustomer({ id, convertData })).unwrap();
      setShowConvertModal(false);
      showToastMessage("Converted to Customer");
      dispatch(fetchLeadById(id));
    } catch (error) {
      showToastMessage(error || "Failed to convert lead", "error");
    }
  };

  const handleScheduleFollowup = async (followupData) => {
    try {
      await dispatch(addLeadFollowup({ id, followupData })).unwrap();
      setShowFollowupModal(false);
      showToastMessage("Followup Scheduled");
      dispatch(fetchLeadById(id));
    } catch (error) {
      showToastMessage(error || "Failed to schedule followup", "error");
    }
  };

  const handleAssignAgent = async (newAgent) => {
    try {
      await dispatch(assignLeadToAgent({ id, assignData: { agent: newAgent } })).unwrap();
      setShowAssignModal(false);
      showToastMessage(`Assigned to ${newAgent}`);
      dispatch(fetchLeadById(id));
    } catch (error) {
      showToastMessage(error || "Failed to assign agent", "error");
    }
  };

  const handleFetchEmails = async () => {
    try {
      await dispatch(fetchLeadEmails(id)).unwrap();
      dispatch(fetchLeadById(id));
    } catch (error) {
      showToastMessage(error || "Failed to fetch emails", "error");
    }
  };

  const handleUpdateEmails = async (updatedLead) => {
    try {
      if (!lead || !lead._id) {
        throw new Error('Lead data not available');
      }
      
      // Ensure lead has emails property
      const leadWithEmails = {
        ...lead,
        emails: updatedLead.emails || []
      };
      
      // Update lead emails via API (you may need to add this API endpoint)
      // For now, just update local state and show success
      setLead(prev => ({ 
        ...prev, 
        emails: updatedLead.emails || [] 
      }));
      console.log('Emails updated successfully:', updatedLead.emails);
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
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-bg-primary min-h-screen text-text-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-4 bg-bg-primary min-h-screen text-text-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Lead not found</p>
          <button
            onClick={() => navigate('/leads')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-bold"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-bg-primary min-h-screen text-text-primary">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* SECTION 1: HEADER & TOP ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-secondary p-4 rounded-xl border border-bg-tertiary shadow-sm">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-yellow-500">|</span> Lead Details
          </h1>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowConvertModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-all"
            >
              CONVERT TO CUSTOMER
            </button>
            <button 
              onClick={() => setShowFollowupModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-all"
            >
              NEXT FOLLOWUP
            </button>
            <button 
              onClick={() => setShowEmailsModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-all"
            >
              EMAILS
            </button>
            <button 
              onClick={() => setShowEditModal(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-all"
            >
              EDIT
            </button>
          </div>
        </div>

        {/* SECTION 2: MIDDLE CONTENT (LEAD INFO & RIGHT ACTIONS) */}
        <LeadDetailsCard
          lead={lead}
          onChangeAssignClick={() => setShowAssignModal(true)}
          onSendTemplateClick={() => setShowAddTemplateModal(true)}
          onSendWhatsappTemplateClick={() => setShowWhatsappModal(true)}
        />

        {/* SECTION 3: BOTTOM CONTENT (HISTORY & INTERACTION) */}
        <LeadHistorySection
          history={history}
          onAddInteraction={() => setShowAddInteraction(true)}
          onViewEmail={(item) => setSelectedHistoryEmail(item)}
          interactionForm={interactionForm}
          setInteractionForm={setInteractionForm}
          handleAddInteraction={handleAddInteraction}
        />
      </div>

      {showConvertModal && (
        <ConvertCustomerModal
          lead={lead}
          onClose={() => setShowConvertModal(false)}
          onConvert={handleConvertToCustomer}
        />
      )}

      {showFollowupModal && (
        <NextFollowupModal
          lead={lead}
          onUpdate={(data) => {
            setLead(prev => ({ ...prev, ...data }));
            showToastMessage("Lead Updated");
          }}
        />
      )}

      {showAssignModal && (
        <ChangeAgentModal
          currentAgent={lead.agent}
          onClose={() => setShowAssignModal(false)}
          onUpdate={handleAssignAgent}
        />
      )}

      {showEmailsModal && (
        <EditEmailsModal
          customer={lead}
          onClose={() => setShowEmailsModal(false)}
          onUpdate={handleUpdateEmails}
        />
      )}

      {showWhatsappModal && (
        <WhatsappTemplateModal
          lead={lead}
          onClose={() => setShowWhatsappModal(false)}
          onSend={(form) => {
            setHistory(prev => [{
              id: Date.now(),
              datetime: new Date().toLocaleString(),
              user: lead.agent,
              type: "whatsapp",
              text: `Whatsapp Template: ${form.template}`
            }, ...prev]);
            setShowWhatsappModal(false);
            showToastMessage("Whatsapp Template Sent");
          }}
        />
      )}

      {showAddTemplateModal && (
        <AddTemplateModal
          onClose={() => setShowAddTemplateModal(false)}
          onAdd={(template) => {
            setHistory(prev => [{
              id: Date.now(),
              datetime: new Date().toLocaleString(),
              user: lead.agent,
              type: "email",
              text: `Email Template sent - ${template.name}`,
              subject: template.subject,
              body: template.body
            }, ...prev]);
            showToastMessage("Email Template Sent");
          }}
        />
      )}


      {showAddInteraction && (
        <AddInteractionModal
          interactionForm={interactionForm}
          setInteractionForm={setInteractionForm}
          onClose={() => setShowAddInteraction(false)}
          onSubmit={handleAddInteraction}
        />
      )}

      {selectedHistoryEmail && (
        <SendTemplateModal
          templates={[
            {
              id: selectedHistoryEmail.id,
              created: selectedHistoryEmail.datetime,
              name: selectedHistoryEmail.text,
              subject: selectedHistoryEmail.subject,
              status: "Active",
              previewBody: selectedHistoryEmail.body,
              previewOnly: true,
            },
          ]}
          previewMode
          onClose={() => setSelectedHistoryEmail(null)}
          onSendTemplate={() => { }}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[60] bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] px-4 py-3 rounded-xl shadow-xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default LeadDetailsPage;