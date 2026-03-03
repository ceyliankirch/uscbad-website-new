'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Menu, X, Sun, Moon, User, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = ({ onOpenAuth }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openMobileNestedDropdown, setOpenMobileNestedDropdown] = useState(null); // NOUVEAU: Pour le sous-sous-menu mobile
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Définir les pages qui ont un "Hero sombre" en haut de page
  const hasDarkHero = pathname === '/' || pathname === '/interclubs' || pathname.startsWith('/actualites') || pathname === '/presentation' || pathname === '/communication' || pathname === '/entraineurs' || pathname === '/benevoles' || pathname === '/evenements';  
  
  // STRUCTURE DES LIENS (Prête pour le Dashboard Admin)
  const navLinks = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Le Club', 
      href: '#',
      dropdown: [
        { name: 'Présentation', href: '/presentation' },
        { name: 'Actualités', href: '/actualites' },
        { name: 'Les Jeunes', href: '/jeunes' },
        { name: 'nos créneaux', href: '/creneaux' },
        { name: 'Interclubs', href: '/interclubs' },
      ]
    },
    { 
      name: 'à venir', 
      href: '#',
      dropdown: [
        { 
          name: 'Tournois', 
          href: '#', // Désactivé car c'est un parent
          // Ces données pourront être remplacées par un fetch API depuis le dashboard
          subDropdown: [
            { name: 'La Petite Plume - Oct.', href: '/tournois/petite-plume' },
            { name: 'La Grande Plume - Fév.', href: '/tournois/grande-plume' },
            { name: 'TLJ de Créteil - Mai', href: '/tournois/tlj-creteil' },
          ] 
        },
        { 
          name: 'Promobad', 
          href: '#', // Désactivé car c'est un parent
          // Ces données pourront être remplacées par un fetch API depuis le dashboard
          subDropdown: [
            { name: 'Octobre Rose - Octobre', href: '/promobad/octobre-rose' },
            { name: 'Saint-Valentin - Février', href: '/promobad/saint-valentin' }
          ] 
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
  ]

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

  if (pathname.startsWith('/admin')) return null;

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

        {/* LIENS DESKTOP */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 space-x-10 items-center">
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
                // ATTENTION: Retrait de overflow-hidden pour permettre au sous-menu d'apparaître sur le côté
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 py-2">
                  {link.dropdown.map((sub) => (
                    <div key={sub.name} className="relative group/sub">
                      
                      {/* S'il y a un sous-sous-menu (Ex: Tournois / Promobad) */}
                      {sub.subDropdown ? (
                        <>
                          <div className="flex items-center justify-between px-6 py-3 text-[11px] font-bold font-['Montserrat'] uppercase text-black hover:bg-slate-50 hover:text-[#0065FF] transition-colors cursor-pointer">
                            <span>{sub.name}</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover/sub:text-[#0065FF]" />
                          </div>
                          
                          {/* LE SOUS-SOUS-MENU (Flyout droit) */}
                          <div className="absolute top-0 left-[95%] ml-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 transform -translate-x-2 group-hover/sub:translate-x-0 py-2">
                            {sub.subDropdown.length > 0 ? (
                              sub.subDropdown.map((nested) => (
                                <Link 
                                  key={nested.name} 
                                  href={nested.href} 
                                  className="block px-5 py-3 text-[10px] font-bold font-['Montserrat'] uppercase text-slate-600 hover:bg-slate-50 hover:text-[#0065FF] transition-colors"
                                >
                                  {nested.name}
                                </Link>
                              ))
                            ) : (
                              <span className="block px-5 py-3 text-[10px] font-bold uppercase text-slate-400 italic">Aucun événement</span>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Lien classique du dropdown */
                        <Link 
                          href={sub.href} 
                          className="block px-6 py-3 text-[11px] font-bold font-['Montserrat'] uppercase text-black hover:bg-slate-50 hover:text-[#0065FF] transition-colors"
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

        {/* ACTIONS DESKTOP */}
        <div className="hidden lg:flex items-center gap-3 z-10">
          <button className={`px-7 py-2.5 rounded-full font-[900] text-xs transition-all flex items-center gap-2 uppercase tracking-normal group ${
            shouldBeSolid
              ? 'bg-[#081031] text-white hover:bg-[#0065FF] dark:bg-white dark:text-[#081031] dark:hover:bg-[#0065FF]'
              : 'bg-white text-[#081031] hover:bg-[#0EE2E2]'
          }`}>
            m'inscrire <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={onOpenAuth}
            className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
              shouldBeSolid ? 'bg-slate-100 text-[#081031] dark:bg-white/10 dark:text-white' : 'bg-white/20 text-white hover:bg-white hover:text-[#081031]'
            }`}
          >
            <User size={18} />
          </button>

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

        <button 
          className={`lg:hidden z-10 ${shouldBeSolid ? 'text-[#081031] dark:text-white' : 'text-white'}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={35} /> : <Menu size={35} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#081031] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-b-3xl overflow-hidden transition-all duration-500 ease-in-out origin-top ${
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
                    setOpenMobileNestedDropdown(null); // On ferme les sous-menus si on change de menu principal
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
                        
                        {/* SOUS-DROPDOWN MOBILE NIVEAU 2 (Ex: Tournois, Promobad) */}
                        {sub.subDropdown ? (
                          <>
                            <button 
                              onClick={() => setOpenMobileNestedDropdown(openMobileNestedDropdown === sub.name ? null : sub.name)}
                              className="flex items-center justify-between py-2 text-sm font-bold font-['Montserrat'] text-black dark:text-white uppercase transition-colors"
                            >
                              <span>{sub.name}</span>
                              <ChevronDown size={16} className={`transition-transform text-slate-400 ${openMobileNestedDropdown === sub.name ? 'rotate-180 text-[#0065FF]' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMobileNestedDropdown === sub.name ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="flex flex-col pl-4 border-l border-slate-200 dark:border-white/10 space-y-3 py-2">
                                {sub.subDropdown.map((nested) => (
                                  <Link 
                                    key={nested.name} 
                                    href={nested.href} 
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setOpenMobileDropdown(null);
                                      setOpenMobileNestedDropdown(null);
                                    }} 
                                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] uppercase transition-colors"
                                  >
                                    {nested.name}
                                  </Link>
                                ))}
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
            <button className="w-full bg-[#0065FF] text-white py-4 rounded-2xl font-[900] uppercase shadow-lg shadow-[#0065FF]/30 hover:scale-[1.02] hover:shadow-xl transition-all flex items-center justify-center gap-2 font-['Montserrat']">
              m'inscrire <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-8 mt-1">
              {mounted && (
                <button 
                  onClick={toggleTheme} 
                  className="p-3 text-[#081031] dark:text-slate-300 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors"
                >
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              )}

              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="p-3 text-[#081031] dark:text-slate-300 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors"
              >
                <User size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;