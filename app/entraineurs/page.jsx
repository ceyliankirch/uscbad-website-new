'use client';
import React, { useState } from 'react';
import { Target, Users, Shield, Award, Star, ArrowRight, Zap, Heart } from 'lucide-react';

// ==========================================
// DONNÉES DES ENTRAÎNEURS
// ==========================================
const performanceCoaches = [
  {
    id: 1,
    name: "Bertrand Gallet",
    role: "Entraîneur Élite",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", 
    color: "#F72585",
    icon: <Award size={16} />,
    tags: ["Équipes 1 à 3", "Haut Niveau"]
  },
  {
    id: 2,
    name: "Malo Mameron",
    role: "Entraîneur Compétiteur",
    img: "chemin_invalide_pour_tester.jpg", // Laisse ça pour voir le beau "MM" en plan B !
    color: "#0065FF",
    icon: <Zap size={16} />,
    tags: ["Équipes 4 & 5", "Loisirs"]
  },
  {
    id: 3,
    name: "Romain Credou",
    role: "Entraîneur Compétiteur",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", 
    color: "#0EE2E2",
    icon: <Target size={16} />,
    tags: ["Équipes 6 à 9", "Jeunes", "Section Féminine"]
  }
];

const developmentCoaches = [
  {
    id: 4,
    name: "Yohann Osvald",
    role: "Service Civique & Entraîneur",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", 
    color: "#0065FF",
    tags: ["Loisirs"]
  },
  {
    id: 5,
    name: "Florian Diez",
    role: "Entraîneur",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop", 
    color: "#0EE2E2",
    tags: ["Jeunes"]
  },
  {
    id: 6,
    name: "Paul Lheureux",
    role: "Entraîneur",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", 
    color: "#0EE2E2",
    tags: ["Jeunes"]
  },
  {
    id: 7,
    name: "Suruthika Nowad S.",
    role: "Entraîneure",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", 
    color: "#0EE2E2",
    tags: ["Jeunes"]
  }
];

export default function EntraineursPage() {
  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20 overflow-hidden">
      
      {/* =========================================================
          SECTION 1 : HERO SOMBRE
          ========================================================= */}
      <section className="relative w-full h-[50svh] lg:h-[60svh] min-h-[450px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0065FF] rounded-full blur-[150px] opacity-30 pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#0EE2E2] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF]/20 border border-[#0065FF]/50 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            <Shield size={14} /> Le Staff Technique
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            NOTRE ÉQUIPE <br />
            <span className="text-[#0EE2E2]">D'ENCADREMENT</span>
          </h1>
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            De l'école de badminton au sport de haut niveau, l'US Créteil s'appuie sur des entraîneurs passionnés et qualifiés pour vous faire progresser à votre rythme.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : PÔLE PERFORMANCE & COMPÉTITION
          ========================================================= */}
      <section className="relative z-30 py-12 lg:py-16 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#0a0f25] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl -mt-12 lg:-mt-20 mb-10">
        
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F72585] text-white flex items-center justify-center shadow-lg shrink-0">
            <Star size={24} />
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none">
              Pôle <span className="text-[#F72585]">Performance</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs lg:text-sm mt-1">Interclubs, Haut Niveau & Compétitions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {performanceCoaches.map((coach) => (
            <CoachCardHorizontal key={coach.id} {...coach} />
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 3 : PÔLE DÉVELOPPEMENT, JEUNES & LOISIRS
          ========================================================= */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#0a0f25] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm mb-16">
        
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0065FF] text-white flex items-center justify-center shadow-lg shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none">
              Pôle <span className="text-[#0065FF] dark:text-[#0EE2E2]">Développement</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs lg:text-sm mt-1">École de Jeunes & Pratique Loisir</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {developmentCoaches.map((coach) => (
            <CoachCardHorizontal key={coach.id} {...coach} small />
          ))}
        </div>

      </section>

      {/* =========================================================
          SECTION 4 : BANNIÈRE DE RECRUTEMENT
          ========================================================= */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mt-10">
        <div className="bg-gradient-to-br from-[#0065FF] to-[#081031] rounded-[2rem] lg:rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center text-white">
          
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
          
          <div className="w-full md:w-2/3 p-8 lg:p-16 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full font-[900] uppercase text-[10px] tracking-widest mb-6 border border-white/20">
              <Heart size={14} className="text-[#0EE2E2]" /> L'esprit Club
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] uppercase italic tracking-tighter leading-[0.9] mb-4">
              Envie de progresser <br/> avec <span className="text-[#0EE2E2]">les meilleurs ?</span>
            </h2>
            <p className="text-sm lg:text-base font-medium leading-relaxed opacity-90 mb-8 max-w-lg">
              Nos créneaux d'entraînements dirigés sont conçus pour vous faire franchir un cap, quel que soit votre niveau initial. Venez tester une séance !
            </p>
            <button className="bg-[#0EE2E2] text-[#081031] px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl hover:scale-105 hover:bg-white transition-all flex items-center justify-center gap-3">
              Voir les créneaux d'entraînement <ArrowRight size={16} />
            </button>
          </div>

          <div className="hidden md:flex w-1/3 justify-center relative z-10 p-8">
            <Target size={180} className="text-white/10 -rotate-12" />
          </div>

        </div>
      </section>

    </div>
  );
}

/* =========================================================
   SOUS-COMPOSANTS : CARTE ENTRAÎNEUR (AVEC FALLBACK IMAGE)
   ========================================================= */

const CoachCardHorizontal = ({ name, role, img, color, icon, tags, small = false }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="group bg-white dark:bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-row items-center gap-4 p-4 h-full block">
      
      {/* Photo Cercle Gauche */}
      <div 
        className={`relative rounded-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 ${small ? 'w-20 h-20 lg:w-24 lg:h-24' : 'w-24 h-24 lg:w-32 lg:h-32'} border-[3px] shadow-lg flex items-center justify-center`}
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