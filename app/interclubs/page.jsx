'use client';
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Calendar, MapPin, ExternalLink, Activity, X } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION
// ==========================================
const team1Players = [
  { 
    id: 1, name: "Romain Credou", role: "Simple Homme / Double", rank: "RORO", img: "/assets/romain-credou.png",
    gender: 'male',
    stats: { played: 14, wins: 11, style: "Offensif" },
    description: "Joueur explosif avec un smash surpuissant. Spécialiste du simple, il apporte sa puissance en double."
  },
  { 
    id: 2, name: "Manon Espen", role: "Simple Dame / Mixte", rank: "N2", img: "/assets/manon-espen.png",
    gender: 'female',
    stats: { played: 16, wins: 13, style: "Contre-attaque" },
    description: "Véritable muraille sur le court. Sa couverture de terrain est exceptionnelle et use ses adversaires."
  },
  { 
    id: 3, name: "Vincent Espen", role: "Double Homme / Mixte", rank: "N1", img: "/assets/vincent-espen.png",
    gender: 'male',
    stats: { played: 12, wins: 9, style: "Créateur / Filet" },
    description: "Meneur de jeu redoutable. Sa vision sur la zone avant est un atout majeur pour dicter l'échange."
  },
  { 
    id: 4, name: "S. Golubickaite", role: "Double Dame", rank: "N1", img: "/assets/samantha-golubickaite.png",
    gender: 'female',
    stats: { played: 10, wins: 8, style: "Polyvalente" },
    description: "Excellente puncheuse en fond de court, elle s'adapte à tous les rythmes tactiques imposés."
  },
  { 
    id: 5, name: "Yohann Osvald", role: "Simple Homme", rank: "N2", img: "/assets/yohann-osvald.png",
    gender: 'male',
    stats: { played: 8, wins: 6, style: "Endurance" },
    description: "Capable de tenir des rallyes interminables pour faire plier physiquement ses adversaires."
  },
  { 
    id: 6, name: "Ulyana Volskaya", role: "Simple Dame", rank: "N1", img: "/assets/ulyana-volskaya.png",
    gender: 'female',
    stats: { played: 15, wins: 14, style: "Technique" },
    description: "Précision diabolique. Ses amortis croisés et son toucher de volant surprennent souvent."
  },
  { 
    id: 7, name: "Nolhan Rihouey", role: "Double / Mixte", rank: "N2", img: "/assets/nolhan-rihouey.png",
    gender: 'male',
    stats: { played: 11, wins: 7, style: "Agressif" },
    description: "Spécialiste de la pression constante. Il ne laisse aucun répit et joue toujours vers l'avant."
  },
];

const rankingN1 = [
  { rank: 1, name: "BC Chambly Oise", pts: 41, played: 8 },
  { rank: 2, name: "US Créteil", pts: 38, played: 8, isUs: true },
  { rank: 3, name: "Racing Club de France", pts: 35, played: 8 },
  { rank: 4, name: "MDMSA Badminton", pts: 29, played: 8 },
  { rank: 5, name: "VGA Stella Saint-Maur", pts: 22, played: 8 },
  { rank: 6, name: "Flume Ille", pts: 15, played: 8 },
];

const nextMatchesN1 = [
  { date: "24 MARS 2026", time: "16:00", home: "US CRÉTEIL", away: "FLUME ILLE", location: "Gymnase Casalis, Créteil", isHome: true },
  { date: "14 AVRIL 2026", time: "15:00", home: "VGA STELLA", away: "US CRÉTEIL", location: "Stade Chéron, St-Maur", isHome: false },
  { date: "05 MAI 2026", time: "16:00", home: "US CRÉTEIL", away: "RACING CLUB", location: "Gymnase Casalis, Créteil", isHome: true },
];

