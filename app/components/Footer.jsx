import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#081031] pt-20 pb-10 px-8 text-white font-['Montserrat'] border-t-[8px] border-[#0065FF]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Colonne 1 : À propos */}
          <div className="space-y-6">
            <div className="text-3xl font-[900] tracking-tighter italic text-white">
              USC<span className="text-[#0065FF]">BAD</span>
            </div>
            <p className="text-slate-400 font-bold text-sm leading-relaxed">
              Le premier club de badminton du Val-de-Marne. Compétition de haut niveau, école de jeunes labellisée et pratique loisir pour tous.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0EE2E2] hover:text-[#081031] transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0065FF] transition-all">
                <Facebook size={18} fill="currentColor" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens Rapides */}
          <div>
            <h4 className="text-[#0EE2E2] font-[900] uppercase tracking-widest text-xs mb-6">Le Club</h4>
            <ul className="space-y-4">
              <FooterLink text="L'Histoire du Club" />
              <FooterLink text="Notre Staff Technique" />
              <FooterLink text="Saison 2026 : Nationale 1" />
              <FooterLink text="Boutique & Maillots" />
            </ul>
          </div>

          {/* Colonne 3 : Pratique */}
          <div>
            <h4 className="text-[#0EE2E2] font-[900] uppercase tracking-widest text-xs mb-6">Pratiquer</h4>
            <ul className="space-y-4">
              <FooterLink text="Horaires & Gymnases" />
              <FooterLink text="Tarifs et Inscriptions" />
              <FooterLink text="Créneaux Loisirs" />
              <FooterLink text="Bad au Féminin" />
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="text-[#0EE2E2] font-[900] uppercase tracking-widest text-xs mb-6">Contact</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-slate-400 font-bold text-sm">
                <MapPin size={18} className="text-[#0065FF] shrink-0 mt-0.5" />
                <span>Palais des Sports<br/>Rue Pasteur Vallery Radot<br/>94000 Créteil</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                <Phone size={18} className="text-[#0065FF] shrink-0" />
                <span>01 43 77 XX XX</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                <Mail size={18} className="text-[#0065FF] shrink-0" />
                <span>contact@uscbad.fr</span>
              </li>
            </ul>
          </div>

        </div>

        {/* LIGNE DE SÉPARATION ET COPYRIGHT */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            © 2026 US Créteil Badminton. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Sous-composant pour les liens du footer
const FooterLink = ({ text }) => (
  <li>
    <a href="#" className="group flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-white transition-colors">
      <ChevronRight size={14} className="text-[#0065FF] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      {text}
    </a>
  </li>
);

export default Footer;