import React, { useState } from "react";
import { useParams } from "react-router";
import {
  Building2, Phone, Mail, MapPin,
  Calendar, CreditCard, CheckCircle2,
  AlertCircle, ArrowLeft, Plus,
  FileText, ExternalLink
} from "lucide-react";
import { Link } from "react-router";
import LeadHistorySection from "../components/lead-details/LeadHistorySection";
import AddInteractionModal from "../components/lead-modals/AddInteractionModal";

const mockCustomer = {
  id: "CUST-98234",
  companyName: "KLEAR DOCS PRIVATE LIMITED",
  customerName: "Abhishek Sharma",
  phone: "9876543210",
  email: "abhishek@kleardocs.com",
  gst: "22AAAAA0000A1Z5",
  type: "Private Limited",
  incorporationDate: "12th May 2023",
  address: "Sector 62, Noida, Uttar Pradesh 201301",
  state: "UTTAR PRADESH",
  agent: "Ritu Kaur",
  totalSales: "₹45,000",
  totalPaid: "₹30,000",
  totalDue: "₹15,000",
  activeJobs: 3,
  status: "Active"
};

const initialHistory = [
  {
    id: 1,
    datetime: "18th March 2026 10:00 am",
    user: "System",
    type: "text",
    text: "Converted from Lead to Customer",
  },
  {
    id: 2,
    datetime: "18th March 2026 11:30 am",
    user: "Ritu Kaur",
    type: "call",
    text: "Discussed annual compliance requirements.",
    called: true,
  }
];

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer] = useState({ ...mockCustomer, id });
  const [history, setHistory] = useState(initialHistory);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [interactionForm, setInteractionForm] = useState({ details: "", called: false });

  const handleAddInteraction = () => {
    if (!interactionForm.details.trim()) return;
    const newItem = {
      id: Date.now(),
      datetime: new Date().toLocaleString(),
      user: customer.agent,
      type: interactionForm.called ? "call" : "text",
      text: interactionForm.details,
      called: interactionForm.called,
    };
    setHistory(prev => [newItem, ...prev]);
    setInteractionForm({ details: "", called: false });
    setShowAddInteraction(false);
  };

  return (
    <div className="p-4 bg-bg-primary min-h-screen text-text-primary">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/leads" className="p-2 hover:bg-bg-secondary rounded-full transition-colors border border-bg-tertiary">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                {customer.companyName}
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider">
                  {customer.status}
                </span>
              </h1>
              <p className="text-sm text-text-secondary font-medium">Customer ID: {customer.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-bg-secondary border border-bg-tertiary hover:border-yellow-500 text-text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              <FileText size={16} />
              ADD INVOICE
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2">
              EDIT PROFILE
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Sales", value: customer.totalSales, icon: CreditCard, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Total Paid", value: customer.totalPaid, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Total Due", value: customer.totalDue, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Active Jobs", value: customer.activeJobs, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <div key={i} className="bg-bg-secondary p-5 rounded-2xl border border-bg-tertiary shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: CUSTOMER INFO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-bg-secondary rounded-2xl border border-bg-tertiary shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-bg-tertiary bg-bg-tertiary/20">
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                  <Building2 size={16} /> Company Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "GST Number", value: customer.gst },
                  { label: "Type", value: customer.type },
                  { label: "Incorp. Date", value: customer.incorporationDate },
                  { label: "State", value: customer.state }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-secondary rounded-2xl border border-bg-tertiary shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-bg-tertiary bg-bg-tertiary/20">
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                  Contact Info
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bg-tertiary/20 text-yellow-500"><Phone size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Phone</span>
                    <span className="text-sm font-semibold">{customer.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bg-tertiary/20 text-blue-500"><Mail size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Email</span>
                    <span className="text-sm font-semibold">{customer.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bg-tertiary/20 text-red-500"><MapPin size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Address</span>
                    <span className="text-xs font-medium leading-relaxed">{customer.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTION HISTORY (Reusing component) */}
          <div className="lg:col-span-2">
            <LeadHistorySection
              history={history}
              onViewEmail={() => { }}
              interactionForm={interactionForm}
              setInteractionForm={setInteractionForm}
              handleAddInteraction={handleAddInteraction}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
