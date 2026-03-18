import React, { useMemo, useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { WHATSAPP_TEMPLATES } from "../../utils/constants";

const WhatsappTemplateModal = ({ lead, onClose, onSend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    template: "",
    mediaUrl: "",
    fileName: lead?.companyName ? `${lead.companyName.replace(/\s+/g, '_')}_Proforma.pdf` : "file.pdf",
    name: lead?.name || "",
    serviceName: lead?.service || "",
    price: "",
  });

  const filteredTemplates = useMemo(() => {
    return WHATSAPP_TEMPLATES.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const preview = useMemo(() => {
    if (!form.template) return "Select a template from the left to preview it here.";
    
    const templateObj = WHATSAPP_TEMPLATES.find(t => t.name === form.template);
    if (!templateObj) return `Preview for "${form.template}" template will appear here.`;

    let content = templateObj.content;
    
    // Replace placeholders
    content = content.replace(/{{Name}}/g, form.name || "{{Name}}");
    content = content.replace(/{{CustomerName}}/g, form.name || "{{CustomerName}}");
    content = content.replace(/{{service name}}/g, form.serviceName || "{{service name}}");
    content = content.replace(/{{Price}}/g, form.price || "{{Price}}");
    
    // Add file header if mediaUrl or fileName is present
    if (form.mediaUrl || form.fileName) {
      return `${form.fileName}\n\n${content}`;
    }
    
    return content;
  }, [form]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 text-text-primary">
      <div className="w-full max-w-6xl bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-tertiary">
          <h3 className="text-xl font-bold">Send Whatsapp Template</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE: TEMPLATE LIST */}
          <div className="w-1/3 border-r border-bg-tertiary flex flex-col bg-bg-tertiary/5">
            <div className="p-4 border-b border-bg-tertiary relative">
              <SearchIcon size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-secondary border border-bg-tertiary text-xs outline-none focus:border-yellow-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-bg-tertiary">
              {filteredTemplates.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setForm(prev => ({ ...prev, template: t.name }))}
                  className={`w-full text-left px-5 py-3 text-[11px] font-semibold border-b border-bg-tertiary/30 transition-all ${
                    form.template === t.name ? 'bg-yellow-500 text-white shadow-md' : 'text-text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  {t.name}
                </button>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="p-10 text-center text-text-secondary text-xs italic">
                  No templates found
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: FORM & PREVIEW */}
          <div className="flex-1 flex flex-col md:flex-row bg-bg-primary overflow-y-auto">
            <div className="flex-1 p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text-secondary uppercase">Header Variables (Document)</h4>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Media URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://example.com/file.pdf"
                      value={form.mediaUrl}
                      onChange={(e) => setForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-bg-tertiary text-xs text-text-primary outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">File Name</label>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={form.fileName}
                      onChange={(e) => setForm(prev => ({ ...prev, fileName: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-bg-tertiary text-xs text-text-primary outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text-secondary uppercase">Body Variables</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Customer Name {"{{Name}}"}</label>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-bg-tertiary text-xs text-text-primary outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Service Name {"{{service name}}"}</label>
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={form.serviceName}
                      onChange={(e) => setForm(prev => ({ ...prev, serviceName: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-bg-tertiary text-xs text-text-primary outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Price {"{{Price}}"}</label>
                    <input
                      type="text"
                      placeholder="e.g. 7,999"
                      value={form.price}
                      onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-bg-tertiary text-xs text-text-primary outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-10">
                <button
                  onClick={() => onSend(form)}
                  disabled={!form.template}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  Send Template via Whatsapp
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 bg-bg-tertiary/10 border-l border-bg-tertiary sticky top-0 h-fit min-h-64">
              <h4 className="text-sm font-bold text-text-secondary uppercase mb-4">Live Preview</h4>
              <div className="bg-green-600 text-white rounded-2xl p-5 min-h-[300px] whitespace-pre-wrap text-sm shadow-xl relative animate-in fade-in slide-in-from-bottom-2">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500 rounded-t-2xl opacity-50"></div>
                {preview}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold px-2 py-1 bg-bg-secondary border border-bg-tertiary rounded w-fit">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Visit our Website
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold px-2 py-1 bg-bg-secondary border border-bg-tertiary rounded w-fit">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Call Us Now!
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold px-2 py-1 bg-bg-secondary border border-bg-tertiary rounded w-fit">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Interested!
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappTemplateModal;