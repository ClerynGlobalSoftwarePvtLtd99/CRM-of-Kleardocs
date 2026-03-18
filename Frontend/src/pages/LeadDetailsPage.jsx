import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import LeadDetailsCard from "../components/lead-details/LeadDetailsCard";
import LeadHistorySection from "../components/lead-details/LeadHistorySection";
import AddInteractionModal from "../components/lead-modals/AddInteractionModal";
import ConvertCustomerModal from "../components/lead-modals/ConvertCustomerModal";
import WhatsappTemplateModal from "../components/lead-modals/WhatsappTemplateModal";
import SendTemplateModal from "../components/lead-modals/SendTemplateModal";
import AddTemplateModal from "../components/templates/AddTemplateModal";
import EditContactModal from "../components/lead-modals/EditContactModal";
import EditLeadModal from "../components/lead-modals/EditLeadModal";
import NextFollowupModal from "../components/lead-modals/NextFollowupModal";
import ChangeAgentModal from "../components/lead-modals/ChangeAgentModal";

const mockLead = {
  id: "678f8daa1b59325fcdf734a4",
  customerName: "HIDESTAY INDIA PRIVATE LIMITED",
  customerPhone: "8679335165",
  companyName: "HIDESTAY INDIA PRIVATE LIMITED",
  service: "Annual Compliance",
  source: "Whatsapp",
  createdAt: "17th March 2026 6:25 pm",
  lastFollowup: "17th March 2026 7:10 pm",
  email: "hidestayindiapvtltd@gmail.com",
  address:
    "HIMJYOTI ENCLAVE KHATA, NO-945 KHASRA NO-24KH, Ambiwala, Dehradun, Dehradun - 248007, Uttarakhand",
  state: "UTTARAKHAND",
  agent: "Ritu Kaur",
  type: "Customer",
  heat: "Hot",
  priority: "High",
};

const initialHistory = [
  {
    id: 1,
    datetime: "2nd February 2026 4:00 pm",
    user: "Jagjyot Singh",
    type: "text",
    text: "Assigned to Ritu Kaur",
  },
  {
    id: 2,
    datetime: "2nd February 2026 4:00 pm",
    user: "Ritu Kaur",
    type: "text",
    text: "Assigned to Jagjyot Singh",
  },
  {
    id: 3,
    datetime: "2nd February 2026 3:39 pm",
    user: "Ritu Kaur",
    type: "whatsapp",
    text: "Whatsapp Template: retargeting_v4",
  },
  {
    id: 4,
    datetime: "2nd February 2026 3:31 pm",
    user: "Ritu Kaur",
    type: "email",
    text: "Email Template sent - Startup India Registration",
    subject: "Startup India Registration - Next Steps & Document Submission",
    body: `Accordion summary...

Accordion body...`,
  },
  {
    id: 5,
    datetime: "2nd February 2026 3:07 pm",
    user: "Ritu Kaur",
    type: "call",
    text: "fvscgvdc",
    called: true,
  },
  {
    id: 6,
    datetime: "2nd February 2026 1:23 pm",
    user: "Ritu Kaur",
    type: "call",
    text: "He is very interested do this work.",
    called: true,
  },
];

const LeadDetailsPage = () => {
  const { id } = useParams();

  const [lead, setLead] = useState({ ...mockLead, id });
  const [history, setHistory] = useState(initialHistory);

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
  const [toast, setToast] = useState("");

  const [interactionForm, setInteractionForm] = useState({
    details: "",
    called: false,
  });

  const showToastMessage = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddInteraction = () => {
    if (!interactionForm.details.trim()) return;

    const newItem = {
      id: Date.now(),
      datetime: new Date().toLocaleString(),
      user: lead.agent,
      type: interactionForm.called ? "call" : "text",
      text: interactionForm.details,
      called: interactionForm.called,
    };

    setHistory((prev) => [newItem, ...prev]);
    setInteractionForm({ details: "", called: false });
    setShowAddInteraction(false);
    showToastMessage("Interaction Added");
  };

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
          onConvert={() => {
            showToastMessage("Converted to Customer");
            setLead(prev => ({ ...prev, isCustomer: true }));
          }}
        />
      )}

      {showFollowupModal && (
        <NextFollowupModal
          lead={lead}
          onClose={() => setShowFollowupModal(false)}
          onUpdate={(data) => {
            setLead(prev => ({ ...prev, lastFollowup: data.nextFollowup }));
            setHistory(prev => [{
              id: Date.now(),
              datetime: new Date().toLocaleString(),
              user: lead.agent,
              type: "text",
              text: `Next Followup scheduled: ${data.nextFollowup}. ${data.details}`
            }, ...prev]);
            showToastMessage("Followup Scheduled");
          }}
        />
      )}

      {showEmailsModal && (
        <EditContactModal
          lead={lead}
          onClose={() => setShowEmailsModal(false)}
          onUpdate={(data) => {
            setLead(prev => ({ ...prev, customerName: data.name, customerPhone: data.phone, email: data.email }));
            showToastMessage("Contact Info Updated");
          }}
        />
      )}

      {showEditModal && (
        <EditLeadModal
          lead={lead}
          onClose={() => setShowEditModal(false)}
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
          onUpdate={(newAgent) => {
            setLead(prev => ({ ...prev, agent: newAgent }));
            setHistory(prev => [{
              id: Date.now(),
              datetime: new Date().toLocaleString(),
              user: "System",
              type: "text",
              text: `Assigned to ${newAgent}`
            }, ...prev]);
            showToastMessage(`Assigned to ${newAgent}`);
          }}
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

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] px-4 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default LeadDetailsPage;