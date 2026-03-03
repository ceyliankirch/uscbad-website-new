'use client';
import React, { useState } from 'react';
import { Instagram, Facebook, Mail, MessageCircle, Palette, ArrowRight, ExternalLink, Smartphone, ChevronLeft, ChevronRight, X, Calendar, Tag, Sparkles } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION : LE MUSÉE (Format 4:5)
// ==========================================
const galleryItems = [
  { 
    id: 1, 
    img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1080&h=1350&auto=format&fit=crop", 
    title: "N1 vs Chambly", 
    category: "Interclubs", 
    date: "Mars 2026",
    description: "Affiche officielle pour la rencontre au sommet de la Poule 2 de Nationale 1. L'objectif était de retranscrire la tension et l'enjeu du match en mettant en avant nos joueurs phares dans une atmosphère électrique."
  },
  { 
    id: 2, 
    img: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1080&h=1350&auto=format&fit=crop", 
    title: "Tournoi Jeunes", 
    category: "Tournoi", 
    date: "Février 2026",
    description: "Visuel promotionnel pour le tournoi régional jeunes organisé par l'US Créteil. Une direction artistique plus colorée et dynamique pour cibler directement les jeunes compétiteurs d'Île-de-France."
  },
  { 
    id: 3, 
    img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1080&h=1350&auto=format&fit=crop", 
    title: "La Nuit du Bad", 
    category: "Événement", 
    date: "Février 2026",
    description: "Création graphique pour notre grand tournoi nocturne interne fluo. L'utilisation du néon et des contrastes forts rappelle immédiatement l'ambiance festive de l'événement."
  },
  { 
    id: 4, 
    img: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=1080&h=1350&auto=format&fit=crop", 
    title: "Recrutement N1", 
    category: "Club", 
    date: "Janvier 2026",
    description: "Campagne de communication pour attirer de nouveaux talents dans notre équipe première. Un design épuré, très axé sur le sport de haut niveau et la performance."
  },
  { 
    id: 5, 
    img: "https://images.unsplash.com/photo-1572680511874-98402c5c991f?q=80&w=1080&h=1350&auto=format&fit=crop", 
    title: "Stage Performance", 
    category: "Stage", 
    date: "Juillet 2025",
    description: "Affiche pour les stages d'été intensifs. Le visuel met l'accent sur l'effort physique et le dépassement de soi, valeurs fondamentales de l'USC."
  },
];

