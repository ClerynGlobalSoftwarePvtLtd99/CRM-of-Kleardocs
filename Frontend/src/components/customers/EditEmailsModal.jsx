import React, { useState, useEffect } from "react";
import { X, Trash2, Mail, Plus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const EditEmailsModal = ({ customer, onClose, onUpdate, loading = false }) => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("Invalid email format");
      return;
    }
    if (emails.includes(newEmail)) {
      toast.error("Email already exists");
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail("");
    toast.success("Email added to list");
  };

  const handleRemoveEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleUpdate = () => {
    onUpdate({ ...customer, emails });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-bg-tertiary px-8 py-6 bg-bg-tertiary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-crm-orange/20 flex items-center justify-center text-crm-orange">
              <Mail size={20} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">Registered Emails</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-text-secondary hover:text-text-primary rounded-xl hover:bg-bg-tertiary">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* ADD EMAIL SECTION */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Add New Email Address</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative group">
                 <input 
                    type="email" 
                    placeholder="example@company.com" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                    className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-3 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all"
                 />
              </div>
              <button 
                  onClick={handleAddEmail}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2"
              >
                  <Plus size={16} /> ADD
              </button>
            </div>
          </div>

          {/* EMAIL LIST */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Current Distribution List</label>
            <div className="bg-bg-primary/50 border border-bg-tertiary rounded-2xl divide-y divide-bg-tertiary max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-bg-tertiary">
              {emails.length > 0 ? (
                emails.map((email, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 group hover:bg-bg-tertiary/10 transition-colors">
                    <span className="text-sm font-bold text-text-primary truncate">{email}</span>
                    <button 
                      onClick={() => handleRemoveEmail(email)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove email"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text-secondary flex flex-col items-center gap-2 opacity-40 italic">
                  <AlertCircle size={32} />
                  <p className="text-xs font-bold uppercase tracking-widest">No emails configured</p>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button 
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-crm-orange hover:bg-orange-600 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-crm-orange/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>Syncing Database...</span>
              </>
            ) : (
              <>
                <Mail size={16} className="group-hover:translate-x-1 transition-transform" />
                <span>Save Registry Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmailsModal;
