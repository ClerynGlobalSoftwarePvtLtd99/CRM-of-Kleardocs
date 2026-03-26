import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { EMAIL_TEMPLATES } from "../../utils/constants";
import RichTextEditor from "../RichTextEditor";
import toast from "react-hot-toast";

const SendTemplateModal = ({ customer, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    setSelectedTemplate(templateName);
    const template = EMAIL_TEMPLATES.find((t) => t.name === templateName);
    if (template) {
      setSubject(template.subject.replace("{company}", customer.companyName));
      setContent(template.body.replace("{company}", customer.companyName));
    }
  };

  const handleSend = () => {
    if (!selectedTemplate || !subject || !content) {
      toast.error("Please fill all fields");
      return;
    }
    // Mock API call
    toast.success(`Template ${selectedTemplate} sent to ${customer.emails[0]}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal">Send Template</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="fieldset-input">
              <span className="fieldset-label">Select Template *</span>
              <select value={selectedTemplate} onChange={handleTemplateChange}>
                <option value="">-- Choose Template --</option>
                {EMAIL_TEMPLATES.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="fieldset-input">
              <span className="fieldset-label">Subject *</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email Subject" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Email Content</label>
            <div className="rounded-xl overflow-hidden border border-bg-tertiary">
                <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="bg-bg-tertiary/20 p-4 rounded-lg border border-bg-tertiary">
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="font-bold text-yellow-500 mr-2">Tip:</span> 
              The selected template will be sent to the primary email: 
              <span className="text-text-primary ml-1 underline">{customer.emails[0]}</span>
            </p>
          </div>
        </div>

        <div className="p-8 border-t border-bg-tertiary">
          <button
            onClick={handleSend}
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            <Send size={16} /> SEND TEMPLATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendTemplateModal;
