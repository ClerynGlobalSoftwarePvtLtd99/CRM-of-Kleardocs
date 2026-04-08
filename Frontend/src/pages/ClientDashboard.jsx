import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSelfData } from '../redux/slices/customersSlice';
import { getCurrentFinancialYear } from '../utils/dateUtils';
import CustomerDirectors from '../components/customers/CustomerDirectors';
import CustomerAnnualComplianceTable from '../components/customers/CustomerAnnualComplianceTable';
import Loader from '../components/Loader';
import { 
    LayoutDashboard, 
    Calendar, 
    Building2, 
    Phone, 
    MapPin, 
    Mail, 
    CheckCircle2, 
    User2,
    Briefcase,
    Timer,
    History,
    Users
} from 'lucide-react';

const ClientDashboard = () => {
    const dispatch = useDispatch();
    const { currentCustomer: customer, loading, error } = useSelector((state) => state.customers);
    const { user: authUser } = useSelector((state) => state.auth);
    const [selectedYear, setSelectedYear] = useState(() => getCurrentFinancialYear());

    useEffect(() => {
        // console.log('Mounting ClientDashboard, authUser:', authUser);
        dispatch(fetchSelfData({ year: selectedYear }));
    }, [dispatch, selectedYear]);

    useEffect(() => {
        if (customer) {
            // console.log('Customer data loaded successfully:', customer);
        }
        if (error) {
            console.error('Customer data load error:', error);
        }
    }, [customer, error]);

    const handleAction = (action, data) => {
        if (action === 'viewComplianceYear') {
            setSelectedYear(data);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <History size={32} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                <p className="text-slate-400">{error}</p>
                <button 
                    onClick={() => dispatch(fetchSelfData({ year: selectedYear }))}
                    className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <Loader />
                <p className="text-slate-400 mt-4 animate-pulse">Initializing dashboard...</p>
            </div>
        );
    }

    const stats = [
        { label: 'Company Name', value: customer.companyName || customer.name, icon: Building2, color: 'text-blue-400' },
        { label: 'Business Type', value: customer.type || 'N/A', icon: Briefcase, color: 'text-purple-400' },
        { label: 'Onboarding Date', value: customer.onboardingDate ? new Date(customer.onboardingDate).toLocaleDateString('en-IN') : 'N/A', icon: Calendar, color: 'text-crm-orange' },
        { label: 'Active Projects', value: customer.compliances?.length || 0, icon: CheckCircle2, color: 'text-emerald-400' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-3xl p-6 md:p-10 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <LayoutDashboard size={120} className="text-crm-orange" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-crm-orange/10 border border-crm-orange/20 rounded-full text-crm-orange text-xs font-bold tracking-widest uppercase">
                            <Timer size={14} />
                            Client Portal
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
                            Welcome, <span className="text-crm-orange">{customer.name}</span>
                        </h1>
                        <p className="text-[var(--color-text-secondary)] font-medium max-w-xl">
                            Easily monitor your company's annual compliance status and director information in real-time.
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-2xl p-4 transition-all hover:border-crm-orange/30 group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-[var(--color-bg-tertiary)]/30 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={18} />
                                </div>
                                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="text-sm font-bold text-[var(--color-text-primary)] truncate">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Directors & Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Contact Card */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-3xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                            <User2 size={20} className="text-crm-orange" />
                            Registered Details
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[var(--color-bg-primary)] rounded-2xl text-[var(--color-text-secondary)] border border-[var(--color-bg-tertiary)]">
                                    <Phone size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Phone Number</p>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{customer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[var(--color-bg-primary)] rounded-2xl text-[var(--color-text-secondary)] border border-[var(--color-bg-tertiary)]">
                                    <Mail size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Primary Email</p>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{customer.emails?.[0] || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[var(--color-bg-primary)] rounded-2xl text-[var(--color-text-secondary)] border border-[var(--color-bg-tertiary)]">
                                    <MapPin size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Registered Address</p>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">{customer.address || 'N/A'}</p>
                                    <p className="text-[11px] font-bold text-crm-orange uppercase tracking-widest mt-1">{customer.state}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Directors Section */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-3xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                            <Users size={20} className="text-crm-orange" />
                            Directors
                        </h3>
                        {customer.directors?.length > 0 ? (
                            <div className="space-y-6">
                                {customer.directors.map((director, idx) => (
                                    <div key={idx} className="relative pl-6 border-l border-[var(--color-bg-tertiary)] group">
                                        <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 bg-crm-orange rounded-full ring-4 ring-crm-orange/20"></div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-crm-orange transition-colors">
                                                {director.name || director.directorName}
                                            </h4>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                                                    <Phone size={12} className="text-[var(--color-text-secondary)]" />
                                                    {director.phone || 'N/A'}
                                                </p>
                                                {director.din && (
                                                    <p className="text-[11px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded w-fit border border-[var(--color-bg-tertiary)]">
                                                        DIN: {director.din}
                                                    </p>
                                                )}
                                                {director.designation && (
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-crm-orange/80">
                                                        {director.designation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-[var(--color-text-secondary)]">No directors listed.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Compliance History */}
                <div className="lg:col-span-2 space-y-6">
                    <CustomerAnnualComplianceTable 
                        compliances={customer.compliances}
                        financialYears={customer.financialYears}
                        selectedYear={selectedYear}
                        onAction={handleAction}
                        readOnly={true}
                    />
                    
                    <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <History size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Need updates?</h4>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                If any details are incorrect or if you want to request a status change for a compliance record, 
                                please contact your relationship manager at Kleardocs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
