import React from "react";
import {
  CalendarClock,
  Mail,
  Pencil,
  Shuffle,
  MessageSquareText,
  MessageCircle,
} from "lucide-react";

const ActionButton = ({ icon, label, className = "", onClick, widthClass = "w-[115px]" }) => (
  <button
    onClick={onClick}
    className={`
      h-11 ${widthClass} rounded-md text-sm font-semibold shadow-sm transition-all cursor-pointer
      inline-flex items-center justify-center gap-2 whitespace-nowrap
      ${className}
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const LeadTopActions = ({
  onNextFollowupClick,
  onEmailsClick,
  onEditClick,
  onChangeAssignClick,
  onSendTemplateClick,
  onSendWhatsappTemplateClick,
}) => {
  return (
    <div className="flex flex-col items-end shrink-0">
      {/* FIRST ROW */}
      <div className="flex items-center justify-end gap-3">
        <ActionButton
          icon={<CalendarClock size={16} />}
          label="NEXT FOLLOWUP"
          onClick={onNextFollowupClick}
          className="bg-sky-600 hover:bg-sky-700 text-white"
          widthClass="w-[180px]"
        />

        <ActionButton
          icon={<Mail size={16} />}
          label="EMAILS"
          onClick={onEmailsClick}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          widthClass="w-[95px]"
        />

        <ActionButton
          icon={<Pencil size={16} />}
          label="EDIT"
          onClick={onEditClick}
          className="bg-[var(--color-accent)] hover:opacity-90 text-white"
          widthClass="w-[90px]"
        />
      </div>

      {/* SECOND ROW */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <ActionButton
          icon={<Shuffle size={16} />}
          label="CHANGE ASSIGN"
          onClick={onChangeAssignClick}
          className="bg-sky-600 hover:bg-sky-700 text-white"
          widthClass="w-[155px]"
        />

        <ActionButton
          icon={<MessageSquareText size={16} />}
          label="SEND TEMPLATE"
          onClick={onSendTemplateClick}
          className="bg-green-700 hover:bg-green-800 text-white"
          widthClass="w-[170px]"
        />

        <ActionButton
          icon={<MessageCircle size={16} />}
          label="SEND WHATSAPP TEMPLATE"
          onClick={onSendWhatsappTemplateClick}
          className="bg-green-700 hover:bg-green-800 text-white"
          widthClass="w-[230px]"
        />
      </div>
    </div>
  );
};

export default LeadTopActions;