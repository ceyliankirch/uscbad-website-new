'use client';
import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Shield, ChevronLeft } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Redirige là où l'utilisateur voulait aller

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Identifiants incorrects. Veuillez vérifier votre saisie.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-sans flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* EFFETS DE FOND */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0065FF] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0EE2E2] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] mb-8 transition-colors">
          <ChevronLeft size={16} /> Retour au site
        </Link>

        {/* CARTE DE CONNEXION */}
        <div className="bg-white dark:bg-[#081031] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
          
          <div className="p-8 lg:p-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-inner">
                <Shield className="text-[#0065FF] dark:text-[#0EE2E2]" size={32} />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">
                Connexion <span className="text-[#0065FF] dark:text-[#0EE2E2]">USC</span>
              </h1>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Accédez à votre espace personnel.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-start gap-3 animate-in shake">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs font-bold text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Adresse Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF] dark:focus:ring-[#0EE2E2] outline-none transition-all placeholder:text-slate-400" 
                    placeholder="jean@uscreteil.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1 pr-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mot de passe</label>
                  <a href="#" className="text-[10px] font-bold text-[#0065FF] dark:text-[#0EE2E2] hover:underline">Oublié ?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF] dark:focus:ring-[#0EE2E2] outline-none transition-all placeholder:text-slate-400" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#0065FF] hover:bg-[#0052cc] text-white py-4 rounded-xl font-[900] uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#0065FF]/30 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Connexion...</>
                  ) : (
                    <>Se connecter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 p-6 text-center">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Vous n'avez pas de compte ? <Link href="/inscriptions" className="text-[#0065FF] dark:text-[#0EE2E2] hover:underline uppercase tracking-wider">Inscrivez-vous</Link>
            </p>
          </div>

        </div>
        
        {/* Rappel pour vos tests */}
        <div className="mt-8 text-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-xs font-medium text-slate-500">
          <span className="font-black uppercase">Comptes de test actifs :</span><br />
          Admin: admin@uscreteil.com / admin123<br />
          Coach: malo@uscreteil.com / coach123
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#040817]"><Loader2 className="animate-spin text-[#0EE2E2]" size={48} /></div>}>
      <LoginForm />
    </Suspense>
  );
}