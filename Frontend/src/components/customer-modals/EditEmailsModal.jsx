import React, { useState } from "react";
import { X, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";

const EditEmailsModal = ({ customer, onClose, onUpdate }) => {
  const [emails, setEmails] = useState(customer.emails || []);
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmail = () => {
    if (!newEmail) return;
    if (emails.includes(newEmail)) {
      toast.error("Email already exists");
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail("");
  };

  const handleRemoveEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleUpdate = () => {
    onUpdate({ ...customer, emails });
    toast.success("Emails updated successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-6 py-4">
          <h2 className="text-xl font-normal">Edit Emails</h2>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {/* EMAIL LIST */}
          <div className="space-y-4 mb-8">
            {emails.map((email, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-bg-tertiary/50">
                <span className="text-text-primary text-sm">{email}</span>
                <button 
                  onClick={() => handleRemoveEmail(email)}
                  className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* ADD EMAIL SECTION */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1">
               <input 
                  type="email" 
                  placeholder="Add Email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  className="w-full bg-transparent border border-bg-tertiary rounded-md p-3 text-text-primary outline-none focus:border-crm-orange transition-colors"
               />
            </div>
            <button 
                onClick={handleAddEmail}
                className="btn-raised btn-raised-green text-white px-6 py-3 rounded-md text-sm font-bold uppercase transition-all"
            >
                ADD
            </button>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            <Mail size={16} /> UPDATE EMAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmailsModal;
