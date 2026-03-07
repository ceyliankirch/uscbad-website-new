'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Clock, MapPin, Loader2, Building2, ExternalLink, Trophy, Map, Info, AlertCircle, Dumbbell, Activity, ChevronDown, User } from 'lucide-react';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const filterOptions = ["Tout voir", "Adultes - Loisirs", "Adultes - Compétiteurs", "Jeunes", "Pôle Féminin", "Indivs"];

export default function PublicPlanningPage() {
  const [activeTab, setActiveTab] = useState('entraînement'); // 'entraînement', 'jeu-libre', 'gymnases'
  const [activeFilter, setActiveFilter] = useState('Tout voir');
  const [sessions, setSessions] = useState([]);
  const [gymnases, setGymnases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour le custom select sur mobile
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  // Référence pour le conteneur du slider afin de gérer le scroll
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resCreneaux, resGymnases] = await Promise.all([
          fetch('/api/creneaux'), fetch('/api/gymnases')
        ]);
        
        if (!resCreneaux.ok) throw new Error("Impossible de charger les créneaux.");
        
        const dataCreneaux = await resCreneaux.json();
        const dataGymnases = await resGymnases.json();
        
        if (dataCreneaux.success) setSessions(dataCreneaux.data);
        if (dataGymnases.success) setGymnases(dataGymnases.data);
      } catch (err) { 
        console.error(err); 
        setError(err.message);
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []);

  // Effet pour recentrer le slider au début quand on change de filtre ou d'onglet
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeFilter, activeTab]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Adultes - Loisirs':
      case 'Adultes - Compétiteurs': return '#0065FF';
      case 'Jeunes': return '#FFD500';
      case 'Pôle Féminin': return '#F72585';
      case 'Indivs': return '#0cc9c9';
      default: return 'transparent';
    }
  };

  // Filtrage par catégorie et par tab (entraînement vs jeu libre)
  const filteredCreneaux = sessions.filter(s => {
    const matchTab = activeTab === 'jeu-libre' ? s.type === 'Jeu Libre' : s.type !== 'Jeu Libre';
    
    // On élargit la recherche à 'category', 'type' et 'title' pour s'assurer de trouver la correspondance
    const matchCat = activeFilter === 'Tout voir' || 
                     s.category === activeFilter || 
                     s.type === activeFilter || 
                     s.title === activeFilter;
                     
    return matchTab && matchCat;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#040817] gap-4">
        <Loader2 className="animate-spin text-[#0065FF]" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Chargement du planning...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] pt-32 lg:pt-48 pb-24 font-['Montserrat'] transition-colors overflow-hidden">
      
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* HEADER SECTION */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-8 tracking-tighter">
            Nos <span className="text-[#0065FF] dark:text-[#0EE2E2]">Créneaux</span>
          </h1>
          
          {/* ONGLETS : Colonne sur Mobile / Ligne sur PC */}
          <div className="inline-flex flex-col md:flex-row p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden w-full md:w-auto gap-1 md:gap-0">
            <button 
              onClick={() => {setActiveTab('entraînement'); setActiveFilter('Tout voir');}} 
              className={`px-4 py-3.5 md:px-8 md:py-3 rounded-xl font-[900] uppercase text-[10px] md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'entraînement' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              <Dumbbell size={16} className="md:hidden shrink-0" /> Entraînements
            </button>
            <button 
              onClick={() => setActiveTab('jeu-libre')} 
              className={`px-4 py-3.5 md:px-8 md:py-3 rounded-xl font-[900] uppercase text-[10px] md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'jeu-libre' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              <Activity size={16} className="md:hidden shrink-0" /> Jeu Libre
            </button>
            <button 
              onClick={() => setActiveTab('gymnases')} 
              className={`px-4 py-3.5 md:px-8 md:py-3 rounded-xl font-[900] uppercase text-[10px] md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'gymnases' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              <Building2 size={16} className="md:hidden shrink-0" /> Gymnases
            </button>
          </div>
        </div>

        {/* BARRE DE FILTRE (Boutons classiques sur PC) */}
        {activeTab === 'entraînement' && !isLoading && (
          <div className="hidden md:flex overflow-x-auto hide-scrollbar w-full justify-start md:justify-center gap-3 pb-6 mb-8 px-4 -mx-4 md:mx-0">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`flex items-center gap-2 px-5 py-2.5 whitespace-nowrap rounded-full font-bold text-xs uppercase transition-all shadow-sm border shrink-0 ${
                  activeFilter === opt 
                    ? 'bg-[#081031] text-white border-[#081031] dark:bg-[#0EE2E2] dark:text-[#081031] dark:border-[#0EE2E2]' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#0065FF] hover:text-[#0065FF] dark:bg-[#0f172a] dark:text-slate-400 dark:border-white/10 dark:hover:text-[#0EE2E2] dark:hover:border-[#0EE2E2]'
                }`}
              >
                {opt !== 'Tout voir' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(opt) }} />}
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* CUSTOM SELECT FILTRE (Uniquement sur Mobile) */}
        {activeTab === 'entraînement' && !isLoading && (
          <div className="md:hidden w-full mb-8 relative z-[60]">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} 
              className={`w-full bg-white dark:bg-[#0f172a] border ${isFilterDropdownOpen ? 'border-[#0065FF] ring-2 ring-[#0065FF]/20' : 'border-slate-200 dark:border-white/10'} rounded-2xl px-5 py-4 text-xs font-bold flex justify-between items-center transition-all shadow-sm outline-none`}
            >
              <span className="flex items-center gap-2 text-[#081031] dark:text-white uppercase tracking-widest">
                {activeFilter !== 'Tout voir' && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(activeFilter) }} />}
                {activeFilter}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="py-2">
                  {filterOptions.map((opt) => (
                    <div 
                      key={opt} 
                      onClick={() => {
                        setActiveFilter(opt);
                        setIsFilterDropdownOpen(false);
                      }} 
                      className={`px-5 py-3.5 text-xs font-bold cursor-pointer transition-colors flex items-center gap-3 uppercase tracking-widest ${
                        activeFilter === opt 
                          ? 'bg-[#0065FF]/10 text-[#0065FF]' 
                          : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      {opt !== 'Tout voir' && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(opt) }} />}
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <main className="w-full">
          {error ? (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-8 rounded-[2rem] text-center max-w-4xl mx-auto">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h3 className="text-xl font-black uppercase text-red-700 dark:text-red-400 mb-2">Erreur d'affichage</h3>
              <p className="text-sm font-bold text-red-600/70 dark:text-red-400/70">{error}</p>
            </div>
          ) : (
            <>
              {/* SLIDER JOURS (Mobile) / COLONNES CENTRÉES (Desktop) POUR ENTRAÎNEMENT & JEU LIBRE */}
              {activeTab !== 'gymnases' && (
                <>
                  <div 
                    ref={scrollContainerRef}
                    className="flex md:flex-wrap md:justify-center overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory md:snap-none gap-6 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 items-start relative z-10 scroll-smooth"
                  >
                    {days.map(day => {
                      const dayCreneaux = filteredCreneaux.filter(c => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                      if (dayCreneaux.length === 0) return null;

                      return (
                        <div key={day} className="shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:flex-1 md:min-w-[220px] md:max-w-[350px] snap-center md:snap-align-none animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-5">
                          <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-slate-200 dark:border-white/10">
                            <div className="h-6 w-1.5 bg-[#0EE2E2] rounded-full" />
                            <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white tracking-tight">{day}</h3>
                          </div>

                          <div className="flex flex-col gap-4 flex-1">
                            {dayCreneaux.map((item, idx) => (
                              <SessionCard key={item._id || idx} session={item} />
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {filteredCreneaux.length === 0 && (
                      <div className="col-span-full text-center py-20 w-full shrink-0">
                        <Info size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aucun créneau ne correspond à ce filtre.</p>
                      </div>
                    )}
                  </div>

                  {/* INFO INTERCLUBS (Uniquement Jeu Libre) - Sous le slider/liste */}
                  {activeTab === 'jeu-libre' && (
                    <div className="max-w-4xl mx-auto mt-8 md:mt-20 p-6 bg-[#FFD500] rounded-[2rem] shadow-xl flex items-center gap-6 border-4 border-[#081031]/10 relative z-20">
                      <Trophy size={40} className="text-[#081031] shrink-0" />
                      <div>
                        <h4 className="text-[#081031] font-black uppercase italic text-sm md:text-base mb-1">Attention : Rencontres Interclubs</h4>
                        <p className="text-[#081031] text-[10px] md:text-xs font-bold uppercase leading-relaxed opacity-90">
                          Les créneaux avec une pastille jaune en haut à droite sont réservés. Le jeu libre y est indisponible.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ONGLET GYMNASES : SLIDER (Mobile) / GRILLE CENTRÉE (Desktop) */}
              {activeTab === 'gymnases' && gymnases.length > 0 && (
                <div className="animate-in fade-in duration-500 relative z-10">
                  <div className="flex md:flex-wrap md:justify-center overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory md:snap-none gap-6 md:gap-8 pb-8 -mx-6 px-6 md:mx-0 md:px-0">
                    {gymnases.map((gym) => (
                      <div key={gym._id} className="shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:flex-1 md:min-w-[280px] md:max-w-[400px] snap-center md:snap-align-none bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-[#0065FF]">
                            <MapPin size={28} />
                          </div>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + " " + gym.address)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#081031] text-white rounded-xl hover:scale-110 transition-transform shadow-lg">
                            <Map size={20} />
                          </a>
                        </div>
                        <h4 className="font-[900] uppercase italic text-2xl text-[#081031] dark:text-white mb-2 tracking-tight">{gym.name}</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wide">{gym.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* FOOTER INFO */}
        <section className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-[#0EE2E2]/10 border border-[#0EE2E2]/20 p-8 rounded-[2.5rem] backdrop-blur-sm">
            <p className="text-sm font-bold text-[#0EE2E2] leading-relaxed italic">
              * Les horaires sont susceptibles d'être modifiés lors des vacances scolaires ou d'événements exceptionnels. 
              Consultez régulièrement le groupe WhatsApp du club pour les alertes en temps réel.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

/* =========================================================
   SOUS-COMPOSANT : SESSION CARD (Design restauré)
   ========================================================= */
const SessionCard = ({ session }) => {
  const isJeuLibre = session.type === 'Jeu Libre';
  const categoryToUse = session.category || session.type; // Adapté aux données de l'API
  const isCompetiteur = categoryToUse === 'Adultes - Compétiteurs';
  
  let iconColor = 'text-[#0065FF]'; 
  let badgeBg = 'bg-[#0065FF]/10'; 
  let badgeText = 'text-[#0065FF]';
  let infoLink = '#';

  if (categoryToUse === 'Jeunes') {
    iconColor = 'text-[#FFD500]'; badgeBg = 'bg-[#FFD500]/20'; badgeText = 'text-[#D4AF37] dark:text-[#FFD500]'; infoLink = '/jeunes';
  } else if (categoryToUse === 'Pôle Féminin') {
    iconColor = 'text-[#F72585]'; badgeBg = 'bg-[#F72585]/10'; badgeText = 'text-[#F72585]'; infoLink = '/pole-feminines';
  } else if (categoryToUse === 'Indivs') {
    iconColor = 'text-[#0cc9c9]'; badgeBg = 'bg-[#0cc9c9]/10'; badgeText = 'text-[#0cc9c9]'; infoLink = '/indivs';
  } else if (categoryToUse === 'Adultes - Loisirs') {
    infoLink = '/loisirs';
  }

  return (
    <div className={`bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 text-[#081031] dark:text-white shadow-sm group relative p-6 rounded-[2rem] transition-all border flex flex-col flex-1 ${session.isInterclub ? 'ring-2 ring-[#FFD500]' : 'hover:-translate-y-1 hover:shadow-xl'}`}>
      
      {/* PASTILLE TROPHÉE JEU LIBRE */}
      {isJeuLibre && session.isInterclub && (
        <div className="absolute -top-3 -right-3 bg-[#FFD500] text-[#081031] w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 animate-in zoom-in">
          <Trophy size={20} />
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${badgeBg} ${badgeText}`}>
          {session.title || categoryToUse}
        </span>
        
        {!isJeuLibre && !isCompetiteur && infoLink !== '#' && !session.isInterclub && (
          <Link href={infoLink} className={`p-2 -mt-2 -mr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${iconColor}`}>
            <ExternalLink size={20} />
          </Link>
        )}
      </div>
      
      <div className="space-y-3 mt-auto">
        <div className="flex items-center gap-3">
          <Clock size={18} className={session.isInterclub ? 'text-[#FFD500]' : iconColor} />
          <span className="font-[900] italic text-2xl leading-none tracking-tight">{session.startTime} - {session.endTime}</span>
        </div>
        <div className="flex items-center gap-3 opacity-70">
          <MapPin size={18} />
          <span className="font-bold text-sm uppercase tracking-wider truncate">{session.gymnasium}</span>
        </div>
        
        {/* BANDEAU INTERCLUB (Entraînement) */}
        {!isJeuLibre && session.isInterclub && (
          <div className="mt-4 flex items-center justify-center gap-2 bg-[#FFD500] py-3 rounded-xl text-[#081031] font-[900] text-[10px] uppercase tracking-widest shadow-lg">
            <Trophy size={16} /> Interclubs
          </div>
        )}

        {(!isJeuLibre && session.coach && !session.isInterclub) && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
            <User size={16} className={iconColor} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Coach: {session.coach}</span>
          </div>
        )}
      </div>
    </div>
  );
};