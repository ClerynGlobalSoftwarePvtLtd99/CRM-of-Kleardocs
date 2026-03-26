import React from "react";
import { X } from "lucide-react";

const EmailTemplateDetailsModal = ({ emailHistory, onClose }) => {
  // Mock data based on the image - in real app, this would come from API based on emailHistory.id
  const templateData = {
    id: 1,
    subject: "Welcome to Your Annual Compliance Access",
    invoiceNumber: "INV-24-2510972",
    invoiceAmount: "₹ 2000.00",
    invoiceDate: "19th Mar 2026",
    username: "FLYTRADR0404",
    password: "bv22006h",
    companyName: "VIRALITY360 PRIVATE LIMITED"
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-[70%] bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-bg-tertiary">
          <h3 className="text-xl font-bold">Email Template Details</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Email Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Email Header */}
            <div className="bg-gray-800 text-white p-4 text-center">
              <h2 className="text-lg font-bold">Welcome to Your Annual Compliance Access</h2>
            </div>

            {/* Logo */}
            <div className="p-4 text-center">
              <img 
                src="/logo.svg" 
                alt="Company Logo" 
                className="mx-auto object-cover rounded-md"
                style={{ width: "200px", height: "90px" }}
              />
            </div>

            {/* Welcome Message */}
            <div className="p-4 text-center">
              <p className="text-gray-700 mb-4">
                Dear <strong>{templateData.companyName}</strong>,
              </p>
              <p className="text-gray-700 mb-4">
                We are delighted to onboard you for Annual Compliance Services.
              </p>
              <p className="text-gray-700 mb-6">
                You can access your CRM portal using the credentials below:
              </p>
            </div>

            {/* Invoice Details Table */}
            <div className="px-4 mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-3 text-left border border-gray-300">Invoice Number</th>
                    <th className="p-3 text-left border border-gray-300">Invoice Amount</th>
                    <th className="p-3 text-left border border-gray-300">Invoice Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-300">{templateData.invoiceNumber}</td>
                    <td className="p-3 border border-gray-300">{templateData.invoiceAmount}</td>
                    <td className="p-3 border border-gray-300">{templateData.invoiceDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Login Credentials Table */}
            <div className="px-4 mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-3 text-left border border-gray-300">Username</th>
                    <th className="p-3 text-left border border-gray-300">Password</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-300 font-mono">{templateData.username}</td>
                    <td className="p-3 border border-gray-300 font-mono">{templateData.password}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* WhatsApp Alert */}
            <div className="mx-4 mb-6">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      A WhatsApp group will be created to handle all your compliances.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center text-gray-600 text-sm">
              <p>Thank you for choosing our services!</p>
              <p>For any queries, feel free to contact us.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateDetailsModal;
