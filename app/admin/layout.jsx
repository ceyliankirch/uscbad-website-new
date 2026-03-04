'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  CalendarDays, 
  Clock, 
  Newspaper, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Medal,
  Briefcase,
  Shield,
  Target
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Configuration de TOUS les onglets avec les rôles autorisés
  const allNavItems = [
    { name: "Vue d'ensemble", icon: <LayoutDashboard size={20} />, path: '/admin', roles: ['admin'] },
    { name: 'Paramètres Club', icon: <Settings size={20} />, path: '/admin/settings', roles: ['admin'] },
    { name: 'Utilisateurs', icon: <Shield size={20} />, path: '/admin/utilisateurs', roles: ['admin'] },
    { name: 'Bureau & CRs', icon: <Briefcase size={20} />, path: '/admin/board', roles: ['admin'] },
    { name: 'Indivs', icon: <Target size={20} />, path: '/mes-indivs', roles: ['admin', 'coach'] }, // Accessible par les coachs
    { name: 'Live Score', icon: <Trophy size={20} />, path: '/admin/score', roles: ['admin'] },
    { name: 'Événements', icon: <CalendarDays size={20} />, path: '/admin/events', roles: ['admin'] },
    { name: 'Créneaux', icon: <Clock size={20} />, path: '/admin/creneaux', roles: ['admin'] },
    { name: 'Tournois & Promobad', icon: <Trophy size={20} />, path: '/admin/tournois', roles: ['admin'] },
    { name: 'Entraîneurs & Bénévoles', icon: <Users size={20} />, path: '/admin/equipe', roles: ['admin'] },
    { name: 'Joueurs', icon: <Medal size={20} />, path: '/admin/joueurs', roles: ['admin'] },
    { name: 'Actualités', icon: <Newspaper size={20} />, path: '/admin/actualites', roles: ['admin'] },
  ];

  // Filtrage dynamique du menu selon le rôle de l'utilisateur (Admin ou Coach)
  const menuItems = allNavItems.filter(item => item.roles.includes(session?.user?.role));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] font-['Montserrat'] flex">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#081031] border-r border-slate-200 dark:border-white/10 fixed h-full z-20 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/logo-uscbadminton.png" 
                alt="Logo USC Badminton" 
                className="h-10 w-auto"
              />
            </Link>
            <div>
              <h1 className="font-[900] italic text-lg text-[#081031] dark:text-white uppercase leading-none">
                {session?.user?.role === 'coach' ? 'Coach' : 'Admin'}
              </h1>
              <span className="text-[10px] font-bold text-[#0EE2E2] uppercase tracking-widest">Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-[#0065FF] text-white shadow-md shadow-[#0065FF]/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#081031] dark:hover:text-white'
                }`}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <div className="lg:hidden fixed top-0 w-full bg-white dark:bg-[#081031] border-b border-slate-200 dark:border-white/10 z-30 flex justify-between items-center p-4">
        <Link href="/" className="font-[900] italic text-lg text-[#081031] dark:text-white uppercase">
          USC {session?.user?.role === 'coach' ? 'Coach' : 'Admin'}
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#081031] dark:text-white">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-[#081031] pt-20 px-4 overflow-y-auto">
          <nav className="space-y-2 pb-10">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-4 p-4 rounded-xl font-bold text-lg ${
                  pathname === item.path ? 'bg-[#0065FF] text-white' : 'text-[#081031] dark:text-white'
                }`}>
                  {item.icon} {item.name}
                </div>
              </Link>
            ))}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-4 p-4 w-full rounded-xl font-bold text-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 mt-4"
            >
              <LogOut size={20} /> Déconnexion
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen transition-all">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}