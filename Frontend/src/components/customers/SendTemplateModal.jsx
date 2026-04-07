import React, { useState, useEffect } from "react";
import { X, Send, Paperclip } from "lucide-react";
import { EMAIL_TEMPLATES } from "../../utils/constants";
import RichTextEditor from "../RichTextEditor";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { sendCustomerEmail, fetchCustomerById } from "../../redux/slices/customersSlice";
import { fetchTemplates } from "../../redux/slices/templatesSlice";
import logo from "../../assets/logo.png";

const TEMPLATE_VARIABLES = [
  { title: 'General:', vars: ['{{name}}', '{{companyName}}', '{{address}}'] },
  {
    title: 'Annual Compliance Only:',
    vars: ['{{complianceName}}'],
  },
];

const SendTemplateModal = ({ customer, onClose }) => {
  const dispatch = useDispatch();
  const { list: backendTemplates, loading } = useSelector((state) => state.templates);
  
  // Combine backend templates with local constants or use constants as primary
  const templates = backendTemplates.length > 0 ? backendTemplates : EMAIL_TEMPLATES;

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const selectedTemplate = templates.find((t) => String(t.id || t._id) === String(selectedTemplateId));

  // Update subject and body when template is selected
  useEffect(() => {
    if (selectedTemplateId) {
      // Find by id (number or string)
      const template = templates.find((t) => String(t.id || t._id) === String(selectedTemplateId));
      if (template) {
        let processedSubject = template.subject || "";
        let processedBody = template.body || "";

        // Replace basic variables
        const replacements = {
          "{{name}}": customer?.name || "",
          "{{companyName}}": customer?.companyName || "",
          "{{address}}": customer?.address || "",
          "{{complianceName}}": customer?.services?.[0]?.name || "Service",
        };

        Object.entries(replacements).forEach(([key, value]) => {
          // Use a simple global replacement
          processedSubject = String(processedSubject).replaceAll(key, value);
          processedBody = String(processedBody).replaceAll(key, value);
        });

        setSubject(processedSubject);
        setContent(processedBody);
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

    try {
      const template = templates.find(t => String(t.id || t._id) === String(selectedTemplateId));
      await dispatch(sendCustomerEmail({
        customerId: customer._id,
        templateId: selectedTemplateId,
        data: { subject, content }
      })).unwrap();

      toast.success(`Email template "${template?.name}" sent successfully`);
      dispatch(fetchCustomerById(customer._id));
      onClose();
    } catch (err) {
      toast.error(err || "Failed to send email");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-4xl bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b border-bg-tertiary">
          <div className="flex-1" /> {/* Spacer for centered logo */}
          <div className="flex flex-col items-center gap-1">
             <img src={logo} alt="CRM Logo" className="h-8 object-contain" />
             <h2 className="text-lg font-bold">Send Email Template</h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="fieldset-input">
              <span className="fieldset-label bg-bg-secondary">Select Template *</span>
              <select 
                value={selectedTemplateId || ""} 
                onChange={handleTemplateChange}
                className="bg-bg-primary border border-bg-tertiary text-text-primary"
              >
                <option value="">-- Choose Template --</option>
                {templates.map((t) => (
                  <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label bg-bg-secondary">Subject *</span>
              <input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Email Subject"
                className="bg-bg-primary border border-bg-tertiary text-text-primary"
              />
            </div>
          </div>

          <div className="bg-gray-200 rounded-lg p-4 text-xs text-gray-600 space-y-3 border border-gray-300">
            <p className="font-bold text-orange-500 uppercase tracking-wider text-[10px]">Available Template Variables</p>
            {TEMPLATE_VARIABLES.map((group) => (
              <div key={group.title} className="space-y-1.5 border-b border-gray-300/50 pb-2 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-700">
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.vars.map((v) => (
                    <span
                      key={v}
                      className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 font-mono text-orange-500 select-all cursor-pointer hover:border-gray-100/50 transition-colors"
                      title="Click to copy usage"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Email Content</label>
            <div className="rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
                <RichTextEditor value={content} onChange={setContent} height={450} />
            </div>
          </div>
          
          <div className="bg-gray-100/50 p-4 rounded-xl border border-gray-300 border-dashed space-y-3">
            <p className="text-xs text-gray-600 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Recipient: 
              <span className="text-gray-700 font-bold">{customer?.emails?.[0] || 'No email provided'}</span>
            </p>
            
            {/* Attachments Section */}
            {selectedTemplate?.attachments?.length > 0 && (
              <div className="pt-2 border-t border-bg-tertiary">
                <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                  <Paperclip size={12} /> {selectedTemplate.attachments.length} Attachments included:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.attachments.map((att, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-bg-secondary border border-bg-tertiary rounded text-[10px] text-text-primary font-medium"
                    >
                      {att.split('/').pop()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-bg-tertiary bg-bg-tertiary/10">
          <button
            onClick={handleSend}
            disabled={!selectedTemplateId}
            className="w-full btn-raised btn-raised-orange text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all active:scale-[0.98]"
          >
            <Send size={18} /> SEND EMAIL TO CUSTOMER
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendTemplateModal;
