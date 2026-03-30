import React from "react";
import { X, Mail } from "lucide-react";

const EmailTemplateDetailsModal = ({ emailTemplate, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-bg-tertiary bg-bg-tertiary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Mail size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight italic">
              Email Template Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-tertiary transition-colors text-text-secondary"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Template Info */}
            <div className="bg-bg-primary p-6 rounded-xl border border-bg-tertiary">
              <h4 className="text-lg font-bold text-text-primary mb-4">Template Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-text-secondary block mb-1">Template Name</span>
                  <p className="text-text-primary">{emailTemplate?.name || emailTemplate?.templateName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-text-secondary block mb-1">Sent Date</span>
                  <p className="text-text-primary">
                    {emailTemplate?.date ? new Date(emailTemplate.date).toLocaleString('en-GB') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-bg-primary p-6 rounded-xl border border-bg-tertiary">
              <h4 className="text-lg font-bold text-text-primary mb-4">Email Preview</h4>
              <div className="bg-bg-secondary p-4 rounded-lg border border-bg-tertiary">
                <div className="text-sm text-text-secondary italic">
                  Email content would be displayed here...
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-bg-primary p-6 rounded-xl border border-bg-tertiary">
              <h4 className="text-lg font-bold text-text-primary mb-4">Delivery Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-text-primary">Delivered Successfully</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-bg-tertiary bg-bg-tertiary/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-black shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateDetailsModal;