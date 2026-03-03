// app/admin/page.jsx
'use client';
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertCircle, 
  Trophy, 
  Newspaper,
  Heart,
  CalendarDays,
  PlusCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Petite fonction pour avoir la date du jour en français
  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* En-tête avec Date */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Vue <span className="text-[#0065FF] dark:text-[#0EE2E2]">d'ensemble</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Bienvenue sur le centre de contrôle du club.</p>
        </div>
        <div className="bg-white dark:bg-[#081031] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm inline-flex items-center gap-2">
          <CalendarDays size={16} className="text-[#0065FF] dark:text-[#0EE2E2]" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">{today}</span>
        </div>
      </div>

      {/* Cartes de statistiques rapides (Mises à jour avec Tournois & Staff) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Licenciés Actifs" value="307" desc="+12 ce mois-ci" icon={<Users size={24} />} color="bg-blue-500" />
        <StatCard title="Tournois & Promobad" value="3" desc="En préparation" icon={<Trophy size={24} />} color="bg-[#F72585]" />
        <StatCard title="Staff & Bénévoles" value="24" desc="Membres enregistrés" icon={<Heart size={24} />} color="bg-[#9333EA]" />
        <StatCard title="Prochain Match" value="J-4" desc="Nationale 1 vs Chambly" icon={<TrendingUp size={24} />} color="bg-[#0EE2E2]" textColor="text-[#081031]" />
      </div>

      {/* Disposition en 2 colonnes : Actions Rapides + Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        
        {/* COLONNE GAUCHE : Actions Rapides (Prend 2/3 de l'espace) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-[900] uppercase text-[#081031] dark:text-white">Actions Rapides</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard 
              href="/admin/score"
              icon={<Trophy size={24} />}
              title="Mettre à jour le Score"
              desc="Modifier le Live Score affiché en page d'accueil."
              color="text-[#0065FF] dark:text-[#0EE2E2]"
              bgHover="hover:border-[#0065FF] dark:hover:border-[#0EE2E2]"
            />
            <QuickActionCard 
              href="/admin/news"
              icon={<Newspaper size={24} />}
              title="Rédiger un Article"
              desc="Publier une nouvelle actualité ou un résultat."
              color="text-[#0065FF] dark:text-[#0EE2E2]"
              bgHover="hover:border-[#0065FF] dark:hover:border-[#0EE2E2]"
            />
            <QuickActionCard 
              href="/admin/tournois"
              icon={<Trophy size={24} />}
              title="Gérer les Tournois"
              desc="Modifier la Petite Plume, Grande Plume, etc."
              color="text-[#F72585]"
              bgHover="hover:border-[#F72585]"
            />
            <QuickActionCard 
              href="/admin/equipe"
              icon={<Users size={24} />}
              title="Gérer le Staff"
              desc="Ajouter un entraîneur ou un bénévole."
              color="text-[#9333EA]"
              bgHover="hover:border-[#9333EA]"
            />
          </div>
        </div>

        {/* COLONNE DROITE : Rappels / Activité (Prend 1/3 de l'espace) */}
        <div className="bg-white dark:bg-[#081031] rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col h-full">
          <h2 className="text-lg font-[900] uppercase text-[#081031] dark:text-white mb-6 flex items-center gap-2">
            <AlertCircle className="text-orange-500" size={20} /> À ne pas oublier
          </h2>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
              <h3 className="text-sm font-bold text-[#081031] dark:text-white mb-1">CR Assemblée Générale</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Le document PDF de la dernière AG doit être uploadé.</p>
              <Link href="/admin/board" className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider flex items-center gap-1">
                Uploader le fichier <ChevronRight size={14} />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#0EE2E2] rounded-full blur-[30px] opacity-20"></div>
              <h3 className="text-sm font-bold text-[#081031] dark:text-white mb-1 flex items-center gap-2">
                <Clock size={14} className="text-[#0065FF] dark:text-[#0EE2E2]" /> Prochain Événement
              </h3>
              <p className="text-xs font-bold text-[#0065FF] dark:text-[#0EE2E2] mb-1">Rencontre N1 vs Chambly</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Samedi prochain à 16h00. N'oubliez pas de mettre à jour le Live Score le jour J.</p>
            </div>
          </div>
          
          <Link href="/admin/planning" className="mt-6 w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            Voir le planning complet
          </Link>
        </div>

      </div>

    </div>
  );
}

// Sous-composant pour les cartes Actions Rapides
const QuickActionCard = ({ href, icon, title, desc, color, bgHover }) => (
  <Link href={href}>
    <div className={`group p-6 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md h-full flex flex-col justify-center ${bgHover}`}>
      <div className={`w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <h3 className="font-[900] text-sm lg:text-base text-[#081031] dark:text-white uppercase mb-1 leading-tight pt-1">
        {title}
      </h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-auto">
        {desc}
      </p>
    </div>
  </Link>
);

// Sous-composant pour les statistiques
const StatCard = ({ title, value, desc, icon, color, textColor = "text-white" }) => (
  <div className="bg-white dark:bg-[#081031] p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-4 relative overflow-hidden group">
    {/* Petit halo lumineux au survol */}
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-full blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>
    
    <div className={`w-12 h-12 ${color} ${textColor} rounded-xl flex items-center justify-center shrink-0 shadow-md relative z-10`}>
      {icon}
    </div>
    <div className="relative z-10">
      <div className="text-3xl font-[900] italic text-[#081031] dark:text-white leading-none mb-1 pt-1">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#0065FF] dark:text-[#0EE2E2] mb-1">{title}</div>
      {desc && <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{desc}</div>}
    </div>
  </div>
);