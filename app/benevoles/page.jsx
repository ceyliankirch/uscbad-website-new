'use client';
import React, { useState } from 'react';
import { Heart, Coffee, Flag, ClipboardList, Shield, GraduationCap, ArrowRight, Sparkles, Activity } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION : LES BÉNÉVOLES
// ==========================================
const officiels = [
  {
    id: 1,
    name: "Laurent D.",
    role: "Juge-Arbitre (JA)",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", 
    color: "#F72585",
    icon: <Shield size={16} />,
    tags: ["Tournois Nationaux", "Interclubs"]
  },
  {
    id: 2,
    name: "Camille M.",
    role: "Arbitre",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", 
    color: "#0065FF",
    icon: <Flag size={16} />,
    tags: ["Arbitre Régional", "Juge de ligne"]
  },
  {
    id: 3,
    name: "Antoine L.",
    role: "Arbitre",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", 
    color: "#0065FF",
    icon: <Flag size={16} />,
    tags: ["En formation", "Interclubs N1"]
  }
];

const geos = [
  {
    id: 4,
    name: "Sarah L.",
    role: "GEO Principale",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", 
    color: "#0EE2E2",
    icon: <ClipboardList size={16} />,
    tags: ["Tournois Jeunes", "Séniors"]
  },
  {
    id: 5,
    name: "Hugo T.",
    role: "Table de marque",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", 
    color: "#0EE2E2",
    icon: <ClipboardList size={16} />,
    tags: ["Logiciel BadPlus", "Micro"]
  }
];

const buvette = [
  {
    id: 6,
    name: "Nathalie & Marc",
    role: "Responsables Buvette",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop", 
    color: "#FFD500",
    icon: <Coffee size={16} />,
    tags: ["Les rois du Croque", "Crêpes 5 étoiles"]
  },
  {
    id: 7,
    name: "Emma P.",
    role: "Bénévole Événements",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop", 
    color: "#FFD500",
    icon: <Heart size={16} />,
    tags: ["Accueil", "Soirées Club"]
  }
];

