import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginCustomer } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { User, Lock, ArrowRight, Mail, Globe, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';

const ClientLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { username: '', password: '' };

        if (!credentials.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (credentials.username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (credentials.password.length < 4) {
            // Some customers might have short simple passwords initially
            newErrors.password = 'Password must be at least 4 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            await dispatch(loginCustomer({
                ...credentials,
                username: credentials.username.trim()
            })).unwrap();
            toast.success('Welcome to your Kleardocs Portal!');
            navigate('/clients/dashboard');
        } catch (error) {
            toast.error(error || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans selection:bg-crm-orange/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-crm-orange/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative w-full max-w-[450px]">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-20 h-20 flex items-center justify-center mb-6 transition-transform hover:scale-105 duration-300">
                        <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-crm-orange tracking-tight mb-2">
                        KLEARDOCS <span className="text-white">CLIENTS</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Access your annual compliance records</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-crm-orange transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={`w-full bg-slate-800/50 border ${errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-crm-orange/50'} rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 ${errors.username ? 'focus:ring-red-500/10' : 'focus:ring-crm-orange/10'} transition-all`}
                                    placeholder="Enter your username"
                                    value={credentials.username}
                                    onChange={(e) => {
                                        setCredentials({ ...credentials, username: e.target.value });
                                        if (errors.username) setErrors({ ...errors, username: '' });
                                    }}
                                />
                            </div>
                            {errors.username && <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errors.username}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-crm-orange transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full bg-slate-800/50 border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-crm-orange/50'} rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 ${errors.password ? 'focus:ring-red-500/10' : 'focus:ring-crm-orange/10'} transition-all`}
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => {
                                        setCredentials({ ...credentials, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-crm-orange transition-colors focus:outline-none"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-crm-orange to-orange-600 hover:from-orange-500 hover:to-crm-orange text-white font-bold py-4 rounded-2xl shadow-xl shadow-crm-orange/20 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>SIGN IN TO PORTAL</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-10 flex flex-col items-center gap-4 text-slate-500 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                    {/* <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div> */}
                    <p>© 2026 Kleardocs Solutions Private Limited. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default ClientLogin;
