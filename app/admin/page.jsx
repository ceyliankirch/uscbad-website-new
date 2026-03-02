// app/admin/page.jsx
import React from 'react';
import { TrendingUp, Users, Calendar, AlertCircle, Trophy, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* En-tête */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">
          Vue <span className="text-[#0065FF] dark:text-[#0EE2E2]">d'ensemble</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">Bienvenue sur le centre de contrôle du club.</p>
      </div>

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Licenciés Actifs" value="307" icon={<Users size={24} />} color="bg-blue-500" />
        <StatCard title="Prochain Match" value="J-4" desc="Nationale 1 vs Chambly" icon={<TrendingUp size={24} />} color="bg-[#0EE2E2]" textColor="text-[#081031]" />
        <StatCard title="Événements à venir" value="3" icon={<Calendar size={24} />} color="bg-indigo-500" />
        <StatCard title="Mises à jour requises" value="1" desc="CR de la dernière AG" icon={<AlertCircle size={24} />} color="bg-orange-500" />
      </div>

      {/* Section des actions rapides */}
      <div className="mt-10">
        <h2 className="text-xl font-[900] uppercase text-[#081031] dark:text-white mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          
          <Link href="/admin/score">
            <div className="group p-6 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-[#0065FF] dark:hover:border-[#0EE2E2] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-[#0065FF] dark:text-[#0EE2E2] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
              <h3 className="font-[900] text-lg text-[#081031] dark:text-white uppercase mb-1">Mettre à jour le Score</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Modifier le Live Score affiché en page d'accueil.</p>
            </div>
          </Link>

          <Link href="/admin/news">
            <div className="group p-6 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-[#0065FF] dark:hover:border-[#0EE2E2] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-[#0065FF] dark:text-[#0EE2E2] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Newspaper size={24} />
              </div>
              <h3 className="font-[900] text-lg text-[#081031] dark:text-white uppercase mb-1">Rédiger un Article</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Publier une nouvelle actualité ou un résultat.</p>
            </div>
          </Link>

          <Link href="/admin/board">
            <div className="group p-6 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-[#0065FF] dark:hover:border-[#0EE2E2] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-[#0065FF] dark:text-[#0EE2E2] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="font-[900] text-lg text-[#081031] dark:text-white uppercase mb-1">Bureau & CRs</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Importer un compte-rendu ou modifier les membres.</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}

// Petit composant réutilisable pour les statistiques
const StatCard = ({ title, value, desc, icon, color, textColor = "text-white" }) => (
  <div className="bg-white dark:bg-[#081031] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-4">
    <div className={`w-12 h-12 ${color} ${textColor} rounded-xl flex items-center justify-center shrink-0 shadow-inner`}>
      {icon}
    </div>
    <div>
      <div className="text-3xl font-[900] italic text-[#081031] dark:text-white leading-none mb-1">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#0065FF] dark:text-[#0EE2E2] mb-1">{title}</div>
      {desc && <div className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{desc}</div>}
    </div>
  </div>
);