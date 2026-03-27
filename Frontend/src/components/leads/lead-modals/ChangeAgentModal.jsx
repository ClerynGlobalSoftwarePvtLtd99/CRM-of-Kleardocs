import React, { useState, useEffect } from "react";
import { X, UserCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/slices/usersSlice";

const ChangeAgentModal = ({ currentAgentId, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const { agents, loading } = useSelector((state) => state.users);
  const [selectedAgentId, setSelectedAgentId] = useState(currentAgentId || "");

  useEffect(() => {
    // Fetch agents when modal opens
    console.log('ChangeAgentModal: Fetching agents...');
    dispatch(fetchUsers({ role: 'agent' }));
  }, [dispatch]);

  useEffect(() => {
    setSelectedAgentId(currentAgentId || "");
  }, [currentAgentId]);

  useEffect(() => {
    console.log('ChangeAgentModal - agents:', agents, 'count:', agents.length, 'loading:', loading);
    console.log('ChangeAgentModal - currentAgentId:', currentAgentId);
  }, [agents, loading, currentAgentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedAgentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-5 py-4">
          <h2 className="text-lg font-bold">Change Agent</h2>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Select Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full rounded-lg border border-bg-tertiary bg-bg-tertiary/10 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
            >
              <option value="">Select Agent</option>
              {loading ? (
                <option value="" disabled>Loading agents...</option>
              ) : agents.length === 0 ? (
                <option value="" disabled>No agents available</option>
              ) : (
                agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-bg-tertiary">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-all uppercase"
            >
              <UserCheck size={16} />
              Update Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeAgentModal;
