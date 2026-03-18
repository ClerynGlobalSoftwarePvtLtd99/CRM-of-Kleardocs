import React from "react";
import { Plus, X } from "lucide-react";

const AddInteractionModal = ({
  interactionForm,
  setInteractionForm,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-bg-tertiary)]">
          <h3 className="text-xl font-semibold">Add Interaction</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block mb-2 font-medium">Interaction Details *</label>
            <textarea
              rows={5}
              value={interactionForm.details}
              onChange={(e) =>
                setInteractionForm((prev) => ({
                  ...prev,
                  details: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-xl outline-none focus:border-[var(--color-accent)]"
              placeholder="Enter interaction details..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setInteractionForm((prev) => ({
                  ...prev,
                  called: !prev.called,
                }))
              }
              className={`w-14 h-8 rounded-full relative transition-colors ${
                interactionForm.called ? "bg-green-600" : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                  interactionForm.called ? "left-7" : "left-1"
                }`}
              />
            </button>
            <span className="font-medium">Phone call made?</span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onSubmit}
              className="bg-[var(--color-accent)] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Interaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInteractionModal;