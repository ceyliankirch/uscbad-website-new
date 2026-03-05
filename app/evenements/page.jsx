'use client';
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Trophy, PartyPopper, Dumbbell, Filter, ChevronRight, PlusCircle, LayoutList, ChevronLeft, Loader2, CalendarPlus } from 'lucide-react';

export default function EvenementsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [viewMode, setViewMode] = useState('list');

  // FONCTION POUR CALCULER LA SAISON DYNAMIQUE (SEPTEMBRE À AOÛT)
  const getSeason = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = Janvier, 8 = Septembre
    
    if (month >= 8) {
      // De Septembre à Décembre
      return `${year} / ${year + 1}`;
    } else {
      // De Janvier à Août
      return `${year - 1} / ${year}`;
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        
        if (json.success) {
          const formattedEvents = json.data.map(e => {
            const dateObj = new Date(e.isoDate);
            return {
              ...e,
              id: e._id,
              day: String(dateObj.getDate()).padStart(2, '0'),
              month: dateObj.toLocaleString('fr-FR', { month: 'long' }).toUpperCase(),
            };
          });
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const filteredEvents = activeFilter === 'Tous' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  const exportGlobalICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//US Creteil Badminton//NONSGML v1.0//EN\n";
    events.forEach(event => {
      if (!event.isoDate) return;
      const dateClean = event.isoDate.replace(/-/g, '');
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DTSTART;VALUE=DATE:${dateClean}\n`;
      icsContent += `DESCRIPTION:${event.description || ''}\n`;
      icsContent += `LOCATION:${event.location || ''}\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'calendrier-uscreteil-complet.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* SECTION HERO */}
      <section className="relative w-full h-[40svh] lg:h-[50svh] min-h-[350px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0EE2E2] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
        
        <div className="relative z-20 px-6 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            NOTRE <span className="text-[#0EE2E2]">CALENDRIER</span>
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0EE2E2]/20 border border-[#0EE2E2]/50 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            <CalendarIcon size={14} /> Saison {getSeason()}
          </div>          
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Tournois, rencontres par équipe, stages jeunes ou soirées festives : ne manquez aucun grand rendez-vous de l'US Créteil Badminton.
          </p>
        </div>
      </section>

      {/* SECTION FILTRES & CALENDRIER (Plus de chevauchement avec le hero) */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-16 mb-20">
        
        {/* BARRE DE FILTRES */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] lg:rounded-full p-2 shadow-xl border border-slate-200 dark:border-white/10 flex items-center justify-center w-full lg:w-auto transition-colors">
            <div className="px-4 text-slate-400 hidden lg:block shrink-0">
              <Filter size={20} />
            </div>
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {['Tous', 'Compétition', 'Vie du Club', 'Stages'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-5 py-2.5 lg:py-3 rounded-full font-[900] uppercase italic text-[10px] lg:text-xs tracking-widest transition-all duration-300 whitespace-nowrap flex-grow lg:flex-grow-0 text-center ${
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

          {/* Toggle Vue */}
          <div className="bg-white dark:bg-[#0f172a] rounded-full p-1.5 shadow-xl border border-slate-200 dark:border-white/10 flex items-center shrink-0 transition-colors">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-[900] uppercase italic text-[10px] tracking-widest transition-all duration-300 w-28 ${
                viewMode === 'list' 
                ? 'bg-[#0065FF] text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <LayoutList size={16} /> Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-[900] uppercase italic text-[10px] tracking-widest transition-all duration-300 w-28 ${
                viewMode === 'calendar' 
                ? 'bg-[#0065FF] text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <CalendarIcon size={16} /> Grille
            </button>
          </div>
        </div>

        {/* AFFICHAGE DES RÉSULTATS */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <Loader2 size={48} className="animate-spin text-[#0EE2E2] mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Chargement du calendrier...</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-4 lg:ml-[140px] space-y-12 pb-10">
            {filteredEvents.length === 0 ? (
              <div className="pl-10 text-center py-20 text-slate-500 font-bold italic">
                Aucun événement programmé pour cette catégorie actuellement.
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={event.id} className="relative pl-8 lg:pl-16 group animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <div 
                    className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-[#040817] shadow-sm transition-transform duration-300 group-hover:scale-150 z-10"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <EventTicket event={event} />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <MonthlyCalendar events={filteredEvents} />
          </div>
        )}

      </section>

      <section className="py-16 px-6 max-w-[1400px] mx-auto">
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
              Synchronisez directement l'ensemble du calendrier du club avec votre smartphone.
            </p>
            <button 
              onClick={exportGlobalICS}
              className="bg-[#0EE2E2] text-[#081031] px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl hover:scale-105 hover:bg-white transition-all flex items-center justify-center gap-3"
            >
              <PlusCircle size={18} /> Ajouter tout à mon agenda (.ics)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

const EventTicket = ({ event }) => {
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Compétition': return <Trophy size={14} />;
      case 'Vie du Club': return <PartyPopper size={14} />;
      case 'Stages': return <Dumbbell size={14} />;
      default: return <CalendarIcon size={14} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group/ticket">
      
      {/* BLOC DATE */}
      <div className="lg:w-[160px] shrink-0 flex flex-col items-center justify-center p-6 lg:p-8 bg-blue-50 dark:bg-blue-500/5 relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: event.color }}></div>
        <span className="text-5xl lg:text-7xl font-[900] italic tracking-tighter leading-none mb-1 text-[#0065FF] dark:text-[#0EE2E2]">
          {event.day}
        </span>
        <span className="text-xs lg:text-sm font-black uppercase tracking-widest text-[#081031] dark:text-white">
          {event.month}
        </span>
      </div>

      {/* CONTENU INFO */}
      <div className="p-6 lg:p-8 flex flex-col justify-center flex-grow min-w-0 relative z-10">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
            style={{ backgroundColor: event.color }}
          >
            {getCategoryIcon(event.category)} {event.category}
          </span>
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Clock size={14} /> {event.time || "Heure à confirmer"}
          </span>
        </div>

        <h3 className="text-2xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white leading-tight mb-4 group-hover/ticket:text-[#0065FF] dark:group-hover/ticket:text-[#0EE2E2] transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed max-w-2xl line-clamp-2">
          {event.description || "Plus d'informations à venir prochainement..."}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-lg">
            <MapPin size={14} className="text-[#0065FF] dark:text-[#0EE2E2]" />
            {event.location || "Lieu à déterminer"}
          </div>
          
          <button 
            onClick={exportSingleICS}
            className="text-[10px] font-black uppercase tracking-widest bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-6 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
          >
            <CalendarPlus size={16} /> Agenda
          </button>
        </div>
      </div>

    </div>
  );
};

const MonthlyCalendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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