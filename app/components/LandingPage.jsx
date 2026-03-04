'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Play, ArrowRight, Trophy, Calendar, ChevronRight, TrendingUp, MapPin, Instagram, Facebook, Mail, Users, Activity, Phone, Star, Loader2 } from 'lucide-react';

// LES CATÉGORIES EXACTES DU DASHBOARD
const categories = ["Tout voir", "Événements", "Compétitions", "Vie du Club", "Interclubs", "Jeunes"];

const LandingPage = () => {
  // --- GESTION DU LIVE SCORE ---
  const [liveScore, setLiveScore] = useState({
    division: 'NATIONALE 1 | J05',
    date: 'CHARGEMENT...',
    homeTeam: 'US CRÉTEIL',
    homeScore: '-',
    homeTextColor: '#081031',
    awayTeam: 'ADVERSAIRE',
    awayScore: '-',
    awayTextColor: '#FFFFFF'
  });

  useEffect(() => {
    fetch('/api/score', { cache: 'no-store' })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data && result.data.homeTeam) {
          setLiveScore(result.data);
        }
      })
      .catch(err => console.error("Erreur chargement Live Score:", err));
  }, []);

  // --- GESTION DES ACTUALITÉS ---
  const [activeCategory, setActiveCategory] = useState("Tout voir");
  const [articles, setArticles] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        if (data.success) {
          // Tri par date de publication (du plus récent au plus ancien)
          const sorted = data.data.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
          setArticles(sorted);
        }
      } catch (error) {
        console.error("Erreur actus:", error);
      } finally {
        setIsLoadingNews(false);
      }
    };
    fetchArticles();
  }, []);

  // Filtrage et limitation à 8 articles pour le carrousel
  const filteredArticles = articles
    .filter(article => activeCategory === "Tout voir" || article.category === activeCategory)
    .slice(0, 8);

  return (
    <div className="bg-white dark:bg-[#040817] font-['Montserrat'] transition-colors duration-300">
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-flex;
            animation: marquee 40s linear infinite;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80svh] lg:h-[100svh] min-h-[600px] flex items-end lg:items-center pb-36 lg:pb-0 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <picture>
            <source media="(min-aspect-ratio: 21/9)" srcSet="/assets/bannière-uscbad-21-9.jpg" />
            <source media="(max-aspect-ratio: 1/1), (max-width: 768px)" srcSet="/assets/bannière-uscbad-9-16.jpg" />
            <img 
              src="/assets/bannière-uscbad-16-9.jpg" 
              alt="US Créteil Badminton N1" 
              className="w-full h-full object-cover object-right"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-[#081031] via-[#081031]/60 to-transparent lg:hidden" />
        </div>

        <div className="relative z-10 w-full max-w-[2000px] mx-auto px-6 lg:px-20 mt-auto lg:mt-0">
          <div className="max-w-6xl space-y-4 lg:space-y-6">
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0EE2E2]/10 border border-[#0EE2E2]/20 backdrop-blur-md">
                <span className="text-[10px] lg:text-[14px] font-[900] uppercase text-[#0EE2E2]">Union Sportive de Créteil</span>
              </div>
              <div className="flex gap-2">
                <MiniSocialBtn icon={<Instagram size={14} />} href="#" />
                <MiniSocialBtn icon={<Facebook size={14} fill="currentColor" />} href="#" />
                <MiniSocialBtn icon={<Mail size={14} />} href="#" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-[900] leading-[0.9] tracking-tighter italic uppercase text-white drop-shadow-lg">
              Rejoignez Nous !
            </h1>
            
            <p className="text-xs md:text-lg lg:text-xl text-[#0EE2E2] font-bold leading-relaxed italic max-w-2xl drop-shadow-md">
              Rejoignez le club dynamique dont l'équipe première évolue en Nationale 1. Rassemblant des joueurs de tous niveaux, du loisir à la compétition, et offrant une école de jeunes labellisée.
            </p>

            <div className="flex flex-row items-center gap-2 lg:gap-4 pt-4 lg:pt-8 w-full md:w-auto">
              <a 
                href="#inscriptions" 
                className="flex-1 md:flex-none flex items-center justify-center bg-[#0065FF] text-white px-4 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-[900] italic text-xs lg:text-lg shadow-2xl hover:scale-[1.02] transition-transform uppercase tracking-normal hover:bg-[#0EE2E2] hover:text-[#081031]"
              >
                M'INSCRIRE
              </a>
              
              <a 
                href="/presentation" 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 lg:gap-4 bg-white/10 lg:bg-white/60 dark:bg-white/10 backdrop-blur-md p-1 lg:p-1.5 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl border border-white/20 lg:border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm group"
              >
                <div className="bg-[#0EE2E2] p-2 lg:p-3 rounded-lg lg:rounded-xl text-[#081031] group-hover:bg-[#081031] group-hover:text-[#0EE2E2] transition-colors">
                  <Home size={16} className="lg:w-5 lg:h-5" />
                </div>
                <span className="font-bold text-[10px] lg:text-[12px] uppercase tracking-normal text-white lg:text-[#081031] dark:lg:text-white group-hover:text-[#081031] dark:group-hover:text-white">
                  Le Club
                </span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SCORE NATIONALE 1 */}
      <section className="relative z-20 -mt-28 md:-mt-24 lg:-mt-20 max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="w-full overflow-visible hide-scrollbar pb-8 pt-8">
          <div className="relative font-['Montserrat'] w-full max-w-sm md:max-w-[1100px] lg:max-w-[1400px] mx-auto flex flex-col md:flex-row h-[172px] md:h-[120px] lg:h-[140px] shrink-0 overflow-visible">
            
            <div className="md:hidden flex w-full h-[32px] absolute -top-[32px] left-0 z-40 shadow-lg">
              <div className="flex-1 bg-[#0065FF] text-white px-4 flex items-center justify-center font-[900] uppercase text-[10px] tracking-widest italic text-center">
                {liveScore.date}
              </div>
              <div className="flex-1 bg-[#0EE2E2] text-[#081031] px-4 flex items-center justify-center font-[900] uppercase text-[10px] tracking-widest italic text-center">
                {liveScore.division}
              </div>
            </div>

            <div className="hidden md:flex absolute top-[-32px] left-1/2 -translate-x-1/2 items-center z-40 shadow-xl">
              <div className="bg-[#0EE2E2] text-[#081031] px-6 py-2 font-[900] uppercase text-[11px] tracking-tighter italic">
                {liveScore.division}
              </div>
              <div className="bg-[#0065FF] text-white px-6 py-2 font-[900] uppercase text-[11px] tracking-tighter italic whitespace-nowrap">
                {liveScore.date}
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full h-full shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
              <div className="flex-[4] flex items-center relative min-w-0 h-[70px] md:h-full shrink-0">
                <div className="w-[70px] md:w-[110px] lg:w-[130px] h-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                  {liveScore.homeLogo ? (
                    <img src={liveScore.homeLogo} alt="Logo Domicile" className="h-[60%] object-contain p-1" />
                  ) : (
                    <span className="text-[8px] lg:text-[10px] font-black text-slate-300 italic uppercase">Logo</span>
                  )}
                </div>

                <div style={{ backgroundColor: liveScore.homeColor || '#0EE2E2' }} className="flex-1 h-full flex flex-col justify-center items-end pr-[85px] md:pr-6 transition-colors duration-500 min-w-0 border-none">
                  <div className="w-full flex flex-col items-end -translate-x-[10px]">
                    <h3 style={{ color: liveScore.homeTextColor || '#081031' }} className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-[900] uppercase leading-none tracking-tighter italic truncate w-full text-right">
                      {liveScore.homeTeam}
                    </h3>
                    <div className="bg-[#081031] text-white px-2 lg:px-3 py-1 font-[900] uppercase text-[7px] md:text-[8px] lg:text-[10px] tracking-[0.2em] mt-1 lg:mt-2 italic">
                      DOMICILE
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute md:relative right-0 top-[0px] md:top-auto bottom-0 w-[75px] md:w-[140px] lg:w-[180px] h-full md:h-full bg-[#0065FF] flex flex-col md:flex-row items-center justify-center z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.15)] md:shadow-[0_0_40px_rgba(0,101,255,0.3)]">
                <div className="hidden md:flex flex-row items-center justify-center gap-4 lg:gap-5 text-white font-[900]">
                  <span className="text-5xl lg:text-7xl tracking-tighter italic drop-shadow-md">{liveScore.homeScore}</span>
                  <div className="w-0.5 lg:w-1 h-10 lg:h-16 bg-white/30 shrink-0"></div>
                  <span className="text-5xl lg:text-7xl tracking-tighter italic drop-shadow-md">{liveScore.awayScore}</span>
                </div>
                <div className="flex md:hidden flex-col w-full h-full text-white font-[900] relative">
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-4xl tracking-tighter italic drop-shadow-md">{liveScore.homeScore}</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-white/30 shrink-0"></div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-4xl tracking-tighter italic drop-shadow-md">{liveScore.awayScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex-[4] flex flex-row md:flex-row-reverse items-center relative min-w-0 h-[70px] md:h-full shrink-0">
                <div className="w-[70px] md:w-[110px] lg:w-[130px] h-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                  {liveScore.awayLogo ? (
                    <img src={liveScore.awayLogo} alt="Logo Extérieur" className="h-[60%] object-contain p-1" />
                  ) : (
                    <span className="text-[8px] lg:text-[10px] font-black text-slate-300 italic uppercase">Logo</span>
                  )}
                </div>

                <div style={{ backgroundColor: liveScore.awayColor || '#081031' }} className="flex-1 h-full flex flex-col justify-center items-end md:items-start pr-[85px] md:pr-0 pl-4 md:pl-6 transition-colors duration-500 min-w-0">
                  <div className="w-full flex flex-col items-end md:items-start -translate-x-[10px]">
                    <h3 style={{ color: liveScore.awayTextColor || '#FFFFFF' }} className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-[900] uppercase leading-none tracking-tighter italic truncate w-full text-right md:text-left">
                      {liveScore.awayTeam}
                    </h3>
                    <div className="bg-white text-[#081031] px-2 lg:px-3 py-1 font-[900] uppercase text-[7px] md:text-[8px] lg:text-[10px] tracking-[0.2em] mt-1 lg:mt-2 italic">
                      EXTÉRIEUR
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div> 
        </div> 
      </section>

      {/* 3. SECTION : INTÉGRER LE CLUB */}
      <section className="py-16 lg:py-24 px-6 lg:px-8 bg-slate-50/50 dark:bg-[#0a0f25] transition-colors relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-10 lg:mb-16 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
              Intégrer <span className="text-[#0065FF] block sm:inline">l'US Créteil</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <InfoCard num="01" title="Jeu Libre & Loisir" desc="Des créneaux tous les jours pour venir jouer librement avec d'autres passionnés dans une ambiance conviviale." color="#0065FF" />
            <InfoCard num="02" title="Compétition & IC" desc="Entraînements dirigés par des coachs et intégration à nos équipes interclubs, jusqu'en Nationale 1." color="#0EE2E2" />
            <InfoCard num="03" title="École des Jeunes" desc="Une école labellisée pour former les champions de demain dès le plus jeune âge avec des pros." color="#0A266D" />
            <div className="bg-[#0065FF] rounded-[1.5rem] lg:rounded-[2rem] p-8 flex flex-col justify-center items-center text-center text-white shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <h4 className="text-2xl font-[900] italic uppercase mb-3 leading-tight">Prêt à nous rejoindre ?</h4>
              <p className="text-[11px] font-bold opacity-90 mb-6">Les inscriptions pour la saison sont ouvertes. Rejoignez la famille USC.</p>
              <button className="bg-[#081031] text-white px-6 py-4 w-full rounded-xl font-[900] uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#0EE2E2] hover:text-[#081031] transition-colors shadow-lg">
                M'inscrire <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex items-center justify-between group hover:shadow-lg transition-all">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Licenciés</div>
                <div className="text-5xl font-[900] italic text-[#081031] dark:text-white">
                  <AnimatedNumber value={307} />
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[#0EE2E2]/10 flex items-center justify-center text-[#0EE2E2] group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Users size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center hover:shadow-lg transition-all">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Parité du club</div>
              <div className="flex items-center gap-4">
                <AnimatedDonut men={184} women={132} />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-[#0065FF] text-[9px] font-black uppercase flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0065FF] shadow-[0_0_8px_#0065FF]"></span> Hommes</span>
                    <span className="text-xl font-[900] italic text-[#081031] dark:text-white leading-none"><AnimatedNumber value={184} /></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#F72585] text-[9px] font-black uppercase flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F72585] shadow-[0_0_8px_#F72585]"></span> Femmes</span>
                    <span className="text-xl font-[900] italic text-[#081031] dark:text-white leading-none"><AnimatedNumber value={132} /></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:shadow-lg transition-all">
              <div className="flex gap-1 text-[#FFD500] mb-3 group-hover:scale-110 transition-transform">
                <Star size={28} fill="currentColor" className="drop-shadow-[0_0_10px_rgba(255, 213, 0, 0.5)]" />
                <Star size={28} fill="currentColor" className="drop-shadow-[0_0_10px_rgba(255, 213, 0, 0.5)] -translate-y-2" />
                <Star size={28} fill="currentColor" className="drop-shadow-[0_0_10px_rgba(255, 213, 0, 0.5)]" />
              </div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">École de Badminton</div>
              <div className="text-sm font-[900] italic text-[#081031] dark:text-white uppercase mt-1">Labellisée FFBAD</div>
            </div>

            <div className="bg-[#081031] dark:bg-[#0065FF]/10 p-6 rounded-[1.5rem] border-none dark:border dark:border-[#0065FF]/20 flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_0_30px_rgba(14,226,226,0.15)] transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EE2E2]/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EE2E2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0EE2E2] shadow-[0_0_8px_#0EE2E2]"></span>
                </span>
                <span className="text-[10px] font-black uppercase text-[#0EE2E2] tracking-widest">En direct ce soir</span>
              </div>
              <div className="text-2xl font-[900] italic text-white uppercase leading-tight mb-2 relative z-10">
                Jeu Libre <span className="text-slate-400">| 20h00</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase relative z-10">
                <MapPin size={12} className="text-[#0EE2E2]" /> Gymnase Casalis
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION : ACTUALITÉS (CONNECTÉE À LA BDD) */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#040817] border-t border-slate-100 dark:border-white/5 overflow-hidden transition-colors">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-end mb-8 lg:mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
                ACTUALITÉS <span className="text-[#0065FF] block sm:inline">RÉCENTES</span>
              </h2>
            </div>
            
            <div className="flex overflow-x-auto hide-scrollbar w-full md:w-auto gap-2 pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 whitespace-nowrap rounded-full font-bold text-[10px] sm:text-xs uppercase transition-all border shrink-0 ${
                    activeCategory === cat 
                      ? 'bg-[#081031] text-white border-[#081031] dark:bg-[#0EE2E2] dark:text-[#081031] dark:border-[#0EE2E2]' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-[#0065FF] hover:text-[#0065FF] dark:bg-transparent dark:text-slate-400 dark:border-white/20 dark:hover:text-[#0EE2E2] dark:hover:border-[#0EE2E2]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoadingNews ? (
            <div className="flex justify-center py-20 px-6">
              <Loader2 className="animate-spin text-[#0EE2E2]" size={40} />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest px-6">
              Aucune actualité trouvée dans cette catégorie.
            </div>
          ) : (
            <div className="flex overflow-x-auto hide-scrollbar gap-6 lg:gap-8 pb-8 snap-x snap-mandatory px-6 lg:px-8">
              {filteredArticles.map(article => (
                <NewsCard key={article._id} article={article} />
              ))}
              
              {/* Carte finale pour inviter à voir tout le blog */}
              <Link href="/actualites" className="group relative bg-[#0065FF]/5 dark:bg-[#0EE2E2]/5 rounded-[2rem] border-2 border-dashed border-[#0065FF]/20 dark:border-[#0EE2E2]/20 flex flex-col items-center justify-center w-[200px] shrink-0 snap-start hover:bg-[#0065FF] dark:hover:bg-[#0EE2E2] transition-colors">
                 <div className="text-[#0065FF] dark:text-[#0EE2E2] group-hover:text-white dark:group-hover:text-[#081031] flex flex-col items-center gap-3 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#0065FF]/10 dark:bg-[#0EE2E2]/10 group-hover:bg-white/20 flex items-center justify-center">
                      <ArrowRight size={24} />
                    </div>
                    <span className="font-black uppercase text-[10px] tracking-widest text-center px-4">Toutes les actus</span>
                 </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. SECTION INTERCLUBS */}
      <section className="py-16 lg:py-24 px-6 lg:px-8 bg-slate-50/50 dark:bg-[#0a0f25] border-t border-slate-100 dark:border-white/5 transition-colors">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 lg:mb-16 gap-6">
            <div>
              <div className="text-[#0EE2E2] font-bold text-[10px] uppercase tracking-normal mb-2 flex items-center gap-2">
                <TrendingUp size={16} /> Classements en cours
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
                RÉSULTATS <span className="text-[#0065FF] block sm:inline">INTERCLUBS</span>
              </h2>
            </div>
            <button className="w-full md:w-auto text-[#0A266D] dark:text-[#0EE2E2] bg-[#0A266D]/5 dark:bg-white/5 md:bg-transparent py-3 md:py-0 rounded-xl md:rounded-none hover:text-[#0065FF] dark:hover:text-white font-bold text-xs uppercase transition-colors text-center">
              Voir tous les résultats détaillés +
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <TeamCard team="Équipe 1" division="Nationale 1 (Poule 2)" color="#0065FF" ranking={[ { rank: 1, name: "BC Chambly", pts: 41 }, { rank: 2, name: "US Créteil", pts: 38, isUs: true }, { rank: 3, name: "Racing Club", pts: 35 }, { rank: 4, name: "VGA Stella", pts: 22 } ]} />
            <TeamCard team="Équipe 2" division="Régionale 1" color="#0EE2E2" ranking={[ { rank: 1, name: "US Créteil 2", pts: 42, isUs: true }, { rank: 2, name: "Sénart Bad", pts: 39 }, { rank: 3, name: "Noisiel", pts: 31 }, { rank: 4, name: "Ermont", pts: 18 } ]} />
            <TeamCard team="Équipe 3" division="Pré-Régionale" color="#0A266D" ranking={[ { rank: 1, name: "Vincennes", pts: 30 }, { rank: 2, name: "Choisy", pts: 28 }, { rank: 3, name: "US Créteil 3", pts: 21, isUs: true }, { rank: 4, name: "Thiais", pts: 12 } ]} />
          </div>
        </div>
      </section>

      {/* 6. SECTION ÉVÉNEMENTS */}
      <section className="py-16 px-6 lg:px-8 bg-[#081031] text-white relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-20%] w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-[#0065FF]/20 lg:bg-[#0065FF]/10 rounded-full blur-[80px] lg:blur-[120px]" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 lg:mb-10 gap-6">
            <h2 className="text-4xl lg:text-4xl font-[900] italic uppercase text-white">
              ÉVÉNEMENTS <span className="text-[#0EE2E2] block sm:inline">À VENIR</span>
            </h2>
            <button className="w-full md:w-auto border-2 border-[#0EE2E2] text-[#0EE2E2] px-6 py-3 lg:py-2 rounded-xl lg:rounded-full font-bold uppercase text-xs hover:bg-[#0EE2E2] hover:text-[#081031] transition-all text-center">
              Calendrier complet
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <EventRow date="24" month="MAI" title="Tournoi International (TIC)" type="Compétition Officielle" location="Gymnase Nelson Mandela" />
            <EventRow date="12" month="JUIN" title="La Nuit du Bad 2026" type="Tournoi Interne" location="Palais des Sports" />
            <EventRow date="28" month="JUIN" title="Assemblée Générale" type="Vie du Club" location="Club House" />
            <EventRow date="05" month="SEPT" title="Forum des Associations" type="Inscriptions" location="Bords de Marne" />
          </div>
        </div>
      </section>

      {/* 7. SECTION PARTENAIRES */}
      <section className="py-8 lg:py-12 bg-slate-50 dark:bg-white overflow-hidden relative flex items-center border-t border-slate-200 transition-colors">
        <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-r from-slate-50 dark:from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-l from-slate-50 dark:from-white to-transparent z-10" />
        
        <div className="flex w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-marquee flex shrink-0 gap-12 lg:gap-24 items-center pr-12 lg:pr-24">
              <img src="/sponsors/yonex_logo.png" alt="Yonex Logo" className="h-8 lg:h-12 w-auto shrink-0 object-contain" />
              <img src="/sponsors/solibad_logo.png" alt="Solibad Logo" className="h-8 lg:h-12 w-auto shrink-0 object-contain" />
              <img src="/sponsors/ville_creteil_logo.png" alt="Ville de Créteil Logo" className="h-8 lg:h-12 w-auto shrink-0 object-contain" />
              <img src="/sponsors/+2bad_logo.png" alt="+2Bad Logo" className="h-8 lg:h-12 w-auto shrink-0 object-contain" />
              <img src="/sponsors/ffbad_logo.png" alt="FFBAD Logo" className="h-8 lg:h-12 w-auto shrink-0 object-contain" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

/* --- SOUS-COMPOSANTS --- */

const MiniSocialBtn = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-[#0EE2E2] hover:text-[#081031] hover:border-transparent transition-all shadow-sm"
  >
    {icon}
  </a>
);

const InfoCard = ({ num, title, desc, color }) => (
  <div className="group bg-white dark:bg-[#0f172a] p-8 lg:p-10 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 flex flex-col h-full">
    <div className="text-4xl lg:text-5xl font-[900] italic mb-4 lg:mb-6 opacity-20 group-hover:opacity-100 transition-all" style={{ color }}>{num}</div>
    <h4 className="text-lg lg:text-xl font-[900] uppercase italic mb-2 lg:mb-3 text-[#081031] dark:text-white transition-colors">{title}</h4>
    <p className="text-slate-500 dark:text-slate-400 font-bold mb-6 lg:mb-8 text-sm flex-grow leading-relaxed transition-colors">{desc}</p>
    <button className="flex items-center gap-2 font-bold text-xs uppercase mt-auto" style={{ color }}>
      Détails <ChevronRight size={16} />
    </button>
  </div>
);

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  React.useEffect(() => {
    if (!hasAnimated) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasAnimated, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const AnimatedDonut = ({ men, women }) => {
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef(null);

  const total = men + women;
  const menPct = (men / total) * 100;
  
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const menDash = (menPct / 100) * circumference;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div ref={ref} className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-lg">
        <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#F72585" strokeWidth="4" />
        <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#0065FF" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={hasAnimated ? circumference - menDash : circumference} strokeLinecap="round" className="transition-all ease-out" style={{ transitionDuration: '2000ms' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[#081031] dark:text-white font-[900] text-xs italic">
          {hasAnimated ? <AnimatedNumber value={menPct} /> : 0}%
        </span>
      </div>
    </div>
  );
};

// COMPOSANT NEWSCARD MIS À JOUR (Dynamique BDD, format validé 16/9)
const NewsCard = ({ article }) => (
  <Link href={`/actualites/${article._id}`} className="group relative bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col w-[280px] lg:w-[350px] shrink-0 snap-center lg:snap-start block">
    
    {/* LISERET BLEU */}
    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0065FF] z-20"></div>

    {/* IMAGE */}
    <div className="aspect-video relative overflow-hidden bg-slate-100 shrink-0 border-b border-slate-100 dark:border-white/5">
      {article.imageUrl ? (
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 font-black uppercase tracking-widest text-xs bg-slate-50 dark:bg-slate-800">US Créteil</div>
      )}
      {/* BADGE CATEGORY BLANC ÉPURÉ */}
      <div className="absolute top-4 right-4 bg-white px-3.5 py-1.5 rounded-xl text-[9px] font-[900] uppercase tracking-widest shadow-md z-10 text-[#081031]">
        {article.category}
      </div>
    </div>

    {/* CONTENU */}
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-lg font-[900] italic leading-tight text-[#081031] dark:text-white mb-2 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-[12px] font-medium leading-relaxed line-clamp-2 mb-4 flex-grow">
        {article.excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-wider">
          <Calendar size={12} className="text-[#0EE2E2]" /> 
          {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR')}
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#081031] dark:text-white group-hover:bg-[#0065FF] group-hover:text-white dark:group-hover:bg-[#0EE2E2] dark:group-hover:text-[#081031] transition-colors">
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  </Link>
);

const TeamCard = ({ team, division, color, ranking }) => (
  <div className="bg-white dark:bg-[#0f172a] p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col shadow-sm">
    <div className="text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 transition-colors">{division}</div>
    <h3 className="text-2xl lg:text-3xl font-[900] italic text-[#081031] dark:text-white uppercase mb-4 lg:mb-6 transition-colors">{team}</h3>
    
    <div className="flex-grow">
      <ul className="space-y-2 text-xs lg:text-sm font-bold">
        {ranking.map((item, idx) => (
          <li key={idx} className={`flex justify-between items-center p-2 lg:p-3 rounded-xl transition-colors ${
            item.isUs 
              ? 'bg-slate-50 dark:bg-white/5 shadow-sm border border-slate-200 dark:border-transparent text-[#081031] dark:text-white' 
              : 'text-slate-500 dark:text-slate-400'
          }`}>
            <span className="flex gap-2 lg:gap-3">
              <span className={item.isUs ? '' : 'opacity-50'}>{item.rank}.</span> 
              <span>{item.name}</span>
            </span>
            <span className={item.isUs ? 'font-[900] text-base lg:text-lg' : 'opacity-60'} style={{ color: item.isUs ? color : undefined }}>
              {item.pts} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const EventRow = ({ date, month, title, type, location }) => (
  <div className="group flex flex-row items-center gap-3 lg:gap-5 p-3 lg:p-5 rounded-[1.2rem] lg:rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-[#0065FF]/20 hover:border-[#0065FF]/50 transition-all cursor-pointer">
    <div className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-[0.8rem] lg:rounded-xl bg-[#0A266D] flex flex-col justify-center items-center group-hover:bg-[#0EE2E2] transition-colors">
      <span className="text-xl lg:text-2xl font-[900] text-white group-hover:text-[#081031] leading-none mb-0.5">{date}</span>
      <span className="text-[8px] lg:text-[10px] font-bold text-[#0EE2E2] group-hover:text-[#081031] uppercase tracking-normal">{month}</span>
    </div>
    
    <div className="flex-grow min-w-0">
      <div className="text-[#0EE2E2] font-bold text-[8px] lg:text-[9px] uppercase mb-0.5 lg:mb-1 truncate">{type}</div>
      <h4 className="text-base lg:text-lg font-[900] italic text-white mb-0.5 lg:mb-1 truncate">{title}</h4>
      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] lg:text-xs font-bold truncate">
        <MapPin size={10} className="lg:w-[12px] lg:h-[12px] shrink-0" /> <span className="truncate">{location}</span>
      </div>
    </div>
    
    <div className="hidden sm:flex flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/20 items-center justify-center text-white group-hover:bg-white group-hover:text-[#0065FF] transition-all">
      <ChevronRight size={16} />
    </div>
  </div>
);

export default LandingPage;