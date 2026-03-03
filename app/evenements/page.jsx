'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight, Trophy, PartyPopper, Dumbbell, Filter, ChevronRight, PlusCircle, LayoutList, ChevronLeft } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION : LES ÉVÉNEMENTS
// ==========================================
const eventsData = [
  {
    id: 1,
    title: "Rencontre N1 : USC vs Chambly",
    category: "Compétition",
    date: "12 Avril 2026",
    day: "12",
    month: "AVR",
    isoDate: "2026-04-12",
    time: "16h00 - 20h00",
    location: "Gymnase Casalis, Créteil",
    description: "Le choc de la poule ! Venez nombreux encourager notre équipe première pour cette rencontre décisive vers les play-offs.",
    img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    color: "#F72585", 
    icon: <Trophy size={18} />
  },
  {
    id: 2,
    title: "Stage Jeunes - Pâques",
    category: "Stages",
    date: "20 au 24 Avril 2026",
    day: "20",
    month: "AVR",
    isoDate: "2026-04-20",
    time: "09h00 - 17h00",
    location: "Gymnase Nelson Mandela",
    description: "Stage intensif ouvert à tous les jeunes du club (Poussins à Cadets). Perfectionnement technique, physique et matchs au programme.",
    img: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1000&auto=format&fit=crop",
    color: "#0EE2E2", 
    icon: <Dumbbell size={18} />
  },
  {
    id: 3,
    title: "Nuit du Bad (Tournoi Fluo)",
    category: "Vie du Club",
    date: "15 Mai 2026",
    day: "15",
    month: "MAI",
    isoDate: "2026-05-15",
    time: "20h00 - 02h00",
    location: "Gymnase Casalis, Créteil",
    description: "Plongez dans le noir complet ! Maquillage fluo, musique, buvette géante et matchs amicaux avec des volants lumineux.",
    img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1000&auto=format&fit=crop",
    color: "#FFD500", 
    icon: <PartyPopper size={18} />
  },
  {
    id: 4,
    title: "Tournoi Régional de Créteil",
    category: "Compétition",
    date: "06 & 07 Juin 2026",
    day: "06",
    month: "JUIN",
    isoDate: "2026-06-06",
    time: "Toute la journée",
    location: "Casalis & Mandela",
    description: "Notre grand tournoi annuel qui rassemble plus de 300 joueurs de toute l'Île-de-France. De N2 à NC.",
    img: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=1000&auto=format&fit=crop",
    color: "#0065FF", 
    icon: <Trophy size={18} />
  },
  {
    id: 5,
    title: "AG & Barbecue",
    category: "Vie du Club",
    date: "28 Juin 2026",
    day: "28",
    month: "JUIN",
    isoDate: "2026-06-28",
    time: "11h00 - 18h00",
    location: "Stade Duvauchelle",
    description: "Bilan de la saison, récompenses, réélection du bureau, suivi de notre traditionnel barbecue de fin d'année ouvert aux familles.",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    color: "#FFD500", 
    icon: <PartyPopper size={18} />
  }
];

export default function EvenementsPage() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'calendar'

  // Filtrer les événements selon la catégorie
  const filteredEvents = activeFilter === 'Tous' 
    ? eventsData 
    : eventsData.filter(event => event.category === activeFilter);

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          SECTION 1 : HERO SOMBRE
          ========================================================= */}
      <section className="relative w-full h-[50svh] lg:h-[60svh] min-h-[450px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0EE2E2] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
        
        <div className="relative z-20 px-6 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0EE2E2]/20 border border-[#0EE2E2]/50 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            <CalendarIcon size={14} /> La Saison 2025/2026
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            NOTRE <span className="text-[#0EE2E2]">CALENDRIER</span>
          </h1>
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Tournois, rencontres par équipe, stages jeunes ou soirées festives : ne manquez aucun grand rendez-vous de l'US Créteil Badminton.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : LE CALENDRIER & FILTRES
          ========================================================= */}
      <section className="relative z-30 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-28 mb-20">
        
        {/* BARRE DE FILTRES & TOGGLE VUE (Regroupés et centrés) */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-30 max-w-4xl mx-auto">
          
          {/* Filtres par Catégorie */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] lg:rounded-full p-2 shadow-xl border border-slate-200 dark:border-white/10 flex items-center justify-center w-full lg:w-auto transition-colors">
            <div className="px-3 text-slate-400 hidden lg:block shrink-0">
              <Filter size={20} />
            </div>
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {['Tous', 'Compétition', 'Vie du Club', 'Stages'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2.5 lg:py-3 rounded-full font-[900] uppercase italic text-[10px] lg:text-xs tracking-widest transition-all duration-300 whitespace-nowrap flex-grow lg:flex-grow-0 text-center ${
                    activeFilter === category 
                    ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031] shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Vue (Liste / Calendrier) */}
          <div className="bg-white dark:bg-[#0f172a] rounded-full p-1.5 shadow-xl border border-slate-200 dark:border-white/10 flex items-center shrink-0 transition-colors">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-[900] uppercase italic text-[10px] tracking-widest transition-all duration-300 w-24 ${
                viewMode === 'list' 
                ? 'bg-[#0065FF] text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <LayoutList size={16} /> Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-[900] uppercase italic text-[10px] tracking-widest transition-all duration-300 w-24 ${
                viewMode === 'calendar' 
                ? 'bg-[#0065FF] text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <CalendarIcon size={16} /> Grille
            </button>
          </div>

        </div>

        {/* AFFICHAGE DES RÉSULTATS (Ternaire selon le ViewMode) */}
        {viewMode === 'list' ? (
          /* VUE : TIMELINE LISTE */
          <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-4 lg:ml-[120px] space-y-12 pb-10">
            {filteredEvents.length === 0 ? (
              <div className="pl-10 text-center py-20 text-slate-500 font-bold italic">
                Aucun événement programmé pour cette catégorie actuellement.
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={event.id} className="relative pl-8 lg:pl-16 group animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Point sur la ligne du temps */}
                  <div 
                    className="absolute left-[-9px] top-8 w-4 h-4 rounded-full border-4 border-white dark:border-[#040817] shadow-sm transition-transform duration-300 group-hover:scale-150"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <EventTicket event={event} />
                </div>
              ))
            )}
          </div>
        ) : (
          /* VUE : CALENDRIER MENSUEL GRILLE */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <MonthlyCalendar events={filteredEvents} />
          </div>
        )}

      </section>

      {/* =========================================================
          SECTION 3 : CALL TO ACTION - SYNCHRONISATION
          ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        <div className="bg-[#0065FF] rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 backdrop-blur-sm">
              <CalendarIcon size={32} />
            </div>
            <h3 className="text-3xl lg:text-5xl font-[900] uppercase italic text-white mb-4">
              Restez <span className="text-[#0EE2E2]">connecté</span>
            </h3>
            <p className="text-white/80 font-medium max-w-xl mx-auto mb-8 text-sm lg:text-base leading-relaxed">
              Ne cherchez plus les dates ! Synchronisez directement le calendrier du club avec votre smartphone ou inscrivez-vous à la newsletter mensuelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#0EE2E2] text-[#081031] px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl hover:scale-105 hover:bg-white transition-all flex items-center justify-center gap-3">
                <PlusCircle size={18} /> Ajouter à mon agenda
              </button>
              <button className="bg-[#081031] text-white px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 border border-white/10">
                Abonnement Newsletter
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* =========================================================
   SOUS-COMPOSANT : CALENDRIER MENSUEL (GRILLE)
   ========================================================= */
const MonthlyCalendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Avril 2026

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getEventsForDay = (day) => {
    const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
    return events.filter(e => e.isoDate === dateStr);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
      
      <div className="p-6 lg:p-8 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
        <button onClick={handlePrevMonth} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl lg:text-3xl font-[900] uppercase italic text-[#081031] dark:text-white">
          {monthNames[currentDate.getMonth()]} <span className="text-[#0065FF] dark:text-[#0EE2E2]">{currentDate.getFullYear()}</span>
        </h2>
        <button onClick={handleNextMonth} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
        {dayNames.map(day => (
          <div key={day} className="py-4 text-center text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[100px] lg:auto-rows-[140px] bg-slate-200 dark:bg-white/10 gap-px">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white dark:bg-[#0f172a] opacity-50"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const dayEvents = getEventsForDay(dayNumber);
          
          return (
            <div key={dayNumber} className="bg-white dark:bg-[#0f172a] p-2 flex flex-col group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors overflow-hidden">
              <span className={`text-sm lg:text-base font-bold mb-1 ${dayEvents.length > 0 ? 'text-[#081031] dark:text-white' : 'text-slate-400'}`}>
                {dayNumber}
              </span>
              
              <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar">
                {dayEvents.map(evt => (
                  <div 
                    key={evt.id} 
                    title={evt.title}
                    className="px-2 py-1.5 rounded text-[9px] lg:text-[10px] font-bold text-white truncate cursor-pointer shadow-sm hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: evt.color }}
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
          <div key={`empty-end-${i}`} className="bg-white dark:bg-[#0f172a] opacity-50"></div>
        ))}
      </div>

    </div>
  );
};

/* =========================================================
   SOUS-COMPOSANT : CARTE ÉVÉNEMENT (TICKET STYLE)
   ========================================================= */
const EventTicket = ({ event }) => {
  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-md hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden relative group/ticket">
      
      <div 
        className="absolute inset-0 opacity-0 group-hover/ticket:opacity-5 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: event.color }}
      ></div>

      <div 
        className="lg:w-[160px] shrink-0 flex flex-row lg:flex-col items-center justify-center p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: event.color }}></div>
        <span className="text-4xl lg:text-6xl font-[900] italic tracking-tighter leading-none mr-2 lg:mr-0 lg:mb-1" style={{ color: event.color }}>
          {event.day}
        </span>
        <span className="text-sm lg:text-lg font-black uppercase tracking-widest text-[#081031] dark:text-white">
          {event.month}
        </span>
      </div>

      <div className="p-6 lg:p-8 flex flex-col justify-center flex-grow min-w-0 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
            style={{ backgroundColor: event.color }}
          >
            {event.icon} {event.category}
          </span>
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Clock size={12} /> {event.time}
          </span>
        </div>

        <h3 className="text-xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white leading-tight mb-3 group-hover/ticket:text-[#0065FF] dark:group-hover/ticket:text-[#0EE2E2] transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed max-w-2xl">
          {event.description}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-3 py-2 rounded-lg">
            <MapPin size={14} className="text-[#0065FF] dark:text-[#0EE2E2]" />
            {event.location}
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-5 py-2.5 rounded-full hover:scale-105 transition-transform flex items-center gap-2">
            Plus d'infos <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="hidden lg:block w-[250px] shrink-0 relative overflow-hidden">
        <img 
          src={event.img} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover/ticket:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#0f172a] via-transparent to-transparent"></div>
      </div>

    </div>
  );
};