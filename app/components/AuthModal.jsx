'use client';
import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';
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
        // Succès ! On ferme et on redirige vers l'admin
        onClose();
        window.location.href = '/admin';
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
      setIsLoading(false);
    }
  };

  return (
    /* Le z-[9999] est CRUCIAL ici pour sortir du contexte de la Navbar 
       et s'afficher par-dessus le contenu du Planning ou de la Landing.
    */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-['Montserrat']">
      
      {/* Overlay sombre avec flou intense pour l'immersion */}
      <div 
        className="absolute inset-0 bg-[#081031]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Fenêtre de la Modale */}
      <div className="relative bg-white dark:bg-[#081031] w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100 dark:border-white/10">
        
        {/* Bouton Fermer */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-[#081031] dark:hover:text-white transition-all p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:rotate-90"
        >
          <X size={20} />
        </button>

        <div className="p-8 lg:p-12">
          {/* En-tête */}
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">
              Espace <span className="text-[#0065FF] dark:text-[#0EE2E2]">Admin</span>
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
              Accès réservé au bureau de l'US Créteil
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-[900] uppercase text-center animate-shake">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-[900] uppercase tracking-widest text-[#081031] dark:text-white/60 ml-1">Identifiant</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0065FF] dark:text-[#0EE2E2]">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 text-[#081031] dark:text-white text-sm font-bold rounded-2xl focus:ring-2 focus:ring-[#0065FF] dark:focus:ring-[#0EE2E2] focus:border-transparent block pl-12 p-4 transition-all outline-none" 
                  placeholder="admin@uscbad.fr"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-[900] uppercase tracking-widest text-[#081031] dark:text-white/60 ml-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0065FF] dark:text-[#0EE2E2]">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 text-[#081031] dark:text-white text-sm font-bold rounded-2xl focus:ring-2 focus:ring-[#0065FF] dark:focus:ring-[#0EE2E2] focus:border-transparent block pl-12 p-4 transition-all outline-none" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#081031] dark:bg-[#0EE2E2] text-white dark:text-[#081031] hover:bg-[#0065FF] dark:hover:bg-white font-[900] uppercase text-[11px] tracking-[0.2em] rounded-2xl p-4 mt-6 flex items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
              {isLoading ? 'Authentification...' : 'Se Connecter'}
              {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;