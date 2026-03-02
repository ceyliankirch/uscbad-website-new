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
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Conditions de style globales
  const isHomePage = pathname === '/';
  const shouldBeDark = isScrolled || !isHomePage || isMobileMenuOpen;

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Le Club', 
      href: '#',
      dropdown: [
        { name: 'Présentation', href: '/presentation' },
        { name: 'nos créneaux', href: '/creneaux' },
        { name: 'Le Bureau', href: '/bureau' },
        { name: 'Actualités', href: '/actualites' },
        { name: 'Interclubs', href: '/interclubs' },
      ]
    },
    { name: 'à venir', href: '#competition' },
    { name: 'Jeunes', href: '#jeunes' },
  ];

  // Initialisation du thème
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  // Ne pas afficher la Navbar dans l'administration
  if (pathname.startsWith('/admin')) return null;

  // Helpers pour les classes répétitives
  const textColor = shouldBeDark ? 'text-[#081031] dark:text-white' : 'text-white';
  const groupHoverColor = shouldBeDark ? 'group-hover:text-[#0065FF]' : 'group-hover:text-[#0EE2E2]';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 py-4 font-['Montserrat'] ${
      shouldBeDark ? 'bg-white/95 dark:bg-[#081031]/95 backdrop-blur-xl' : 'bg-transparent'
    }`}>
      {/* AJOUT: relative et w-full pour que le menu absolu se centre par rapport à ce conteneur */}
      <div className="max-w-[1600px] mx-auto flex justify-between items-center relative w-full">
        
        {/* LOGO (Reste aligné à gauche grâce au justify-between) */}
        <Link href="/" className="z-10">
          <img 
            src="/logo-uscbadminton.png" 
            alt="Logo USC" 
            className="h-12 w-auto cursor-pointer"
          />
        </Link>

        {/* LIENS DESKTOP (PARFAITEMENT CENTRÉS) */}
        {/* L'astuce : absolute left-1/2 -translate-x-1/2 sort le bloc du flux flexbox pour le centrer géométriquement */}
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-50 bg-white dark:bg-[#081031] rounded-2xl shadow-2xl border-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                  {link.dropdown.map((sub) => (
                    <Link 
                      key={sub.name} 
                      href={sub.href} 
                      className={`block px-6 py-4 text-[11px] font-[900] uppercase transition-colors ${
                        shouldBeDark 
                          ? 'text-[#081031] dark:text-white hover:bg-slate-50 hover:text-[#0065FF]' 
                          : 'text-[#081031] dark:text-white hover:bg-[#0EE2E2] hover:text-[#081031]'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BOUTONS D'ACTION (Restent alignés à droite grâce au justify-between) */}
        <div className="hidden lg:flex items-center gap-3 z-10">
          <button className={`px-7 py-2.5 rounded-full font-[900] text-xs transition-all flex items-center gap-2 uppercase tracking-normal group ${
            shouldBeDark
              ? 'bg-[#081031] text-white hover:bg-[#0065FF] dark:bg-white dark:text-[#081031] dark:hover:bg-[#0065FF]'
              : 'bg-white text-[#081031] hover:bg-[#0EE2E2]'
          }`}>
            s'inscrire <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={onOpenAuth}
            className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
              shouldBeDark ? 'bg-slate-100 text-[#081031] dark:bg-white/10 dark:text-white' : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            <User size={18} />
          </button>

          {mounted && (
            <button 
              onClick={toggleTheme} 
              className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
                shouldBeDark ? 'bg-slate-100 text-[#081031] dark:bg-white/10 dark:text-yellow-400' : 'bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className={`lg:hidden z-10 ${shouldBeDark ? 'text-[#081031] dark:text-white' : 'text-white'}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={35} /> : <Menu size={35} />}
        </button>
      </div>

      {/* MENU MOBILE (Unifié, Sans bordures, Fluide) */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#081031]/95 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-b-3xl overflow-hidden transition-all duration-500 ease-in-out origin-top ${
          isMobileMenuOpen 
            ? 'max-h-[85vh] opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-6 py-2 overflow-y-auto max-h-[85vh] hide-scrollbar">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col">
              
              {/* Lien Principal ou Bouton Accordéon */}
              {link.dropdown ? (
                <button 
                  onClick={() => setOpenMobileDropdown(openMobileDropdown === link.name ? null : link.name)}
                  className="flex items-center justify-between py-3 text-lg font-[900] uppercase text-[#081031] dark:text-white group"
                >
                  <span className="group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors">
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
                  className="py-3 text-lg font-[900] uppercase text-[#081031] dark:text-white hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors"
                >
                  {link.name}
                </Link>
              )}

              {/* Sous-menu (Accordéon animé) */}
              {link.dropdown && (
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openMobileDropdown === link.name ? 'max-h-[400px] opacity-100 mb-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  {/* On garde juste une petite ligne verticale de couleur pour montrer que c'est un sous-menu */}
                  <div className="flex flex-col pl-4 border-l-2 border-[#0065FF] dark:border-[#0EE2E2] space-y-3 pt-1 pb-2">
                    {link.dropdown.map(sub => (
                      <Link 
                        key={sub.name} 
                        href={sub.href} 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setOpenMobileDropdown(null); // On referme l'accordéon pour la prochaine fois
                        }} 
                        className="text-sm font-[900] text-slate-500 hover:text-[#0065FF] dark:text-slate-400 dark:hover:text-[#0EE2E2] uppercase transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          ))}
          
          {/* Bouton d'action final (Design enrichi) */}
          <div className="pt-4 pb-6">
            <button className="w-full bg-[#0065FF] text-white py-4 rounded-2xl font-[900] uppercase shadow-lg shadow-[#0065FF]/30 hover:scale-[1.02] hover:shadow-xl transition-all flex items-center justify-center gap-2">
              Adhérer en ligne <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;