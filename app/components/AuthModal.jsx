'use client';
import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const AuthModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        setError("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
      } else {
        onClose();
        window.location.href = '/admin'; 
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-['Montserrat']">
      
      {/* Overlay sombre */}
      <div 
        className="absolute inset-0 bg-[#040817]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Fenêtre minimaliste */}
      <div className="relative w-full max-w-[360px] bg-white dark:bg-[#081031] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 rounded-full transition-all shadow-sm hover:rotate-90"
        >
          <X size={16} />
        </button>

        <div className="p-6 lg:p-8 relative z-10">
          
          {/* En-tête Compact */}
          <div className="flex flex-col items-center text-center mb-6 mt-2">
            <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center mb-3 border border-slate-200 dark:border-white/5">
              <Shield size={18} />
            </div>
            <h3 className="text-xl font-[900] uppercase text-[#081031] dark:text-white leading-none tracking-tight">
              Connexion <span className="text-[#0065FF]">Staff</span>
            </h3>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest animate-in shake">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-[#081031] dark:text-white rounded-xl px-4 py-3 pl-10 text-xs font-bold focus:ring-2 focus:ring-[#0065FF] dark:focus:ring-[#0EE2E2] outline-none transition-all placeholder:text-slate-400" 
                  placeholder="admin@uscbad.fr"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1 mr-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Mot de passe</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-[#081031] dark:text-white rounded-xl px-4 py-3 pl-10 text-xs font-bold focus:ring-2 focus:ring-[#0065FF] dark:focus:ring-[#0EE2E2] outline-none transition-all placeholder:text-slate-400" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0065FF] hover:bg-[#0052cc] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 group"
              >
                {isLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Connexion...</>
                ) : (
                  <>Accéder <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;