import React, { useState, useEffect } from "react";
import { X, Send, Paperclip, Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { 
  sendCustomerEmail, 
  fetchCustomerById
} from "../../redux/slices/customersSlice";
import { fetchTemplates } from "../../redux/slices/templatesSlice";

const TEMPLATE_VARIABLES = [
  { title: 'Customer:', vars: ['{{name}}', '{{companyName}}', '{{address}}', '{{phone}}', '{{email}}', '{{username}}', '{{password}}'] },
  { title: 'Invoice:', vars: ['{{invoiceNo}}', '{{invoiceDate}}', '{{invoiceAmount}}', '{{subTotal}}', '{{totalGst}}', '{{due}}'] },
  { title: 'Compliance:', vars: ['{{complianceName}}', '{{complianceStatus}}', '{{complianceDoneDate}}', '{{complianceExpiryDate}}', '{{complianceFinancialYear}}'] },
  { title: 'System:', vars: ['{{currentDate}}', '{{currentYear}}'] },
];

const SendTemplateModal = ({ customer, onClose }) => {
  const dispatch = useDispatch();
  const { list: templates, loading: templatesLoading } = useSelector((state) => state.templates);
  const { loading: sendingEmail } = useSelector((state) => state.customers);

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [showVariables, setShowVariables] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState([]);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const selectedTemplate = templates.find((t) => String(t.id || t._id) === String(selectedTemplateId));

  // Update subject and body when template is selected
  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find((t) => String(t.id || t._id) === String(selectedTemplateId));
      if (template) {
        // Simple client-side placeholder replacement for preview
        let processedSubject = template.subject || "";
        let processedBody = template.body || "";

        const replacements = {
          "{{name}}": customer?.name || "",
          "{{companyName}}": customer?.companyName || "",
          "{{address}}": customer?.address || "",
          "{{phone}}": customer?.phone || "",
          "{{email}}": customer?.emails?.[0] || "",
          "{{username}}": customer?.username || "",
          "{{password}}": customer?.password || "",
          "{{currentDate}}": new Date().toLocaleDateString('en-GB'),
          "{{currentYear}}": new Date().getFullYear().toString(),
        };

        Object.entries(replacements).forEach(([key, value]) => {
          processedSubject = String(processedSubject).replaceAll(key, value);
          processedBody = String(processedBody).replaceAll(key, value);
        });

        setSubject(processedSubject);
        setContent(processedBody);
        setValidationWarnings([]);
      }
    }
  }, [selectedTemplateId, templates, customer]);

  const handleTemplateChange = (e) => {
    setSelectedTemplateId(e.target.value);
  };


  const handleSend = async () => {
    if (!selectedTemplateId || !subject || !content) {
      toast.error("Please fill all fields");
      return;
    }

    if (!customer?.emails || customer.emails.length === 0) {
      toast.error("Customer has no email addresses");
      return;
    }

    try {
      const template = templates.find(t => String(t.id || t._id) === String(selectedTemplateId));
      const result = await dispatch(sendCustomerEmail({
        customerId: customer._id,
        templateId: selectedTemplateId,
        data: { subject, content }
      })).unwrap();

      toast.success(
        <div className="space-y-1">
          <p>Email sent successfully!</p>
          <p className="text-xs opacity-80">Message ID: {result.messageId?.substring(0, 20)}...</p>
          {result.hasAttachments && (
            <p className="text-xs opacity-80">Attachments: {result.attachmentNames.join(", ")}</p>
          )}
        </div>
      );
      
      dispatch(fetchCustomerById({ customerId: customer._id }));
      onClose();
    } catch (err) {
      toast.error(err || "Failed to send email");
    }
  };

  const hasEmails = customer?.emails && customer.emails.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[var(--color-text-primary)]">
      <div className="w-full max-w-5xl bg-bg-secondary border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-bg-tertiary)]">
          <div className="flex-1" />
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-lg font-bold">Send Email Template</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">via Brevo Transactional Email</p>
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={onClose} className="p-2 transition-colors text-[var(--color-text-secondary)] hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Warning if no emails */}
        {!hasEmails && (
          <div className="px-5 pt-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-sm text-red-400">
                <strong>No email addresses on file.</strong> Please add an email first before sending templates.
              </p>
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validationWarnings.length > 0 && (
          <div className="px-5 pt-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-yellow-500" size={16} />
                <p className="text-sm font-medium text-yellow-400">
                  Template has undefined variables
                </p>
              </div>
              <ul className="text-xs text-yellow-300/80 space-y-1 ml-6">
                {validationWarnings.map((warning, idx) => (
                  <li key={idx}>• {warning.placeholder}: {warning.description}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col overflow-hidden flex-1">
          {/* Editor Panel */}
          <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
            {/* Template Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="fieldset-input">
                <span className="fieldset-label bg-[var(--color-bg-secondary)]">Select Template *</span>
                <select 
                  value={selectedTemplateId || ""} 
                  onChange={handleTemplateChange}
                  disabled={templatesLoading || templates.length === 0}
                  className="bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                >
                  <option value="">
                    {templatesLoading 
                      ? "Loading templates..." 
                      : templates.length === 0 
                        ? "No templates available - create in Templates section" 
                        : "-- Choose Template --"
                    }
                  </option>
                  {templates.map((t) => (
                    <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="fieldset-input">
                <span className="fieldset-label bg-[var(--color-bg-secondary)]">Subject *</span>
                <input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="Email Subject"
                  className="bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                />
              </div>
            </div>

            {/* Variables Toggle */}
            <div className="border border-[var(--color-bg-tertiary)] rounded-lg overflow-hidden">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className="w-full px-4 py-2 flex items-center justify-between bg-[var(--color-bg-tertiary)]/30 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-crm-orange)]">
                  Available Template Variables
                </span>
                {showVariables ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showVariables && (
                <div className="p-4 text-xs text-[var(--color-text-secondary)] space-y-3 bg-[var(--color-bg-primary)]/30">
                  {TEMPLATE_VARIABLES.map((group) => (
                    <div key={group.title} className="space-y-1.5 border-b border-[var(--color-bg-tertiary)]/50 pb-2 last:border-0 last:pb-0">
                      <p className="font-semibold text-[var(--color-text-primary)]/80">{group.title}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.vars.map((v) => (
                          <span
                            key={v}
                            className="bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded px-2 py-0.5 font-mono text-[var(--color-crm-orange)] select-all cursor-pointer hover:border-[var(--color-crm-orange)]/50 transition-colors"
                            title="Click to copy usage"
                            onClick={() => {
                              navigator.clipboard.writeText(v);
                              toast.success(`Copied ${v}`);
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Content */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">
                Email Content (HTML)
              </label>
              <div className="rounded-xl overflow-hidden border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)]">
                <RichTextEditor value={content} onChange={setContent} height={350} />
              </div>
            </div>

            {/* Recipients & Attachments Info */}
            <div className="bg-[var(--color-bg-primary)]/50 p-4 rounded-xl border border-[var(--color-bg-tertiary)] border-dashed space-y-3">
              {/* Recipients */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasEmails ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertCircle className="text-red-500" size={16} />
                  )}
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Recipients ({customer?.emails?.length || 0}):
                  </span>
                </div>
                <span className={`text-xs font-bold ${hasEmails ? 'text-green-400' : 'text-red-400'}`}>
                  {hasEmails ? customer.emails.join(", ") : 'No emails configured'}
                </span>
              </div>
              
              {/* Attachments */}
              {selectedTemplate?.attachments?.length > 0 && (
                <div className="pt-2 border-t border-[var(--color-bg-tertiary)]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                    <Paperclip size={12} /> {selectedTemplate.attachments.length} Template Attachments:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.attachments.map((att, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded text-[10px] text-[var(--color-text-primary)] font-medium"
                      >
                        {att.split('/').pop()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[var(--color-bg-tertiary)] bg-[var(--color-bg-tertiary)]/10">
          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={!selectedTemplateId || !hasEmails || sendingEmail}
              className="flex-1 bg-[var(--color-crm-orange)] hover:bg-[var(--color-crm-orange)]/90 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {sendingEmail ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending via Brevo...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Email {hasEmails && `to ${customer.emails.length} Recipient${customer.emails.length > 1 ? 's' : ''}`}
                </>
              )}
            </button>
          </div>
          
          {!hasEmails && (
            <p className="text-xs text-red-400 mt-2 text-center">
              Please add at least one email address to the customer before sending.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendTemplateModal;
