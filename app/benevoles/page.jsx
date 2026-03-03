'use client';
import React, { useState, useEffect } from 'react';
import { Heart, Coffee, ClipboardCheck, Award, Loader2 } from 'lucide-react';

export default function BenevolesPage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Appel à notre API pour récupérer toute l'équipe
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        if (data.success) {
          setMembers(data.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des bénévoles :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // On filtre pour ne garder que les rôles liés au bénévolat
  const officiels = members.filter(m => m.category === 'officiel');
  const geos = members.filter(m => m.category === 'geo');
  const buvetteMembers = members.filter(m => m.category === 'buvette');

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          HERO SECTION
          ========================================================= */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#9333EA] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#9333EA]/20 border border-[#9333EA]/50 text-[#d8b4fe] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            <Heart size={14} /> L'Âme du Club
          </div>
          
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-tight text-white drop-shadow-2xl mb-3 py-2">
              NOS <span className="text-[#d8b4fe]">BÉNÉVOLES</span>
            </h1>
          </div>
          
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Arbitres, Juges-Arbitres, GEOs ou responsables buvette : découvrez ceux qui donnent de leur temps pour faire vivre l'US Créteil Badminton.
          </p>
        </div>
      </section>

      {/* =========================================================
          AFFICHAGE DU CHARGEMENT
          ========================================================= */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-[#9333EA]">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-sm text-slate-500">Chargement de l'équipe...</p>
        </div>
      )}

      {/* =========================================================
          OFFICIELS (Arbitres & JA)
          ========================================================= */}
      {!isLoading && officiels.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
          <div className="flex items-center gap-4 mb-10 lg:mb-16 border-b-2 border-slate-100 dark:border-white/5 pb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-[#0065FF]/10 text-[#0065FF] flex items-center justify-center shrink-0">
              <Award size={32} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight pt-2 pb-1">
                Les <span className="text-[#0065FF]">Officiels</span>
              </h2>
              <p className="text-sm lg:text-base font-bold text-slate-500 dark:text-slate-400">Arbitres et Juges-Arbitres qui garantissent le bon déroulement du jeu.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {officiels.map((member) => (
              <VolunteerCard key={member._id} member={member} defaultColor="#0065FF" />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          G.E.O (Gestionnaires)
          ========================================================= */}
      {!isLoading && geos.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
          <div className="flex items-center gap-4 mb-10 lg:mb-16 border-b-2 border-slate-100 dark:border-white/5 pb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-[#F72585]/10 text-[#F72585] flex items-center justify-center shrink-0">
              <ClipboardCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight pt-2 pb-1">
                Les <span className="text-[#F72585]">G.E.O</span>
              </h2>
              <p className="text-sm lg:text-base font-bold text-slate-500 dark:text-slate-400">Gestionnaires d'Organisation de nos tournois et rencontres.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {geos.map((member) => (
              <VolunteerCard key={member._id} member={member} defaultColor="#F72585" small={true} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          BUVETTE & ACCUEIL
          ========================================================= */}
      {!isLoading && buvetteMembers.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24 mb-20">
          <div className="flex items-center gap-4 mb-10 lg:mb-16 border-b-2 border-slate-100 dark:border-white/5 pb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-[#FFD500]/10 text-[#FFB703] flex items-center justify-center shrink-0">
              <Coffee size={32} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight pt-2 pb-1">
                Accueil & <span className="text-[#FFB703]">Buvette</span>
              </h2>
              <p className="text-sm lg:text-base font-bold text-slate-500 dark:text-slate-400">Les rois et reines de la convivialité lors de nos événements.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {buvetteMembers.map((member) => (
              <VolunteerCard key={member._id} member={member} defaultColor="#FFB703" small={true} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// --- SOUS-COMPOSANT (Spécifique aux bénévoles) ---

const VolunteerCard = ({ member, defaultColor, small = false }) => {
  const [imgError, setImgError] = useState(false);
  
  const color = member.color || defaultColor;
  const initials = member.name
    ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="group bg-slate-50 dark:bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-row items-center gap-4 p-4 h-full">
      
      {/* Photo Cercle */}
      <div 
        className={`relative rounded-full shrink-0 overflow-hidden bg-white dark:bg-[#081031] ${small ? 'w-16 h-16 lg:w-20 lg:h-20' : 'w-20 h-20 lg:w-24 lg:h-24'} border-[3px] shadow-sm flex items-center justify-center`}
        style={{ borderColor: color }}
      >
        {!imgError && member.image ? (
          <img 
            src={member.image} 
            alt="" 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"
          />
        ) : (
          <span 
            className="font-[900] text-xl lg:text-2xl italic tracking-tighter opacity-50 select-none"
            style={{ color: color }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col min-w-0 flex-grow py-1">
        <span 
          className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest mt-0.5 mb-1 truncate"
          style={{ color: color }}
        >
          {member.role}
        </span>

        <h3 className="text-base lg:text-lg font-[900] uppercase italic text-[#081031] dark:text-white leading-tight mb-2">
          {member.name}
        </h3>
        
        {member.tags && member.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {member.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};