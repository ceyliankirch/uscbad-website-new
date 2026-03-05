'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Facebook, Instagram, ChevronRight, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#081031] pt-20 pb-10 border-t border-white/10 font-['Montserrat']">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* GRILLES DE LIENS ET INFOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* COLONNE 1 : LOGO & PRÉSENTATION (Prend plus de place) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <img 
                src="/logo-uscbadminton.png" 
                alt="Logo US Créteil Badminton" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-sm">
              L'US Créteil Badminton est un club dynamique labellisé par la FFBaD, dédié à la pratique du badminton en loisir comme en compétition, pour tous les âges.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.facebook.com/USCRETEIL.Bad" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0065FF] hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/uscbad/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F72585] hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* COLONNE 2 : LE CLUB & VIE DU CLUB */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-[900] uppercase italic text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0EE2E2]"></span> Le Club
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Présentation', path: '/presentation' },
                { name: 'Actualités', path: '/actualites' },
                { name: 'Tarifs & Inscriptions', path: '/inscriptions' },
                { name: 'Le Bureau', path: '/bureau' },
                { name: 'Nos Entraîneurs', path: '/entraineurs' },
                { name: 'Les Bénévoles', path: '/benevoles' },
                { name: 'Communication', path: '/communication' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-sm font-bold text-slate-300 hover:text-[#0EE2E2] transition-colors flex items-center gap-2 group">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#0EE2E2]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 : JOUER & ÉVÉNEMENTS */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-[900] uppercase italic text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F72585]"></span> Badminton
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Nos Créneaux', path: '/creneaux' },
                { name: 'Interclubs', path: '/interclubs' },
                { name: 'Les Jeunes', path: '/jeunes' },
                { name: 'Pôle Féminines', path: '/pole-feminines' },
                { name: 'Indivs', path: '/indivs' },
                { name: 'Calendrier', path: '/evenements' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-sm font-bold text-slate-300 hover:text-[#F72585] transition-colors flex items-center gap-2 group">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#F72585]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 4 : CONTACT & ACTION */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="text-lg font-[900] uppercase italic text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0065FF]"></span> Contact
            </h4>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#0EE2E2] shrink-0">
                <Mail size={16} />
              </div>
              <a href="mailto:contact@uscbad.fr" className="text-sm font-bold text-slate-300 hover:text-[#0EE2E2] transition-colors break-all">
                contact@uscbad.fr
              </a>
            </div>

            <Link href="/inscriptions" className="mt-4 bg-[#0EE2E2] text-[#081031] py-4 px-6 rounded-2xl font-[900] uppercase text-xs tracking-widest hover:scale-105 hover:bg-white transition-all flex items-center justify-between group shadow-lg">
              Rejoindre le club
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* LIGNE DU BAS (COPYRIGHT & MENTIONS LÉGALES) */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400">
            © {currentYear} US Créteil Badminton. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}