export default function InterclubsPage() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState(null); 
  
  // States pour la gestion du Swipe Mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const hoverTimeoutRef = useRef(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? team1Players.length - 1 : prev - 1));
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === team1Players.length - 1 ? 0 : prev + 1));
    setTilt({ x: 0, y: 0 });
  };

  // --- GESTION DU SWIPE TACTILE ---
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // --- GESTION DES EFFETS SOURIS (DÉSKTOP) ---
  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (activeIndex !== index) {
        setActiveIndex(index);
        setTilt({ x: 0, y: 0 });
      }
    }, 150);
  };

  const handleMouseLeaveCard = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseMove = (e, index) => {
    if (activeIndex !== index) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    setTilt({ x: rotateX, y: rotateY });
  };

  // --- STYLES DE POSITIONNEMENT DES CARTES (3D) ---
  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    let relativeDiff = diff;
    const total = team1Players.length;
    
    if (diff > total / 2) relativeDiff -= total;
    if (diff < -total / 2) relativeDiff += total;

    let translateX = 0; let scale = 1; let zIndex = 50;
    let opacity = 1; let blur = 'blur(0px)'; let rotateY = '0deg';

    if (relativeDiff === 0) {
      translateX = 0; scale = 1.1; zIndex = 50; opacity = 1; blur = 'blur(0px)'; rotateY = '0deg';
    } else if (relativeDiff === -1) {
      translateX = -120; scale = 0.85; zIndex = 40; opacity = 0.4; blur = 'blur(2px)'; rotateY = '20deg';
    } else if (relativeDiff === 1) {
      translateX = 120; scale = 0.85; zIndex = 40; opacity = 0.4; blur = 'blur(2px)'; rotateY = '-20deg';
    } else if (relativeDiff === -2) {
      translateX = -200; scale = 0.7; zIndex = 30; opacity = 0.15; blur = 'blur(4px)'; rotateY = '25deg';
    } else if (relativeDiff === 2) {
      translateX = 200; scale = 0.7; zIndex = 30; opacity = 0.15; blur = 'blur(4px)'; rotateY = '-25deg';
    } else {
      opacity = 0; scale = 0.5; zIndex = 10; rotateY = '0deg';
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY})`,
      zIndex,
      opacity,
      filter: blur,
    };
  };

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300">
      
      {/* =========================================================
          SECTION 1 : HERO (CARROUSEL 3D OU PROFIL PLEIN ÉCRAN)
          ========================================================= */}
      <section className="relative w-full overflow-hidden bg-[#081031] min-h-[90svh] lg:min-h-[850px] pt-24 pb-16 lg:py-32 flex items-center">
        {/* Décors de fond globaux */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-center h-full">
          
          {selectedPlayer ? (
            /* =========================================================
               VUE PROFIL PLEIN ÉCRAN
               ========================================================= */
            <div className="w-full flex flex-col lg:flex-row items-center justify-between animate-in fade-in zoom-in duration-500 relative pt-12 lg:pt-0">
              
              {/* Bouton Fermer */}
              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="absolute top-0 right-0 lg:-top-12 lg:right-4 z-50 text-white/50 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer bg-white/5 lg:bg-transparent px-4 py-2 rounded-full lg:p-0"
              >
                <X size={20} /> Fermer
              </button>

              {/* DROITE : IMAGE DÉTOURÉE CARRÉE */}
              {/* AGRANDISSEMENT : max-h-[500px] sur mobile et max-h-[700px] sur desktop */}
              <div className="w-full lg:w-[50%] aspect-square max-h-[500px] lg:max-h-[700px] relative z-10 flex items-center justify-center order-1 lg:order-2 shrink-0">
                {/* Lueur d'arrière plan hyper floue */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] lg:blur-[120px] opacity-40 pointer-events-none ${selectedPlayer.gender === 'male' ? 'bg-[#0EE2E2]' : 'bg-[#ff0072]'}`}></div>
                
                {/* Grand Rank en filigrane */}
                <div className="absolute right-0 top-1/4 text-[120px] sm:text-[200px] lg:text-[250px] font-[900] italic text-white/5 pointer-events-none tracking-tighter">
                  {selectedPlayer.rank}
                </div>

                <img 
                  src={selectedPlayer.img} 
                  alt={selectedPlayer.name} 
                  className="relative z-20 w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* GAUCHE : TEXTES ET STATS */}
              <div className="w-full lg:w-[50%] flex flex-col justify-center pt-8 lg:pt-0 z-20 order-2 lg:order-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 lg:mb-6">
                  <span className="bg-[#0065FF] text-white px-4 py-1.5 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-sm">
                    {selectedPlayer.role}
                  </span>
                  <span className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-4 py-1.5 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-sm flex items-center gap-2">
                    <Trophy size={14} className="text-[#0EE2E2]" /> {selectedPlayer.rank}
                  </span>
                </div>

                <h2 className="text-5xl sm:text-[70px] lg:text-[90px] font-[900] uppercase italic tracking-tighter leading-[0.9] lg:leading-[0.85] text-white drop-shadow-lg mb-8">
                  <span className="block text-white/70 text-2xl sm:text-4xl lg:text-[50px] mb-1 lg:mb-2 font-bold tracking-normal">
                    {selectedPlayer.name.split(' ')[0]}
                  </span>
                  {selectedPlayer.name.split(' ').slice(1).join(' ')}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10 border-t border-white/10 pt-8">
                  <div className="flex flex-col">
                    <span className="text-3xl lg:text-4xl font-[900] text-white italic">{selectedPlayer.stats.played}</span>
                    <span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest font-bold mt-2">Matchs Joués</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl lg:text-4xl font-[900] text-white italic">{selectedPlayer.stats.wins}</span>
                    <span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest font-bold mt-2">Victoires</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl lg:text-4xl font-[900] text-[#0EE2E2] italic">
                      {Math.round((selectedPlayer.stats.wins / selectedPlayer.stats.played) * 100)}%
                    </span>
                    <span className="text-[9px] lg:text-[10px] text-[#0EE2E2]/60 uppercase tracking-widest font-bold mt-2">Win Rate</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm lg:text-lg font-[900] text-white italic uppercase leading-none">{selectedPlayer.stats.style}</span>
                    <span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest font-bold mt-2">Style de jeu</span>
                  </div>
                </div>

                <p className="text-white/60 font-bold text-xs lg:text-sm max-w-lg leading-relaxed border-l-0 lg:border-l-4 border-t-4 lg:border-t-0 pt-4 lg:pt-0 mx-auto lg:mx-0 border-[#0065FF] lg:pl-5">
                  {selectedPlayer.description}
                </p>
              </div>

            </div>

          ) : (
            /* =========================================================
               VUE CARROUSEL 3D
               ========================================================= */
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500 mt-6 lg:mt-0">
              
              <div className="text-center mb-6 lg:mb-10">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter text-white drop-shadow-md">
                  INTER<span className="text-[#0065FF]">CLUBS</span>
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#0EE2E2] uppercase tracking-widest mt-2">Saison 2025-2026</p>
              </div>

              <div className="text-center mb-10 lg:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0EE2E2] text-[#081031] font-[900] uppercase text-[10px] tracking-widest italic mb-3">
                  <Trophy size={14} /> Équipe Première
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] uppercase italic tracking-tighter text-white leading-none">
                  NATIONALE <span className="text-[#0EE2E2]">1</span>
                </h2>
              </div>

              {/* Carrousel 3D avec Événements tactiles */}
              <div 
                className="relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] aspect-square flex justify-center items-center perspective-[1500px]"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {team1Players.map((player, index) => (
                  <div
                    key={player.id}
                    // AGRANDISSEMENT : w-[320px] sur mobile et w-[450px] sur desktop
                    className="absolute w-[320px] sm:w-[450px] lg:w-[550px] aspect-square transition-all duration-700 ease-out cursor-pointer border-none"
                    style={getCardStyle(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeaveCard}
                    onClick={() => {
                      if (activeIndex === index) setSelectedPlayer(player);
                    }}
                  >
                    {/* Wrapper interne pour le "Tilt 3D" */}
                    <div 
                      className="w-full h-full relative transition-transform duration-150 ease-out flex flex-col justify-end items-center group pointer-events-none"
                      style={{
                        transform: activeIndex === index 
                          ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                          : 'rotateX(0deg) rotateY(0deg)'
                      }}
                    >
                      {/* Lueur Cyan ou Rose (#ff0072) */}
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[80px] opacity-40 transition-opacity duration-500 group-hover:opacity-80 pointer-events-none ${player.gender === 'male' ? 'bg-[#0EE2E2]' : 'bg-[#ff0072]'}`}></div>
                      
                      {/* Image Détourée Carrée */}
                      <img 
                        src={player.img} 
                        alt={player.name} 
                        className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Bouton Blanc - Fixe en 2D en dessous de l'image carrée */}
                    <div className={`absolute -bottom-10 lg:-bottom-12 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none ${activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="bg-white text-[#081031] px-6 sm:px-8 py-3 rounded-full font-[900] uppercase text-[9px] sm:text-[10px] lg:text-[12px] tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.4)] whitespace-nowrap">
                        Découvrir le joueur
                      </div>
                    </div>

                    {/* Zone de capture transparente pour l'effet Tilt */}
                    <div 
                      className="absolute inset-0 z-30"
                      onMouseMove={(e) => handleMouseMove(e, index)}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Contrôles de Navigation Descendus */}
              <div className="flex items-center gap-6 mt-16 sm:mt-20 lg:mt-24 z-20">
                <button onClick={handlePrev} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0EE2E2] hover:text-[#081031] transition-all backdrop-blur-md">
                  <ChevronLeft size={20} className="sm:w-5 sm:h-5" />
                </button>
                <div className="flex gap-2">
                  {team1Players.map((_, idx) => (
                    <div key={idx} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-6 sm:w-8 bg-[#0EE2E2]' : 'w-1.5 sm:w-2 bg-white/30'}`} />
                  ))}
                </div>
                <button onClick={handleNext} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0EE2E2] hover:text-[#081031] transition-all backdrop-blur-md">
                  <ChevronRight size={20} className="sm:w-5 sm:h-5" />
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          SECTION 2 : TABLEAUX NATIONALE 1 (Classement & Rencontres PLUS PETITS)
          ========================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* CLASSEMENT COMPACT */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-[900] uppercase italic tracking-tighter mb-6 flex items-center gap-3">
              <Activity className="text-[#0065FF]" size={24} /> Classement <span className="text-[#0065FF]">Poule 2</span>
            </h2>
            
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="flex items-center bg-[#081031] text-white px-4 py-3 font-[900] uppercase text-[9px] tracking-widest italic">
                <div className="w-10">Pos</div>
                <div className="flex-1">Équipe</div>
                <div className="w-12 text-center hidden sm:block">Joués</div>
                <div className="w-12 text-right">Pts</div>
              </div>
              
              <div className="flex flex-col">
                {rankingN1.map((team, idx) => (
                  <div key={idx} className={`flex items-center px-4 py-3 border-b border-slate-100 dark:border-white/5 transition-colors ${team.isUs ? 'bg-[#0065FF]/10 dark:bg-[#0EE2E2]/10 border-l-4 border-l-[#0065FF] dark:border-l-[#0EE2E2]' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <div className={`w-10 font-[900] text-base italic ${team.rank <= 2 ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-slate-400'}`}>
                      {team.rank}
                    </div>
                    <div className={`flex-1 font-[900] uppercase italic text-xs sm:text-sm ${team.isUs ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>
                      {team.name}
                    </div>
                    <div className="w-12 text-center font-bold text-xs text-slate-500 hidden sm:block">{team.played}</div>
                    <div className={`w-12 text-right font-[900] text-base ${team.isUs ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>{team.pts}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-3 text-right">
              <a href="https://icbad.ffbad.org/equipe/58349" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#0065FF] hover:text-[#081031] dark:hover:text-[#0EE2E2] transition-colors italic">
                Détail ICBAD <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* RENCONTRES À VENIR COMPACTES */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-[900] uppercase italic tracking-tighter mb-6 flex items-center gap-3 text-[#081031] dark:text-white">
              <Calendar className="text-[#0EE2E2]" size={24} /> Rencontres <span className="text-[#0EE2E2]">à venir</span>
            </h2>

            <div className="flex flex-col gap-3">
              {nextMatchesN1.map((match, idx) => (
                <div key={idx} className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row overflow-hidden group hover:border-[#0EE2E2] transition-colors">
                  
                  {/* Date Block Compact */}
                  <div className="bg-[#081031] text-white p-4 flex flex-col justify-center items-center sm:w-[110px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 group-hover:bg-[#0EE2E2] group-hover:text-[#081031] transition-colors">
                    <span className="text-[9px] font-black text-[#0EE2E2] group-hover:text-[#081031] tracking-widest uppercase transition-colors mb-0.5">{match.time}</span>
                    <span className="text-2xl font-[900] italic leading-tight text-center">{match.date.split(' ')[0]}</span>
                    <span className="text-xs font-bold uppercase">{match.date.split(' ')[1]}</span>
                  </div>

                  {/* Info Block Compact */}
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-300">
                        {match.isHome ? 'DOMICILE' : 'EXTÉRIEUR'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`text-lg sm:text-xl font-[900] italic uppercase leading-none truncate ${match.isHome ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>
                        {match.home}
                      </div>
                      <div className="text-slate-300 font-black italic text-sm">VS</div>
                      <div className={`text-lg sm:text-xl font-[900] italic uppercase leading-none truncate ${!match.isHome ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>
                        {match.away}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                      <MapPin size={12} className={match.isHome ? "text-[#0EE2E2]" : ""} /> {match.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 3 : ÉQUIPES RÉGIONALES (PLUS COMPACTES)
          ========================================================= */}
      <section className="bg-slate-50 dark:bg-[#0a0f25] py-16 border-t border-slate-200 dark:border-white/5 transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white">
              ÉQUIPES <span className="text-[#0065FF]">RÉGIONALES</span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">La force du collectif cristolien</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            
            {/* CARTE ÉQUIPE 2 */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#0EE2E2]"></div>
              <div className="p-6 lg:p-8 pl-10 flex-1">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white">Équipe 2</h3>
                    <div className="inline-block mt-1 bg-[#0EE2E2]/20 text-[#081031] dark:text-[#0EE2E2] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Régionale 1</div>
                  </div>
                  <Trophy className="text-slate-200 dark:text-slate-700 w-10 h-10" />
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100 dark:border-white/5 pb-1.5 mb-1.5">
                    <span>Club</span><span>Pts</span>
                  </div>
                  <div className="flex justify-between font-[900] text-xs uppercase italic text-[#081031] dark:text-white bg-[#0EE2E2]/10 p-2 rounded-lg">
                    <span>1. US CRÉTEIL 2</span><span className="text-[#0065FF] dark:text-[#0EE2E2]">42</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs uppercase text-slate-500 px-2 py-1">
                    <span>2. Sénart Badminton</span><span>39</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs uppercase text-slate-500 px-2 py-1">
                    <span>3. Bussy St-Georges</span><span>35</span>
                  </div>
                </div>
              </div>
              <a href="#" className="block bg-[#081031] text-white text-center py-4 font-[900] uppercase text-[9px] tracking-widest hover:bg-[#0EE2E2] hover:text-[#081031] transition-colors mt-auto">
                Voir le calendrier complet
              </a>
            </div>

            {/* CARTE ÉQUIPE 3 */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#0065FF]"></div>
              <div className="p-6 lg:p-8 pl-10 flex-1">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white">Équipe 3</h3>
                    <div className="inline-block mt-1 bg-[#0065FF]/20 text-[#0065FF] dark:text-[#0065FF] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Régionale 3</div>
                  </div>
                  <Trophy className="text-slate-200 dark:text-slate-700 w-10 h-10" />
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100 dark:border-white/5 pb-1.5 mb-1.5">
                    <span>Club</span><span>Pts</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs uppercase text-slate-500 px-2 py-1">
                    <span>1. Vincennes</span><span>30</span>
                  </div>
                  <div className="flex justify-between font-[900] text-xs uppercase italic text-[#081031] dark:text-white bg-[#0065FF]/10 p-2 rounded-lg">
                    <span>2. US CRÉTEIL 3</span><span className="text-[#0065FF]">28</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs uppercase text-slate-500 px-2 py-1">
                    <span>3. Ermont</span><span>22</span>
                  </div>
                </div>
              </div>
              <a href="#" className="block bg-[#081031] text-white text-center py-4 font-[900] uppercase text-[9px] tracking-widest hover:bg-[#0065FF] transition-colors mt-auto">
                Voir le calendrier complet
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4 : ÉQUIPES DÉPARTEMENTALES (CTA ICBAD)
          ========================================================= */}
      <section className="py-16 lg:py-24 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 bg-[#0EE2E2]/20 text-[#0EE2E2] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 rotate-3">
            <Activity size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white mb-4">
            CHAMPIONNATS <span className="text-[#0EE2E2]">DÉPARTEMENTAUX</span>
          </h2>
          <p className="text-sm lg:text-base font-bold text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
            L'US Créteil possède également plusieurs équipes engagées dans les championnats départementaux et vétérans. Suivez leurs parcours, résultats et classements directement sur la plateforme officielle ICBAD de la FFBaD.
          </p>
          <a 
            href="https://icbad.ffbad.org/club/557" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#0065FF] text-white px-6 py-4 rounded-xl font-[900] uppercase italic text-xs shadow-lg hover:scale-[1.02] hover:bg-[#081031] transition-all"
          >
            Accéder à l'espace club ICBAD <ExternalLink size={16} />
          </a>
        </div>
      </section>

    </div>
  );
}