import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { fetchLeads, createNewLead } from "../redux/slices/leadsSlice";
import LeadsHeader from "../components/leads/LeadsHeader";
import LeadsFilter from "../components/leads/LeadsFilter";
import LeadsTable from "../components/leads/LeadsTable";
import AddLeadModal from "../components/leads/AddLeadModal";
import ContentLoader from "../components/common/ContentLoader";

const Leads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: leads, loading, error } = useSelector((state) => state.leads);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    dispatch(fetchLeads(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ✅ HANDLE ADD LEAD
  const handleAddLead = async (newLead) => {
    try {
      await dispatch(createNewLead(newLead)).unwrap();
      setShowModal(false);
      toast.success("Lead added successfully");
    } catch (error) {
      toast.error(error || "Failed to add lead");
    }
  };

  // ✅ HANDLE LEAD CLICK
  const handleLeadClick = (leadId) => {
    navigate(`/lead/${leadId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader message="Fetching leads..." />
      </div>
    );
  }

  return (
    <div className="p-4 bg-bg-primary text-text-primary h-full">
      <LeadsHeader 
        onAdd={() => setShowModal(true)} 
        count={leads.length} 
      />

      <LeadsFilter onFilterChange={handleFilterChange} filters={filters} />

      <LeadsTable 
        leads={leads} 
        loading={loading}
        onLeadClick={handleLeadClick}
      />

      {showModal && (
        <AddLeadModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddLead}
        />
      )}
    </div>
  );
};

export default Leads;