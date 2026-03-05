'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, MapPin, Loader2, Building2, ExternalLink, User, Trophy, Map } from 'lucide-react';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const filterOptions = ["Tout voir", "Adultes - Loisirs", "Adultes - Compétiteurs", "Jeunes", "Pôle Féminin", "Indivs"];

export default function PublicPlanningPage() {
  const [activeTab, setActiveTab] = useState('entraînement');
  const [activeFilter, setActiveFilter] = useState('Tout voir');
  const [sessions, setSessions] = useState([]);
  const [gymnases, setGymnases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resCreneaux, resGymnases] = await Promise.all([
          fetch('/api/creneaux'), fetch('/api/gymnases')
        ]);
        const dataCreneaux = await resCreneaux.json();
        const dataGymnases = await resGymnases.json();
        if (dataCreneaux.success) setSessions(dataCreneaux.data);
        if (dataGymnases.success) setGymnases(dataGymnases.data);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] pt-32 lg:pt-48 pb-24 px-4 sm:px-6 font-['Montserrat'] transition-colors">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* HEADER SECTION */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-8 tracking-tighter">
            Nos <span className="text-[#0065FF] dark:text-[#0EE2E2]">Créneaux</span>
          </h1>
          
          <div className="inline-flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button onClick={() => {setActiveTab('entraînement'); setActiveFilter('Tout voir');}} className={`px-8 py-3 rounded-xl font-[900] uppercase text-sm tracking-widest transition-all ${activeTab === 'entraînement' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Entraînements</button>
            <button onClick={() => setActiveTab('jeu-libre')} className={`px-8 py-3 rounded-xl font-[900] uppercase text-sm tracking-widest transition-all ${activeTab === 'jeu-libre' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Jeu Libre</button>
          </div>
        </div>

        {/* BARRE DE FILTRE */}
        {activeTab === 'entraînement' && !isLoading && (
          <div className="flex overflow-x-auto hide-scrollbar w-full justify-start md:justify-center gap-3 pb-6 mb-8 px-4">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`flex items-center gap-2 px-5 py-2.5 whitespace-nowrap rounded-full font-bold text-[10px] sm:text-xs uppercase transition-all shadow-sm border shrink-0 ${
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

        {/* GRILLE DU PLANNING */}
        {isLoading ? (
          <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#0EE2E2]" size={48} /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
              {days
                .filter(day => !(activeTab === 'entraînement' && day === 'Samedi')) // Retire Samedi en Entraînement
                .map((day) => {
                  const daySessions = sessions
                    .filter(s => s.day === day)
                    .filter(s => activeTab === 'jeu-libre' ? s.type === 'Jeu Libre' : s.type !== 'Jeu Libre')
                    .filter(s => activeTab === 'jeu-libre' || activeFilter === 'Tout voir' || s.type === activeFilter)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  // CAS SPÉCIFIQUE : MERCREDI ENTRAÎNEMENT (2 colonnes regroupées par gymnase)
                  if (day === 'Mercredi' && activeTab === 'entraînement') {
                    const sessionsByGym = daySessions.reduce((acc, session) => {
                      if (!acc[session.gymnasium]) acc[session.gymnasium] = [];
                      acc[session.gymnasium].push(session);
                      return acc;
                    }, {});

                    return (
                      <div key={day} className="col-span-1 xl:col-span-2 flex flex-col gap-5">
                        <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-[#0EE2E2] dark:border-white/10">
                          <div className="h-6 w-1.5 bg-[#0EE2E2] rounded-full" />
                          <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white tracking-tight">{day}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(sessionsByGym).map(([gym, gymSessions]) => (
                            <div key={gym} className="space-y-4">
                              <div className="flex items-center gap-2 px-2 opacity-50">
                                <MapPin size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{gym}</span>
                              </div>
                              {gymSessions.map((session) => <SessionCard key={session._id} session={session} />)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // AFFICHAGE STANDARD
                  return (
                    <div key={day} className="flex flex-col gap-5">
                      <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-slate-200 dark:border-white/10">
                        <div className="h-6 w-1.5 bg-[#0EE2E2] rounded-full" />
                        <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white tracking-tight">{day}</h3>
                      </div>
                      <div className="flex flex-col gap-4">
                        {daySessions.map((session) => <SessionCard key={session._id} session={session} />)}
                        {daySessions.length === 0 && (
                          <div className="text-slate-400 font-bold uppercase text-[10px] italic py-8 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-[2rem]">Aucun créneau</div>
                        )}
                      </div>
                    </div>
                  );
              })}
            </div>

            {/* INFO INTERCLUBS (Uniquement Jeu Libre) */}
            {activeTab === 'jeu-libre' && (
              <div className="max-w-4xl mx-auto mt-20 p-6 bg-[#FFD500] rounded-[2rem] shadow-xl flex items-center gap-6 border-4 border-[#081031]/10">
                <Trophy size={40} className="text-[#081031] shrink-0" />
                <div>
                  <h4 className="text-[#081031] font-black uppercase italic text-sm">Attention : Rencontres Interclubs</h4>
                  <p className="text-[#081031] text-[10px] font-bold uppercase leading-relaxed opacity-80">
                    Les créneaux avec une pastille jaune en haut à droite sont réservés. Le jeu libre y est indisponible.
                  </p>
                </div>
              </div>
            )}

            {/* --- SECTION GYMNASES --- */}
            <div className="mt-32 pt-20 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4 mb-12 justify-center lg:justify-start">
                <Building2 size={32} className="text-[#0065FF]" />
                <h2 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white">Nos <span className="text-[#0065FF]">Gymnases</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gymnases.map((gym) => (
                  <div key={gym._id} className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group">
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
          </>
        )}
      </div>
    </div>
  );
}

const SessionCard = ({ session }) => {
  const isJeuLibre = session.type === 'Jeu Libre';
  const isCompetiteur = session.type === 'Adultes - Compétiteurs';
  
  let iconColor = 'text-[#0065FF]'; 
  let badgeBg = 'bg-[#0065FF]/10'; 
  let badgeText = 'text-[#0065FF]';
  let infoLink = '#';

  if (session.type === 'Jeunes') {
    iconColor = 'text-[#FFD500]'; badgeBg = 'bg-[#FFD500]/20'; badgeText = 'text-[#D4AF37] dark:text-[#FFD500]'; infoLink = '/jeunes';
  } else if (session.type === 'Pôle Féminin') {
    iconColor = 'text-[#F72585]'; badgeBg = 'bg-[#F72585]/10'; badgeText = 'text-[#F72585]'; infoLink = '/pole-feminin';
  } else if (session.type === 'Indivs') {
    iconColor = 'text-[#0cc9c9]'; badgeBg = 'bg-[#0cc9c9]/10'; badgeText = 'text-[#0cc9c9]'; infoLink = '/indivs';
  } else if (session.type === 'Adultes - Loisirs') {
    infoLink = '/loisirs';
  }

  return (
    <div className={`bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 text-[#081031] dark:text-white shadow-sm group relative p-6 rounded-[2rem] transition-all border ${session.isInterclub ? 'ring-2 ring-[#FFD500]' : 'hover:-translate-y-1 hover:shadow-xl'}`}>
      
      {/* PASTILLE TROPHÉE JEU LIBRE */}
      {isJeuLibre && session.isInterclub && (
        <div className="absolute -top-3 -right-3 bg-[#FFD500] text-[#081031] w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 animate-in zoom-in">
          <Trophy size={20} />
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${badgeBg} ${badgeText}`}>
          {session.title || session.type}
        </span>
        
        {!isJeuLibre && !isCompetiteur && infoLink !== '#' && !session.isInterclub && (
          <Link href={infoLink} className={`p-2 -mt-2 -mr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${iconColor}`}>
            <ExternalLink size={20} />
          </Link>
        )}
      </div>
      
      <div className="space-y-3">
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