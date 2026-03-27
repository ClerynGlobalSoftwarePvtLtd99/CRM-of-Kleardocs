import React, { useState, useEffect } from "react";
import { X, Send, Mail, User, Briefcase, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates } from "../../../redux/slices/templatesSlice";
import RichTextEditor from "../../RichTextEditor";
import { EMAIL_TEMPLATES } from "../../../utils/constants";
import toast from "react-hot-toast";

const SendTemplateModal = ({ lead, onClose, onSendTemplate, previewMode = false }) => {
  const dispatch = useDispatch();
  const { list: backendTemplates, loading } = useSelector((state) => state.templates);
  
  // Combine backend templates with local constants or use constants as primary
  const templates = backendTemplates.length > 0 ? backendTemplates : EMAIL_TEMPLATES;
  
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

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
          "{{name}}": lead?.name || "",
          "{{companyName}}": lead?.companyName || "",
          "{{address}}": lead?.address || "",
          "{{complianceName}}": lead?.service?.name || "Service",
        };

        Object.entries(replacements).forEach(([key, value]) => {
          // Use a simple global replacement
          processedSubject = String(processedSubject).replaceAll(key, value);
          processedBody = String(processedBody).replaceAll(key, value);
        });

        setFormData({
          subject: processedSubject,
          body: processedBody,
        });
      }
    }
  }, [selectedTemplateId, templates, lead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      toast.error("Please select a template first");
      return;
    }
    
    const templateName = templates.find(t => t._id === selectedTemplateId)?.name;
    onSendTemplate({
      ...formData,
      templateId: selectedTemplateId,
      templateName
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-bg-tertiary bg-bg-tertiary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-crm-orange/20 flex items-center justify-center text-crm-orange">
              <Mail size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              {previewMode ? "Email Template View" : "Send Email Template"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-tertiary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: FORM SECTION */}
          <div className="flex-1 space-y-6">
            {!previewMode && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Select Email Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-3 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose a pre-defined template...</option>
                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Email Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Subject will auto-populate from template"
                className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-3 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-tertiary/20 border border-bg-tertiary text-[10px] font-black text-text-secondary uppercase">
                  <User size={10} /> {lead?.name || 'Name'}
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-tertiary/20 border border-bg-tertiary text-[10px] font-black text-text-secondary uppercase">
                  <Briefcase size={10} /> {lead?.companyName || 'Company'}
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-tertiary/20 border border-bg-tertiary text-[10px] font-black text-text-secondary uppercase">
                  <MapPin size={10} /> {lead?.address?.slice(0, 15) || 'Address'}...
               </div>
            </div>

            <div className="space-y-2 rounded-xl overflow-hidden border border-bg-tertiary bg-bg-primary min-h-[300px]">
                <RichTextEditor
                   value={formData.body}
                   onChange={(val) => setFormData(prev => ({ ...prev, body: val }))}
                />
            </div>
          </div>

          {/* RIGHT: PREVIEW / TIPS */}
          <div className="lg:w-80 flex flex-col gap-6">
             <div className="bg-gradient-to-br from-crm-orange to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-crm-orange/20">
                <h4 className="font-black uppercase tracking-widest text-xs mb-4 opacity-80 border-b border-white/20 pb-2">Pro Tip</h4>
                <p className="text-sm font-bold leading-relaxed mb-4">
                  The system automatically injects lead data into variables like <code className="bg-white/20 px-1 rounded">{"{{name}}"}</code> and <code className="bg-white/20 px-1 rounded">{"{{companyName}}"}</code>.
                </p>
                <div className="space-y-3 pt-2">
                   {lead?.emails?.map((email, i) => (
                     <div key={i} className="flex items-center gap-2 text-[10px] font-black truncate bg-black/10 px-3 py-2 rounded-lg border border-white/10 uppercase tracking-tighter">
                        <Mail size={12} /> {email}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-bg-tertiary/5 rounded-2xl p-6 border-2 border-dashed border-bg-tertiary">
                <h4 className="font-black uppercase tracking-widest text-xs text-text-secondary mb-4">Verification</h4>
                <p className="text-[10px] font-bold text-text-secondary leading-normal italic">
                  Ensure the calculated values in the editor match the lead's current profile before hitting send.
                </p>
             </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-bg-tertiary bg-bg-tertiary/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:bg-bg-tertiary transition-all"
          >
            Cancel
          </button>
          {!previewMode && (
            <button
              onClick={handleSubmit}
              disabled={!selectedTemplateId}
              className="px-10 py-3 rounded-xl bg-crm-orange hover:bg-orange-600 disabled:bg-gray-500 text-white text-xs font-black shadow-lg shadow-crm-orange/20 transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95"
            >
              <Send size={16} />
              Send Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendTemplateModal;