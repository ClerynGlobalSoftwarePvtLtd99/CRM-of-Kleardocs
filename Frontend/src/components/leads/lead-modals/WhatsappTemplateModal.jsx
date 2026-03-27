import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare, Image as ImageIcon, FileText, User, ChevronRight } from "lucide-react";
import { WHATSAPP_TEMPLATES } from "../../../utils/constants";
import toast from "react-hot-toast";

const WhatsappTemplateModal = ({ lead, onClose, onSend }) => {
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [formData, setFormData] = useState({
    mediaUrl: "",
    fileName: "",
    name: lead?.name || "",
  });

  const selectedTemplate = WHATSAPP_TEMPLATES.find(t => t.name === selectedTemplateName);

  const processContent = (content) => {
    if (!content) return "";
    return content.replace(/{{Name}}|{{CustomerName}}/g, formData.name || "Customer");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTemplateName) {
      toast.error("Please select a template");
      return;
    }
    
    onSend({
      templateName: selectedTemplateName,
      variables: {
        name: formData.name,
        mediaUrl: formData.mediaUrl || undefined,
        fileName: formData.fileName || undefined
      },
      content: processContent(selectedTemplate?.content)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-[#0b141a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#202c33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25d366]/20 flex items-center justify-center text-[#25d366]">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">
              Send Whatsapp Template
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: FORM SECTION */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Select Whatsapp Template</label>
              <div className="relative">
                <select
                  value={selectedTemplateName}
                  onChange={(e) => setSelectedTemplateName(e.target.value)}
                  className="w-full bg-[#202c33] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#25d366]/20 focus:border-[#25d366] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose template...</option>
                  {WHATSAPP_TEMPLATES.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                    <ImageIcon size={10} /> Media URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-[#202c33] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#25d366]/20 focus:border-[#25d366] transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                    <FileText size={10} /> File Name
                  </label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                    placeholder="document.pdf"
                    className="w-full bg-[#202c33] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#25d366]/20 focus:border-[#25d366] transition-all"
                  />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                 <User size={10} /> Body Variable: {"{{Name}}"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#202c33] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#25d366]/20 focus:border-[#25d366] transition-all"
              />
            </div>

            <div className="bg-[#111b21] p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Quick Tips</h4>
               <ul className="space-y-2">
                  <li className="text-xs font-bold text-gray-400 flex items-start gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#25d366] mt-1 shrink-0"></div>
                     Variables are case-sensitive: Use {"{{Name}}"} for most templates.
                  </li>
                  <li className="text-xs font-bold text-gray-400 flex items-start gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#25d366] mt-1 shrink-0"></div>
                     Media URL must be a direct link to an image or document.
                  </li>
               </ul>
            </div>
          </div>

          {/* RIGHT: WHATSAPP PREVIEW */}
          <div className="lg:w-[400px] flex flex-col bg-[#0b141a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
             
             <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-white/5 z-10">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                   {lead?.name?.[0] || 'L'}
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-black text-white">{lead?.name || 'Lead Name'}</span>
                   <span className="text-[9px] text-gray-400">Online</span>
                </div>
             </div>

             <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto z-10 min-h-[400px]">
                {selectedTemplate ? (
                  <div className="self-end max-w-[85%] animate-in slide-in-from-right-4 duration-300">
                     <div className="bg-[#056162] text-white p-3 rounded-2xl rounded-tr-none shadow-md relative group">
                        {formData.mediaUrl && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                             {formData.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                               <img src={formData.mediaUrl} alt="media" className="w-full h-auto object-cover max-h-[200px]" onError={(e) => e.target.style.display='none'} />
                             ) : (
                               <div className="p-3 flex items-center gap-2 text-xs font-bold">
                                 <FileText size={16} /> {formData.fileName || 'Attached Document'}
                               </div>
                             )}
                          </div>
                        )}
                        <p className="text-xs font-medium whitespace-pre-wrap leading-relaxed">
                          {processContent(selectedTemplate.content)}
                        </p>
                        <div className="flex justify-end mt-1">
                          <span className="text-[9px] opacity-60 font-bold">12:45 pm</span>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                     <MessageSquare size={48} className="mb-4" />
                     <p className="text-sm font-black uppercase tracking-widest text-center">Select a template to<br/>view live preview</p>
                  </div>
                )}

                <div className="self-start max-w-[85%]">
                   <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none shadow-md">
                      <p className="text-[10px] font-bold opacity-60 italic mb-1 uppercase tracking-tighter">System Confirmation</p>
                      <p className="text-xs font-medium">Please verify the variables before sending.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-white/5 bg-[#202c33] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTemplateName}
            className="px-10 py-3 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] disabled:bg-gray-600 text-white text-xs font-black shadow-lg shadow-[#25d366]/20 transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95"
          >
            <Send size={16} />
            Send Whatsapp
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsappTemplateModal;