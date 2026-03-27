'use client';

import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Trophy, Award, User, ChevronRight, Calendar, Loader2, CalendarDays, X, Share2, CalendarPlus, PartyPopper, Dumbbell } from 'lucide-react';
import Link from 'next/link';

const EcoleJeunes = () => {
  // --- ÉTATS ---
  const [schedules, setSchedules] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // États pour les Événements
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // États pour la modale d'événement
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- RÉCUPÉRATION DES DONNÉES (Créneaux, Staff, Joueurs) ---
    useEffect(() => {
    document.title = "Les Jeunes | US Créteil Badminton"; 
    setIsLoading(true);
    Promise.all([
      fetch('/api/creneaux').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/team').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/players?team=performance-jeunes').then(res => res.json()).catch(() => ({ data: [] }))
    ])
    .then(([creneauxRes, teamRes, playersRes]) => {
      
      // Filtrage des créneaux "Jeunes"
      if (creneauxRes.success) {
        setSchedules(creneauxRes.data.filter(s => s.type === 'Jeunes'));
      }

      // Filtrage de l'équipe : Toute personne encadrant les "Jeunes"
      if (teamRes.success) {
        const jeunesCoaches = teamRes.data.filter(member => 
          member.trainerRoles && 
          member.trainerRoles.includes('Jeunes')
        );
        
        // Tri par ordre si défini
        jeunesCoaches.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCoaches(jeunesCoaches);
      }

      if (playersRes.success) {
        setPlayers(playersRes.data);
      }
      
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Erreur lors du chargement des données:", err);
      setIsLoading(false);
    });
  }, []);

  // --- RÉCUPÉRATION DES ÉVÉNEMENTS (Catégorie Stages) ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        
        if (json.success) {
          const today = new Date().toISOString().split('T')[0];
          
          // On filtre : dans le futur ET de la catégorie "Stages" (pour les jeunes)
          const future = json.data
            .filter(event => event.isoDate >= today && event.category === 'Jeunes')
            .slice(0, 3) // On n'en garde que 3 pour le design
            .map(e => {
              const d = new Date(e.isoDate);
              return {
                ...e,
                day: String(d.getDate()).padStart(2, '0'),
                month: d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', ''),
                fullMonth: d.toLocaleString('fr-FR', { month: 'long' }),
                year: d.getFullYear()
              };
            });
          
          setUpcomingEvents(future);
        }
      } catch (error) {
        console.error("Erreur chargement des événements :", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // --- GESTION DE LA MODALE ---
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="bg-white dark:bg-[#040817] font-['Montserrat'] transition-colors duration-300 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 lg:px-8 overflow-hidden bg-[#081031] text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0065FF]/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-[1200px] mx-auto text-center flex flex-col items-center">
          <div className="flex flex-col items-center justify-center p-6 lg:p-8 mb-8 lg:mb-12 transition-colors">
            <div className="flex gap-2 text-[#0EE2E2] mb-4">
              <Star size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)]" />
              <Star size={48} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)] -translate-y-2" />
              <Star size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)]" />
            </div>
            <h1 className="text-5xl md:text-8xl font-[900] italic uppercase tracking-tighter">
              CLUB
            </h1>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EE2E2] to-[#0065FF]">Labellisé 3 Étoiles</p>
          </div>
          <p className="text-sm md:text-lg text-slate-300 font-bold max-w-2xl leading-relaxed">
            Un encadrement de qualité pour vos enfants, du minibad à la compétition. Notre équipe pédagogique diplômée accompagne chaque jeune vers son meilleur niveau.
          </p>
        </div>
      </section>

      {/* 2. CRÉNEAUX D'ENTRAÎNEMENTS EN COLONNES */}
      <section className="py-16 lg:py-24 max-w-[1600px] mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Créneaux <span className="text-[#0065FF]">Jeunes</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0065FF] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {['Lundi', 'Mercredi', 'Jeudi'].map((day) => {
              // On filtre les créneaux pour ne garder que ceux du jour en cours, triés par heure
              const daySessions = schedules
                .filter(s => s.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day} className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-slate-200 dark:border-white/10">
                    <div className="h-6 w-1.5 bg-[#FFD500] rounded-full" />
                    <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white tracking-tight">{day}</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {daySessions.map((session) => (
                      <ScheduleCard key={session._id} session={session} />
                    ))}
                    
                    {daySessions.length === 0 && (
                      <div className="text-slate-400 font-bold uppercase text-[10px] italic py-8 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-[2rem]">
                        Aucun créneau
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. NOS ENTRAÎNEURS JEUNES */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#0a0f25] border-y border-slate-100 dark:border-white/5 transition-colors">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
              Nos <span className="text-[#0EE2E2]">Entraîneurs</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold">L'équipe encadrante de l'école de badminton.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0EE2E2] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {coaches.length > 0 ? coaches.map((coach) => (
                <div key={coach._id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
                  <CoachCard 
                    name={coach.name} 
                    role={coach.role} 
                    diploma={coach.tags && coach.tags.length > 0 ? coach.tags[0] : "Encadrant diplômé"} 
                    img={coach.image}
                    color={coach.color}
                  />
                </div>
              )) : (
                <div className="w-full bg-white dark:bg-[#081031] p-10 rounded-3xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
                   <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Aucun entraîneur affecté aux jeunes pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. PÔLE PERFORMANCE CONNECTÉ À LA BDD */}
      <section className="py-16 lg:py-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Pôle <span className="text-[#0065FF]">Performance</span>
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold">Nos pépites qui brillent au niveau régional et national.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0065FF] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {players.length > 0 ? (
              players.map((player) => (
                <div key={player._id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
                  <PlayerCard 
                    name={player.name} 
                    category={player.category} 
                    rank={player.rank} 
                    titles={player.titles} 
                    img={player.image} 
                    accent={player.accentColor}
                    badge={player.badge}
                  />
                </div>
              ))
            ) : (
              <div className="w-full bg-white dark:bg-[#081031] p-10 rounded-3xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                  Aucun joueur renseigné dans le Pôle Performance pour le moment.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. ÉVÉNEMENTS JEUNES (DYNAMIQUE) */}
      <section className="py-16 lg:py-24 bg-[#081031] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EE2E2]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="mb-10 lg:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-white">
              L'Agenda <span className="text-[#0EE2E2]">Jeunes</span>
            </h2>
            <Link href="/evenements" className="border-2 border-[#0EE2E2] text-[#0EE2E2] px-6 py-2.5 rounded-full font-bold uppercase text-xs hover:bg-[#0EE2E2] hover:text-[#081031] transition-all">
              Calendrier complet
            </Link>
          </div>

          {isLoadingEvents ? (
            <div className="flex justify-center py-20 opacity-50">
              <Loader2 size={40} className="animate-spin text-[#0EE2E2]" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((evt) => (
                <EventRow 
                  key={evt._id}
                  event={evt}
                  onClick={() => handleOpenModal(evt)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-12 text-center">
              <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 font-bold">Aucun stage ou événement jeunes prévu pour le moment.</p>
            </div>
          )}

        </div>
      </section>

      {/* 6. MODALE DE DÉTAILS DE L'ÉVÉNEMENT */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 lg:p-8 bg-[#040817]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#081031] w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative border border-white/10 animate-in zoom-in-95 duration-300">
            
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 z-50 p-3 bg-black/20 hover:bg-[#F72585] text-white rounded-full transition-all backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto hide-scrollbar">
              <div className="relative h-64 lg:h-80 w-full bg-slate-800">
                {selectedEvent.image ? (
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#081031] to-[#0065FF]/30">
                    <CalendarDays size={80} className="text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081031] via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg"
                    style={{ backgroundColor: selectedEvent.color || '#0EE2E2' }}
                  >
                    {selectedEvent.category}
                  </span>
                  <h2 className="text-3xl lg:text-5xl font-[900] italic uppercase text-white leading-tight drop-shadow-lg">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EE2E2] mb-4">À propos de l'événement</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg whitespace-pre-wrap">
                        {selectedEvent.description || "Aucune description détaillée n'a été renseignée pour cet événement. Contactez le club pour plus d'informations."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <button className="flex items-center gap-2 bg-[#0065FF] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#0052cc] transition-all shadow-lg shadow-[#0065FF]/20">
                        S'inscrire / Participer
                      </button>
                      <button className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                        <Share2 size={16} /> Partager
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Informations</h4>
                      
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#081031] flex items-center justify-center text-[#0EE2E2] shadow-sm shrink-0">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Date</p>
                            <p className="text-sm font-bold text-[#081031] dark:text-white capitalize">
                              {selectedEvent.dateDisplay || `${selectedEvent.day} ${selectedEvent.fullMonth} ${selectedEvent.year}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#081031] flex items-center justify-center text-[#F72585] shadow-sm shrink-0">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Horaires</p>
                            <p className="text-sm font-bold text-[#081031] dark:text-white">
                              {selectedEvent.time || "À confirmer"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#081031] flex items-center justify-center text-[#0065FF] shadow-sm shrink-0">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Lieu</p>
                            <p className="text-sm font-bold text-[#081031] dark:text-white">
                              {selectedEvent.location || "Lieu non défini"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/* --- SOUS-COMPOSANTS --- */

const ScheduleCard = ({ session }) => {
  const iconColor = 'text-[#FFD500]'; 
  const badgeBg = 'bg-[#FFD500]/20'; 
  const badgeText = 'text-[#D4AF37] dark:text-[#FFD500]';

  return (
    <div className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 text-[#081031] dark:text-white shadow-sm group relative p-6 rounded-[2rem] transition-all border hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-start mb-5">
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${badgeBg} ${badgeText}`}>
          {session.title || 'Jeunes'}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock size={18} className={iconColor} />
          <span className="font-[900] italic text-2xl leading-none tracking-tight">{session.startTime} - {session.endTime}</span>
        </div>
        <div className="flex items-center gap-3 opacity-70">
          <MapPin size={18} />
          <span className="font-bold text-sm uppercase tracking-wider truncate">{session.gymnasium}</span>
        </div>
        {session.coach && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
            <User size={16} className={iconColor} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Coach: {session.coach}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CoachCard = ({ name, role, diploma, img, color }) => (
  <div className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-4 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
    <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 relative" style={{ borderColor: color || '#0EE2E2' }}>
      <div className="absolute inset-0 bg-[#081031]/5 group-hover:bg-transparent transition-colors z-10" />
      {img ? (
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
           <User size={24} />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white truncate mb-0.5">{name}</h3>
      <div className="font-black text-[9px] uppercase tracking-widest mb-1.5" style={{ color: color || '#0065FF' }}>{role}</div>
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">
        <Award size={12} style={{ color: color || '#0065FF' }} /> {diploma}
      </div>
    </div>
  </div>
);

const PlayerCard = ({ name, category, rank, titles, img, accent, badge }) => (
  <div className="relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:-translate-y-2 transition-transform duration-300">
    {badge && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F72585] to-[#ff4d9a] text-white px-4 py-1.5 rounded-full font-[900] uppercase text-[10px] tracking-widest shadow-lg shadow-[#F72585]/30 z-20 whitespace-nowrap animate-bounce">
        {badge}
      </div>
    )}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full p-1 mb-4" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}>
        <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-[#0f172a]">
          {img ? (
            <img src={img} alt={name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700"><User size={32}/></div>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-1">{name}</h3>
      <div className="text-sm font-bold text-slate-400 mb-4">{category}</div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Classement</span>
          <span className="font-[900] text-sm" style={{ color: accent }}>{rank}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1"><Trophy size={12} /> Palmarès</span>
          <span className="font-bold text-xs text-[#081031] dark:text-white text-right max-w-[120px] truncate">{titles}</span>
        </div>
      </div>
    </div>
  </div>
);

const EventRow = ({ event, onClick }) => {
  const { day, month, title, category, location, color } = event;

  const exportSingleICS = () => {
    if (!event.isoDate) return;
    const dateClean = event.isoDate.replace(/-/g, '');
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//US Creteil Badminton//NONSGML v1.0//EN\n";
    icsContent += "BEGIN:VEVENT\n";
    icsContent += `SUMMARY:${event.title}\n`;
    icsContent += `DTSTART;VALUE=DATE:${dateClean}\n`;
    icsContent += `DESCRIPTION:${event.description || ''}\n`;
    icsContent += `LOCATION:${event.location || ''}\n`;
    icsContent += "END:VEVENT\n";
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-[#0EE2E2]/10 hover:border-[#0EE2E2]/50 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EE2E2]/20 blur-[30px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex-shrink-0 w-16 h-16 rounded-[1rem] bg-[#0A266D] flex flex-col justify-center items-center group-hover:bg-[#0EE2E2] transition-colors relative z-10 shadow-md">
        <span className="text-2xl font-[900] text-white group-hover:text-[#081031] leading-none mb-0.5">{day}</span>
        <span className="text-[10px] font-bold text-[#0EE2E2] group-hover:text-[#081031] uppercase">{month}</span>
      </div>
      
      <div className="flex-grow min-w-0 w-full text-center sm:text-left relative z-10">
        <div className="text-[#0EE2E2] font-bold text-[9px] uppercase tracking-widest mb-1 truncate">{category}</div>
        <h4 className="text-base font-[900] italic text-white mb-1.5 truncate group-hover:text-[#0EE2E2] transition-colors">{title}</h4>
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-[11px] font-bold truncate">
          <MapPin size={12} className="shrink-0 text-[#0065FF]" /> <span className="truncate">{location || "Lieu à confirmer"}</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-shrink-0 relative z-10 flex-col gap-2">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            exportSingleICS(); 
          }}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#081031] transition-all shadow-sm"
          title="Ajouter à l'agenda"
        >
          <CalendarPlus size={16} />
        </button>
      </div>
    </div>
  );
};

export default EcoleJeunes;