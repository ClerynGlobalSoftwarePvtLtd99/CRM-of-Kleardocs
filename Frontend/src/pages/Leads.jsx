import { useState } from "react";
import toast from "react-hot-toast";

import LeadsHeader from "../components/leads/LeadsHeader";
import LeadsFilter from "../components/leads/LeadsFilter";
import LeadsTable from "../components/leads/LeadsTable";
import AddLeadModal from "../components/leads/AddLeadModal";

const Leads = () => {
  const [showModal, setShowModal] = useState(false);

  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Test",
      phone: "+91 1111",
      company: "",
      service: "Annual Compliance",
      source: "WhatsApp",
      agent: "Ritu Kaur",
      type: "Hot",
      priority: "High",
      createdAt: "17th Mar 2026 12:41 pm",
    },
  ]);

  // ✅ HANDLE ADD LEAD
  const handleAddLead = (newLead) => {
    setLeads((prev) => [
      ...prev,
      {
        ...newLead,
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
      },
    ]);

    setShowModal(false);

    // 🔥 TOAST SUCCESS
    toast.success("Lead added successfully ");
  };

  return (
    <div className="p-4 bg-bg-primary text-text-primary h-full">
      
      <LeadsHeader onAdd={() => setShowModal(true)} count={leads.length} />

      <LeadsFilter />

      <LeadsTable leads={leads} />

      {showModal && (
        <AddLeadModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddLead}   // 🔥 IMPORTANT
        />
      )}

    </div>
  );
};

export default Leads;