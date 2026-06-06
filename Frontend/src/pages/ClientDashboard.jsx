import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSelfData } from '../redux/slices/customersSlice';
import { getCurrentFinancialYear } from '../utils/dateUtils';
import CustomerDirectors from '../components/customers/CustomerDirectors';
import CustomerAnnualComplianceTable from '../components/customers/CustomerAnnualComplianceTable';
import Loader from '../components/Loader';
import logo from '../assets/logo.png';
import {
    Calendar,
    Building2,
    Phone,
    MapPin,
    Mail,
    CheckCircle2,
    Briefcase,
    Timer,
    History,
    Users
} from 'lucide-react';

const ClientDashboard = () => {
    const dispatch = useDispatch();
    const { currentCustomer: customer, loading, error } = useSelector((state) => state.customers);
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
        { label: 'Phone Number', value: customer.phone || 'N/A', icon: Phone, color: 'text-indigo-400' },
        { label: 'Primary Email', value: customer.emails?.[0] || 'N/A', icon: Mail, color: 'text-pink-400' },
        { label: 'Registered Address', value: customer.address ? `${customer.address}${customer.state ? `, ${customer.state}` : ''}` : 'N/A', icon: MapPin, color: 'text-cyan-400' },
        ...(customer.directors && customer.directors.length > 0
            ? customer.directors.map((director, idx) => ({
                label: `Director ${idx + 1}`,
                value: `${director.name || director.directorName || 'N/A'}${director.designation ? ` (${director.designation})` : ''}${director.din ? ` | DIN: ${director.din}` : ''}${director.phone ? ` | Ph: ${director.phone}` : ''}`,
                icon: Users,
                color: 'text-rose-400'
              }))
            : [{
                label: 'Directors',
                value: 'No director assigned',
                icon: Users,
                color: 'text-rose-400'
              }]
        ),
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-3xl p-6 md:p-10 shadow-xl">
                <div className="absolute top-0 right-0 p-3 sm:p-5 md:p-8 opacity-100 pointer-events-none">
                    <img src={logo} alt="Company Logo" className="w-14 h-14 sm:w-[80px] sm:h-[80px] md:w-[120px] md:h-[120px] object-contain" />
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
                            <div className={`text-sm font-bold text-[var(--color-text-primary)] ${stat.label === 'Registered Address' || stat.label.startsWith('Director') ? 'line-clamp-2 leading-relaxed' : 'truncate'}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
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
    );
};

export default ClientDashboard;
