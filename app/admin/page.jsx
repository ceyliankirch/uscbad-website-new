'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, Users, Trophy, Newspaper, CalendarDays, 
  Clock, Settings, Shield, Target, Activity, 
  ChartArea, Heart, Wallet, Wrench, Send, Coffee, Dumbbell, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
  document.title = "Dashboard | US Créteil Badminton";    // Redirection de sécurité selon le rôle
    if (status === 'authenticated') {
      const roles = session?.user?.roles || (session?.user?.role ? [session.user.role] : []);
      const isAdmin = roles.includes('admin');
      
      // Si c'est UNIQUEMENT un coach, on l'envoie sur son espace
      if (roles.includes('coach') && !isAdmin) {
        router.replace('/admin/entrainements');
      }
    }
  }, [session, status, router]);

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0065FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Initialisation...</p>
        </div>
      </div>
    );
  }

  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Admin';

  // =========================================================================
  // ORGANISATION DES MODULES (Pour la grille Mobile & Desktop)
  // =========================================================================
  const modulesGroups = [
    {
      title: "Gestion & Finances",
      color: "text-[#0065FF]",
      bgHover: "hover:border-[#0065FF] hover:shadow-[#0065FF]/20",
      iconBg: "bg-[#0065FF]/10 dark:bg-[#0065FF]/20",
      items: [
        { name: 'Licenciés', path: '/admin/joueurs', icon: <Users size={24} /> },
        { name: 'Staff & Accès', path: '/admin/utilisateurs', icon: <Shield size={24} /> },
        { name: 'Trésorerie', path: '/admin/tresorerie', icon: <Wallet size={24} /> },
        { name: 'Outils', path: '/admin/boite-a-outils', icon: <Wrench size={24} /> },
      ]
    },
    {
      title: "Sport & Événements",
      color: "text-[#0EE2E2]",
      bgHover: "hover:border-[#0EE2E2] hover:shadow-[#0EE2E2]/20",
      iconBg: "bg-[#0EE2E2]/10 dark:bg-[#0EE2E2]/20",
      items: [
        { name: 'Événementiel', path: '/admin/evenementiel', icon: <CalendarDays size={24} /> },
        { name: 'Interclubs', path: '/admin/interclubs', icon: <Trophy size={24} /> },
        { name: 'Live Score', path: '/admin/score', icon: <Activity size={24} /> },
        { name: 'Créneaux', path: '/admin/creneaux', icon: <Clock size={24} /> },
      ]
    },
    {
      title: "Espaces & Communication",
      color: "text-[#F72585]",
      bgHover: "hover:border-[#F72585] hover:shadow-[#F72585]/20",
      iconBg: "bg-[#F72585]/10 dark:bg-[#F72585]/20",
      items: [
        { name: 'Actualités', path: '/admin/news', icon: <Newspaper size={24} /> },
        { name: 'Emails', path: '/admin/emails', icon: <Send size={24} /> },
        { name: 'Page Web', path: '/admin/communication', icon: <ChartArea size={24} /> },
        { name: 'Pôle Féminin', path: '/admin/pole-feminin', icon: <Heart size={24} /> },
        { name: 'Entraînements', path: '/admin/entrainements', icon: <Dumbbell size={24} /> },
        { name: 'Buvette', path: '/admin/buvette', icon: <Coffee size={24} /> },
      ]
    }
  ];

  return (
    <div className="font-['Montserrat'] pb-32 animate-in fade-in duration-500 max-w-[1600px] mx-auto select-none sm:select-auto">
      
      {/* =========================================================
          1. EN-TÊTE : PROFIL & SALUTATION
          ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6 mb-8 pt-4">
        <div className="flex items-center gap-5">
          <Link href="/admin/profil" className="relative group shrink-0 active:scale-95 transition-transform">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-[3px] border-[#0065FF] shadow-lg bg-slate-200 dark:bg-[#081031] flex items-center justify-center text-xl lg:text-3xl font-black text-[#0065FF]">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute bottom-0 -right-1 bg-[#081031] dark:bg-white text-white dark:text-[#081031] p-1.5 rounded-full shadow-md border-2 border-white dark:border-[#040817]">
              <Settings size={12} />
            </div>
          </Link>

          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white mb-1 leading-tight tracking-tight">
              Salut <span className="text-[#0065FF]">{firstName}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Centre de contrôle du club
            </p>
          </div>
        </div>

        <div className="hidden sm:inline-flex bg-white dark:bg-[#081031] px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm items-center gap-3">
          <CalendarDays size={18} className="text-[#0065FF]" />
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 capitalize tracking-widest">{today}</span>
        </div>
      </div>

      {/* =========================================================
          2. GRILLE DES MODULES (2 PAR RANGÉE SUR MOBILE)
          ========================================================= */}
      <div className="space-y-10 lg:space-y-12">
        {modulesGroups.map((group, idx) => (
          <div key={idx} className="space-y-4 lg:space-y-6">
            <h2 className="text-base lg:text-xl font-[900] uppercase italic text-slate-400 dark:text-slate-500 flex items-center gap-3 pl-2">
              {group.title}
            </h2>
            
            {/* GRID : 2 colonnes sur mobile, 3 sur tablette, 4 ou 5 sur desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
              {group.items.map((item, itemIdx) => (
                <Link key={itemIdx} href={item.path} className="block active:scale-95 transition-transform duration-200">
                  <div className={`bg-white dark:bg-[#0f172a] rounded-2xl lg:rounded-[1.5rem] p-5 lg:p-6 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl aspect-square group ${group.bgHover}`}>
                    
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-[1rem] lg:rounded-[1.2rem] flex items-center justify-center mb-3 lg:mb-4 shadow-inner transition-transform group-hover:scale-110 ${group.color} ${group.iconBg}`}>
                      {React.cloneElement(item.icon, { className: "w-7 h-7 lg:w-8 lg:h-8" })}
                    </div>
                    
                    <h3 className="font-[900] uppercase text-[10px] sm:text-[11px] lg:text-xs tracking-widest text-[#081031] dark:text-white leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}