import React, { useState, useEffect } from "react";
import { X, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";

const EditEmailsModal = ({ customer, onClose, onUpdate, loading = false }) => {
  // Ensure emails is always an array
  const [emails, setEmails] = useState(() => {
    const customerEmails = customer?.emails;
    if (Array.isArray(customerEmails)) {
      return customerEmails;
    } else if (customerEmails && typeof customerEmails === 'object') {
      // Convert object to array if needed
      return Object.values(customerEmails).filter(email => typeof email === 'string');
    }
    return [];
  });
  const [newEmail, setNewEmail] = useState("");

  // Reset emails state when customer prop changes
  useEffect(() => {
    const customerEmails = customer?.emails;
    if (Array.isArray(customerEmails)) {
      setEmails(customerEmails);
    } else if (customerEmails && typeof customerEmails === 'object') {
      setEmails(Object.values(customerEmails).filter(email => typeof email === 'string'));
    } else {
      setEmails([]);
    }
  }, [customer?.emails]);

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
                <a 
                  href={`mailto:${email}`}
                  className="text-text-primary text-sm hover:text-crm-orange transition-colors cursor-pointer underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `mailto:${email}`;
                  }}
                >
                  {email}
                </a>
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
                  autoComplete="off"
                  data-lp-ignore="true"
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
                disabled={loading}
                className="w-full btn-raised btn-raised-orange text-white px-4 py-3 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-xs">UPDATING...</span>
              </>
            ) : (
              <>
                <Mail size={16} />
                <span className="hidden sm:inline text-xs md:inline">UPDATE EMAILS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmailsModal;