export default function BenevolesPage() {
  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20 overflow-hidden">
      
      {/* =========================================================
          SECTION 1 : HERO SOMBRE
          ========================================================= */}
      <section className="relative w-full h-[50svh] lg:h-[60svh] min-h-[450px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#FFD500] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F72585] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFD500]/20 border border-[#FFD500]/50 text-[#FFD500] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            <Heart size={14} /> L'Âme du Club
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            NOS <span className="text-[#FFD500]">BÉNÉVOLES</span>
          </h1>
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Sans eux, pas de tournois, pas d'interclubs, pas de buvette. Découvrez et rejoignez la team de passionnés qui fait vivre l'US Créteil au quotidien.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : LES OFFICIELS TECHNIQUES (Arbitres & JA)
          ========================================================= */}
      <section className="relative z-30 py-12 lg:py-16 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#0a0f25] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl -mt-12 lg:-mt-20 mb-10">
        
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F72585] text-white flex items-center justify-center shadow-lg shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none">
              Les <span className="text-[#F72585]">Officiels Techniques</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs lg:text-sm mt-1">Juges-Arbitres (JA) et Arbitres</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {officiels.map((person) => (
            <VolunteerCard key={person.id} {...person} />
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 3 : LES ORGANISATEURS (GEO) & BUVETTE
          ========================================================= */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#0a0f25] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm mb-16">
        
        {/* SOUS-SECTION : GEO */}
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0EE2E2] text-[#081031] flex items-center justify-center shadow-lg shrink-0">
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none">
              Les <span className="text-[#0065FF] dark:text-[#0EE2E2]">Organisateurs</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs lg:text-sm mt-1">Gestionnaires d'Organisation (GEO) & Table de marque</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {geos.map((person) => (
            <VolunteerCard key={person.id} {...person} />
          ))}
        </div>

        {/* SOUS-SECTION : BUVETTE */}
        <div className="mb-12 flex items-center gap-4 pt-10 border-t border-slate-200 dark:border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD500] text-[#081031] flex items-center justify-center shadow-lg shrink-0">
            <Coffee size={24} />
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none">
              La Team <span className="text-[#FFD500]">Buvette</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs lg:text-sm mt-1">Le cœur convivial de nos événements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {buvette.map((person) => (
            <VolunteerCard key={person.id} {...person} />
          ))}
        </div>

      </section>

      {/* =========================================================
          SECTION 4 : FORMATIONS ET RECRUTEMENT (LE CALL TO ACTION)
          ========================================================= */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto mt-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF]/10 text-[#0065FF] dark:bg-[#0EE2E2]/10 dark:text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6">
            <GraduationCap size={16} /> Le club vous accompagne
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white leading-none mb-4">
            FRANCHISSEZ LE <span className="text-[#0065FF]">PAS !</span>
          </h2>
          <p className="text-sm lg:text-base font-bold text-slate-500 max-w-2xl mx-auto">
            Vous souhaitez vous investir mais vous ne savez pas comment faire ? Le club finance vos formations officielles (LIFB / FFBAD) et vous accompagne pas à pas.
          </p>
        </div>

        {/* Grille des Formations (4 colonnes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          
          {/* Formation Arbitre */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
              <Flag size={100} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#0065FF]/10 text-[#0065FF] flex items-center justify-center mb-6 shrink-0">
              <Flag size={28} />
            </div>
            <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-3">Devenir Arbitre</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed flex-grow">
              Vivez les matchs de l'intérieur ! Apprenez à gérer une rencontre, annoncer les scores et veiller au respect des règles.
            </p>
            <div className="mt-auto">
              <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#0065FF]" /> Formation financée par le club</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#0065FF]" /> Matériel fourni (tenue, cartons)</li>
              </ul>
              <div className="flex gap-2">
                <a href="https://www.ffbad.org/badminton-se-former-formations-des-officiels" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#0065FF]/30 text-[#0065FF] hover:bg-[#0065FF]/10 transition-colors">
                  + D'infos
                </a>
                <a href="https://lifb.org/formations/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#0065FF] text-white hover:opacity-90 transition-opacity shadow-md">
                  Inscriptions
                </a>
              </div>
            </div>
          </div>

          {/* Formation GEO */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
              <ClipboardList size={100} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#0EE2E2]/10 text-[#0EE2E2] flex items-center justify-center mb-6 shrink-0">
              <ClipboardList size={28} />
            </div>
            <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-3">Se former GEO</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed flex-grow">
              Devenez le chef d'orchestre ! Maîtrisez le logiciel BadPlus, lancez les matchs au micro et assurez le bon déroulement d'un tournoi.
            </p>
            <div className="mt-auto">
              <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#0EE2E2]" /> Formation très courte (1 weekend)</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#0EE2E2]" /> Indispensable pour nos interclubs</li>
              </ul>
              <div className="flex gap-2">
                <a href="https://www.ffbad.org/badminton-se-former-formations-des-dirigeants" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#0EE2E2]/40 text-[#0065FF] dark:text-[#0EE2E2] hover:bg-[#0EE2E2]/10 transition-colors">
                  + D'infos
                </a>
                <a href="https://lifb.org/formations/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#0EE2E2] text-[#081031] hover:opacity-90 transition-opacity shadow-md">
                  Inscriptions
                </a>
              </div>
            </div>
          </div>

          {/* Formation JA */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
              <Shield size={100} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#F72585]/10 text-[#F72585] flex items-center justify-center mb-6 shrink-0">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-3">Juge-Arbitre</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed flex-grow">
              Le garant de la compétition. Formez-vous aux règlements pointus pour superviser des tournois et gérer les litiges avec diplomatie.
            </p>
            <div className="mt-auto">
              <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#F72585]" /> Rôle à responsabilités</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#F72585]" /> Indemnisation FFBAD possible</li>
              </ul>
              <div className="flex gap-2">
                <a href="https://www.ffbad.org/badminton-se-former-formations-des-officiels" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#F72585]/30 text-[#F72585] hover:bg-[#F72585]/10 transition-colors">
                  + D'infos
                </a>
                <a href="https://lifb.org/formations/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#F72585] text-white hover:opacity-90 transition-opacity shadow-md">
                  Inscriptions
                </a>
              </div>
            </div>
          </div>

          {/* Formation Entraîneur */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
              <Activity size={100} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-6 shrink-0">
              <Activity size={28} />
            </div>
            <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-3">Devenir Entraîneur</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed flex-grow">
              Transmettez votre passion ! Le club vous accompagne pour passer vos diplômes d'animateur fédéral (MODEF, AB1...).
            </p>
            <div className="mt-auto">
              <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#8B5CF6]" /> Pour encadrer les jeunes/loisirs</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#8B5CF6]" /> Évolutif vers le haut niveau</li>
              </ul>
              <div className="flex gap-2">
                <a href="https://www.ffbad.org/badminton-se-former-formations-de-l-encadrement" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors">
                  + D'infos
                </a>
                <a href="https://lifb.org/formations/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#8B5CF6] text-white hover:opacity-90 transition-opacity shadow-md">
                  Inscriptions
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Call To Action Global */}
        <div className="bg-[#081031] rounded-[2rem] p-8 lg:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FFD500] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-4xl font-[900] uppercase italic text-white mb-4">
              Pas besoin de diplôme pour <span className="text-[#FFD500]">aider !</span>
            </h3>
            <p className="text-slate-300 font-medium max-w-2xl mx-auto mb-8 text-sm lg:text-base">
              Faire des croque-monsieurs à la buvette, installer les poteaux le matin d'un tournoi, ou simplement donner un coup de main ponctuel : toute aide est précieuse. Rejoignez le groupe WhatsApp des bénévoles !
            </p>
            <button className="bg-[#FFD500] text-[#081031] px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl hover:scale-105 hover:bg-white transition-all inline-flex items-center justify-center gap-3">
              Je propose mon aide <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </section>

    </div>
  );
}

/* =========================================================
   SOUS-COMPOSANTS : CARTE BÉNÉVOLE (AVEC FALLBACK IMAGE)
   ========================================================= */

const VolunteerCard = ({ name, role, img, color, icon, tags }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="group bg-white dark:bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-row items-center gap-4 p-4 h-full block">
      
      {/* Photo Cercle Gauche */}
      <div 
        className="relative rounded-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 w-20 h-20 lg:w-24 lg:h-24 border-[3px] shadow-lg flex items-center justify-center"
        style={{ borderColor: color }}
      >
        {!imgError && img ? (
          <img 
            src={img} 
            alt={name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"
          />
        ) : (
          <span 
            className="font-[900] text-2xl lg:text-3xl italic tracking-tighter opacity-50"
            style={{ color: color }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Informations Container Droite */}
      <div className="flex flex-col min-w-0 flex-grow py-1">
        {/* Role */}
        <span 
          className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest mt-0.5 mb-1 truncate flex items-center gap-1.5"
          style={{ color: color === '#081031' ? '#0065FF' : color }}
        >
          {icon && icon} {role}
        </span>

        {/* Nom */}
        <h3 className="text-base lg:text-lg font-[900] uppercase italic text-[#081031] dark:text-white leading-tight mb-2 truncate group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors">
          {name}
        </h3>
        
        {/* Tags d'encadrement */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-sm text-[8px] font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
    </div>
  );
};