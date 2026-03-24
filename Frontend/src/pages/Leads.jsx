import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { fetchLeads, createNewLead } from "../redux/slices/leadsSlice";
import LeadsHeader from "../components/leads/LeadsHeader";
import LeadsFilter from "../components/leads/LeadsFilter";
import LeadsTable from "../components/leads/LeadsTable";
import AddLeadModal from "../components/leads/AddLeadModal";
import Loader from "../components/Loader";

const Leads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: leads, loading, error } = useSelector((state) => state.leads);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const debounceTimeoutRef = useRef(null);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout to debounce API calls
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedFilters(newFilters);
    }, 300);
  }, []);

  useEffect(() => {
    dispatch(fetchLeads(debouncedFilters));
  }, [dispatch, debouncedFilters]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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

  if (loading && leads.length === 0) {
    return (
      <div className="p-4 bg-bg-primary text-text-primary h-full flex items-center justify-center">
        <Loader />
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