export default function CommunicationPage() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedVisual, setSelectedVisual] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // --- GESTION DU SWIPE MOBILE ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || selectedVisual) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
    setTilt({ x: 0, y: 0 });
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
    setTilt({ x: 0, y: 0 });
  };

  // --- GESTION DE L'EFFET TILT 3D ---
  const handleMouseMove = (e, index) => {
    if (activeIndex !== index || selectedVisual) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeaveCard = () => setTilt({ x: 0, y: 0 });

  // --- CALCUL DES STYLES DU CARROUSEL CIRCULAIRE (ARC AÉRÉ) ---
  const getCardStyle = (index) => {
    const total = galleryItems.length;
    let diff = index - activeIndex;

    // Boucle infinie
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isCenter = diff === 0;
    const absDiff = Math.abs(diff);
    
    // Paramètres mathématiques pour l'arc de cercle (Aérés)
    const translateX = diff * 150; 
    const translateY = absDiff * 40; 
    const translateZ = -absDiff * 150; 
    const rotateZ = diff * 8; 
    const rotateY = diff * -15; 
    const scale = isCenter ? 1.05 : 1; 
    const zIndex = 50 - absDiff;
    const opacity = isCenter ? 1 : Math.max(0.3, 1 - absDiff * 0.3);
    const blur = isCenter ? 'blur(0px)' : `blur(${absDiff * 3}px)`;

    return {
      transform: `translateX(${translateX}%) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
      zIndex,
      opacity,
      filter: blur,
      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return (
    // RETOUR AU FOND BLANC CLASSIQUE (SUPPORT DARK MODE)
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20 overflow-hidden">
      
      {/* =========================================================
          HERO : GALERIE NFT 3D INTÉGRÉE (FOND SOMBRE FORCÉ)
          ========================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#081031]">
        
        {/* Fonds et lumières */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[1000px] h-[600px] lg:h-[1000px] bg-[#0065FF]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Header textuel (Disparaît si on ouvre une image) */}
          {!selectedVisual && (
            <div className="text-center mb-10 lg:mb-16 animate-in fade-in duration-500 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-white rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
                <Sparkles size={14} className="text-[#0EE2E2]" /> L'Art du Badminton
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-4">
                LE MUSÉE <span className="text-[#0065FF]">USC</span>
              </h1>
              <p className="text-sm lg:text-base font-bold text-slate-300 leading-relaxed">
                Collection exclusive des visuels du club. Direction Artistique par Ceylian Kirchhoffer.
              </p>
            </div>
          )}

          {/* VUE DÉTAIL OU CARROUSEL */}
          {selectedVisual ? (
            /* --- VUE DÉTAIL --- */
            <div className="w-full flex flex-col lg:flex-row items-center justify-between animate-in fade-in zoom-in duration-500 relative max-w-[1200px] mx-auto mt-4 text-white">
              
              <button 
                onClick={() => setSelectedVisual(null)} 
                className="absolute -top-12 right-0 lg:-top-16 lg:right-0 z-50 text-white/50 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer bg-white/5 lg:bg-transparent px-4 py-2 rounded-full lg:p-0"
              >
                <X size={20} /> Fermer
              </button>

              <div className="w-full lg:w-[45%] flex justify-center relative z-10 order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-[2rem] bg-[#0065FF] blur-[80px] lg:blur-[100px] opacity-40 pointer-events-none"></div>
                <img 
                  src={selectedVisual.img} 
                  alt={selectedVisual.title} 
                  className="relative z-20 w-full max-w-[320px] lg:max-w-[360px] aspect-[4/5] object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10"
                />
              </div>

              <div className="w-full lg:w-[50%] flex flex-col justify-center z-20 order-2 lg:order-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <span className="bg-[#0065FF] text-white px-4 py-1.5 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-sm flex items-center gap-2">
                    <Tag size={14} /> {selectedVisual.category}
                  </span>
                  <span className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-4 py-1.5 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-sm flex items-center gap-2">
                    <Calendar size={14} className="text-[#0EE2E2]" /> {selectedVisual.date}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-lg mb-8">
                  {selectedVisual.title}
                </h2>

                <div className="border-t border-white/10 pt-6 lg:pt-8 mb-8">
                  <h4 className="text-[#0065FF] font-bold uppercase text-[10px] tracking-widest mb-3">Le concept créatif</h4>
                  <p className="text-white/80 font-medium text-sm lg:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                    {selectedVisual.description}
                  </p>
                </div>
              </div>
            </div>

          ) : (
            /* --- VUE CARROUSEL --- */
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              
              {/* Le conteneur 3D */}
              <div 
                className="relative w-full max-w-[1200px] h-[350px] sm:h-[450px] lg:h-[550px] flex justify-center items-center perspective-[2000px]"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {galleryItems.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={item.id}
                      className="absolute w-[210px] sm:w-[250px] lg:w-[320px] cursor-pointer"
                      style={getCardStyle(index)}
                      onMouseEnter={() => { if (!touchStart) setTilt({ x: 0, y: 0 }) }}
                      onMouseLeave={handleMouseLeaveCard}
                      onClick={() => {
                        if (isActive) setSelectedVisual(item);
                        else setActiveIndex(index);
                      }}
                    >
                      {/* Wrapper Tilt 3D */}
                      <div 
                        className="w-full h-full relative transition-transform duration-150 ease-out group"
                        style={{
                          transform: isActive ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'rotateX(0deg) rotateY(0deg)'
                        }}
                      >
                        {/* Lueur Bleue (Visible au survol de la carte active) */}
                        <div className={`absolute inset-0 -m-2 rounded-[2.5rem] bg-[#0065FF] blur-[40px] opacity-0 transition-opacity duration-700 pointer-events-none ${isActive ? 'group-hover:opacity-60' : ''}`}></div>

                        {/* Carte Glassmorphism Bleu Nuit */}
                        <div className="w-full bg-[#081031]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 shadow-2xl flex flex-col relative overflow-hidden">
                          
                          {/* Image 4:5 */}
                          <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-4 border border-white/5 bg-[#040817]">
                            <img 
                              src={item.img} 
                              alt={item.title} 
                              className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-105 group-hover:scale-110' : 'scale-100'}`}
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 bg-[#081031]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0065FF] animate-pulse shadow-[0_0_8px_#0065FF]"></span>
                              <span className="text-[8px] font-black uppercase tracking-widest text-white">{item.category}</span>
                            </div>
                          </div>

                          {/* Footer de la carte */}
                          <div className="px-2 pb-2 flex items-center justify-between">
                            <div className="flex flex-col text-white">
                              <h3 className="text-sm lg:text-base font-[900] uppercase italic leading-tight mb-0.5 truncate max-w-[140px] lg:max-w-[180px]">
                                {item.title}
                              </h3>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {item.date}
                              </p>
                            </div>
                            
                            {/* Avatar Créateur */}
                            <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0">
                              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="Ceylian" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Zone de capture pour le Tilt */}
                        {isActive && (
                          <div 
                            className="absolute inset-0 z-30"
                            onMouseMove={(e) => handleMouseMove(e, index)}
                          ></div>
                        )}
                      </div>

                      {/* Bouton cliquable en dessous */}
                      <div className={`absolute -bottom-14 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-white text-[#081031] px-6 py-3 rounded-full font-[900] uppercase text-[9px] sm:text-[10px] tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.4)] whitespace-nowrap flex items-center gap-2">
                          Découvrir l'œuvre
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Contrôles de Navigation */}
              <div className="flex items-center gap-8 lg:gap-16 mt-16 relative z-20 w-full max-w-md justify-center">
                <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0065FF] hover:border-transparent transition-all backdrop-blur-md">
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-[#0065FF] tracking-widest mb-1">Ceylian K.</span>
                    <div className="flex gap-1.5">
                      {galleryItems.map((_, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => { setActiveIndex(idx); setTilt({x: 0, y:0}); }}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/50'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleNext} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0065FF] hover:border-transparent transition-all backdrop-blur-md">
                  <ChevronRight size={24} />
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          SECTION 2 : RÉSEAUX SOCIAUX & CONTACT (IDENTIQUE V1)
          ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mt-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white">
            SUIVEZ LE <span className="text-[#0065FF]">MOUVEMENT</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* INSTAGRAM */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 rounded-[2rem] hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="bg-white dark:bg-[#0f172a] h-full rounded-[1.85rem] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center mb-6 shadow-md group-hover:rotate-12 transition-transform">
                <Instagram size={32} />
              </div>
              <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Instagram</h3>
              <p className="text-slate-500 font-bold text-xs mb-6">Résultats en direct, coulisses, stories et photos exclusives.</p>
              <span className="text-[#F72585] font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 mt-auto">
                @us_creteil_badminton <ExternalLink size={14} />
              </span>
            </div>
          </a>

          {/* FACEBOOK */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-[#1877F2] to-[#0065FF] p-1 rounded-[2rem] hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="bg-white dark:bg-[#0f172a] h-full rounded-[1.85rem] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-6 shadow-md group-hover:rotate-12 transition-transform">
                <Facebook size={32} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Facebook</h3>
              <p className="text-slate-500 font-bold text-xs mb-6">Toutes les annonces officielles, événements et albums photos complets.</p>
              <span className="text-[#1877F2] font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 mt-auto">
                US Créteil Badminton <ExternalLink size={14} />
              </span>
            </div>
          </a>

          {/* EMAIL */}
          <a href="mailto:com@uscbad.fr" className="group bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-800 p-1 rounded-[2rem] hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="bg-white dark:bg-[#0f172a] h-full rounded-[1.85rem] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-white/10 text-[#081031] dark:text-white flex items-center justify-center mb-6 shadow-md group-hover:rotate-12 transition-transform">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Service Presse</h3>
              <p className="text-slate-500 font-bold text-xs mb-6">Pour toute demande d'interview, sponsoring ou utilisation de nos visuels.</p>
              <span className="text-slate-600 dark:text-slate-300 font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 mt-auto">
                com@uscbad.fr <ArrowRight size={14} />
              </span>
            </div>
          </a>

        </div>
      </section>

      {/* =========================================================
          SECTION 3 : LA COMMUNAUTÉ WHATSAPP (IDENTIQUE V1)
          ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-[#25D366] rounded-[2rem] lg:rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col lg:flex-row items-center">
          
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/connected.png')" }}></div>
          <div className="absolute -right-20 -top-20 text-white/20 pointer-events-none">
            <MessageCircle size={400} />
          </div>

          <div className="w-full lg:w-3/5 p-8 lg:p-16 relative z-10 text-[#081031]">
            <div className="inline-flex items-center gap-2 bg-[#081031] text-white px-4 py-1.5 rounded-full font-[900] uppercase text-[10px] tracking-widest mb-6">
              <Smartphone size={14} /> Espace Joueurs
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] uppercase italic tracking-tighter leading-[0.9] mb-6">
              REJOIGNEZ LA <br/> <span className="text-white">COMMUNAUTÉ</span>
            </h2>
            
            <p className="text-sm lg:text-base font-bold leading-relaxed opacity-90 mb-8 max-w-lg">
              Ne ratez plus aucun créneau annulé, organisez des matchs de jeu libre de dernière minute ou suivez les résultats de votre équipe. Nous avons créé une <strong>Communauté WhatsApp</strong> officielle pour rassembler tous les groupes du club !
            </p>

            <ul className="space-y-3 mb-10 text-xs lg:text-sm font-black uppercase tracking-wider">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white"></span> Un groupe "Annonces Officielles"</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white"></span> Un groupe "Jeu Libre & Recherche de joueurs"</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white"></span> Des groupes par équipes d'Interclubs</li>
            </ul>

            <button className="bg-white text-[#25D366] px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl hover:scale-105 hover:bg-[#081031] hover:text-white transition-all flex items-center justify-center gap-3">
              <MessageCircle size={18} /> Intégrer la communauté
            </button>
          </div>

          <div className="w-full lg:w-2/5 h-[300px] lg:h-auto relative z-10 flex items-center justify-center p-8 hidden lg:flex">
            <div className="relative w-64 h-[500px] bg-[#081031] rounded-[3rem] border-[8px] border-[#081031] shadow-2xl overflow-hidden -rotate-6 group-hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=1000&auto=format&fit=crop" 
                alt="WhatsApp Chat Concept" 
                className="w-full h-full object-cover opacity-80" 
              />
              <div className="absolute inset-x-4 top-12 space-y-4">
                <div className="w-3/4 bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-none p-3 text-[10px] text-white font-bold">Le créneau de ce soir est maintenu ! 🏸</div>
                <div className="w-3/4 ml-auto bg-[#25D366] rounded-2xl rounded-tr-none p-3 text-[10px] text-[#081031] font-bold text-right">Super, j'y serai vers 20h 🔥</div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}