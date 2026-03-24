import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ email, password });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="max-w-md w-full space-y-8 bg-[var(--color-bg-secondary)] p-8 rounded-xl shadow-2xl border border-[var(--color-bg-tertiary)] animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center">
          <img 
            src="/logo.svg" 
            alt="Startup Station Logo" 
            className="h-24 w-auto mb-6 transition-transform hover:scale-105 duration-300" 
          />
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] group">
            Welcome Back
            <div className="h-1 w-0 group-hover:w-full bg-[var(--color-accent)] transition-all duration-300"></div>
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Please enter your details to login
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 group-focus-within:text-[var(--color-accent)] transition-colors"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-accent)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="relative group">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 group-focus-within:text-[var(--color-accent)] transition-colors"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-accent)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:outline-none transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[var(--color-crm-orange)] hover:bg-[#d99a46] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-all duration-300 items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                  LOGIN
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-4">
          <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest opacity-60">
            &copy; 2026 Kleardocs CRM. Secure Access Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
