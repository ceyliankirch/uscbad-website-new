'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Menu, X, Sun, Moon, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = ({ onOpenAuth }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Conditions de style globales
  const isHomePage = pathname === '/';
  const shouldBeDark = isScrolled || !isHomePage;

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Le Club', 
      href: '#',
      dropdown: [
        { name: 'Planning', href: '/planning' },
        { name: 'Le Bureau', href: '/bureau' },
        { name: 'Actualités', href: '/actualites' }
      ]
    },
    { name: 'Compétition', href: '#competition' },
    { name: 'Jeunes', href: '#jeunes' },
    { name: 'Inscriptions', href: '#inscriptions' },
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
  const hoverColor = shouldBeDark ? 'hover:text-[#0065FF]' : 'hover:text-[#0EE2E2]';
  const groupHoverColor = shouldBeDark ? 'group-hover:text-[#0065FF]' : 'group-hover:text-[#0EE2E2]';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 py-4 font-['Montserrat'] ${
      shouldBeDark ? 'bg-white/95 dark:bg-[#081031]/95 backdrop-blur-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/">
          <img 
            src="/logo-uscbadminton.png" 
            alt="Logo USC" 
            className="h-12 w-auto cursor-pointer"
          />
        </Link>

        {/* LIENS DESKTOP */}
        <div className="hidden lg:flex space-x-10 items-center">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group py-2">
              <div className={`flex items-center gap-1 text-sm font-[900] uppercase cursor-pointer transition-colors ${textColor} ${groupHoverColor}`}>
                {link.dropdown ? (
                  <>
                    {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </>
                ) : (
                  <a href={link.href}>{link.name}</a>
                )}
              </div>

              {link.dropdown && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-[#081031] rounded-2xl shadow-2xl border-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
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

        {/* BOUTONS D'ACTION */}
        <div className="hidden lg:flex items-center gap-3">
          <button className={`px-7 py-2.5 rounded-full font-[900] text-xs transition-all flex items-center gap-2 uppercase tracking-normal group ${
            shouldBeDark
              ? 'bg-[#081031] text-white hover:bg-[#0065FF] dark:bg-white dark:text-[#081031] dark:hover:bg-[#0065FF]'
              : 'bg-white text-[#081031] hover:bg-[#0EE2E2]'
          }`}>
            Adhérer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
          className={`lg:hidden ${shouldBeDark ? 'text-[#081031] dark:text-white' : 'text-white'}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#081031] flex flex-col p-8 space-y-4 shadow-2xl overflow-y-auto max-h-[80vh]">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col gap-2">
              <div className="text-lg font-[900] uppercase text-[#081031] dark:text-white border-b border-slate-50 dark:border-white/5 pb-2">
                {link.name}
              </div>
              {link.dropdown && link.dropdown.map(sub => (
                <Link 
                  key={sub.name} 
                  href={sub.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="pl-4 text-sm font-[900] text-[#0065FF] dark:text-[#0EE2E2] uppercase"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          ))}
          <button className="w-full bg-[#0065FF] text-white py-4 rounded-2xl font-[900] uppercase shadow-lg mt-4">
            Adhérer en ligne
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;