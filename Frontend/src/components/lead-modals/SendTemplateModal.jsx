import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import TemplatesFilter from "../templates/TemplatesFilters";
import TemplatesHeader from "../templates/TemplatesHeader";
import TemplatesTable from "../templates/TemplatesTable";

const SendTemplateModal = ({
  templates,
  onClose,
  onSendTemplate,
  previewMode = false,
}) => {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const q = searchFilter.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q)
      );
    });
  }, [templates, searchFilter]);

  const handleEditClick = (tmpl) => {
    if (!previewMode) {
      onSendTemplate(tmpl);
    }
  };

  const handleManageClick = (tmpl) => {
    if (!previewMode) {
      onSendTemplate(tmpl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-bg-tertiary)]">
          <h3 className="text-xl font-semibold">
            {previewMode ? "Email Template Preview" : "Send Template"}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {!previewMode && (
            <>
              <TemplatesHeader count={filteredTemplates.length} onAddClick={() => {}} />
              <TemplatesFilter
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
              />
            </>
          )}

          <TemplatesTable
            templates={filteredTemplates}
            onEditClick={handleEditClick}
            onManageClick={handleManageClick}
          />

          {previewMode && filteredTemplates[0]?.previewBody && (
            <div className="mt-6 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-xl p-4 whitespace-pre-line">
              <p className="font-semibold mb-3">Subject :-</p>
              <p className="mb-4">{filteredTemplates[0]?.subject}</p>
              <div>{filteredTemplates[0]?.previewBody}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendTemplateModal;