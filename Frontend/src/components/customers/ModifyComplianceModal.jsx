import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateCustomerCompliance } from "../../redux/slices/customersSlice";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";
import axiosInstance from "../../api/axiosInstance";

const ModifyComplianceModal = ({ customerId, compliance, onClose }) => {
  const { id: urlId } = useParams();
  const actualCustomerId = customerId || urlId;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    hasExpiry: false,
    status: "To Be Done",
    accountant: "None",
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const users = response.data.data || [];
        // Filter for agents and admins who can be assigned as accountants
        const filteredAgents = users.filter(u => u.role === 'agent' || u.role === 'admin' || u.role === 'accountant');
        setAgents(filteredAgents);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    if (compliance) {
      setFormData({
        name: compliance.name || "",
        hasExpiry: compliance.hasExpiry || false,
        status: compliance.status || "To Be Done",
        accountant: compliance.accountant || "None",
      });
    }
  }, [compliance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = { ...formData };

      // Automatically set completion date if status is changed to 'Done'
      if (formData.status === "Done") {
        updateData.completedOn = new Date().toISOString();
      }

      await dispatch(updateCustomerCompliance({
        customerId: actualCustomerId,
        complianceId: compliance._id,
        data: updateData
      })).unwrap();

      toast.success("Compliance updated");
      onClose();
    } catch (err) {
      toast.error(err || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-[500px] max-h-[90vh] bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-bg-tertiary flex-shrink-0">
          <h2 className="text-2xl font-bold text-text-primary">Edit Compliance</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">

          {/* Compliance Name */}
          <div className="fieldset-input">
            <label className="fieldset-label bg-bg-secondary">Compliance Name *</label>
            <textarea
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Has Expiry Toggle */}
          <div className="flex items-center gap-4 py-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.hasExpiry}
                onChange={(e) => setFormData({ ...formData, hasExpiry: e.target.checked })}
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
            </label>
            <span className="text-text-secondary font-medium">Has Expiry?</span>
          </div>

          {/* Status Dropdown */}
          <div className="fieldset-input">
            <label className="fieldset-label bg-bg-secondary">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="To Be Done">To Be Done</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Accountant Dropdown */}
          <div className="fieldset-input">
            <label className="fieldset-label bg-bg-secondary">Accountant</label>
            <select
              value={formData.accountant}
              onChange={(e) => setFormData({ ...formData, accountant: e.target.value })}
              disabled={loadingAgents}
            >
              <option value="None">None</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
            {loadingAgents && <p className="text-[10px] text-text-secondary mt-1">Loading accountants...</p>}
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-105 mt-2 flex-shrink-0"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <Check size={22} strokeWidth={3} />
                <span className="uppercase font-bold tracking-wider">Update Compliance</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifyComplianceModal;
