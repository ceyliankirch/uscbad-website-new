'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Menu, X, Sun, Moon, User, ArrowRight, LogOut, Shield, Target, Scissors, Dumbbell, Coffee, MapPin, FileText, Briefcase } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from './AuthModal'; // Importation de la modale

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openMobileNestedDropdown, setOpenMobileNestedDropdown] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // État pour contrôler l'affichage de la modale d'authentification
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // RÉCUPÉRATION DE LA SESSION UTILISATEUR
  const { data: session, status } = useSession();

  // ÉTATS POUR STOCKER LES DONNÉES DYNAMIQUES DE LA BASE DE DONNÉES
  const [dynamicTournaments, setDynamicTournaments] = useState([]);
  const [dynamicPromobads, setDynamicPromobads] = useState([]);

  // Définir les pages qui ont un "Hero sombre" en haut de page
  const hasDarkHero = pathname === '/' || pathname === '/interclubs' || pathname.startsWith('/actualites') || pathname === '/presentation' || pathname === '/communication' || pathname === '/entraineurs' || pathname === '/benevoles' || pathname === '/evenements' || pathname.startsWith('/tournois/') || pathname.startsWith('/promobad/') || pathname === '/indivs' || pathname === '/pole-feminines' || pathname === '/mes-indivs' || pathname === '/inscriptions' || pathname === '/profil'; 
  
  // APPEL API POUR RÉCUPÉRER LES TOURNOIS ET PROMOBADS DYNAMIQUEMENT
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/tournaments');
        const json = await res.json();
        
        if (json.success) {
          // On sépare les officiels des internes
          const officiels = json.data.filter(t => t.type === 'tournoi');
          const internes = json.data.filter(t => t.type === 'promobad');
          
          // On les formate pour le menu (Nom + Lien vers la route dynamique)
          setDynamicTournaments(officiels.map(t => ({ name: t.title, href: `/tournois/${t._id}` })));
          setDynamicPromobads(internes.map(t => ({ name: t.title, href: `/promobad/${t._id}` })));
        }
      } catch (error) {
        console.error("Erreur de récupération des événements pour la Navbar", error);
      }
    };
    fetchEvents();
  }, []);

  // STRUCTURE DES LIENS
  const navLinks = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Le Club', 
      href: '#',
      dropdown: [
        { name: 'Présentation', href: '/presentation' },
        { name: 'Actualités', href: '/actualites' },
        { name: 'Tarifs & Inscriptions', href: '/inscriptions' },
      ]
    },

    { 
      name: 'Jouer', 
      href: '#',
      dropdown: [
        { name: 'Nos Créneaux', href: '/creneaux' },
        { name: 'Interclubs', href: '/interclubs' },
        { name: 'Les Jeunes', href: '/jeunes' },
        { name: 'Pôle Féminines', href: '/pole-feminines' },
        { name: 'Indivs', href: '/indivs' },
      ]
    },

    { 
      name: 'à venir', 
      href: '#',
      dropdown: [
        { 
          name: 'Tournois', 
          href: '#',
          subDropdown: dynamicTournaments.length > 0 ? dynamicTournaments : [{ name: 'Chargement...', href: '#' }]
        },
        { 
          name: 'Promobad', 
          href: '#',
          subDropdown: dynamicPromobads.length > 0 ? dynamicPromobads : [{ name: 'Chargement...', href: '#' }]
        },
        { name: 'Calendrier', href: '/evenements' },
      ]
    },
    { 
      name: 'Vie du Club', 
      href: '#', 
      dropdown: [
        { name: 'Le bureau', href: '/bureau' },
        { name: 'Communication', href: '/communication' },
        { name: 'Nos Entraîneurs', href: '/entraineurs' },
        { name: 'Les Bénévoles', href: '/benevoles' },
      ]
    },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // GESTION DU SCROLL DYNAMIQUE
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = hasDarkHero ? window.innerHeight - 100 : 20;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasDarkHero]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  const shouldBeSolid = isScrolled || !hasDarkHero || isMobileMenuOpen;
  const textColor = shouldBeSolid ? 'text-[#081031] dark:text-white' : 'text-white';
  const groupHoverColor = shouldBeSolid ? 'group-hover:text-[#0065FF]' : 'group-hover:text-[#0EE2E2]';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 py-4 font-['Montserrat'] ${
      shouldBeSolid ? 'bg-white dark:bg-[#081031] shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto flex justify-between items-center relative w-full">
        
        <Link href="/" className="z-10">
          <img 
            src="/logo-uscbadminton.png" 
            alt="Logo USC" 
            className="h-12 w-auto cursor-pointer"
          />
        </Link>

        {/* LIENS DESKTOP (Affichés seulement si >= 1440px) */}
        <div className="hidden min-[1440px]:flex absolute left-1/2 -translate-x-1/2 space-x-10 items-center">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group py-2">
              <div className={`flex items-center gap-1 text-sm font-[900] uppercase cursor-pointer transition-colors ${textColor} ${groupHoverColor}`}>
                {link.dropdown ? (
                  <>
                    {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </>
                ) : (
                  <Link href={link.href}>{link.name}</Link>
                )}
              </div>

              {link.dropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white dark:bg-[#081031] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 py-2">
                  {link.dropdown.map((sub) => (
                    <div key={sub.name} className="relative group/sub">
                      
                      {/* S'il y a un sous-sous-menu */}
                      {sub.subDropdown ? (
                        <>
                          <div className="flex items-center justify-between pl-6 pr-4 py-3 text-[11px] font-bold font-['Montserrat'] uppercase text-black dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] hover:pl-8 transition-all duration-300 cursor-pointer">
                            <span>{sub.name}</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover/sub:text-[#0065FF] dark:group-hover/sub:text-[#0EE2E2]" />
                          </div>
                          
                          {/* LE SOUS-SOUS-MENU */}
                          <div className="absolute top-0 left-[95%] ml-2 w-56 bg-white dark:bg-[#081031] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 transform -translate-x-2 group-hover/sub:translate-x-0 py-2">
                            {sub.subDropdown.length > 0 && sub.subDropdown[0].name !== 'Chargement...' ? (
                              sub.subDropdown.map((nested) => (
                                <Link 
                                  key={nested.name} 
                                  href={nested.href} 
                                  className="block pl-5 pr-5 py-3 text-[10px] font-bold font-['Montserrat'] uppercase text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] hover:pl-7 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
                                  title={nested.name}
                                >
                                  {nested.name}
                                </Link>
                              ))
                            ) : (
                              <span className="block px-5 py-3 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 italic">
                                {sub.subDropdown[0]?.name || "Aucun événement"}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Lien classique du dropdown */
                        <Link 
                          href={sub.href} 
                          className="block pl-6 pr-6 py-3 text-[11px] font-bold font-['Montserrat'] uppercase text-black dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] hover:pl-8 transition-all duration-300"
                        >
                          {sub.name}
                        </Link>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS DESKTOP (Affichées seulement si >= 1440px) */}
        <div className="hidden min-[1440px]:flex items-center gap-3 z-10">

          {/* GESTION DE L'AUTHENTIFICATION DESKTOP */}
          {status === 'loading' ? (
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          ) : session ? (
            <div className="relative group/auth">
              <button className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center font-bold text-sm shadow-md ${
                shouldBeSolid ? 'bg-[#0065FF] text-white' : 'bg-white text-[#0065FF]'
              }`}>
                {session.user?.name?.charAt(0).toUpperCase() || <User size={18} />}
              </button>
              
              {/* Menu profil */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#081031] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible transition-all duration-300 transform translate-y-2 group-hover/auth:translate-y-0 py-2 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-1">
                  <p className="text-xs font-bold text-[#081031] dark:text-white truncate">{session.user?.name || 'Utilisateur'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{session.user?.email}</p>
                </div>
                
                {/* AFFICHAGE CONDITIONNEL DES DASHBOARDS SELON LES RÔLES */}
                {(() => {
                  const userRoles = session.user?.roles || (session.user?.role ? [session.user.role] : ['user']);
                  const hasAdminRoles = userRoles.some(r => r !== 'user');
                  
                  return (
                    <div className="max-h-[60vh] overflow-y-auto hide-scrollbar">
                      {userRoles.includes('admin') && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-500 transition-colors uppercase">
                          <Shield size={14} /> Espace Admin
                        </Link>
                      )}
                      {userRoles.includes('bureau') && (
                        <Link href="/admin/dashboard-bureau" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors uppercase">
                          <Briefcase size={14} /> Espace Bureau
                        </Link>
                      )}
                      {userRoles.includes('coach') && (
                        <Link href="/admin/entrainements" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#00E676] dark:hover:text-[#00E676] transition-colors uppercase">
                          <Dumbbell size={14} /> Entraînements
                        </Link>
                      )}
                      {userRoles.includes('indiv') && (
                        <Link href="/admin/indivs" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#F72585] dark:hover:text-[#F72585] transition-colors uppercase">
                          <Target size={14} /> Gestion Indivs
                        </Link>
                      )}
                      {userRoles.includes('cordeur') && (
                        <Link href="/admin/cordage" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors uppercase">
                          <Scissors size={14} /> Atelier Recordage
                        </Link>
                      )}
                      {userRoles.includes('buvette') && (
                        <Link href="/admin/buvette" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#FFD500] dark:hover:text-[#FFD500] transition-colors uppercase">
                          <Coffee size={14} /> Gestion Buvette
                        </Link>
                      )}
                      {/* Toujours visible pour les connectés */}
                      <Link href="/profil" className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors uppercase ${hasAdminRoles ? 'border-t border-slate-100 dark:border-white/5 mt-1 pt-3' : ''}`}>
                        <User size={14} /> Espace Joueur
                      </Link>
                    </div>
                  );
                })()}

                <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 text-left px-4 py-3 mt-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-500 uppercase border-t border-slate-100 dark:border-white/5 transition-colors">
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
                shouldBeSolid ? 'bg-slate-100 text-[#081031] dark:bg-white/10 dark:text-white hover:bg-[#0065FF] hover:text-white dark:hover:bg-[#0065FF]' : 'bg-white/20 text-white hover:bg-white hover:text-[#081031]'
              }`}
            >
              <User size={18} />
            </button>
          )}

          {mounted && (
            <button 
              onClick={toggleTheme} 
              className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
                shouldBeSolid ? 'bg-slate-100 text-[#081031] dark:bg-white/10 dark:text-yellow-400' : 'bg-white/20 text-white hover:bg-white hover:text-yellow-500'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* Bouton Menu Mobile (Apparaît si < 1440px) */}
        <button 
          className={`min-[1440px]:hidden z-10 ${shouldBeSolid ? 'text-[#081031] dark:text-white' : 'text-white'}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={35} /> : <Menu size={35} />}
        </button>
      </div>

      {/* MENU MOBILE (Apparaît si < 1440px) */}
      <div 
        className={`min-[1440px]:hidden absolute top-full left-0 w-full bg-white dark:bg-[#081031] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-b-3xl overflow-hidden transition-all duration-500 ease-in-out origin-top ${
          isMobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-6 py-2 overflow-y-auto max-h-[85vh] hide-scrollbar">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col">
              {link.dropdown ? (
                <button 
                  onClick={() => {
                    setOpenMobileDropdown(openMobileDropdown === link.name ? null : link.name);
                    setOpenMobileNestedDropdown(null); 
                  }}
                  className="flex items-center justify-between py-3 text-lg font-[900] uppercase text-[#081031] dark:text-white group border-b border-slate-100 dark:border-white/5"
                >
                  <span className="group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors font-['Montserrat']">
                    {link.name}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-300 text-slate-400 ${
                      openMobileDropdown === link.name ? 'rotate-180 text-[#0065FF] dark:text-[#0EE2E2]' : ''
                    }`} 
                  />
                </button>
              ) : (
                <Link 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-lg font-[900] uppercase text-[#081031] dark:text-white hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors font-['Montserrat'] border-b border-slate-100 dark:border-white/5"
                >
                  {link.name}
                </Link>
              )}

              {/* DROPDOWN MOBILE NIVEAU 1 */}
              {link.dropdown && (
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openMobileDropdown === link.name ? 'max-h-[800px] opacity-100 mb-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex flex-col pl-4 border-l-2 border-[#0065FF] dark:border-[#0EE2E2] space-y-2 pt-2 pb-2 mt-2">
                    {link.dropdown.map(sub => (
                      <div key={sub.name} className="flex flex-col">
                        
                        {/* SOUS-DROPDOWN MOBILE NIVEAU 2 */}
                        {sub.subDropdown ? (
                          <>
                            <button 
                              onClick={() => setOpenMobileNestedDropdown(openMobileNestedDropdown === sub.name ? null : sub.name)}
                              className="flex items-center justify-between py-2 text-sm font-bold font-['Montserrat'] text-black dark:text-white uppercase transition-colors"
                            >
                              <span>{sub.name}</span>
                              <ChevronDown size={16} className={`transition-transform text-slate-400 ${openMobileNestedDropdown === sub.name ? 'rotate-180 text-[#0065FF] dark:text-[#0EE2E2]' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMobileNestedDropdown === sub.name ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="flex flex-col pl-4 border-l border-slate-200 dark:border-white/10 space-y-3 py-2">
                                {sub.subDropdown.length > 0 && sub.subDropdown[0].name !== 'Chargement...' ? (
                                  sub.subDropdown.map((nested) => (
                                    <Link 
                                      key={nested.name} 
                                      href={nested.href} 
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setOpenMobileDropdown(null);
                                        setOpenMobileNestedDropdown(null);
                                      }} 
                                      className="text-[11px] font-bold text-slate-500 dark:text-white hover:text-[#0065FF] dark:hover:text-[#0EE2E2] uppercase transition-colors"
                                    >
                                      {nested.name}
                                    </Link>
                                  ))
                                ) : (
                                  <span className="text-[11px] font-bold text-slate-400 uppercase italic">
                                    {sub.subDropdown[0]?.name || "Aucun événement"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Lien classique du dropdown */
                          <Link 
                            href={sub.href} 
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }} 
                            className="py-2 text-sm font-bold font-['Montserrat'] text-black dark:text-white hover:text-[#0065FF] dark:hover:text-[#0EE2E2] uppercase transition-colors"
                          >
                            {sub.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ACTIONS FINALES MOBILE */}
          <div className="flex flex-col gap-4 pt-6 pb-6 mt-4 border-t border-slate-100 dark:border-white/10">

            {/* GESTION AUTHENTIFICATION MOBILE (DYNAMIQUE SELON RÔLES) */}
            {status === 'loading' ? null : session ? (
              <div className="flex flex-col gap-4 w-full mt-2 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-xs font-black uppercase italic text-[#0065FF] dark:text-[#0EE2E2] text-center mb-1">
                  {session.user?.name}
                </p>
                
                {/* LIGNE 1 : DASHBOARDS */}
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const userRoles = session.user?.roles || (session.user?.role ? [session.user.role] : ['user']);
                    const hasAdminRoles = userRoles.some(r => r !== 'user');
                    return (
                      <>
                        {userRoles.includes('admin') && (
                          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white dark:bg-[#0f172a] text-red-500 rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm"><Shield size={16} /> Admin</Link>
                        )}
                        {userRoles.includes('bureau') && (
                          <Link href="/admin/dashboard-bureau" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white dark:bg-[#0f172a] text-[#0065FF] dark:text-[#0EE2E2] rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm"><Briefcase size={16} /> Bureau</Link>
                        )}
                        {userRoles.includes('coach') && (
                          <Link href="/admin/entrainements" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white dark:bg-[#0f172a] text-[#00E676] rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm"><Dumbbell size={16} /> Coach</Link>
                        )}
                        {userRoles.includes('indiv') && (
                          <Link href="/admin/indivs" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white dark:bg-[#0f172a] text-[#F72585] rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm"><Target size={16} /> Indivs</Link>
                        )}
                        {userRoles.includes('cordeur') && (
                          <Link href="/admin/cordage" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white dark:bg-[#0f172a] text-[#10B981] rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm"><Scissors size={16} /> Recordage</Link>
                        )}
                        {userRoles.includes('buvette') && (
                          <Link href="/admin/buvette" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white dark:bg-[#0f172a] text-[#FFD500] rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm"><Coffee size={16} /> Buvette</Link>
                        )}
                        
                        {/* Toujours visible pour les connectés */}
                        <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className={`p-3 bg-white dark:bg-[#0f172a] text-[#0065FF] dark:text-[#0EE2E2] rounded-xl flex flex-col items-center gap-1 font-bold text-[10px] uppercase text-center shadow-sm ${!hasAdminRoles ? 'col-span-2' : ''}`}><User size={16} /> Espace Joueur</Link>
                      </>
                    );
                  })()}
                </div>

                {/* LIGNE 2 : THEME ET DECONNEXION */}
                <div className="flex gap-2 mt-2 border-t border-slate-200 dark:border-white/10 pt-4">
                  {mounted && (
                    <button 
                      onClick={toggleTheme} 
                      className="flex-1 py-3 bg-white dark:bg-[#0f172a] text-[#081031] dark:text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      {isDark ? <><Sun size={16} /> Clair</> : <><Moon size={16} /> Sombre</>}
                    </button>
                  )}
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }} 
                    className="flex-1 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <LogOut size={16} /> Sortir
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 w-full mt-2">
                {mounted && (
                  <button 
                    onClick={toggleTheme} 
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-[#081031] dark:text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                )}
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                  className="flex-[2] py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 text-[#081031] dark:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <User size={16} /> Connexion Staff
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* MODALE D'AUTHENTIFICATION */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </nav>
  );
};

export default Navbar;