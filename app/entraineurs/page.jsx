'use client';
import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Award, Loader2 } from 'lucide-react';

export default function EntraineursPage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Appel à notre nouvelle API pour récupérer l'équipe
  useEffect(() => {
  document.title = "Nos entraîneurs | US Créteil Badminton"; 
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        if (data.success) {
          setMembers(data.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des entraîneurs :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // On sépare automatiquement les membres selon leur catégorie
  const perfCoaches = members.filter(m => m.category === 'performance');
  const devCoaches = members.filter(m => m.category === 'developpement');

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          HERO SECTION
          ========================================================= */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0065FF] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF]/20 border border-[#0065FF]/50 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            <Award size={14} /> Encadrement Professionnel
          </div>
          
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-tight text-white drop-shadow-2xl mb-3 py-2">
              L'ÉQUIPE <span className="text-[#0EE2E2]">TECHNIQUE</span>
            </h1>
          </div>
          
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Découvrez les professionnels diplômés qui accompagnent nos joueurs au quotidien, de l'école de jeunes jusqu'au plus haut niveau national.
          </p>
        </div>
      </section>

      {/* =========================================================
          AFFICHAGE DU CHARGEMENT
          ========================================================= */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-[#0065FF]">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-sm text-slate-500">Chargement de l'équipe...</p>
        </div>
      )}

      {/* =========================================================
          PÔLE PERFORMANCE (S'affiche s'il y a des entraîneurs)
          ========================================================= */}
      {!isLoading && perfCoaches.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
          <div className="flex items-center gap-4 mb-10 lg:mb-16 border-b-2 border-slate-100 dark:border-white/5 pb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-[#F72585]/10 text-[#F72585] flex items-center justify-center shrink-0">
              <Target size={32} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight pt-2 pb-1">
                Pôle <span className="text-[#F72585]">Performance</span>
              </h2>
              <p className="text-sm lg:text-base font-bold text-slate-500 dark:text-slate-400">Interclubs Nationaux & Régionaux, Collectif Compétiteur.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {perfCoaches.map((coach) => (
              <CoachCardHorizontal 
                key={coach._id}
                name={coach.name} 
                role={coach.role} 
                img={coach.image} 
                color={coach.color || "#F72585"} 
                tags={coach.tags || []} 
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          PÔLE DÉVELOPPEMENT (S'affiche s'il y a des entraîneurs)
          ========================================================= */}
      {!isLoading && devCoaches.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32 mb-20">
          <div className="flex items-center gap-4 mb-10 lg:mb-16 border-b-2 border-slate-100 dark:border-white/5 pb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-[#0065FF]/10 dark:bg-[#0EE2E2]/10 text-[#0065FF] dark:text-[#0EE2E2] flex items-center justify-center shrink-0">
              <TrendingUp size={32} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight pt-2 pb-1">
                Pôle <span className="text-[#0065FF] dark:text-[#0EE2E2]">Développement</span>
              </h2>
              <p className="text-sm lg:text-base font-bold text-slate-500 dark:text-slate-400">École de Jeunes, Adultes Loisirs & Perfectionnement.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {devCoaches.map((coach) => (
              <CoachCardHorizontal 
                key={coach._id}
                name={coach.name} 
                role={coach.role} 
                img={coach.image} 
                color={coach.color || "#0065FF"} 
                tags={coach.tags || []} 
                small={true}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// --- SOUS-COMPOSANT (Avec gestion dynamique des initiales et correction du truncate) ---

const CoachCardHorizontal = ({ name, role, img, color, tags, small = false }) => {
  const [imgError, setImgError] = useState(false);
  
  // Génération des initiales si pas de photo
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="group bg-slate-50 dark:bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-row items-center gap-4 p-4 h-full">
      
      {/* Photo Cercle */}
      <div 
        className={`relative rounded-full shrink-0 overflow-hidden bg-white dark:bg-[#081031] ${small ? 'w-20 h-20 lg:w-24 lg:h-24' : 'w-24 h-24 lg:w-32 lg:h-32'} border-[3px] shadow-sm flex items-center justify-center`}
        style={{ borderColor: color }}
      >
        {!imgError && img ? (
          <img 
            src={img} 
            alt="" 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"
          />
        ) : (
          <span 
            className="font-[900] text-2xl lg:text-3xl italic tracking-tighter opacity-50 select-none"
            style={{ color: color }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col min-w-0 flex-grow py-1">
        <span 
          className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest mt-0.5 mb-1 truncate flex items-center gap-1.5"
          style={{ color: color }}
        >
          {role}
        </span>

        {/* J'ai retiré le 'truncate' ici pour que les longs noms passent à la ligne ! */}
        <h3 className="text-base lg:text-lg font-[900] uppercase italic text-[#081031] dark:text-white leading-tight mb-3">
          {name}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};