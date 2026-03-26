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
  const [toastMessage, setToastMessage] = useState("");

  const [interactionForm, setInteractionForm] = useState({
    details: "",
    called: false,
  });

  const [isInteractionFormVisible, setIsInteractionFormVisible] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
      // Also fetch emails to ensure they're available
      dispatch(fetchLeadEmails(id));
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

  useEffect(() => {
    if (lead) {
      console.log('Lead data loaded:', lead);
      console.log('Lead history:', lead.history);
      console.log('Lead emails:', lead.emails);
      console.log('Redux emails:', emails);
      
      // Update lead with emails from Redux if not already present
      if (emails && (!lead.emails || lead.emails.length === 0)) {
        lead.emails = emails;
      }
      
      // Check if lead has history property
      const leadHistory = lead.history || [];
      
      // Map history items to consistent format with null checks
      const formattedHistory = leadHistory.filter(h => h && typeof h === 'object').map(h => {
        const historyItem = {
          id: h._id || Date.now(),
          datetime: h.createdAt ? new Date(h.createdAt).toLocaleString() : new Date().toLocaleString(),
          user: (h.createdBy && h.createdBy.name) ? h.createdBy.name : h.createdBy || lead.agent || 'System',
          type: h.type || 'interaction',
          text: h.details || 'History Entry',
          details: h.notes || '',
          notes: h.notes || '', // Add notes field for followup items
          called: h.phoneCalled || false // Use phoneCalled from backend response
        };
        
        // Handle conversion history specially
        if (h.type === 'converted') {
          historyItem.text = `Converted to customer`;
          historyItem.details = h.details || 'Conversion completed';
        }
        
        // Handle followup history specially - put notes in both details and notes for compatibility
        if (h.type === 'followup') {
          historyItem.notes = h.notes || '';
          historyItem.details = h.details || '';
        }
        
        return historyItem;
      });
      
      console.log('Formatted history:', formattedHistory);
      setHistory(formattedHistory);
    }
  }, [lead, emails]);

  const showToastMessage = (message, type = 'success') => {
    toast[type](message);
  };

  const handleAddInteraction = () => {
    setShowAddInteraction(true);
  };

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
      showToastMessage("Interaction Added");
      
      // Refresh lead data
      dispatch(fetchLeadById(id));
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  const handleConvertToCustomer = async (convertData) => {
    try {
      const result = await dispatch(convertLeadToCustomer({ id, convertData })).unwrap();
      setShowConvertModal(false);
      showToastMessage("Converted to Customer");
      
      // After successful conversion, fetch the new customer and add to customers list
      if (result.conversion.customerId) {
        try {
          const { createCustomer } = await import('../redux/slices/customersSlice');
          const axiosInstance = (await import('../api/axiosInstance')).default;
          const customerResponse = await axiosInstance.get(`/customers/${result.conversion.customerId}`);
          
          // Add the new customer to the customers list
          await dispatch(createCustomer(customerResponse.data.data));
        } catch (error) {
          console.error('Failed to add converted customer to list:', error);
        }
      }
      
      // Redirect to customers page after successful conversion
      navigate('/customers');
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  const handleScheduleFollowup = async (followupData) => {
    try {
      // Transform data to match backend API structure
      const apiData = {
        followupDate: followupData.nextFollowup,
        phoneCalled: false, // Default value, can be updated if needed
        details: followupData.details || ""
      };
      
      await dispatch(addLeadFollowup({ id, followupData: apiData })).unwrap();
      setShowFollowupModal(false);
      showToastMessage("Followup Scheduled");
      
      // Redux slice already handles history updates
      // Refresh lead data to get updated history
      dispatch(fetchLeadById(id));
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  const handleAssignAgent = async (newAgentId) => {
    try {
      await dispatch(assignLeadToAgent({ id, assignData: { agentId: newAgentId } })).unwrap();
      setShowAssignModal(false);
      
      const selectedAgent = agents.find(a => a._id === newAgentId);
      showToastMessage(`Assigned to ${selectedAgent?.name || 'Agent'}`);
      
      dispatch(fetchLeadById(id));
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  const handleFetchEmails = async () => {
    try {
      await dispatch(fetchLeadEmails(id)).unwrap();
      dispatch(fetchLeadById(id));
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  const handleEditLead = async (updatedData) => {
    try {
      if (!lead || !lead._id) {
        throw new Error('Lead data not available');
      }
      
      // Update lead via API
      await dispatch(updateExistingLead({ 
        id: lead._id, 
        leadData: updatedData 
      })).unwrap();
      
      // If lead is converted to customer and service was updated, also update customer service
      if (lead.isCustomer && lead.customer && updatedData.service) {
        try {
          // Check if service actually changed
          const oldService = lead.service || lead.type || '';
          const newService = updatedData.service;
          
          if (oldService !== newService) {
            // Fetch services to find the serviceId by name
            const { fetchServices } = await import('../redux/slices/servicesSlice');
            const servicesResult = await dispatch(fetchServices()).unwrap();
            
            // Find the service by name
            const service = servicesResult.find(s => s.name === newService);
            
            if (service) {
              const { addServiceToCustomer } = await import('../redux/slices/customersSlice');
              const serviceData = {
                serviceId: service._id,
                startDate: new Date().toISOString().split('T')[0],
                status: 'Active'
              };
              
              await dispatch(addServiceToCustomer({ 
                customerId: lead.customer, 
                serviceData 
              })).unwrap();
              
              console.log('Service updated for customer:', lead.customer, 'New service:', newService);
            } else {
              console.warn('Service not found:', newService);
            }
          }
        } catch (serviceError) {
          console.error('Failed to update customer service:', serviceError);
          // Don't fail the whole operation if service update fails
        }
      }
      
      toast.success("Lead updated successfully!");
      
      // Refresh lead data to get updated information
      await dispatch(fetchLeadById(id));
      
      // Close modal after successful update
      setShowEditModal(false);
    } catch (error) {
      const errorMessage = String(error);
      console.error('Lead update error:', error);
      toast.error(errorMessage);
    }
  };

  const handleUpdateEmails = async (updatedLead) => {
    try {
      if (!lead || !lead._id) {
        throw new Error('Lead data not available');
      }
      
      // Update lead emails via API
      const result = await dispatch(updateLeadEmailsThunk({ 
        id: lead._id, 
        emails: updatedLead.emails || [] 
      })).unwrap();
      
      console.log('Email update result:', result);
      console.log('Updated lead emails:', updatedLead.emails);
      
      toast.success("Emails updated successfully!");
      
      // Refresh lead data to get updated information
      await dispatch(fetchLeadById(id));
      await dispatch(fetchLeadEmails(id));
      
      // Close modal after successful update
      setShowEmailsModal(false);
    } catch (error) {
      const errorMessage = String(error);
      console.error('Email update error:', error);
      toast.error(errorMessage);
    }
  };

  const handleSendEmailTemplate = async (templateData) => {
    try {
      await dispatch(sendEmailTemplateToLead({ 
        id: lead._id, 
        templateData 
      })).unwrap();
      
      setShowAddTemplateModal(false);
      showToastMessage("Email template sent successfully!");
      
      // Redux slice doesn't handle email template history, so we add it manually
      setHistory(prev => [{
        id: Date.now(),
        datetime: new Date().toLocaleString(),
        user: lead.agent,
        type: "email",
        text: `Email Template sent - ${templateData.templateName}`,
        subject: templateData.subject,
        body: templateData.body
      }, ...prev]);
      
      // Refresh lead data
      dispatch(fetchLeadById(id));
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  const handleSendWhatsappTemplate = async (templateData) => {
    try {
      await dispatch(sendWhatsappTemplateToLead({ 
        id: lead._id, 
        templateData 
      })).unwrap();
      
      setShowWhatsappModal(false);
      showToastMessage("WhatsApp template sent successfully!");
      
      // Redux slice doesn't handle WhatsApp template history, so we add it manually
      setHistory(prev => [{
        id: Date.now(),
        datetime: new Date().toLocaleString(),
        user: lead.agent,
        type: "whatsapp",
        text: `WhatsApp Template: ${templateData.templateName}`
      }, ...prev]);
      
      // Refresh lead data
      dispatch(fetchLeadById(id));
    } catch (error) {
      const errorMessage = String(error);
      showToastMessage(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-bg-primary min-h-screen flex items-center justify-center">
        <ContentLoader message="Fetching lead details..." />
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-yellow-500">|</span> Lead Details
            </h1>
            {lead.isCustomer && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-green-600/10 text-green-600 border border-green-600/20 uppercase">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Customer
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {!lead.isCustomer && (
              <button 
                onClick={() => setShowConvertModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-all"
              >
                CONVERT TO CUSTOMER
              </button>
            )}
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
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-all"
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
          onAddInteraction={handleAddInteraction}
          onViewEmail={(item) => setSelectedHistoryEmail(item)}
          interactionForm={interactionForm}
          setInteractionForm={setInteractionForm}
          handleAddInteraction={handleSubmitInteraction}
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
          onClose={() => setShowFollowupModal(false)}
          onUpdate={handleScheduleFollowup}
        />
      )}

      {showAssignModal && (
        <ChangeAgentModal
          currentAgentId={lead.agent?._id}
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

      {showEditModal && (
        <EditContactModal
          lead={lead}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleEditLead}
        />
      )}

      {showWhatsappModal && (
        <WhatsappTemplateModal
          lead={lead}
          onClose={() => setShowWhatsappModal(false)}
          onSend={handleSendWhatsappTemplate}
        />
      )}

      {showAddTemplateModal && (
        <AddTemplateModal
          onClose={() => setShowAddTemplateModal(false)}
          onAdd={handleSendEmailTemplate}
        />
      )}


      {showAddInteraction && (
        <AddInteractionModal
          interactionForm={interactionForm}
          setInteractionForm={setInteractionForm}
          onClose={() => setShowAddInteraction(false)}
          onSubmit={handleSubmitInteraction}
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