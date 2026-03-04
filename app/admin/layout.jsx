// app/admin/layout.jsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  CalendarDays, 
  Clock, // On ajoute l'icône pour le planning
  Newspaper, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mise à jour du menu avec l'onglet Planning
  // Mise à jour du menu avec l'onglet Planning, Tournois et Staff
  const menuItems = [
    { name: 'Vue d\'ensemble', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Live Score', icon: <Trophy size={20} />, path: '/admin/score' },
    { name: 'Événements', icon: <CalendarDays size={20} />, path: '/admin/events' },
    { name: 'Créneaux', icon: <Clock size={20} />, path: '/admin/creneaux' },
    { name: 'Tournois & Promobad', icon: <Trophy size={20} />, path: '/admin/tournois' }, // NOUVEAU
    { name: 'Entraîneurs & Bénévoles', icon: <Users size={20} />, path: '/admin/equipe' }, // NOUVEAU
    { name: 'Actualités', icon: <Newspaper size={20} />, path: '/admin/actualites' },
    { name: 'Bureau & CRs', icon: <Users size={20} />, path: '/admin/board' }, // Note: Tu as deux fois Users, tu pourrais changer l'icône du Bureau en <Briefcase /> si tu veux !
    { name: 'Paramètres Club', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

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
              <h1 className="font-[900] italic text-lg text-[#081031] dark:text-white uppercase leading-none">Admin</h1>
              <span className="text-[10px] font-bold text-[#0EE2E2] uppercase tracking-widest">Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
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
          USC Admin
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#081031] dark:text-white">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-[#081031] pt-20 px-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-4 p-4 rounded-xl font-bold text-lg text-[#081031] dark:text-white hover:bg-slate-100 dark:hover:bg-white/5">
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