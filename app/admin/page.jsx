'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Trophy, 
  Newspaper,
  CalendarDays,
  Clock,
  ChevronRight,
  Settings,
  Shield,
  Briefcase,
  Medal,
  Target,
  Activity,
  ChartArea,
  Heart,
  Scissors
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est un coach, il n'a rien à faire sur le dashboard général
    if (status === 'authenticated' && session?.user?.role === 'coach') {
      router.replace('/admin/indivs');
    }
  }, [session, status, router]);

  // Petite fonction pour avoir la date du jour en français
  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  if (status === 'loading' || (session?.user?.role === 'coach')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0EE2E2] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Extraction du prénom pour le message de bienvenue
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Admin';

  // Liens pour le menu de gauche (Desktop uniquement), maintenant complet
  const adminMenu = [
    { name: 'Utilisateurs', path: '/admin/utilisateurs', icon: <Shield size={20} /> },
    { name: 'Actualités', path: '/admin/news', icon: <Newspaper size={20} /> },
    { name: 'Calendrier', path: '/admin/events', icon: <CalendarDays size={20} /> },
    { name: 'Joueurs', path: '/admin/joueurs', icon: <Medal size={20} /> },
    { name: 'Créneaux', path: '/admin/creneaux', icon: <Clock size={20} /> },
    { name: 'Indivs', path: '/admin/indivs', icon: <Target size={20} /> },
    { name: 'Live Score', path: '/admin/score', icon: <Activity size={20} /> },
    { name: 'Tournois', path: '/admin/tournois', icon: <Medal size={20} /> },
    { name: 'Bureau & CRs', path: '/admin/bureau', icon: <Briefcase size={20} /> },
    { name: 'Staff & Équipe', path: '/admin/equipe', icon: <Users size={20} /> },
    { name: 'Paramètres', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const pagesMenu = [
    { name: 'Interclubs', path: '/admin/interclubs', icon: <Trophy size={20} /> },
    { name: 'Tournois', path: '/admin/tournois', icon: <Medal size={20} /> },
    { name: 'Communication', path: '/admin/communication', icon: <ChartArea size={20} /> },
    { name: 'Pôle Féminin', path: '/admin/pole-feminin', icon: <Heart size={20} /> },
    { name: 'Espace Entraîneurs', path: '/admin/entrainements', icon: <Settings size={20} /> },
    { name: 'Espace Buvette', path: '/admin/buvette', icon: <Briefcase size={20} /> },
    { name: 'Espace cordeurs', path: '/admin/cordage', icon: <Scissors size={20} /> },
  ]

  return (
    <div className="flex flex-col lg:flex-row pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 gap-8">
      
      {/* 1. CONTENEUR NAVIGATION GAUCHE (Desktop UNIQUEMENT, positionnement normal) */}
      <div className='flex-col lg:flex gap-6'>
        <div className="hidden lg:flex flex-col w-[260px] xl:w-[280px] shrink-0 bg-white dark:bg-[#081031] rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm h-fit">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 pl-2">Navigation</h2>
          <nav className="space-y-1">
            {adminMenu.map(item => (
              <Link key={item.name} href={item.path} className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm text-[#081031] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-all group">
                <span className="text-slate-400 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] group-hover:scale-110 transition-all">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex flex-col w-[260px] xl:w-[280px] shrink-0 bg-white dark:bg-[#081031] rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm h-fit">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 pl-2">Pages & Contenu</h2>
          <nav className="space-y-1">
            {pagesMenu.map(item => (
              <Link key={item.name} href={item.path} className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm text-[#081031] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-all group">
                <span className="text-slate-400 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] group-hover:scale-110 transition-all">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 2. CONTENU CENTRAL */}
      <div className="flex-1 w-full space-y-10">
        
        {/* En-tête avec Date et Profil */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-5">
            <Link href="/admin/profil" className="relative group shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0065FF] dark:border-[#0EE2E2] shadow-lg bg-slate-200 dark:bg-[#081031] flex items-center justify-center text-xl font-black text-slate-500 dark:text-slate-400 group-hover:scale-105 transition-transform duration-300">
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
                Bonjour <span className="text-[#0065FF] dark:text-[#0EE2E2]">{firstName}</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold">Bienvenue sur le centre de contrôle du club.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#081031] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm inline-flex items-center gap-2">
            <CalendarDays size={16} className="text-[#0065FF] dark:text-[#0EE2E2]" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">{today}</span>
          </div>
        </div>

        {/* Cartes de statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <StatCard title="Licenciés Actifs" value="307" desc="+12 ce mois-ci" icon={<Users size={24} />} color="bg-blue-500" />
          <StatCard title="Tournois & Promobad" value="3" desc="En préparation" icon={<Trophy size={24} />} color="bg-[#F72585]" />
          <StatCard title="Prochain Match" value="J-4" desc="Nationale 1 vs Chambly" icon={<TrendingUp size={24} />} color="bg-[#0EE2E2]" textColor="text-[#081031]" />
        </div>

        {/* ==========================================
            AFFICHAGE DESKTOP : ACCÈS RAPIDE (Cartes Horizontales)
            ========================================== */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-[900] uppercase text-[#081031] dark:text-white italic">Accès Rapide</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <QuickActionCard 
              href="/admin/score" 
              icon={<Trophy size={24} />} 
              title="Live Score" 
              desc="Mettre à jour le score en direct." 
              color="text-[#0065FF]" 
              bgHover="hover:border-[#0065FF]" 
            />
            <QuickActionCard 
              href="/admin/tournois" 
              icon={<Trophy size={24} />} 
              title="Tournois" 
              desc="Tournois officiels et Promobad." 
              color="text-[#F72585]" 
              bgHover="hover:border-[#F72585]" 
            />
            <QuickActionCard 
              href="/admin/board" 
              icon={<Briefcase size={24} />} 
              title="Bureau & CRs" 
              desc="Comptes rendus et documents." 
              color="text-[#0EE2E2]" 
              bgHover="hover:border-[#0EE2E2]" 
            />
            <QuickActionCard 
              href="/admin/settings" 
              icon={<Settings size={24} />} 
              title="Paramètres" 
              desc="Configuration générale du club." 
              color="text-slate-500" 
              bgHover="hover:border-slate-500" 
            />
          </div>
        </div>

        {/* ==========================================
            AFFICHAGE MOBILE : MODULES D'ADMINISTRATION (Cartes Carrées)
            ========================================== */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-[900] uppercase text-[#081031] dark:text-white italic">Modules d'administration</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ModuleCard href="/admin/score" icon={<Trophy size={28} />} title="Live Score" color="text-[#0065FF]" bgHover="hover:border-[#0065FF]" />
            <ModuleCard href="/admin/tournois" icon={<Trophy size={28} />} title="Tournois" color="text-[#F72585]" bgHover="hover:border-[#F72585]" />
            <ModuleCard href="/admin/board" icon={<Briefcase size={28} />} title="Bureau & CRs" color="text-[#0EE2E2]" bgHover="hover:border-[#0EE2E2]" />
            <ModuleCard href="/admin/events" icon={<CalendarDays size={28} />} title="Calendrier" color="text-[#9333EA]" bgHover="hover:border-[#9333EA]" />
            
            <ModuleCard href="/admin/utilisateurs" icon={<Shield size={28} />} title="Utilisateurs" color="text-[#0065FF]" bgHover="hover:border-[#0065FF]" />
            <ModuleCard href="/admin/news" icon={<Newspaper size={28} />} title="Actualités" color="text-[#F72585]" bgHover="hover:border-[#F72585]" />
            <ModuleCard href="/admin/joueurs" icon={<Medal size={28} />} title="Joueurs" color="text-[#0EE2E2]" bgHover="hover:border-[#0EE2E2]" />
            <ModuleCard href="/admin/creneaux" icon={<Clock size={28} />} title="Créneaux" color="text-[#9333EA]" bgHover="hover:border-[#9333EA]" />
            
            <ModuleCard href="/admin/indivs" icon={<Target size={28} />} title="Indivs" color="text-[#0065FF]" bgHover="hover:border-[#0065FF]" />
            <ModuleCard href="/admin/settings" icon={<Settings size={28} />} title="Paramètres" color="text-slate-500" bgHover="hover:border-slate-500" />
          </div>
        </div>

        {/* ==========================================
            À NE PAS OUBLIER (Commun Desktop & Mobile)
            ========================================== */}
        <div className="bg-white dark:bg-[#081031] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col mt-4">
          <h2 className="text-xl font-[900] uppercase text-[#081031] dark:text-white mb-6 lg:mb-8 flex items-center gap-3 italic">
            <AlertCircle className="text-orange-500" size={24} /> À ne pas oublier
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-[#081031] dark:text-white mb-2">CR Assemblée Générale</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">Le document PDF de la dernière AG doit être uploadé pour le rendre accessible aux adhérents.</p>
              </div>
              <Link href="/admin/board" className="text-xs font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest flex items-center gap-2 w-fit bg-orange-100 dark:bg-orange-500/20 px-4 py-2 rounded-xl transition-colors">
                Uploader le fichier <ChevronRight size={14} />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EE2E2] rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-30"></div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-[#081031] dark:text-white mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-[#0065FF] dark:text-[#0EE2E2]" /> Prochain Événement
                </h3>
                <p className="text-lg font-black text-[#0065FF] dark:text-[#0EE2E2] mb-2 uppercase tracking-tight">Rencontre N1 vs Chambly</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Samedi prochain à 16h00. N'oubliez pas de mettre à jour le Live Score le jour J.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-4 border-t border-slate-100 dark:border-white/10">
            <Link href="/admin/events" className="w-full py-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              Voir le calendrier complet
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

// Sous-composant : Cartes Horizontales (Desktop)
const QuickActionCard = ({ href, icon, title, desc, color, bgHover }) => (
  <Link href={href}>
    <div className={`group p-6 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 h-full flex flex-col justify-center ${bgHover}`}>
      <div className={`w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <h3 className="font-[900] text-sm lg:text-base text-[#081031] dark:text-white uppercase mb-1 leading-tight pt-1">
        {title}
      </h3>
      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-auto leading-relaxed">
        {desc}
      </p>
    </div>
  </Link>
);

// Sous-composant : Cartes Carrées (Mobile)
const ModuleCard = ({ href, icon, title, color, bgHover }) => (
  <Link href={href}>
    <div className={`group p-4 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-[1.5rem] transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 aspect-square flex flex-col items-center justify-center text-center ${bgHover}`}>
      <div className={`w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <h3 className="font-[900] text-xs sm:text-sm text-[#081031] dark:text-white uppercase leading-tight">
        {title}
      </h3>
    </div>
  </Link>
);

// Sous-composant : Statistiques
const StatCard = ({ title, value, desc, icon, color, textColor = "text-white" }) => (
  <div className="bg-white dark:bg-[#081031] p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-4 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-full blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>
    
    <div className={`w-14 h-14 ${color} ${textColor} rounded-2xl flex items-center justify-center shrink-0 shadow-md relative z-10 transition-transform group-hover:scale-105`}>
      {icon}
    </div>
    <div className="relative z-10">
      <div className="text-4xl font-[900] italic text-[#081031] dark:text-white leading-none mb-1.5 pt-1">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-[#0065FF] dark:text-[#0EE2E2] mb-1">{title}</div>
      {desc && <div className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{desc}</div>}
    </div>
  </div>
);