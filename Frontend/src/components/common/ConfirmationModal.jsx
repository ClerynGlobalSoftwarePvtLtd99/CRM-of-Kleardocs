import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertCircle className="text-red-500" size={48} />,
          confirmBtn: "btn-raised-red text-white",
          border: "border-red-500/20"
        };
      case 'warning':
        return {
          icon: <AlertCircle className="text-yellow-500" size={48} />,
          confirmBtn: "btn-raised-orange text-white",
          border: "border-yellow-500/20"
        };
      default:
        return {
          icon: <AlertCircle className="text-blue-500" size={48} />,
          confirmBtn: "btn-raised-blue text-white",
          border: "border-blue-500/20"
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-[var(--color-bg-secondary)] border ${styles.border} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="flex justify-end p-4 pb-0">
          <button 
            onClick={onClose}
            className="p-1 hover:bg-bg-tertiary rounded-full transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-bg-tertiary/20 rounded-full">
            {styles.icon}
          </div>
          <h2 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">
            {title}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg font-bold border border-[var(--color-bg-tertiary)] hover:bg-bg-tertiary transition-colors text-[var(--color-text-primary)]"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg btn-raised ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
