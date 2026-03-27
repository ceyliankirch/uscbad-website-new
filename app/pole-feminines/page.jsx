'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, User, Star, Trophy, ArrowRight, Heart, CalendarDays, Shield, ChevronRight, Zap, Loader2 } from 'lucide-react';

export default function PoleFemininesPage() {
  const [coach, setCoach] = useState(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState(true);

  useEffect(() => {
    document.title = "Pôle féminin | US Créteil Badminton";
  }, []);

  // RÉCUPÉRATION DU COACH RÉFÉRENT DEPUIS LA BDD
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await fetch('/api/team');
        const json = await res.json();
        
        if (json.success && json.data) {
          // Cherche un entraîneur avec le rôle 'Féminin' ou dont le nom contient 'Romain'
          const foundCoach = json.data.find(m => 
            (m.trainerRoles && m.trainerRoles.includes('Féminin')) || 
            m.name.toLowerCase().includes('romain')
          );
          if (foundCoach) setCoach(foundCoach);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du coach :", err);
      } finally {
        setIsLoadingCoach(false);
      }
    };
    fetchCoach();
  }, []);

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          SECTION 1 : HERO SOMBRE & FÉMININ (Avec Box Coach)
          ========================================================= */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 flex flex-col justify-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#F72585]/20 to-transparent z-0"></div>
        
        {/* Cercles de lumière */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#F72585] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#0EE2E2] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>
        
        <div className="relative z-20 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* TEXTE (GAUCHE) */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F72585]/10 border border-[#F72585]/30 text-[#F72585] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 backdrop-blur-md">
              <Star size={14} /> Un projet club fort
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
              PÔLE <span className="text-[#F72585] block sm:inline">FÉMININ</span>
            </h1>
            <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-xl">
              L'US Créteil Badminton s'engage pour le développement de la pratique féminine. Un accompagnement dédié pour encourager, rassembler et faire briller nos joueuses.
            </p>
          </div>

          {/* BOX COACH (DROITE) */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative">
            {/* Lueur arrière de la carte */}
            <div className="absolute inset-0 bg-[#F72585]/20 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-full transform hover:scale-[1.02] transition-transform duration-500">
              
              {/* Badge flottant "COACH" */}
              <div className="absolute -top-5 -right-5 lg:-top-6 lg:-right-6 bg-[#F72585] text-white w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(247,37,133,0.5)] rotate-12 z-20">
                Coach
              </div>
              
              {isLoadingCoach ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-[#F72585]" size={32}/>
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Recherche...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[3px] border-[#F72585] mb-5 shadow-inner">
                    {coach?.image ? (
                      <img src={coach.image} alt={coach?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-[900] italic uppercase text-white mb-1">
                    {coach?.name || "Romain Credou"}
                  </h3>
                  <p className="text-[#F72585] font-black uppercase text-[10px] tracking-widest mb-5">
                    Entraîneur Référent
                  </p>
                  <div className="border-t border-white/10 pt-5 w-full">
                    <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                      "Mon objectif : vous donner les clés techniques et tactiques pour vous épanouir sur le terrain et performer en compétition."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 2 : LES VALEURS DU PÔLE (Cartes)
          ========================================================= */}
      <section className="relative z-30 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-16 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-[#F72585]/10 text-[#F72585] rounded-2xl flex items-center justify-center mb-6">
              <Heart size={28} />
            </div>
            <h3 className="text-xl font-black italic uppercase mb-3 text-[#081031] dark:text-white">Convivialité</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Un espace de partage et de cohésion. Nous créons un environnement bienveillant où chaque joueuse, débutante ou confirmée, trouve sa place.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-[#0065FF]/10 text-[#0065FF] rounded-2xl flex items-center justify-center mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-black italic uppercase mb-3 text-[#081031] dark:text-white">Progression</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Des créneaux spécifiques encadrés par nos entraîneurs pour travailler la technique, la tactique de double dames et le mixte.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-[#0EE2E2]/10 text-[#0EE2E2] rounded-2xl flex items-center justify-center mb-6">
              <Trophy size={28} />
            </div>
            <h3 className="text-xl font-black italic uppercase mb-3 text-[#081031] dark:text-white">Compétition</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Des équipes Interclubs féminines dynamiques et un accompagnement soutenu pour celles qui souhaitent se lancer en tournoi individuel.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 3 : DÉTAILS DU PROGRAMME (Image + Texte)
          ========================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* IMAGE / VISUEL */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#F72585] rounded-[3rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="relative bg-slate-200 dark:bg-white/5 rounded-[3rem] overflow-hidden aspect-[4/5] border-4 border-white dark:border-[#0f172a] shadow-2xl">
              {/* Remplacer cette div par une vraie balise <img src="..." /> avec une belle photo d'équipe féminine */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-[#081031]/5 dark:bg-[#081031]/50">
                [Image d'une équipe féminine de badminton]
              </div>
            </div>
            
            {/* Badge flottant */}
            <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white dark:bg-[#0f172a] p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-white/10 animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F72585]/10 text-[#F72585] flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">Label FFBaD</p>
                  <p className="text-lg font-[900] italic text-[#081031] dark:text-white leading-none">Club Avenir</p>
                </div>
              </div>
            </div>
          </div>

          {/* TEXTE & CONTENU */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 leading-tight">
                Plus qu'un sport, <br/>une <span className="text-[#F72585]">équipe</span>.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-base">
                Nous savons que franchir le pas de la compétition ou simplement trouver sa place dans un club peut parfois être intimidant. C'est pourquoi l'US Créteil a structuré un parcours spécifique pour ses adhérentes.
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F72585] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#F72585]/30 mt-1">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-base text-[#081031] dark:text-white mb-1">Créneaux 100% Féminins</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Des sessions d'entraînement réservées, encadrées par nos coachs, pour travailler des schémas de jeu spécifiques (double dames, déplacements).</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0065FF] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#0065FF]/30 mt-1">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-base text-[#081031] dark:text-white mb-1">Réseau & Marrainage</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Les nouvelles joueuses sont accompagnées par des compétitrices expérimentées pour faciliter leur intégration dans la vie du club.</p>
                </div>
              </li>
            </ul>

            <div className="pt-6">
              <Link href="/creneaux" className="inline-flex items-center gap-3 bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-8 py-4 rounded-xl font-[900] uppercase text-xs tracking-widest hover:scale-105 hover:bg-[#F72585] dark:hover:bg-[#F72585] dark:hover:text-white transition-all shadow-lg group">
                Voir les créneaux dédiés
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 4 : TÉMOIGNAGE / CITATION
          ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto bg-[#F72585] rounded-[3rem] p-10 lg:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-white/30 font-[900] italic text-8xl leading-none h-12 -mt-8 mb-4">"</div>
            <p className="text-xl lg:text-3xl font-[900] italic text-white mb-8 leading-tight">
              Le pôle féminin m'a permis de prendre confiance en moi sur le terrain. L'ambiance y est exceptionnelle, on s'encourage et on progresse toutes ensemble, de la joueuse loisir à la compétitrice N.
            </p>
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 bg-white/20 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white">
                 <User size={24} />
              </div>
              <div>
                <p className="font-black uppercase text-white tracking-widest text-sm">Capitaine Équipe 2</p>
                <p className="text-white/80 font-medium text-xs">Joueuse depuis 5 ans au club</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 : CALL TO ACTION (Rejoindre)
          ========================================================= */}
      <section className="py-20 lg:py-32 text-center px-6">
        <h2 className="text-3xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6">
          Prête à rejoindre <br/>la <span className="text-[#F72585]">team féminine</span> ?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 max-w-lg mx-auto">
          Que ce soit pour transpirer, vous amuser ou tout gagner en tournoi, il y a une place pour vous à Créteil.
        </p>
        <Link href="/inscriptions" className="inline-flex items-center gap-3 bg-[#F72585] text-white px-10 py-5 rounded-2xl font-[900] uppercase text-sm tracking-widest hover:scale-105 hover:shadow-xl transition-all group">
          S'inscrire pour la saison <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

    </div>
  );
}