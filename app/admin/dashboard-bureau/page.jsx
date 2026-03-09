'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Briefcase, 
  CalendarDays, 
  Coffee, 
  Wrench, 
  Send, 
  ChevronRight, 
  Loader2, 
  Settings 
} from 'lucide-react';

export default function BureauDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      const userRoles = session?.user?.roles || (session?.user?.role ? [session.user.role] : []);
      // On autorise les membres du bureau et les admins globaux à voir cette page
      const isBureau = userRoles.includes('bureau') || userRoles.includes('admin');

      if (!isBureau) {
        router.replace('/profil');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [status, session, router]);

  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-[#0065FF]" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chargement de votre espace...</p>
      </div>
    );
  }

  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Membre';

  const modules = [
    { name: 'Emails & Newsletters', path: '/admin/emails', icon: <Send size={32} />, color: 'text-[#0065FF]', bgHover: 'hover:border-[#0065FF]', desc: 'Communiquer avec les adhérents.' },
    { name: 'Organisation Bureau', path: '/admin/bureau', icon: <Briefcase size={32} />, color: 'text-[#9333EA]', bgHover: 'hover:border-[#9333EA]', desc: 'Réunions, comptes-rendus et membres.' },
    { name: 'Pôle Événementiel', path: '/admin/evenementiel', icon: <CalendarDays size={32} />, color: 'text-[#0EE2E2]', bgHover: 'hover:border-[#0EE2E2]', desc: 'Calendrier, Tournois et Projets.' },
    { name: 'Gestion Joueurs', path: '/admin/joueurs', icon: <Users size={32} />, color: 'text-[#F72585]', bgHover: 'hover:border-[#F72585]', desc: 'Licenciés FFBaD et Effectifs.' },
    { name: 'La Buvette', path: '/admin/buvette', icon: <Coffee size={32} />, color: 'text-[#FFD500]', bgHover: 'hover:border-[#FFD500]', desc: 'Finances, menus et stocks.' },
    { name: 'Boîte à Outils', path: '/admin/boite-a-outils', icon: <Wrench size={32} />, color: 'text-slate-500', bgHover: 'hover:border-slate-500', desc: 'Mots de passe et accès du club.' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24 max-w-7xl mx-auto">
      
      {/* EN-TÊTE PROFIL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-10">
        <div className="flex items-center gap-5">
          <Link href="/profil" className="relative group shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0065FF] shadow-lg bg-slate-200 dark:bg-[#081031] flex items-center justify-center text-xl font-black text-slate-500 dark:text-slate-400 group-hover:scale-105 transition-transform duration-300">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute bottom-0 -right-1 bg-[#081031] dark:bg-white text-white dark:text-[#081031] p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md border-2 border-white dark:border-[#040817]">
              <Settings size={12} />
            </div>
          </Link>

          <div>
            <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-1 leading-tight pt-2">
              Espace <span className="text-[#0065FF]">Bureau</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold">Bonjour {firstName}, gérez les pôles clés de l'association.</p>
          </div>
        </div>
      </div>

      {/* GRILLE DES MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {modules.map((mod, idx) => (
          <Link key={idx} href={mod.path} className={`group bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border-2 border-transparent shadow-sm hover:shadow-xl transition-all flex flex-col ${mod.bgHover}`}>
            <div className={`w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${mod.color}`}>
              {mod.icon}
            </div>
            <h3 className="text-xl lg:text-2xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight mb-3">
              {mod.name}
            </h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
              {mod.desc}
            </p>
            <div className={`mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${mod.color}`}>
              Accéder <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}