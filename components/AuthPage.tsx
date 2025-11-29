import React, { useState } from 'react';
import { signup, login } from '../services/authService';
import { UserAccount } from '../types';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { APP_LOGO_URL } from '../constants';

interface AuthPageProps {
  onAuthSuccess: (user: UserAccount) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay for UX
      
      let user: UserAccount;
      if (isLogin) {
        user = login(email, password);
      } else {
        if (!name.trim()) throw new Error("Name is required.");
        user = signup(email, password, name);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black z-0"></div>
      
      {/* Animated BG elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
           <img 
              src={APP_LOGO_URL} 
              alt="Erynto" 
              className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg shadow-emerald-500/20"
           />
           <h1 className="text-3xl font-bold text-white tracking-tight">Erynto</h1>
           <p className="text-slate-400 text-sm mt-1">
             {isLogin ? 'Welcome back, traveler.' : 'Create your digital identity.'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign Up Name Field */}
          {!isLogin && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-transparent hover:decoration-emerald-300 transition-all"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};