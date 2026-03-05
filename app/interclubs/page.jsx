'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Calendar, MapPin, ExternalLink, Activity, X, Loader2, Info, User, Star } from 'lucide-react';

const formatTeamName = (name) => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length > 2) {
    return (
      <>
        <span className="block">{words.slice(0, 2).join(' ')}</span>
        <span className="block">{words.slice(2).join(' ')}</span>
      </>
    );
  }
  return <span className="block">{name}</span>;
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState(null); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // ==========================================
  // ÉTATS DYNAMIQUES (JOUEURS ET ICBAD)
  // ==========================================
  const [team1Players, setTeam1Players] = useState([]); 
  const [liveRanking, setLiveRanking] = useState([]);
  const [liveRankingEq2, setLiveRankingEq2] = useState([]);
  const [liveRankingEq3, setLiveRankingEq3] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [configUrls, setConfigUrls] = useState({ team1Url: '#', clubUrl: '#' });
  
  const [isScraping, setIsScraping] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    // 1. CHARGEMENT DES JOUEURS DEPUIS LA BDD
    const fetchPlayers = async () => {
      try {
        const res = await fetch('/api/team-players?team=N1');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setTeam1Players(json.data);
          setActiveIndex(Math.floor(json.data.length / 2));
        }
      } catch (err) {
        console.error("Erreur chargement joueurs:", err);
      } finally {
        setIsLoadingPlayers(false);
      }
    };

    // 2. CHARGEMENT DES SCORES ET CLASSEMENTS ICBAD
    const fetchIcbadData = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/icbad?t=${timestamp}`, { cache: 'no-store' });
        const result = await res.json();
        
        if (result.success && result.data) {
          setLiveRanking(result.data.rankingN1 || []);
          setLiveRankingEq2(result.data.rankingEq2 || []);
          setLiveRankingEq3(result.data.rankingEq3 || []);
          setLiveMatches(result.data.nextMatches || []);
          if (result.data.configUrls) setConfigUrls(result.data.configUrls);
        }
      } catch (err) {
        console.error("Erreur synchro ICBAD:", err);
      } finally {
        setIsScraping(false);
      }
    };
    
    fetchPlayers();
    fetchIcbadData();
  }, []);

  // --- LOGIQUE DE TRANSITION DOUCE ---
  const handleSelectPlayer = (player) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPlayer(player);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const handleCloseProfile = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPlayer(null);
      setIsTransitioning(false);
    }, 300);
  };

  // --- NAVIGATION CARROUSEL ---
  const handlePrev = () => {
    if (team1Players.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? team1Players.length - 1 : prev - 1));
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    if (team1Players.length === 0) return;
    setActiveIndex((prev) => (prev === team1Players.length - 1 ? 0 : prev + 1));
    setTilt({ x: 0, y: 0 });
  };

  // --- GESTION TACTILE ---
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
  };

  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (activeIndex !== index) { setActiveIndex(index); setTilt({ x: 0, y: 0 }); }
    }, 150);
  };

  const handleMouseMove = (e, index) => {
    if (activeIndex !== index) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({ x: ((y - centerY) / centerY) * -15, y: ((x - centerX) / centerX) * 15 });
  };

  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    let relativeDiff = diff;
    const total = team1Players.length;
    if (diff > total / 2) relativeDiff -= total;
    if (diff < -total / 2) relativeDiff += total;

    let translateX = 0; let scale = 1; let zIndex = 50;
    let opacity = 1; let blur = 'blur(0px)'; let rotateY = '0deg';

    if (relativeDiff === 0) { translateX = 0; scale = 1.1; zIndex = 50; } 
    else if (relativeDiff === -1) { translateX = -120; scale = 0.85; zIndex = 40; opacity = 0.4; blur = 'blur(2px)'; rotateY = '20deg'; } 
    else if (relativeDiff === 1) { translateX = 120; scale = 0.85; zIndex = 40; opacity = 0.4; blur = 'blur(2px)'; rotateY = '-20deg'; } 
    else if (relativeDiff === -2) { translateX = -200; scale = 0.7; zIndex = 30; opacity = 0.15; blur = 'blur(4px)'; rotateY = '25deg'; } 
    else if (relativeDiff === 2) { translateX = 200; scale = 0.7; zIndex = 30; opacity = 0.15; blur = 'blur(4px)'; rotateY = '-25deg'; } 
    else { opacity = 0; scale = 0.5; zIndex = 10; rotateY = '0deg'; }

    return { transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY})`, zIndex, opacity, filter: blur };
  };

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300">
      
      {/* =========================================================
          SECTION 1 : HERO (HAUTEUR HARMONISÉE & ESPACEMENT HAUT)
          ========================================================= */}
      <section className="relative w-full overflow-hidden bg-[#081031] min-h-[900px] lg:min-h-[1050px] flex items-center justify-center pt-32 lg:pt-48 pb-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className={`relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 transition-all duration-500 ease-in-out h-full ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          
          {selectedPlayer ? (
            /* --- VUE PROFIL DÉTAILLÉ (HAUTEUR HARMONISÉE) --- */
            <div className="w-full min-h-[600px] lg:min-h-[750px] flex flex-col lg:flex-row items-center justify-between relative">
              <button 
                onClick={handleCloseProfile} 
                className="absolute -top-12 lg:top-0 right-0 z-50 text-white/50 hover:text-white flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer bg-white/5 lg:bg-white/10 px-5 py-2.5 rounded-full hover:scale-105 border border-white/10"
              >
                <X size={18} /> Fermer le profil
              </button>

              <div className="w-full lg:w-[50%] aspect-square max-h-[500px] lg:max-h-[700px] relative z-10 flex items-center justify-center order-1 lg:order-2 shrink-0">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] lg:blur-[120px] opacity-40 pointer-events-none ${selectedPlayer.gender === 'female' ? 'bg-[#F72585]' : 'bg-[#0EE2E2]'}`}></div>
                <div className="absolute right-0 top-1/4 text-[120px] sm:text-[200px] lg:text-[250px] font-[900] italic text-white/5 pointer-events-none tracking-tighter uppercase">
                  {selectedPlayer.rank}
                </div>
                {selectedPlayer.image ? (
                  <img src={selectedPlayer.image} alt={selectedPlayer.name} className="relative z-20 w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-12 duration-700" />
                ) : (
                  <div className="relative z-20 w-full h-full flex items-end justify-center"><User size={300} className="text-white/10 mb-10" /></div>
                )}
              </div>

              <div className="w-full lg:w-[50%] flex flex-col justify-center pt-12 lg:pt-0 z-20 order-2 lg:order-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 lg:mb-6 animate-in fade-in slide-in-from-left-8 duration-500 delay-100">
                  <span className="bg-[#0065FF] text-white px-4 py-1.5 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-sm">{selectedPlayer.role}</span>
                  <span className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-4 py-1.5 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-sm flex items-center gap-2">
                    <Trophy size={14} className="text-[#0EE2E2]" /> {selectedPlayer.rank}
                  </span>
                </div>
                <h2 className="text-5xl sm:text-[70px] lg:text-[90px] font-[900] uppercase italic tracking-tighter leading-[0.9] lg:leading-[0.85] text-white drop-shadow-lg mb-8 animate-in fade-in slide-in-from-left-8 duration-500 delay-200">
                  <span className="block text-white/70 text-2xl sm:text-4xl lg:text-[50px] mb-1 lg:mb-2 font-bold tracking-normal">{selectedPlayer.name.split(' ')[0]}</span>
                  {selectedPlayer.name.split(' ').slice(1).join(' ')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10 border-t border-white/10 pt-8 animate-in fade-in slide-in-from-left-8 duration-500 delay-300">
                  <div className="flex flex-col"><span className="text-3xl lg:text-4xl font-[900] text-white italic">{selectedPlayer.played}</span><span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest font-bold mt-2">Matchs Joués</span></div>
                  <div className="flex flex-col"><span className="text-3xl lg:text-4xl font-[900] text-white italic">{selectedPlayer.wins}</span><span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest font-bold mt-2">Victoires</span></div>
                  <div className="flex flex-col"><span className="text-3xl lg:text-4xl font-[900] text-[#0EE2E2] italic">{selectedPlayer.played > 0 ? Math.round((selectedPlayer.wins / selectedPlayer.played) * 100) : 0}%</span><span className="text-[9px] lg:text-[10px] text-[#0EE2E2]/60 uppercase tracking-widest font-bold mt-2">Win Rate</span></div>
                  <div className="flex flex-col justify-center"><span className="text-sm lg:text-lg font-[900] text-white italic uppercase leading-none">Nationale 1</span><span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest font-bold mt-2">Championnat</span></div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-[2rem] border-l-4 border-[#0EE2E2] italic text-white/80 relative overflow-hidden group animate-in fade-in slide-in-from-left-8 duration-500 delay-400">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EE2E2]/5 blur-2xl rounded-full"></div>
                   <div className="flex items-center gap-2 mb-3 relative z-10">
                     <Info size={14} className="text-[#0EE2E2]" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Anecdote & Citation</span>
                   </div>
                   <p className="text-xs lg:text-base font-bold leading-relaxed relative z-10">
                    "{selectedPlayer.anecdote || "Ce joueur préfère laisser son talent parler sur le terrain..."}"
                   </p>
                </div>
              </div>
            </div>
          ) : (
            /* --- VUE CARROUSEL 3D --- */
            <div className="w-full flex flex-col items-center">
              <div className="text-center animate-in fade-in slide-in-from-top-8 duration-700">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter text-white drop-shadow-md">INTERCLUBS</h1>
              </div>

              <div className="text-center mb-5 lg:mb-8 animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0EE2E2]/10 border border-[#0EE2E2]/30 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-3 backdrop-blur-md">
                  <Trophy size={14} /> Équipe Première
                </div>
              </div>
              
              {isLoadingPlayers ? (
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <Loader2 className="animate-spin text-[#0EE2E2]" size={48} />
                </div>
              ) : team1Players.length > 0 ? (
                <div 
                  className="relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] aspect-square flex justify-center items-center perspective-[1500px] animate-in zoom-in duration-700 delay-200"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {team1Players.map((player, index) => (
                    <div
                      key={player._id}
                      className="absolute w-[320px] sm:w-[450px] lg:w-[550px] aspect-square transition-all duration-700 ease-out cursor-pointer border-none"
                      style={getCardStyle(index)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => setTilt({x:0, y:0})}
                      onClick={() => {
                        if (activeIndex === index) handleSelectPlayer(player);
                      }}
                    >
                      <div 
                        className="w-full h-full relative transition-transform duration-150 ease-out flex flex-col justify-end items-center group pointer-events-none"
                        style={{
                          transform: activeIndex === index 
                            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                            : 'rotateX(0deg) rotateY(0deg)'
                        }}
                      >
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[80px] opacity-40 transition-opacity duration-500 group-hover:opacity-80 pointer-events-none ${player.gender === 'female' ? 'bg-[#F72585]' : 'bg-[#0EE2E2]'}`}></div>
                        
                        {player.image ? (
                          <img src={player.image} alt={player.name} className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="relative z-10 w-full h-full flex items-end justify-center pb-20 opacity-20"><User size={200} /></div>
                        )}
                      </div>

                      <div className={`absolute -bottom-10 lg:-bottom-12 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none ${activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-white text-[#081031] px-6 sm:px-8 py-3 rounded-full font-[900] uppercase text-[9px] sm:text-[10px] lg:text-[12px] tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.4)] whitespace-nowrap">
                          Découvrir {player.name.split(' ')[0]}
                        </div>
                      </div>

                      <div 
                        className="absolute inset-0 z-30"
                        onMouseMove={(e) => handleMouseMove(e, index)}
                      ></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-white/20 font-black uppercase tracking-widest">
                  Effectif en cours de validation
                </div>
              )}

              {team1Players.length > 0 && (
                <div className="flex items-center gap-6 mt-16 sm:mt-20 lg:mt-24 z-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
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
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : TABLEAUX ICBAD (CLASSEMENT & RENCONTRES)
          ========================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* CLASSEMENT DYNAMIQUE */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-[900] uppercase italic tracking-tighter flex items-center gap-3">
                <Activity className="text-[#0065FF]" size={24} /> Classement <span className="text-[#0065FF]">Nationale 1</span>
              </h2>
              {isScraping ? (
                <Loader2 size={16} className="animate-spin text-[#0065FF]" />
              ) : (
                <span className="text-[8px] sm:text-[9px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full uppercase tracking-widest font-black flex items-center gap-1.5 border border-green-200 dark:border-green-500/30 shadow-sm">
                  Live ICBAD <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                </span>
              )}
            </div>
            
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden transition-colors">
              <div className="flex items-center bg-[#081031] text-white px-4 py-3 font-[900] uppercase text-[9px] tracking-widest italic">
                <div className="w-10">Pos</div>
                <div className="flex-1">Équipe</div>
                <div className="w-12 text-center hidden sm:block">Joués</div>
                <div className="w-12 text-right">Pts</div>
              </div>
              
              <div className="flex flex-col">
                {liveRanking.length > 0 ? liveRanking.slice(0, 6).map((team, idx) => (
                  <div key={idx} className={`flex items-center px-4 py-3 border-b border-slate-100 dark:border-white/5 transition-colors ${team.isUs ? 'bg-[#0065FF]/10 dark:bg-[#0EE2E2]/10 border-l-4 border-l-[#0065FF] dark:border-l-[#0EE2E2]' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <div className={`w-10 font-[900] text-base italic ${team.rank <= 2 ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-slate-400'}`}>{team.rank}</div>
                    <div className={`flex-1 font-[900] uppercase italic text-xs sm:text-sm ${team.isUs ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>{team.name}</div>
                    <div className="w-12 text-center font-bold text-xs text-slate-500 hidden sm:block">{team.played}</div>
                    <div className={`w-12 text-right font-[900] text-base ${team.isUs ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>{team.pts}</div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-400 font-bold italic text-sm">Chargement du classement...</div>
                )}
              </div>
            </div>
            
            <div className="mt-3 text-right">
              <a href={configUrls.team1Url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#0065FF] hover:text-[#081031] dark:hover:text-[#0EE2E2] transition-colors italic">
                Détail complet sur ICBAD <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* RENCONTRES À VENIR */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-[900] uppercase italic tracking-tighter flex items-center gap-3 text-[#081031] dark:text-white">
                <Calendar className="text-[#0EE2E2]" size={24} /> Rencontres <span className="text-[#0EE2E2]">à venir</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {liveMatches.length > 0 ? liveMatches.slice(0, 3).map((match, idx) => (
                <div key={idx} className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row overflow-hidden group hover:border-[#0EE2E2] transition-colors">
                  <div className="bg-[#081031] text-white p-4 flex flex-col justify-center items-center sm:w-[110px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 group-hover:bg-[#0EE2E2] group-hover:text-[#081031] transition-colors">
                    <span className="text-[9px] font-black text-[#0EE2E2] group-hover:text-[#081031] tracking-widest uppercase transition-colors mb-0.5">{match.time}</span>
                    <span className="text-2xl font-[900] italic leading-tight text-center">{match.date.split(' ')[0]}</span>
                    <span className="text-xs font-bold uppercase">{match.date.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-300">
                        {match.isHome ? 'DOMICILE' : 'EXTÉRIEUR'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 mb-3 w-full">
                      <div className={`text-right text-lg sm:text-xl font-[900] italic uppercase leading-tight break-words ${match.isHome ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>
                        {formatTeamName(match.home)}
                      </div>
                      <div className="text-slate-300 dark:text-slate-600 font-black italic text-sm shrink-0 flex justify-center px-1">VS</div>
                      <div className={`text-left text-lg sm:text-xl font-[900] italic uppercase leading-tight break-words ${!match.isHome ? 'text-[#0065FF] dark:text-[#0EE2E2]' : 'text-[#081031] dark:text-white'}`}>
                        {formatTeamName(match.away)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mt-auto">
                      <MapPin size={12} className={match.isHome ? "text-[#0EE2E2]" : ""} /> {match.location}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-2xl text-center text-slate-400 font-bold italic text-sm">Chargement des rencontres...</div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 3 : ÉQUIPES RÉGIONALES
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
            <TeamRegionalCard team="Équipe 2" level="Pré-National" color="#0EE2E2" ranking={liveRankingEq2} url={configUrls.clubUrl} isScraping={isScraping} />
            {/* CARTE ÉQUIPE 3 */}
            <TeamRegionalCard team="Équipe 3" level="Régionale 3" color="#0065FF" ranking={liveRankingEq3} url={configUrls.clubUrl} isScraping={isScraping} />
          </div>
        </div>
      </section>

      {/* SECTION CTA DÉPARTEMENTAUX */}
      <section className="py-16 lg:py-24 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 bg-[#0EE2E2]/20 text-[#0EE2E2] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 rotate-3">
            <Activity size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white mb-4">
            CHAMPIONNATS <span className="text-[#0EE2E2]">DÉPARTEMENTAUX</span>
          </h2>
          <p className="text-sm lg:text-base font-bold text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
            L'US Créteil possède également plusieurs équipes engagées dans les championnats départementaux et vétérans. Suivez leurs parcours directement sur ICBAD.
          </p>
          <a 
            href={configUrls.clubUrl} 
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

const TeamRegionalCard = ({ team, level, color, ranking, url, isScraping }) => (
  <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group flex flex-col transition-colors">
    <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: color }}></div>
    <div className="p-6 lg:p-8 pl-10 flex-1">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white">{team}</h3>
          <div className="inline-block mt-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${color}20`, color: color }}>{level}</div>
        </div>
        {isScraping ? <Loader2 className="animate-spin text-slate-300" size={24} /> : <Trophy className="text-slate-200 dark:text-slate-700 w-10 h-10" />}
      </div>
      
      <div className="space-y-2.5">
        <div className="flex justify-between font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100 dark:border-white/5 pb-1.5 mb-1.5">
          <span>Club</span><span>Pts</span>
        </div>
        {ranking.length > 0 ? ranking.slice(0, 4).map((item, idx) => (
          <div key={idx} className={`flex justify-between items-center font-bold text-xs uppercase px-2 py-1.5 rounded-lg transition-colors ${item.isUs ? 'font-[900] italic text-[#081031] dark:text-white bg-slate-50 dark:bg-white/5' : 'text-slate-500 dark:text-slate-400'}`}>
            <span className="truncate pr-2">{item.rank}. {item.name}</span>
            <span className={item.isUs ? '' : 'opacity-60'} style={{ color: item.isUs ? color : undefined }}>{item.pts}</span>
          </div>
        )) : <div className="text-center py-4 text-slate-400 text-[10px] font-bold uppercase italic">Données indisponibles</div>}
      </div>
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-[#081031] text-white text-center py-4 font-[900] uppercase text-[9px] tracking-widest hover:bg-[#0EE2E2] hover:text-[#081031] transition-all mt-auto" style={{ backgroundColor: isScraping ? undefined : '#081031' }}>
      Voir le calendrier complet <ExternalLink size={10} className="inline mb-0.5 ml-1" />
    </a>
  </div>
);